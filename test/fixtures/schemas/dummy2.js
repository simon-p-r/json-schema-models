module.exports = {


    metaSchema: {
        description: 'dummy2 collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'dummy2',
        version: 1,
        keys: [{
            name: 'sid',
            flds: {
                'tdid': 1
            }
        }]

    },
    schema: {

        id: 'dummy2',
        type: 'object',
        additionalProperties: false,
        properties: {

            amt: {
                type: 'string',
                maxLength: 50
            }
        },
        required: ['amt']
    }
};
