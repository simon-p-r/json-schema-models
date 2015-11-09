'use strict';

module.exports = [

    {
        name: 'entity',
        indexes: [],
        options: {

        }
    },
    {
        name: 'relationship',
        indexes: [{
            key: {
                test: 1
            },
            options: {
                name: 'realtionship_test',
                background: true,
                unique: true
            }

        },
        {
            key: {
                item: 1
            },
            options: {
                name: 'realtionship_example',
                background: true,
                unique: true
            }
        }],
        options: {

        }
    },
    {
        name: 'lookup',
        indexes: [],
        options: {

        }
    }

];
