'use strict';

module.exports = {

    metaSchema: {
        description: 'example collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'example',
        version: 1,
        keys: [{
            name: 'test',
            flds: {
                'test': 1
            }
        },
        {
            name: 'example',
            flds: {
                'example': 1
            }
        }]

    },
    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {

            test: {
                type: 'string',
                maxLength: 50
            },
            example: {
                type: 'string'
            }
        },
        required: ['test', 'example']
    }
};
