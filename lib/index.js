'use strict';

const Async = require('neo-async');
const MongoClient = require('mongodb').MongoClient;
const Hoek = require('hoek');
const Joi = require('joi');
const Wadofgum = require('wadofgum');
const Validation = require('wadofgum-json-schema');
const Datastore = require('wadofgum-mongodb');
const Yajsv = require('yajsv');
const ZSchema = require('z-schema');

const internals = {
    options: Joi.object({
        mongo: Joi.object({
            name: Joi.string().required(),
            url: Joi.string().required(),
            options:  Joi.object(),
            collections: Joi.array().items(Joi.object({
                name: Joi.any(),
                indexes: Joi.array(),
                options: Joi.object()
            })).required()
        }),
        schema: Joi.object({
            formats: Joi.object({

            }).pattern(/^[a-zA-Z]+$/, Joi.func())
        })
    })
};


module.exports = class JsonModels {

    constructor(options) {

        Hoek.assert(typeof options === 'object', 'JsonModels must be constructed with a valid options object');
        this.settings = options;
        const result = Joi.validate(this.settings, internals.options);
        if (result.error) {
            throw result.error;
        };
        this.schema = new Yajsv(this.settings.schema);
        this.zSchema = ZSchema;
        this.validator = new ZSchema();
        this.collections = this.settings.mongo.collections;
        this._collectionNames = [];
        this.db = null;
    };

    start(cb) {

        const compileErr = this.compile();
        if (compileErr) {
            return cb(compileErr, null);
        }
        if (!Object.keys(this.schema.records).length) {
            return cb(new Error('No record schemas loaded, please use addSchemas to add schema definitions'), null);
        }

        this.validate(this.schema, (err) => {

            if (err) {
                return cb(err, null);
            }

            const conn = internals.prepareConnection(this.settings.mongo);
            MongoClient.connect(conn.url, conn.options, (err, db) => {

                if (err) {
                    return cb(err, null);
                }

                this.db = db;

                this.createCollections((err, collections) => {

                    if (err) {
                        return cb(err, null);
                    }

                    this.createSchemas(db, (err, schemas) => {

                        if (err) {
                            return cb(err, null);
                        }

                        const definitions = schemas.definitions;
                        const records = schemas.records;
                        return cb(null, { collections, db, definitions, records });
                    });
                });
            });
        });
    };

    validate(rawSchemas, callback) {

        const formats = Object.keys(rawSchemas.formats);
        for (let i = 0; i < formats.length; ++i) {

            const name = formats[i];
            const func = rawSchemas.formats[name].bind(this);
            this.zSchema.registerFormat(name, func);
        }

        const defs = Object.keys(rawSchemas.definitions);
        for (let i = 0; i < defs.length; ++i) {

            const schemaName = defs[i];
            const definition = rawSchemas.definitions[schemaName].schema;
            const valid = this.validator.validateSchema(definition);

            if (!valid) {
                const err = {
                    schemaName,
                    msg: this.validator.getLastError()
                };
                return callback(err);
            }
        }

        const recs = Object.keys(rawSchemas.records);
        for (let i = 0; i < recs.length; ++i) {

            const schemaName = recs[i];
            const record = rawSchemas.records[schemaName].schema;
            const valid = this.validator.validateSchema(record);

            if (!valid) {
                const err = {
                    schemaName,
                    msg: this.validator.getLastError()
                };
                return callback(err);
            }
        }
        return callback(null);

    };

    compile() {

        try {
            this.schema.compile();
        }
        catch (e) {
            return e;
        }
    };


    stop(callback) {

        if (callback) {
            return this.db.close(callback);
        }

        this.db.close();
        return null;
    };

    buildIndexes(callback) {

        const collections = this.collections;

        const iterator = (collection, next) => {

            const name = collection.name;
            const indexes = collection.indexes;
            const createIndexes = (index, done) => {

                this.db.createIndex(name, index.key, index.options, (err, res) => {

                    if (err) {
                        return done(new Error(`Cannot create collection indices: ${collection.name} - ${err}`), null);
                    }
                    return done();
                });

            };

            Async.eachSeries(indexes, createIndexes, (err) => {

                return next(err);
            });

        };

        Async.eachSeries(collections, iterator, (err) => {

            return callback(err);

        });


    };

    createCollections(callback) {

        const rawCollections = this.collections;
        const collections = {};

        const iterator = (item, next) => {

            const collectionName = item.name;
            this._collectionNames.push(collectionName);
            const options = item.options;

            this.db.createCollection(collectionName, options, (err, collection) => {

                if (err) {
                    return next(err, null);
                }

                collections[collectionName] = collection;
                return next();

            });
        };

        Async.eachSeries(rawCollections, iterator, (err) => {

            return callback(err, collections);
        });

    };


    createSchemas(db, cb) {

        const definitions = {};
        const records = {};
        const keys = Object.keys(this.schema.records);
        for (let i = 0; i < keys.length; ++i) {

            const name = keys[i];
            const record = this.schema.records[name];
            if (this._collectionNames.indexOf(record.metaSchema.base) !== -1) {

                records[name] = class extends Wadofgum.mixin(Validation, Datastore) {};
                records[name].schema = record;
                records[name].validator = this.validator;
                records[name].db = db;
            }
            else {
                return cb(new Error(`Base name for record schema ${name} has no corresponding collection`), null);
            }
        }
        const defs = Object.keys(this.schema.definitions);
        for (let i = 0; i < defs.length; ++i) {

            const name = defs[i];
            definitions[name] = class extends Wadofgum.mixin(Validation) {};
            definitions[name].schema = this.schema.definitions[name];
            definitions[name].validator = this.validator;
        }
        return cb(null, { definitions, records });
    };

    addSchemas(schemas) {

        this.schema.addSchemas(schemas);
    };

    addFormats(formats) {

        this.schema.addFormats(formats);
    };
};


internals.prepareConnection = (connection) => {

    const url = `${connection.url}/${connection.name}`;
    return {
        name: connection.name,
        url,
        options: connection.options
    };

};
