'use strict';

const extend = require('jquery-extend');


module.exports = class Author {
    constructor (options) {
        const required = [
            'slug',
            'bio',
            'name',
            'title',
            'email'
        ];

        required.forEach(prop => {
            if (!options.hasOwnProperty(prop)) {
                throw `Author must have a ${prop} property`;
            }
        });

        extend(true, this, options);
    }
};
