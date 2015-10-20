// Load modules

var Code = require('code');
var Lab = require('lab');
var Manager = require('../lib/index.js');

// Fixtures
var Schemas = require('./fixtures/schemas/index.js');
var Formats = require('./fixtures/formats.js');
var InvalidDef = require('./fixtures/schemas/invalid/def.js');
var InvalidRec = require('./fixtures/schemas/invalid/rec.js');
var InvalidRef = require('./fixtures/schemas/invalid/ref.js');
var Rec = require('./fixtures/data/rec.json');
var Rec1 = require('./fixtures/data/rec1.json');
var Rec2 = require('./fixtures/data/rec2.json');
var ZSchema = require('z-schema');
var Validator = new ZSchema();

// Set-up lab
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('Manager', function () {

    it('should throw an error when constructed without an options object', function (done) {

        expect(function () {

            new Manager();
        }).throws(Error, 'Datastore must be constructed with a valid options object');
        done();

    });

    it('should return an error when opened against invalid port', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27018',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });
        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

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

    it('should return an error when a defintion schema is not valid with z-schema', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas([InvalidDef]);
        manager.start(function (err, result) {

            expect(err).to.exist();
            done();

        });
    });

    it('should return an error from start method when a schema compile throws an error', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });


        manager.schema.addSchemas([InvalidRef]);
        manager.start(function (err, result) {

            expect(err).to.exist();
            done();

        });
    });

    it('should return an error from start method when a record schema is not valid with z-schema', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas([InvalidRec]);
        manager.start(function (err, result) {

            expect(err).to.exist();
            done();

        });
    });

    it('should create settings object from options passed to constructor and connect to db', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            expect(result.db).to.exist();
            expect(result.records).to.exist();
            expect(result.records.rec).to.exist();
            expect(manager.db).to.exist();
            manager.stop(done);

        });
    });


    it('should expose a insertMany method on collection entity', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            result.records.rec.insertMany([Rec1, Rec2], {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop(done);
            });
        });
    });

    it('should expose a insertOne method on collection entity', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            result.records.rec.insertOne(Rec, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a count method on collection entity', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            result.records.rec.count({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.a.number();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a find method on collection entity', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            result.records.rec.find({}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.array();
                manager.stop(done);
            });
        });
    });

    it('should expose a findOne method on collection entity', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            expect(result).to.be.an.object();
            result.records.rec.findOne({ tdid: 'test' }, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop(done);
            });
        });
    });

    it('should expose a deleteMany method on collection entity', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            result.records.rec.deleteMany({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop(done);
            });
        });
    });

    it('should expose a deleteOny method on collection entity', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            result.records.rec.deleteOne({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop(done);
            });
        });
    });

    it('should expose a buildIndexes method and successfully build indexes with mongodb', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.buildIndexes(function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.exist();
                manager.stop(done);
            });
        });
    });

    it('should return an error if buildIndexes is unsuccesful with mongo', function (done) {

        var manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            yajsv: {
                formats: Formats
            },
            validator: Validator
        });

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummy.indexes = [{
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
                manager.stop(done);
            });
        });
    });

});
