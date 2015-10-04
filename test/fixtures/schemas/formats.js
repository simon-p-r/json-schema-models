module.exports = [{

    metaSchema: {
        description: 'format collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'format',
        version: 1,
        keys: [{
            name: 'sid',
            flds: {
                'tdid': 1
            }
        }]

    },
    schema: {

        id: 'format',
        properties: {

            key: {
                type: 'string',
                format: 'key',
                maxLength: 50
            }
        },
        required: ['key']
    }

}];
