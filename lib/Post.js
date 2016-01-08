var argv   = require('yargs').argv,
    extend = require('jquery-extend'),
    moment = require('moment'),
    url    = require('url');


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

    var defaults = {
        url : {
            protocol : 'http',
            hostname : 'localhost',
            port     : argv.p || 3000
        }
    };

    // Validate options
    required.forEach((prop) => {
        if ( !options.hasOwnProperty(prop) ) throw 'Post must have a ' + prop + ' property';
    });

    // Extend this by the options
    extend(true, this, defaults, options);

    // Calculate a display date
    this.displayDate = moment(this.date).format('MMMM DD, YYYY');

    // Calculate a pub date for RSS
    this.pubDate = moment(this.date).format('ddd, DD MMM YYYY HH:mm:ss [GMT]');

    // Handle environment differences
    switch ( process.env.TRAVIS_BRANCH ) {
    case 'master':
        this.url.protocol = 'https';
        this.url.host = 'makers.airware.com';
        break;
    case 'develop':
        this.url.protocol = 'https';
        this.url.host = 'makers-staging.airware.com';
        break;        
    }            

    // Format Link
    this.link = url.format(extend({}, this.url, {
        pathname : [this.category, this.slug].join('/')
    }));

    // Derive a snippet from the first paragraph of the content
    this.snippet = this.content.match(/<p>(.*)<\/p>/)[1];

    // Join the authors collection
    this.author = this.authors.find((author) => {
        return author.slug == this.author;
    }, this);

    // Build a reviewers collection from authors
    this.reviewers = this.authors.filter((author) => {
        return ( this.reviewers.indexOf(author.slug) >= 0 );
    }, this);


    // Transform tags into objects
    this.tags = this.tags.map((tag) => {
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