'use strict';

module.exports = {


    metaSchema: {
        description: 'example record schema',
        type: 'record',
        base: 'entity',
        jsonSchema: 'v4',
        name: 'exampleRec',
        version: 1,
        rids: ['lookup'],
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

            lookup: {
                type: 'string',
                maxLength: 50
            },
            '$ref.def': 'exampleDef'
        },
        required: ['lookup']
    }
};
