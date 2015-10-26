'use strict';

module.exports = {


    metaSchema: {
        description: 'invalid defintion',
        type: 'record',
        base: 'example',
        jsonSchema: 'v4',
        name: 'rec',
        version: 1

    },
    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {

            control: {
                type: 'string',
                '$ref.unknown': 'unknown',
                maxLength: 50
            }
        },
        required: ['control']
    }
};
