'use strict';

module.exports = {


    metaSchema: {
        description: 'invalid record schema',
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
                format: 'unknown',
                maxLength: 50
            }
        },
        required: ['control']
    }
};
