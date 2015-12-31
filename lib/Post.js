var extend = require('jquery-extend'),
    moment = require('moment');

// Constructor
var Post = function( options ) {

    var required = [
        'slug',
        'title',
        'author',
        'authors',
        'reviewers',
        'category',
        'date',
        'content',
        'thumbnail',
        'tags'
    ];

    // Validate options
    required.forEach(function(prop) {
        if ( !options.hasOwnProperty(prop) ) throw 'Post must have a ' + prop + ' property';
    });

    // Extend this by the options
    extend(true, this, options);

    // Calculate a display date
    this.displayDate = moment(this.date).format('MMMM DD, YYYY');

    // Calculate a link
    this.link = '/' + this.category + '/' + this.slug + '/';

    // Derive a snippet from the first paragraph of the content
    this.snippet = this.content.match(/<p>(.*)<\/p>/)[1];

    // Join the authors collection
    this.author = this.authors.find(function(author) {
        return author.slug == this.author;
    }, this);

    // Build a reviewers collection from authors
    this.reviewers = this.authors.filter(function(author) {
        return ( this.reviewers.indexOf(author.slug) >= 0 );
    }, this);


    // Transform tags into objects
    this.tags = this.tags.map(function(tag) {
        return {
            name : tag,
            slug : tag.toLowerCase()
                    .replace(' ', '-') // Dash delimit
                    .replace(/[^a-zA-Z0-9-_]/g, '') // Strip invalid chars
        };
    });

    // Return this for chaining
    return this;

};


// Helper to 
Post.prototype.makePath = function( path ) {
    var newPath = path
        .replace(this.slug, this.category + '/' + this.slug)
        .replace('.html', '/index.html'); // Convert to an index file

    return newPath;
};


module.exports = Post;