'use strict';

var extend = require('jquery-extend');


module.exports = class Author {

    constructor( options ) {

        var required = [
            'slug',
            'bio',
            'name',
            'title',
            'email'
        ];

        required.forEach((prop) => {
            if ( !options.hasOwnProperty(prop) )
                throw 'Author must have a ' + prop + ' property';
        });

        extend(true, this, options);
    }

};