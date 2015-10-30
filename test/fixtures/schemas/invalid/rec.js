'use strict';

module.exports = {


    metaSchema: {
        description: 'invalid record schema',
        type: 'record',
        base: 'exampleCollection',
        jsonSchema: 'v4',
        name: 'rec',
        version: 1

    },
    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {

            invalid: {
                type: 'string',
                format: 'unknown',
                maxLength: 50
            }
        },
        required: ['invalid']
    }
};
