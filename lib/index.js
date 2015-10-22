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
        this.records = {};
    }

    start (callback) {

        var self = this;
        var compileErr = this.compile();
        if (compileErr) {
            return callback(compileErr);
        }
        this.schema.validator = this.validator;
        if (!Object.keys(this.schema.records).length) {
            return callback(new Error('No record schemas loaded, please use addSchemas to add schema definitions'));
        }
        return this.validate(this.schema, function (err, valid) {

            if (err) {
                return callback(err, null);
            }

            var conn = internals.prepareConnection(self.settings.mongo);
            return MongoClient.connect(conn.url, conn.options, function (err, db) {

                if (err) {
                    return callback(err, null);
                }
                self.db = db;
                var keys = Object.keys(self.schema.records);
                for (var i = 0, il = keys.length; i < il; ++i) {
                    var name = keys[i];
                    self.records[name] = new Record(db, self.schema, name);
                }
                var records = self.records;
                return callback(null, { records, db });
            });
        });

    }

    validate (rawSchemas, callback) {

        var err, schemaName, valid;
        var formats = Object.keys(this.schema.formats);
        for (var e = 0, el = formats.length; e < el; ++e) {

            var name = formats[e];
            var func = this.schema.formats[name].bind(this);
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
        var records = this.schema.records;
        Async.eachSeries(records, function (record, next) {

            var recName = record.metaSchema.name;
            var collectionName = record.metaSchema.base || recName;
            var indexes = self.records[recName].indexes;
            Async.eachSeries(indexes, function (index, done) {

                self.db.createIndex(collectionName, index.key, index.options, function (err, res) {

                    if (err) {
                        return done('Cannot create collection indices: ' + collectionName + ' - ' + err, null);
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
