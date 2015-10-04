// Load modules
var Hoek = require('hoek');

var internals = {};

module.exports = internals.Collection = function (db, schema, name) {

    Hoek.assert(this instanceof internals.Collection, 'Collection must be created using new');
    Hoek.assert(typeof db === 'object', 'db must be an object');
    Hoek.assert(typeof schema === 'object', 'schema must be an object');
    Hoek.assert(typeof name === 'string', 'name must be a string');
    this.db = db;
    var metaSchema = schema.schemas[name].metaSchema;
    var keys = metaSchema.keys;
    this.name = metaSchema.base || metaSchema.name;
    this.indexes = internals.prepareIndexes(keys);
    return this;

};


internals.Collection.prototype.find = function (criteria, callback) {

    var name = this.name;
    return this.db.collection(name).find(criteria).toArray(callback);

};


internals.Collection.prototype.findOne = function (criteria, options, callback) {

    var name = this.name;
    return this.db.collection(name).findOne(criteria, options, callback);

};


internals.Collection.prototype.deleteMany = function (filter, options, callback) {

    var name = this.name;
    return this.db.collection(name).deleteMany(filter, options, callback);

};

internals.Collection.prototype.deleteOne = function (filter, options, callback) {

    var name = this.name;
    return this.db.collection(name).deleteOne(filter, options, callback);

};


internals.Collection.prototype.insertMany = function (docs, options, callback) {

    var name = this.name;
    return this.db.collection(name).insertMany(docs, options, callback);

};


internals.Collection.prototype.insertOne = function (doc, options, callback) {

    var self = this;
    var name = this.name;
    // var schema = this.jSchema;
    // this.schema.validateData(doc, schema, function(err, valid) {
    //
    //
    //     if (err) {
    //         console.log(err);
    //         return callback(err, null);
    //     }

    return self.db.collection(name).insertOne(doc, options, callback);
    // })


};


internals.Collection.prototype.count = function (criteria, options, callback) {

    var name = this.name;
    return this.db.collection(name).count(criteria, options, callback);
};



internals.prepareIndexes = function (indexes) {

    var results = [];
    indexes.forEach(function (key) {

        var options = {
            key: key.flds,
            name: key.name,
            unique: true,
            background: true,
            w: 1
        };
        results.push(options);

    });
    return results;
};
