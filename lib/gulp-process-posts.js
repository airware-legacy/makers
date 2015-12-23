var extend    = require('jquery-extend'),
    parsePath = require('parse-filepath'),
    Post      = require('./Post'),
    through   = require('through2');


module.exports = function(data, template) {
    if (!data) throw 'A data object is required to process the posts';
    if (!template) throw 'A compiled handlebars template is required to process the posts';

    return through.obj(function(file, encoding, callback) {
        // Create a post object
        var post = new Post(extend(true, {}, file.frontMatter, {
            slug      : parsePath(file.path).name,
            link        : '/' + file.frontMatter.category + '/' + file.relative.replace('.html', '') + '/',
            content   : file.contents.toString(),
            pageTitle : data.pageTitle,
            year      : data.year,
            timestamp : data.timestamp,
            isExternal: !!file.frontMatter.external
        }));

        // Join the authors collection
        post.author = data.authors.find(function(author) {
            return author.slug == file.frontMatter.author;
        });

        // Build a reviewers collection from authors
        post.reviewers = data.authors.filter(function(author) {
            return ( file.frontMatter.reviewers.indexOf(author.slug) >= 0 );
        });

        // Populate the posts object for reuse
        data.posts.push(post);

        // Alter the path, write the rendered template, and put back in stream
        file.path = post.makePath(file.path);
        file.contents = new Buffer(template(post));

        callback(null, file);
    });
};