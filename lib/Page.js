var extend = require('jquery-extend');


var Page = function( options ) {

    var required = [
        'slug',
        'title',
        'content'
    ];

    var defaults = {
        categories : []
    };

    // Validate options
    required.forEach(function(prop) {
        if ( !options.hasOwnProperty(prop) ) throw 'Page must have a ' + prop + ' property';
    });

    // Extend this by the options
    extend(true, this, defaults, options);

    // Optionally promote a featured post
    if (this.featured) this.featured = this.posts.shift();

    // Filter posts by categorie(s)
    this.posts = this.posts.filter(function(post) {
        return this.categories.indexOf(post.category) >= 0;
    }, this);

    return this;

};


module.exports = Page;