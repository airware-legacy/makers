'use strict';

const argv = require('yargs').argv,
    extend = require('jquery-extend'),
    moment = require('moment'),
    path   = require('path'),
    url    = require('url');


module.exports = class Page {
    constructor (options) {
        const required = [
            'path',
            'title',
            'classes'
        ];

        const defaults = {
            categories : [],
            url        : {
                protocol : 'http',
                hostname : 'localhost',
                port     : argv.p || 3000
            }
        };

        // Validate options
        required.forEach(prop => {
            if (!options.hasOwnProperty(prop)) throw `Page must have a ${prop} property`;
        });

        // Extend this by the options
        extend(true, this, defaults, options);

        // Optionally promote a featured post
        // if (this.featured) this.featured = this.posts.shift();

        // Calculate the slug
        this.slug = path.parse(this.path).name;

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
        if (this.slug == 'index') {
            this.link = url.format(extend({}, defaults.url, {
                pathname : '/'
            }));
        } else if (this.slug == 'error') {
            this.link = url.format(extend({}, defaults.url, {
                pathname : 'error.html'
            }));
        } else {
            this.link = url.format(extend({}, defaults.url, {
                pathname : this.slug
            }));
            const filePath = path.parse(this.path);
            this.path = path.join(filePath.dir, filePath.name, `index${filePath.ext}`);
        }

        // Format optional RSS links
        if (this.rss) {
            this.rssPath = path.join('build', `${this.slug}.rss`);

            this.rssLink = url.format(extend({}, this.url, {
                pathname : `${this.slug}.rss`
            }));

            this.buildDate = moment().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
        }

        // Filter posts by categorie(s)
        this.posts = this.posts.filter(post => {
            return this.categories.indexOf(post.category) >= 0;
        }, this);
    }
};
