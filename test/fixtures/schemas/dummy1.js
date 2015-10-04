module.exports = {


    metaSchema: {
        description: 'dummy collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'dummy1',
        version: 1,
        keys: [{
            name: 'sid',
            flds: {
                'tdid': 1
            }
        }]

    },
    schema: {

        id: 'dummy1',
        type: 'object',
        additionalProperties: false,
        properties: {

            iban: {
                type: 'string',
                maxLength: 50
            }
        },
        required: ['iban']
    }
};
