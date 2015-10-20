'use strict';

module.exports = {


    metaSchema: {
        description: 'invlaid defintion',
        type: 'record',
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
