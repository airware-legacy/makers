'use strict';

const fs = require('fs');


describe('The assets copied from the src/static directory...', () => {
    it('Should include a favicon file', done => {
        fs.stat('build/favicon.ico', err => {
            if (err) throw err;
            done();
        });
    });

    it('Should include ALL images in /img', done => {
        function getBuiltImages (source) {
            fs.readdir('build/img', (err, built) => {
                if (err) throw err;
                built.should.eql(source);
                done();
            });
        }

        fs.readdir('src/static/img', (err, source) => {
            if (err) throw err;
            getBuiltImages(source);
        });
    });
});
