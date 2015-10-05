// Load modules

var Code = require('code');
var Lab = require('lab');
var Schema = require('yajsv');
var Manager = require('../lib/index.js');

// Fixtures
var Schemas = require('./fixtures/schemas/index.js');
// var AddedSchemas = require('./fixtures/schemas/array.js');
// var FormatSchemas = require('./fixtures/schemas/formats.js');
// var Formats = require('./fixtures/formats.js');
var Rec = require('./fixtures/data/rec.json');
var Rec1 = require('./fixtures/data/rec1.json');
var Rec2 = require('./fixtures/data/rec2.json');

// Set-up lab
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('Manager', function () {

    it('should throw an error when constructed without new', function (done) {

        expect(function () {

            Manager();
        }).throws(Error);
        done();

    });

    it('should throw an error when constructed without an options object', function (done) {

        expect(function () {

            new Manager();
        }).throws(Error, 'options must be an object');
        done();

    });

    it('should return an error when opened against invalid port', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27018',
            options: {

            }
        });
        schema.addSchemas(Schemas);
        schema.compile();
        manager.start(schema, function (err, result) {

            expect(err).to.exist();
            expect(result).to.not.exist();
            done();
        });

    });

    it('should throw an error when invalid options are passed to constructor', function (done) {

        expect(function () {

            new Manager({
                url: 'mongodb://localhost:27017',
                options: {

                }
            });
        }).throws(Error);
        done();

    });

    it('should create settings object from options passed to constructor and connect to db', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();

        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            expect(result.db).to.exist();
            expect(result.models).to.exist();
            expect(result.models.dummy).to.exist();
            expect(result.models.rec).to.exist();
            expect(manager.db).to.exist();
            manager.stop(done);

        });
    });


    it('should expose a insertMany method on collection entity', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();

        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            var dummy = result.models.dummy;
            expect(dummy).to.be.an.object();
            dummy.insertMany([Rec1, Rec2], {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a insertOne method on collection entity', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {


            }
        });

        schema.addSchemas(Schemas);
        schema.compile();

        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            var dummy = result.models.dummy;
            expect(dummy).to.be.an.object();
            dummy.insertOne(Rec, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a count method on collection entity', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();
        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();

            result.models.dummy.count({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.a.number();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a find method on collection entity', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();
        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            result.models.dummy.find({}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.array();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a findOne method on collection entity', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();
        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            result.models.dummy.findOne({ tdid: 'test' }, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a deleteMany method on collection entity', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();
        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            result.models.dummy.deleteMany({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a deleteOny method on collection entity', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();
        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            result.models.dummy.deleteOne({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a buildIndexes method and successfully build indexes with mongodb', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();
        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            manager.buildIndexes(function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.exist();
                manager.stop();
                done();
            });
        });
    });

    it('should return an error if buildIndexes is unsuccesful with mongo', function (done) {

        var schema = new Schema({});
        var manager = new Manager({
            name: 'test_db',
            url: 'mongodb://localhost:27017',
            options: {

            }
        });

        schema.addSchemas(Schemas);
        schema.compile();
        manager.start(schema, function (err, result) {

            expect(err).not.to.exist();
            manager.models.example.indexes = [{
                key: {
                    test: 1
                },
                name: 'sid',
                unique: false,
                background: true,
                w: 1
            }];
            manager.buildIndexes(function (err, rec) {

                expect(err).to.exist();
                expect(rec).to.not.exist();
                manager.stop();
                done();
            });
        });
    });

});
