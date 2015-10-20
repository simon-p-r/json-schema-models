'use strict';

module.exports = {


    metaSchema: {
        description: 'dummy collection',
        type: 'record',
        jsonSchema: 'v4',
        name: 'rec',
        version: 1,
        keys: [{
            name: 'sid',
            flds: {
                'tdid': 1
            }
        }]

    },
    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {

            lookup: {
                type: 'string',
                maxLength: 50
            },
            '$ref.control': 'sample'
        },
        required: ['lookup']
    }
};
