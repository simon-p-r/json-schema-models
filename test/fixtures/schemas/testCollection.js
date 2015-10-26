'use strict';

module.exports = {


    metaSchema: {
        description: 'test collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'test',
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
