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
var beforeEach = lab.beforeEach;

describe('Manager', function () {

    var manager;

    beforeEach(function (done) {

        manager = new Manager({
            mongo: {
                name: 'test_db',
                url: 'mongodb://localhost:27017',
                options: {

                }
            },
            schema: {
                formats: Formats
            },
            validator: Validator,
            zSchema: ZSchema
        });
        done();
    });

    it('should throw an error when constructed without an options object', function (done) {

        expect(function () {

            new Manager();
        }).throws(Error, 'Datastore must be constructed with a valid options object');
        done();

    });

    it('should return an error when opened against invalid port', function (done) {

        manager.settings.mongo.url = 'mongodb://localhost:27018';
        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).to.exist();
            expect(result).to.not.exist();
            done();
        });

    });

    it('should throw an error when invalid options are passed to constructor', function (done) {

        manager.settings.mongo.url = 'mongodb://localhost:27017';
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

        manager.schema.addSchemas([InvalidDef]);
        manager.start(function (err, result) {

            expect(err).to.exist();
            done();

        });
    });

    it('should return an error from start method when a schema compile throws an error', function (done) {

        manager.schema.addSchemas([InvalidRef]);
        manager.start(function (err, result) {

            expect(err).to.exist();
            done();

        });
    });

    it('should return an error from start method when a record schema is not valid with z-schema', function (done) {

        manager.schema.addSchemas([InvalidRec]);
        manager.start(function (err, result) {

            expect(err).to.exist();
            done();

        });
    });

    it('should return an error if no record schemas have been loaded by addSchemas method', function (done) {

        manager.start(function (err, result) {

            expect(err).to.exist();
            done();
        });
    });


    it('should return an error if defintion sub-schemas are not valid with z-schema', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.schema.addSchemas([InvalidDef]);
        manager.start(function (err, result) {

            expect(err).to.exist();
            done();
        });
    });

    it('should create settings object from options passed to constructor and connect to db', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            expect(manager.db).to.exist();
            expect(manager.records).to.exist();
            expect(manager.records.dummyRec).to.exist();
            manager.stop(done);

        });
    });


    it('should expose a insertMany method on collection entity', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummyRec.insertMany([Rec1, Rec2], {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop(done);
            });
        });
    });

    it('should expose a insertOne method on collection entity', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummyRec.insertOne(Rec, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a count method on collection entity', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummyRec.count({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.a.number();
                manager.stop();
                done();
            });
        });
    });

    it('should expose a find method on collection entity', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummyRec.find({}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.array();
                manager.stop(done);
            });
        });
    });

    it('should expose a findOne method on collection entity', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummyRec.findOne({ tdid: 'test' }, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop(done);
            });
        });
    });

    it('should expose a deleteMany method on collection entity', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummyRec.deleteMany({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop(done);
            });
        });
    });

    it('should expose a deleteOny method on collection entity', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummyRec.deleteOne({}, {}, function (err, rec) {

                expect(err).to.not.exist();
                expect(rec).to.be.an.object();
                manager.stop(done);
            });
        });
    });

    it('should expose a buildIndexes method and successfully build indexes with mongodb', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.buildIndexes(function (err) {

                expect(err).to.not.exist();
                manager.stop(done);
            });
        });
    });

    it('should return an error if buildIndexes is unsuccesful with mongo', function (done) {

        manager.schema.addSchemas(Schemas);
        manager.start(function (err, result) {

            expect(err).not.to.exist();
            manager.records.dummyRec.indexes = [{
                key: {
                    test: 'a'
                },
                name: 'sid',
                unique: false,
                background: true,
                w: 1
            }];
            manager.buildIndexes(function (err) {

                expect(err).to.exist();
                manager.stop(done);
            });
        });
    });

});
