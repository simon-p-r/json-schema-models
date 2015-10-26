'use strict';

module.exports = {


    metaSchema: {
        description: 'sample definition',
        type: 'definition',
        jsonSchema: 'v4',
        name: 'sample',
        version: 1

    },
    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {

            control: {
                type: 'string',
                maxLength: 50
            }
        },
        required: ['control']
    }
};
