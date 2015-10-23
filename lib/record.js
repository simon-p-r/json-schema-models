'use strict';

var Hoek = require('hoek');

var internals = {};

module.exports = internals.Record = class Record {

    constructor (db, schemata, name) {

        Hoek.assert(typeof db === 'object', 'db must be an object');
        Hoek.assert(typeof schemata === 'object', 'schema must be an object');
        Hoek.assert(typeof name === 'string', 'name must be a string');
        this.db = db;
        var schema = schemata.records[name];
        this.meta = schema.metaSchema;
        this.validator = schemata.validator;
        this.schema = schema.schema;
        var keys = this.meta.keys;
        this.collectionName = this.meta.base;
        if (keys) {
            this.indexes = internals.prepareIndexes(keys);
        }
    }

    find (query, projection, callback) {

        var name = this.collectionName;
        return this.db.collection(name).find(query, projection).toArray(callback);
    }

    findOne (criteria, options, callback) {

        var name = this.collectionName;
        return this.db.collection(name).findOne(criteria, options, callback);
    }

    deleteMany (filter, options, callback) {

        var name = this.collectionName;
        return this.db.collection(name).deleteMany(filter, options, callback);
    }

    deleteOne (filter, options, callback) {

        var name = this.collectionName;
        return this.db.collection(name).deleteOne(filter, options, callback);

    }

    insertMany (docs, options, callback) {

        var name = this.collectionName;
        return this.db.collection(name).insertMany(docs, options, callback);
    }

    insertOne (doc, options, callback) {

        var self = this;
        var name = this.collectionName;
        // this.schema.validateData(doc, schema, function(err, valid) {
        //
        //
        //     if (err) {
        //         console.log(err);
        //         return callback(err, null);
        //     }

        return self.db.collection(name).insertOne(doc, options, callback);
        // })
    }

    count (criteria, options, callback) {

        var name = this.collectionName;
        return this.db.collection(name).count(criteria, options, callback);
    }
};


internals.prepareIndexes = function (indexes) {

    var results = [];
    indexes.forEach(function (key) {

        var info = {
            key: key.flds,
            name: key.name,
            unique: true,
            background: true,
            w: 1
        };
        results.push(info);

    });
    return results;
};
