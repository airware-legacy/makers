var extend = require('jquery-extend'),
    parsePath = require('parse-filepath'),
    through = require('through2');


var indexify = function( options ) {

    var defaults = {
        exempt : []
    };

    extend(this, defaults, options);

    this.exempt.push('index');

    return through.obj(function(file, encoding, callback) {
        var path = parsePath(file.path);

        if ( this.exempt.indexOf(path.name) == -1 )
            file.path = [ path.dirname, path.name, 'index' + path.extname ].join('/');

        callback(null, file);
    }.bind(this));
};


module.exports = indexify;