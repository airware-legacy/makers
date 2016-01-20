'use strict';

const argv = require('yargs').argv,
    extend = require('jquery-extend'),
    moment = require('moment'),
    path   = require('path'),
    url    = require('url');


module.exports = class Post {
    constructor (options) {
        const required = [
            'path',
            'title',
            'author',
            'authors',
            'reviewers',
            'category',
            'date',
            'content',
            'thumb',
            'poster',
            'tags'
        ];

        const defaults = {
            url : {
                protocol : 'http',
                hostname : 'localhost',
                port     : argv.p || 3000
            }
        };

        // Validate options
        required.forEach(prop => {
            if (!options.hasOwnProperty(prop)) throw `Post must have a ${prop} property`;
        });

        // Extend this by the options
        extend(true, this, defaults, options);

        // Make a slug
        this.slug = path.parse(this.path).name;

        // Calculate a display date
        this.displayDate = moment(this.date).format('MMMM DD, YYYY');

        // Calculate a pub date for RSS
        this.pubDate = moment(this.date).format('ddd, DD MMM YYYY HH:mm:ss [GMT]');

        // Handle environment differences
        switch (process.env.TRAVIS_BRANCH) {
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
            pathname : path.join(this.category, this.slug)
        }));

        // Derive a snippet from the first paragraph of the content
        this.snippet = this.content.match(/<p>(.*)<\/p>/)[1];

        // Join the authors collection
        this.author = this.authors.find(author => {
            return author.slug == this.author;
        }, this);

        // Build a reviewers collection from authors
        this.reviewers = this.authors.filter(author => {
            return (this.reviewers.indexOf(author.slug) >= 0);
        }, this);

        // Create a path for gulp
        this.path = this.path
            .replace(this.slug, `${this.category}/${this.slug}`)
            .replace('.html', '/index.html'); // Convert to an index file

        // Transform tags into objects
        this.tags = this.tags.map(tag => {
            return {
                name : tag,
                slug : tag.toLowerCase()
                        .replace(' ', '-') // Dash delimit
                        .replace(/[^a-zA-Z0-9-_]/g, '') // Strip invalid chars
            };
        });
    }
};
