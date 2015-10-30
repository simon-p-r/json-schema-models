'use strict';

module.exports = {


    metaSchema: {
        description: 'test record schema',
        type: 'record',
        base: 'testCollection',
        jsonSchema: 'v4',
        name: 'testRec',
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
