'use strict';

const argv = require('yargs').argv,
    extend = require('jquery-extend'),
    path   = require('path'),
    url    = require('url'),
    trianglify = require('trianglify');


module.exports = class Author {
    constructor (options) {
        const required = [
            'bio',
            'name',
            'title',
            'email'
        ];

        const defaults = {
            url : {
                protocol : 'http',
                hostname : 'localhost',
                port     : argv.p || 3000
            },
            posts: [],
            classes : [ 'author', 'generated-background' ]
        };

        // Validate options
        required.forEach(prop => {
            if (!options.hasOwnProperty(prop)) {
                throw `Author must have a ${prop} property`;
            }
        });

        // Extend this by the defaults and options
        extend(true, this, defaults, options);

        // Make a slug
        this.slug = path.parse(this.path).name;

        // Format Link
        this.link = url.format(extend({}, this.url, {
            pathname : `authors/${this.slug}`
        }));

        this.poster = trianglify({
          cell_size: 15,
          variance: 60,
          x_colors: 'random',
          width: 1800,
          height: 500,
          seed: this.name.toUpperCase()
        }).png();

        // Create a path for gulp
        this.path = this.path
            .replace(this.slug, `authors/${this.slug}`)
            .replace('.html', '/index.html'); // Convert to an index file
    }
};
