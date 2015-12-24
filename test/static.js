var assert = require('assert'),
    fs     = require('fs');


describe('The assets copied from the src/static directory...', function() {

    it('Should include a favicon file', function(done) {
        fs.stat('build/favicon.ico', function(err, stats) {
            if (err) throw err;
            done();
        });
    });

    it('Should include ALL images in /img', function(done) {
        fs.readdir('build/img', function(err, built) {
            if (err) throw err;
            fs.readdir('src/static/img', function(err, source) {
                if (err) throw err;
                assert.deepEqual(built, source);
                done();
            });
        });
    });

});