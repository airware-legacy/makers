var fs     = require('fs'),
    should = require('should'),
    zlib   = require('zlib');


describe('The dynamically concatenated and minified JS...', function() {

    var handle = 'build/all.min.js';
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

    it('Should contain jQuery', function() {
        str.should.containEql('jQuery JavaScript Library');
    });

    it('Should contain Bootstrap', function() {
        str.should.containEql('Bootstrap');
    });

    it('Should contain custom JavaScript', function() {
        var scripts = ['Custom Headline', 'Custom Mobile Menu', 'Custom Post', 'Custom Layout', 'Custom Lightbox'];

        scripts.forEach(function (script) {
            str.should.containEql(script);
        });
    });

    it('Should contain Google Analytics', function() {
        str.should.containEql('Google Analytics');
    });

});