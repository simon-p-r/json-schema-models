'use strict';

var Async = require('neo-async');
var MongoClient = require('mongodb').MongoClient;
var Hoek = require('hoek');
var Joi = require('joi');
var Collection = require('./collection.js');
// var Model = require('./model.js');
var Yajsv = require('yajsv');

var internals = {
    options: Joi.object({
        mongo: Joi.object({
            name: Joi.string().required(),
            url: Joi.string().required(),
            options:  Joi.object()
        }),
        schema: Joi.object({
            formats: Joi.object({

            }).pattern(/^[a-zA-Z]+$/, Joi.func())
        }),
        validator: Joi.object().required(),
        zSchema: Joi.func().required()
    })


};



module.exports = internals.Datastore = class Datastore {

    constructor (options) {

        Hoek.assert(typeof options === 'object', 'Datastore must be constructed with a valid options object');
        this.settings = options;
        var result = Joi.validate(this.settings, internals.options);
        if (result.error) {
            throw result.error;
        };
        this.schema = new Yajsv(this.settings.schema);
        this.zSchema = this.settings.zSchema;
        this.validator = this.settings.validator;
        this.db = null;
        this.collections = {};
    }

    start (cb) {

        var self = this;
        var compileErr = this.compile();
        if (compileErr) {
            return cb(compileErr);
        }
        this.schema.validator = this.validator;
        if (!Object.keys(this.schema.collections).length) {
            return cb(new Error('No collection schemas loaded, please use addSchemas to add schema definitions'));
        }
        return this.validate(this.schema, function (err) {

            if (err) {
                return cb(err);
            }

            var conn = internals.prepareConnection(self.settings.mongo);
            var name;
            return MongoClient.connect(conn.url, conn.options, function (err, db) {

                if (err) {
                    return cb(err);
                }
                self.db = db;
                // var recs = Object.keys(self.schema.records);
                // for (var i = 0; i < recs.length; ++i) {
                //
                //     name = recs[i];
                //     self.models[name] = new Model(db, self.schema, name);
                //
                // }
                var collections = Object.keys(self.schema.collections);
                for (var a = 0; a < collections.length; ++a) {

                    name = collections[a];
                    self.collections[name] = new Collection(db, self.schema, name);

                }
                return cb();
            });
        });

    }

    validate (rawSchemas, callback) {

        var err, schemaName, valid;
        var formats = Object.keys(rawSchemas.formats);
        for (var e = 0, el = formats.length; e < el; ++e) {

            var name = formats[e];
            var func = rawSchemas.formats[name].bind(this);
            this.zSchema.registerFormat(name, func);
        }

        var defs = Object.keys(rawSchemas.definitions);
        for (var i = 0, il = defs.length; i < il; ++i) {

            schemaName = defs[i];
            var definition = rawSchemas.definitions[schemaName].schema;
            valid = this.validator.validateSchema(definition);

            if (!valid) {
                err = {
                    schemaName,
                    msg: this.validator.getLastError()
                };
                return callback(err);
            }
        }

        var collections = Object.keys(rawSchemas.collections);
        for (var f = 0, fl = collections.length; f < fl; ++f) {

            schemaName = collections[f];
            var collection = rawSchemas.collections[schemaName].schema;
            valid = this.validator.validateSchema(collection);

            if (!valid) {
                err = {
                    schemaName,
                    msg: this.validator.getLastError()
                };
                return callback(err);
            }
        }

        var recs = Object.keys(rawSchemas.records);
        for (var a = 0, al = recs.length; a < al; ++a) {

            schemaName = recs[a];
            var record = rawSchemas.records[schemaName].schema;
            valid = this.validator.validateSchema(record);

            if (!valid) {
                err = {
                    schemaName,
                    msg: this.validator.getLastError()
                };
                return callback(err);
            }
        }
        return callback();

    }

    compile () {

        try {
            this.schema.compile();
        } catch (e) {
            return e;
        }
    }


    stop (callback) {

        if (callback) {
            delete this.collections;
            return this.db.close(callback);
        }
        delete this.collections;
        this.db.close();
        return;
    }

    buildIndexes (callback) {

        var self = this;
        var collections = this.collections;
        Async.eachSeries(collections, function (collection, next) {

            var collectionName = collection.meta.name;
            var indexes = self.collections[collectionName].indexes;
            Async.eachSeries(indexes, function (index, done) {

                self.db.createIndex(collectionName, index.key, index.options, function (err, res) {

                    if (err) {
                        return done('Cannot create collection indices: ' + collectionName + ' - ' + err);
                    }
                    return done();
                });

            }, function (err) {

                return next(err);
            });
        }, function (err) {

            return callback(err);
        });
    }

};


internals.prepareConnection = function (connection) {

    var url = connection.url + '/' + connection.name;
    return {
        name: connection.name,
        url: url,
        options: connection.options
    };

};
