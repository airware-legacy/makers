var fs   = require('fs'),
    zlib = require('zlib');


describe('The robots.txt file...', function() {

    var handle = 'build/robots.txt';
    var buf = null;
    var str = '';

    it('Should exist', function(done) {
        fs.readFile(handle, function(err, data) {
            if (err) throw err;
            buf = data;
            done();
        });
    });

    it('Should be gzipped', function(done) {
        zlib.gunzip(buf, function(err, data) {
            if (err) throw err;
            str = data.toString();
            done();
        });
    });

    it('Should contain the correct dynamic content', function() {
        if ( process.env.TRAVIS_BRANCH == 'master' )
            str.should.equal('');
        else
            str.should.equal('User-agent: *\nDisallow: /');
    });

});