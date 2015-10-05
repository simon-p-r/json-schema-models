module.exports = {


    metaSchema: {
        description: 'example collection',
        type: 'collection',
        jsonSchema: 'v4',
        name: 'example',
        version: 1

    },
    schema: {

        id: 'example',
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
