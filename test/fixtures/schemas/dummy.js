'use strict';

module.exports = {


    metaSchema: {
        description: 'dummy collection',
        type: 'record',
        jsonSchema: 'v4',
        name: 'dummy',
        version: 1,
        keys: [{
            name: 'sid',
            flds: {
                'tdid': 1
            }
        }]

    },
    schema: {

        id: 'dummy',
        type: 'object',
        additionalProperties: false,
        properties: {

            dbRef: {
                type: 'object',
                // format: 'dbRef',
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
                required: ['cn', 'q'],
                additionalProperties: false
            },
            luRef: {
                type: 'object',
                // format: 'lookup',
                properties: {
                    lt: {
                        type: 'string',
                        maxLength: 50
                    },
                    lv: {
                        type: ['string', 'array'],
                        maxLength: 50,
                        items: {
                            type: 'string',
                            maxLength: 50
                        }
                    }
                },
                additionalProperties: false
            },
            duration: {
                type: 'string',
                maxLength: 50

            },
            password: {
                type: 'string',
                maxLength: 50
            },
            phone: {
                type: 'string',
                maxLength: 50
            },
            postcode: {
                type: 'string',
                maxLength: 50
            },
            vatNumber: {
                type: 'string',
                maxLength: 50
            },
            iban: {
                type: 'string',
                maxLength: 50
            },
            contact: {
                type: 'string',
                maxLength: 50
            },
            amt: {
                type: 'string',
                maxLength: 50
            }
        },
        required: ['dbRef']
    }
};
