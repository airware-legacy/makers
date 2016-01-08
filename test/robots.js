var fs   = require('fs'),
    zlib = require('zlib');


describe('The robots.txt file...', () => {

    var handle = 'build/robots.txt';
    var buf = null;
    var str = '';

    it('Should exist', (done) => {
        fs.readFile(handle, (err, data) => {
            if (err) throw err;
            buf = data;
            done();
        });
    });

    it('Should be gzipped', (done) => {
        zlib.gunzip(buf, (err, data) => {
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