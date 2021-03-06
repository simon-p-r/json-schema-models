'use strict';

module.exports = {


    metaSchema: {
        description: 'test record schema',
        type: 'record',
        base: 'lookup',
        jsonSchema: 'v4',
        name: 'testRec',
        rids: ['lookup'],
        version: 1

    },
    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {

            lookup: {
                type: 'string',
                maxLength: 50
            },
            '$ref.control': 'exampleDef'
        },
        required: ['lookup']
    }
};
