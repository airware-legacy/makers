var extend    = require('jquery-extend'),
    parsePath = require('parse-filepath'),
    Page      = require('./Page'),
    through   = require('through2');


module.exports = function(data, handlebars) {
    if (!data) throw 'A data object is required to process the pages';
    if (!handlebars) throw 'A handlebars instance is required to process the pages';

    return through.obj(function(file, encoding, callback) {
        // Construct a page object
        var page = new Page(extend(true, {}, file.frontMatter, {
            slug      : parsePath(file.path).name,
            content   : file.contents.toString(),
            posts     : data.posts,
            year      : data.year,
            timestamp : data.timestamp,
            pageTitle : data.pageTitle
        }));

        // Compile the template and put the results back in the stream
        var template = handlebars.compile(page.content);
        file.contents = new Buffer(template(page));

        callback(null, file);
    });
};