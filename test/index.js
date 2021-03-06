'use strict';

const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Manager = require('../lib/index.js');

// Fixtures
const Collections = require('./fixtures/collections.js');
const Schemas = require('./fixtures/schemas/index.js');
const Formats = require('./fixtures/formats.js');
const InvalidDef = require('./fixtures/schemas/invalid/def.js');
const InvalidRec = require('./fixtures/schemas/invalid/rec.js');
const InvalidRef = require('./fixtures/schemas/invalid/ref.js');


// Set-up lab
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const afterEach = lab.afterEach;
const beforeEach = lab.beforeEach;

describe('Manager', () => {

    let manager;

    beforeEach((done) => {

        manager = new Manager({
            mongo: {
                name: 'wadofgum_db',
                url: 'mongodb://localhost:27017',
                options: {

                },
                collections: Collections
            },
            schema: {
                formats: Formats
            }
        });
        done();
    });

    afterEach((done) => {

        manager = null;
        done();
    });


    it('should throw an error when constructed without an options object', (done) => {

        expect(() => {

            new Manager();
        }).throws(Error, 'JsonModels must be constructed with a valid options object');
        done();

    });

    it('should return an error when opened against invalid port', (done) => {

        manager.settings.mongo.url = 'mongodb://localhost:27018';
        manager.addSchemas(Schemas);
        manager.start((err, result) => {

            expect(err).to.exist();
            expect(err.name).to.contain('MongoError');
            expect(err.message).to.contain('failed to connect to server');
            done();
        });

    });

    it('should throw an error when invalid options are passed to constructor', (done) => {

        manager.settings.mongo.url = 'mongodb://localhost:27017';
        expect(() => {

            new Manager({
                url: 'mongodb://localhost:27017',
                options: {

                }
            });
        }).throws(Error);
        done();

    });

    it('should return an error when a defintion schema is not valid with z-schema', (done) => {

        manager.addSchemas(Schemas);
        manager.addSchemas([InvalidDef]);
        manager.start((err, result) => {

            expect(err).to.exist();
            expect(err.schemaName).to.contain('def');
            done();

        });
    });

    it('should return an error from start method when a schema compile throws an error', (done) => {

        manager.addSchemas([InvalidRef]);
        manager.start((err, result) => {

            expect(err).to.exist();
            expect(err).to.be.instanceof(Error);
            done();

        });
    });

    it('should return an error from start method when a createCollections returns an error', (done) => {

        const invalid = Hoek.clone(Collections);
        invalid[0].name = null;
        const datastore = new Manager({
            mongo: {
                name: 'wadofgum_db',
                url: 'mongodb://localhost:27017',
                options: {

                },
                collections: invalid
            },
            schema: {
                formats: Formats
            }
        });
        datastore.addSchemas(Schemas);
        datastore.start((err, result) => {

            expect(err).to.exist();
            expect(err.code).to.equal(15888);
            done();

        });
    });

    it('should return an error from start method when a createSchemas returns an error', (done) => {

        const Invalid = Hoek.clone(Schemas);
        Invalid[1].metaSchema.base = 'invalid';
        const datastore = new Manager({
            mongo: {
                name: 'wadofgum_db',
                url: 'mongodb://localhost:27017',
                options: {

                },
                collections: Collections
            },
            schema: {
                formats: Formats
            }
        });
        datastore.addSchemas(Invalid);
        datastore.start((err, result) => {

            expect(err).to.exist();
            expect(err.toString()).to.contain('Base name for record schema');
            done();

        });
    });


    it('should return an error if no record schemas have been loaded by addSchemas method', (done) => {

        manager.start((err, result) => {

            expect(err).to.exist();
            expect(err.message).to.contain('No record schemas loaded');
            done();
        });
    });

    it('should return an error from start method when a record schema is not valid with z-schema', (done) => {

        manager.addSchemas(Schemas);
        manager.addSchemas([InvalidRec]);
        manager.start((err, result) => {

            expect(err).to.exist();
            expect(err.schemaName).to.contain('rec');
            done();
        });
    });

    it('should return an error if defintion sub-schemas are not valid with z-schema', (done) => {

        manager.addSchemas(Schemas);
        manager.addSchemas([InvalidDef]);
        manager.start((err, result) => {

            expect(err).to.exist();
            expect(err.schemaName).to.contain('def');
            done();
        });
    });

    it('should add custom formats via addFormats method', (done) => {

        manager.addSchemas(Schemas);
        manager.addFormats({
            customFormat: function (string) {

                return true;
            }
        });
        manager.start((err, result) => {

            expect(err).not.to.exist();
            expect(manager.schema.formats.customFormat).to.be.a.function();
            manager.stop(done);

        });
    });

    it('should successfully start db and return collections, records and db objects', (done) => {

        manager.addSchemas(Schemas);
        manager.start((err, result) => {

            expect(err).not.to.exist();
            expect(result.db).to.exist();
            expect(result.records).to.exist();
            expect(result.collections).to.exist();
            expect(result.definitions).to.exist();
            manager.stop(done);

        });
    });

    it('should clean up when stop method is called', (done) => {

        manager.addSchemas(Schemas);
        manager.start((err, result) => {

            expect(err).not.to.exist();
            manager.stop();
            done();
        });
    });

    it('should expose a buildIndexes method and successfully build indexes with mongodb', (done) => {

        manager.addSchemas(Schemas);
        manager.start((err, result) => {

            expect(err).not.to.exist();
            manager.buildIndexes((err) => {

                expect(err).to.not.exist();
                manager.stop(done);
            });
        });
    });

    it('should return an error if buildIndexes is unsuccesful with mongo', (done) => {

        const invalid = Hoek.clone(Collections);
        invalid[1].indexes[2] = Collections[1].indexes[0];
        invalid[1].indexes[2].options.unique = false;
        manager.collections = invalid;
        manager.addSchemas(Schemas);
        manager.start((err, result) => {

            expect(err).not.to.exist();
            manager.buildIndexes((err) => {

                expect(err).to.exist();
                expect(err.message).to.contain('Cannot create collection indices');
                manager.stop(done);
            });
        });
    });
});
