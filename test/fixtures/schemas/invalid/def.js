'use strict';

module.exports = {


    metaSchema: {
        description: 'invalid defintion',
        type: 'definition',
        jsonSchema: 'v4',
        name: 'def',
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
