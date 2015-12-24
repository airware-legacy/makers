var fs     = require('fs'),
    should = require('should'),
    zlib   = require('zlib');


describe('The dynamically concatenated and minified CSS...', function() {

    var handle = 'build/all.min.css';
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

    it('Should contain Bootstrap styles', function() {
        str.should.containEql('Bootstrap');
    });

    it('Should contain Custom styles', function() {
        str.should.containEql('Custom LESS styles');
    });

    it('Should contain Custom fonts', function() {
        str.should.containEql('Custom Fonts');
    });

});