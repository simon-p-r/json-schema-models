'use strict';

var Async = require('neo-async');
var MongoClient = require('mongodb').MongoClient;
var Hoek = require('hoek');
var Joi = require('joi');
var Record = require('./record.js');
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

            }).pattern(/^[a-zA-Z]+$/, Joi.func().required())
        }).required(),
        validator: Joi.object().required()
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
        this.validator = this.settings.validator;
        this.db = null;
        this.records = {};
    }

    start (callback) {

        var self = this;
        try {
            this.schema.compile();
        } catch (e) {
            return callback(e, null);
        }
        this.schema.validator = this.validator;
        var conn = internals.prepareConnection(this.settings.mongo);
        return this.validate(this.schema, function (err, valid) {

            if (err) {
                return callback(err, null);
            }

            MongoClient.connect(conn.url, conn.options, function (err, db) {

                if (err) {
                    return callback(err, null);
                }
                self.db = db;
                var records = Object.keys(self.schema.records);
                for (var i = 0, il = records.length; i < il; ++i) {
                    var name = records[i];
                    self.records[name] = new Record(db, self.schema, name);
                }
                return callback(null, {
                    records: self.records,
                    db: db
                });

            });
        });

    }

    validate (rawSchemas, callback) {

        var err, schemaName, valid;
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
                return callback(err, null);
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
                return callback(err, null);
            }
        }
        return callback(null, true);

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
        var records = this.schema.records;
        var retVal = {};
        Async.eachSeries(records, function (record, next) {

            var recName = record.metaSchema.name;
            var collectionName = record.metaSchema.base || recName;
            var indexes = self.records[recName].indexes;
            Async.eachSeries(indexes, function (index, done) {

                self.db.createIndex(collectionName, index.key, index.options, function (err, res) {

                    if (err) {
                        return done('Cannot create collection indices: ' + collectionName + ' - ' + err, null);
                    }
                    retVal[record] = res;
                    return done(null);
                });

            }, function (err) {

                if (err) {
                    return next(err);
                }
                return next();
            });
        }, function (err) {

            if (err) {
                return callback(err, null);
            }
            return callback(null, retVal);
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
