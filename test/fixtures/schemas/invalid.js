'use strict';

module.exports = {

    metaSchema: {
        description: 'invalid record schema',
        type: 'record',
        base: 'example',
        jsonSchema: 'v4',
        name: 'invalid',
        version: 1

    },
    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {

            iban: {
                type: 'string',
                maxLength: 50
            }
        },
        required: ['iban']
    }
};
