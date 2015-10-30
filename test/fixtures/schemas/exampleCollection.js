'use strict';

module.exports = {

    metaSchema: {
        description: 'example collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'exampleCollection',
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

            recType: {
                type: 'string'
            },
            test: {
                type: 'string',
                maxLength: 50
            },
            example: {
                type: 'string'
            }
        },
        required: ['recType', 'test', 'example']
    },
    methods: {
        preValidate: function (payload) {

            return payload;
        },
        postValidate: function (payload) {

            return payload;
        },
        preSave: function (payload) {

            return payload;
        },
        postSave: function (payload) {

            return payload;
        }
    }
};
