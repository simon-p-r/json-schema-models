'use strict';

module.exports = {


    metaSchema: {
        description: 'example collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'example',
        version: 1,
        keys: [{
            name: 'sid',
            flds: {
                'test': 1
            }
        }]

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
