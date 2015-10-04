'use strict';

var DbRef = require('./dbRef.js').schema;

module.exports = {

    metaSchema: {
        description: 'database control definition',
        type: 'definition',
        jsonSchema: 'v4',
        name: 'control',
        version: 1
    },

    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {

            createdAt: {
                type: 'string',
                format: 'date-time',
                maxLength: 50
            },
            createdBy: DbRef,
            id: {
                type: 'string',
                maxLength: 50
            },
            schemaVersion: {
                type: 'integer'
            },
            updatedAt: {
                type: 'string',
                maxLength: 50,
                format: 'date-time'
            },
            updatedBy: DbRef
        }

    }
};
