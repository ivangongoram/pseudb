# PseuDB (Under Construction)

1. [Introduction](#introduction)
2. [Model Conventions](#model-conventions)
3. [Inserting & Updating Models](#inserting--updating-models)
4. [Deleting Models](#deleting-models)
5. [Where Clauses](#where-clauses)
6. [Schedule Frequency Options](#schedule-frequency-options)
7. [Examples](#examples)

## Introduction
PseuDB is a library designed to simplify the process of creating and managing JSON-based databases with
relational capabilities. This library enables developers to effortlessly create and interact with databases
using models, providing a flexible and intuitive approach to working with data.

- **JSON-based Database:** PseuDB leverages the simplicity and flexibility of JSON to store and retrieve data, 
allowing you to easily manage your application's data without the need for a traditional database system.

- **Model-driven Approach:** With PseuDB, you can define models that represent your data structure and relationships. 
This approach enables you to create, query, and manipulate data using a familiar object-oriented paradigm.

- **Relational Capabilities:** PseuDB introduces relational capabilities to JSON-based databases. 
You can define relationships between models, such as one-to-one, one-to-many, and many-to-many, 
to establish associations and efficiently retrieve related data.

- **Querying and Filtering:** PseuDB offers a rich set of querying and filtering options,
enabling you to retrieve specific data based on various criteria. You can perform complex 
queries, apply filters, and sort data to extract the information you need efficiently.

## Model Conventions
````js
    const Model = require('pseudb');
    class User extends Model
    {
        static table = 'user';
        static fillable = [
            'id',
            'name',
            'age'
        ];
    }
    User.initialize();
    module.exports = User;
````
## Inserting & Updating Models

## Deleting Models

## Where Clauses

|  Operators  |        Description         |
|:-----------:|:--------------------------:|
|      =      |          Equality          |
|     ==      |      Strict equality       |
|     \>      |        Greater than        |
|      <      |         Less than          |
|     \>=     |  Greater than or equal to  |
|     <=      |   Less than or equal to    |
|     !=      |        Not equal to        |
|     !==     |    Strict not equal to     |


```js
    Model.where('name', '=', 'ivan')
         .where('age', '>', 35)
         .get();
```

> [!SUMMARY] Example Project: Explore as the Documentation Evolves
> The project documentation is under construction, but you can explore our example project to understand how our library works in action. We're working to provide you with a complete guide soon. Thank you for your interest! ([Example](https://github.com/ivangongoram/example.git)).
