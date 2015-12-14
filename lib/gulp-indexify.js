var parsePath = require('parse-filepath'),
    through = require('through2');


module.exports = function( arg ) {
    var exempt = [ 'index' ];

    if (typeof arg == 'string')
        exempt.push(arg);
    else
        exempt = exempt.concat(arg);

    return through.obj(function(file, encoding, callback) {
        var path = parsePath(file.path);
        
        if ( exempt.indexOf(path.name) == -1 )
            file.path = [ path.dirname, path.name, 'index' + path.extname ].join('/');
        
        callback(null, file);
    });
};