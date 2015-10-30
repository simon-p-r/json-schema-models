'use strict';

var Hoek = require('hoek');
var Utils = require('basic-utils');
var SID_DIVIDER = '::';

var internals = {};

module.exports = internals.Collection = class Collection {

    constructor (db, schemata, name) {

        Hoek.assert(typeof db === 'object', 'db must be an object');
        Hoek.assert(typeof schemata === 'object', 'schema must be an object');
        Hoek.assert(typeof name === 'string', 'name must be a string');
        this.db = db;
        var schema = schemata.collections[name];
        this.schemata = schemata;
        this.meta = schema.metaSchema;
        this.validator = schemata.validator;
        this.methods = schema.methods;
        this.schema = schema.schema;
        var keys = this.meta.keys;
        this.collectionName = this.meta.name;
        this.sids = [];
        if (keys) {
            this.indexes = this.prepareIndexes(keys);
        }
    }

    find (query, projection, callback) {

        var name = this.collectionName;
        return this.db.collection(name).find(query, projection).toArray(callback);
    }

    findOne (criteria, options, callback) {

        var name = this.collectionName;
        return this.db.collection(name).find(criteria, options).limit(1).next(callback);
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
        var type = doc.recType;
        if (!this.schemata.records[type]) {
            return callback(new Error('No valid schema matching documents recType'));
        }
        var schema = this.schemata.records[type].schema;
        return this.validator.validate(doc, schema, function (err, valid) {

            if (err) {
                return callback(err);
            }
            return self.db.collection(name).insertOne(doc, options, callback);
        });
    }

    count (criteria, options, callback) {

        var name = this.collectionName;
        return this.db.collection(name).count(criteria, options, callback);
    }

    distinct (key, query, options, callback) {

        var name = this.collectionName;
        return this.db.collection(name).distinct(key, query, options, callback);
    }

    prepareIndexes (indexes) {

        var results = [];
        var self = this;
        indexes.forEach(function (key) {

            self.sids.push(key.name);
            var index = {
                key: key.flds,
                options: {
                    name: key.name,
                    unique: true,
                    background: true,
                    w: 1
                }
            };
            results.push(index);

        });
        return results;
    }

    createSid (payload) {

        if (Utils.isObj(payload) && payload.control) {
            payload.control.sid = '';
            var sids = this.sids;
            for (let i = 0; i < sids.length; ++i) {

                var sid = sids[i];
                var v = Hoek.reach(payload, sid);
                if (!v) {
                    return;
                }
                v = v.trim();
                payload.control.sid += v + SID_DIVIDER;
            }
            payload.control.sid = payload.control.sid.slice(0, payload.control.sid.length - 2).toLowerCase();
        }
        return payload;
    }
};
