'use strict';

const fs = require('fs');


describe('The robots.txt file...', () => {

    let str;

    it('Should exist', done => {
        fs.readFile('build/robots.txt', (err, data) => {
            if (err) throw err;
            str = data.toString();
            done();
        });
    });

    it('Should contain the correct dynamic content', () => {
        if ( process.env.TRAVIS_BRANCH == 'master' )
            str.should.equal('');
        else
            str.should.equal('User-agent: *\nDisallow: /');
    });

});
