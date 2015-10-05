'use strict';

// Load modules
var Async = require('neo-async');
var MongoClient = require('mongodb').MongoClient;
var Hoek = require('hoek');
var Joi = require('joi');
var Collection = require('./collection.js');

var internals = {
    Schema: {
        name: Joi.string().required(),
        url: Joi.string().required(),
        options: Joi.object()
    }
};


module.exports = internals.Manager = function (options) {

    Hoek.assert(this instanceof internals.Manager, 'ModelManager must be created using new');
    Hoek.assert(typeof options === 'object', 'options must be an object');
    this.settings = options;
    var result = Joi.validate(this.settings, internals.Schema);
    if (result.error) {
        throw result.error;
    };
    this.schema = null;
    this.db = null;
    this.models = {};
    return this;
};


internals.Manager.prototype.start = function (schema, callback) {

    var self = this;
    internals.schema = schema;
    var conn = internals.prepareConnection(this.settings);
    MongoClient.connect(conn.url, conn.options, function (err, db) {

        if (err) {
            return callback(err, null);
        }
        self.db = db;
        internals.schema.db = db;
        var models = internals.schema.models;
        for (var i = 0, il = models.length; i < il; ++i) {
            var name = models[i].alias || models[i].collectionName;
            self.models[name] = new Collection(db, internals.schema, name);
        }
        return callback(null, {
            models: self.models,
            db: db
        });

    });

};


internals.Manager.prototype.stop = function (callback) {

    if (callback) {
        delete this.collections;
        return this.db.close(callback);
    }
    delete this.collections;
    this.db.close();
    return;
};


internals.Manager.prototype.buildIndexes = function (callback) {

    var self = this;
    var models = internals.schema.models;
    var retVal = {};
    Async.eachSeries(models, function (model, next) {

        var collectionName = model.collectionName;
        var modelName = model.alias || collectionName;
        var indexes = self.models[modelName].indexes;
        Async.eachSeries(indexes, function (index, done) {

            self.db.createIndex(collectionName, index.key, index.options, function (err, res) {

                if (err) {
                    return done('Cannot create collection indices: ' + collectionName + ' - ' + err, null);
                }
                retVal[model] = res;
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
};


internals.prepareConnection = function (connection) {

    var url = connection.url + '/' + connection.name;
    return {
        name: connection.name,
        url: url,
        options: connection.options,
        schemas: connection.schemas
    };

};
