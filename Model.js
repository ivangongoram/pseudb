const fs = require("node:fs");

class Model
{

    static table;
    static fillable;

    static create(attributes){
        Model.table = {
            name: this.table.name,
            maxId: this.table.maxId,
            data: this.table.data
        }
        Model.fillable = this.fillable;

        attributes = Model.#attributes(attributes);
        let table = read(this.table.name);

        table.maxId = (table.maxId !== null)
            ? attributes.id
            : null;
        table.data.push(attributes);

        return {
            get: () => {return attributes},
            save: () => {return Model.#save(table)}
        };
    }

    static #attributes(attributes){
        let tableAttributes = requireUncached(dirTable(this.table.name));
        const buildObject = {};
        const fillable = this.fillable;
        const includeKeys = ['id', 'created_at', 'updated_at'];
        Object.keys(tableAttributes).forEach(function (key) {
            if (fillable.indexOf(key) !== -1 || (includeKeys.indexOf(key) !== -1 && attributes[key] !== undefined)){
                buildObject[key] = attributes[key];
            }else {
                buildObject[key] = tableAttributes[key];
            }
        });
        return buildObject;
    }

    static #update(attributes){
        if(this.table.data.length === 0) return false;
        let table = read(this.table.name);
        const fillable = this.fillable;
        const tableAttributes = requireUncached(dirTable(table.name));

        this.table.data.forEach(element => {
            const index = table.data.findIndex(x => JSON.stringify(x) === JSON.stringify(element));
            if(index === -1) return false;

            fillable.forEach(key => {
                if (attributes[key] !== undefined){
                    element[key] = attributes[key];
                    if (Object.keys(tableAttributes).indexOf('updated_at') !== -1 ) element['updated_at'] = new Date();
                }
            });

            table.data.splice(index, 1, element);
        });

        table.maxId = maxId(table);

        Model.#save(table);
        Model.refresh();
        return true;
    }

    static #delete(){
        if(this.table.data.length === 0) return false;
        let table = read(this.table.name);

        for (const element of this.table.data) {
            const index = table.data.findIndex(x => JSON.stringify(x) === JSON.stringify(element));
            if(index === -1) return false;
            table.data.splice(index, 1);
        }

        table.maxId = maxId(table);

        Model.#save(table);
        Model.refresh();
        return true;
    }

    static #save(table){
        const replacer = (key, value) => typeof value === "bigint" ? value.toString() : value;
        const data = JSON.stringify(table, replacer,2);
        try {
            fs.writeFileSync(dirDb(table.name), data);
            return true;
        } catch (err) {
            throw new Error(err);
        }
    }

    static find(id){
        Model.table = {
            name: this.table.name,
            maxId: this.table.maxId,
            data: this.table.data.filter(x => x.id == id)
        }

        Model.fillable = this.fillable;

        return {
            get: () => {return Model.table.data[0]}, //TODO: first ??
            delete: () => {return Model.#delete()},
            update: (parameters) => {return Model.#update(parameters)}
        }
    }

    static where(column, operator, value){
        function condition(element) {
            let operators = {
                '=': function(a, b) {return a == b},
                '==': function(a, b) {return a === b},
                '<': function(a, b) {return a < b},
                '>': function(a, b) {return a > b},
                '>=': function(a, b) {return a >= b},
                '<=': function(a, b) {return a <= b},
                '!=': function(a, b) {return a != b},
                '!==': function(a, b) {return a !== b},
            };
            return operators[operator](element[column], value);
        }

        Model.table = {
            name: this.table.name,
            maxId: this.table.maxId,
            data: this.table.data.filter(condition)
        }

        Model.fillable = this.fillable;

        return {
            get: () => {return Model.table.data},
            first: () => {return Model.table.data[0]},
            where: (column, operator, value) => {return Model.where(column, operator, value)},
            delete: () => {return Model.#delete()},
            update: (parameters) => {return Model.#update(parameters)}
        }
    }

    static initialize() {
        const file = this.table?.name ?? this.table;
        this.table = read(file);

        fs.watch(dirDb(file), (eventType, filename) => {
            if (filename && eventType === 'change') {
                this.table = read(file);
            }
        });
    }

    static refresh() {
        const file = this.table?.name ?? this.table;
        this.table = read(file);
    }
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

function read(file) {
    try {
        const data = fs.readFileSync(`./database/db/${file}.json`, 'utf8');
        return data ? JSON.parse(data) : data;
    } catch (err) {
        throw new Error(err);
    }
}

function maxId(table) {
    return (table.maxId !== null)
        ? Math.max(...Object.values(table.data).map(data => Number(data.id)))
        : null;
}

function dirTable(name) {
    return `../../database/tables/${name}_table.js`;
}

function dirDb(name) {
    return `./database/db/${name}.json`;
}

module.exports = Model;