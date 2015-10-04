module.exports = {


    metaSchema: {
        description: 'dummy collection',
        type: 'record',
        jsonSchema: 'v4',
        base: 'dummy',
        name: 'rec',
        version: 1,
        keys: [{
            name: 'sid',
            flds: {
                'test': 1
            }
        }]

    },
    schema: {

        id: 'rec',
        type: 'object',
        additionalProperties: false,
        properties: {

            lookup: {
                type: 'string',
                maxLength: 50
            }
        },
        required: ['lookup']
    }
};
