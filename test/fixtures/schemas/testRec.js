'use strict';

module.exports = {


    metaSchema: {
        description: 'test record schema',
        type: 'record',
        base: 'example',
        jsonSchema: 'v4',
        name: 'test',
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
            '$ref.control': 'sample'
        },
        required: ['lookup']
    }
};
