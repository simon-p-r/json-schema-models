'use strict';

module.exports = {

    metaSchema: {
        description: 'dbRef definition',
        type: 'definition',
        jsonSchema: 'v4',
        name: 'dbRef',
        version: 1
    },

    schema: {

        type: 'object',
        additionalProperties: false,
        properties: {
            cn: {
                type: 'string',
                maxLength: 50
            },
            q: {
                type: ['string', 'object'],
                maxLength: 50,
                patternProperties: {
                    '/(?=.*[a-zA-Z])/': {
                        type: 'string',
                        maxLength: 50
                    }
                }
            }
        },
        required: ['cn', 'q']
    }

};
