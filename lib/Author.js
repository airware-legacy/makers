var extend = require('jquery-extend');


// Constructor
var Author = function( options ) {

    var required = [
        'slug',
        'bio',
        'name',
        'title',
        'email'
    ];

    required.forEach(function(prop) {
        if ( !options.hasOwnProperty(prop) ) throw 'Author must have a ' + prop + ' property';
    });

    extend(true, this, options);

    return this;

};


module.exports = Author;