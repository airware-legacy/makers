var path    = require('path'),
    through = require('through2');


module.exports = function( arg ) {
    var exempt = [ 'index' ];

    if (typeof arg == 'string')
        exempt.push(arg);
    else
        exempt = exempt.concat(arg);

    return through.obj(function(file, encoding, callback) {
        var filePath = path.parse(file.path);

        if ( exempt.indexOf(filePath.name) == -1 )
            file.path = [ filePath.dir, filePath.name, 'index' + filePath.ext ].join('/');

        callback(null, file);
    });
};