// Through2 is a thin wrapper around node transform streams
var through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;


// Consts
const PLUGIN_NAME = 'gulp-hb-partials';


// Plugin level function(dealing with files)
function gulpHbPartials(hb) {

    if ( !hb ) throw new PluginError(PLUGIN_NAME, 'You must pass a handlebars object as the first argument!');

    // Creating a stream through which each file will pass
    return through.obj(function(file, enc, cb) {

        if (file.isNull()) return cb(null, file);

        if (file.isBuffer()) {
            var name = /(.*)\/(.*)\.(.*)/.exec(file.path)[2];
            hb.registerPartial(name, file.contents.toString());
        }

        cb(null, file);

    });

}

// Exporting the plugin main function
module.exports = gulpHbPartials;