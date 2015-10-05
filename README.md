# json-schema-models [![build status](https://travis-ci.org/simon-p-r/json-schema-models.svg?branch=master)](https://travis-ci.org/simon-p-r/json-schema-models)

Data models for mongodb using json schema to define polymorphic schemas to be used with mongodb.
Internally modules use z-schema for json validation and mongodb native driver to connect to db.

### Not currently fit for public consumption


#### API

##### new jsonSchemaModels(options);

options object must contain the following properties
+ name - mongodb name
+ url - mongodb url string (host and port)
+ options - mongodb connection options

##### .start(yajsv, callback)

+ method to validate the schemas

    ##### params
    + yajsv object constructed by [yajsv](https://github.com/simon-p-r/yajsv) module, required for internal validation and defines what models to build
    + callback with error, result signature - error will show if any schemas have failed validation and result is an object containing the raw mognodb db handle from connection and an object containing handles to each model with keys beign name of model and value being the handle.

##### .stop(callback)

+ method to close connections and clean-up for server closedown

    ##### params
    + optional callback with no signature

##### .buildIndexes(callback)

+ method to build indexes based on schema definition

    ##### params
    + callback with err, result signature

##### Todo

Intergrate with yasjv properly
Add validation to model insert, insertMany and update methods
Add lifecycle hooks for methods that are defined within defined schemas
Intergrate dropAllIndexes method
Handle multiple schema and database namespaces
Switch to generators or async await instead of neo-async dependency
