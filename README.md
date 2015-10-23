# json-schema-models [![build status](https://travis-ci.org/simon-p-r/json-schema-models.svg?branch=master)](https://travis-ci.org/simon-p-r/json-schema-models)

Data models for mongodb using json schema to define polymorphic schemas to be used with mongodb.
Internally modules use z-schema for json validation and mongodb native driver to connect to db.

### Not currently fit for public consumption


#### API

##### new jsonSchemaModels(options);

options object must contain the following properties
+ mongo
   + name - mongodb name
   + url - mongodb url string (host and port)
   + options - mongodb connection options

+ schema
   + formats - an object with keys being name of format to register and value being the custom function to register for z-schema validation
+ validator - an object created by z-schema constructor function

##### .start(callback)

+ method to validate the schemas

    ##### params
    + callback with error, result signature - error will show if any schemas have failed validation and result is an object containing the raw mognodb db handle from connection and an object containing handles to each model with keys beign name of model and value being the handle.

##### .stop(callback)

+ method to close connections and clean-up for server closedown

    ##### params
    + optional callback with no signature

##### .buildIndexes(callback)

+ method to build indexes based on schema definition

    ##### params
    + callback with err signature

##### Todo

+ Add json-schema validation to model insert, insertMany and update methods
+ Add lifecycle hooks for methods that are defined on schema definitions
+ Intergrate dropAllIndexes method
+ Handle multi-tenant database semantics
+ Switch to generators or async await instead of neo-async dependency
+ Add ability to use different datastores based on configuration
+ Add query pasrser for request.query from hapi
+ Argument checker for api rather than hardcoding incoming parameters to collection / record objects
