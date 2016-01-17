'use strict';

var fs   = require('fs'),
    zlib = require('zlib');


describe('The dynamically concatenated and minified CSS...', () => {

    var handle = 'build/all.min.css';
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

    it('Should contain Bootstrap styles', () => {
        str.should.containEql('Bootstrap');
    });

    it('Should contain Custom styles', () => {
        str.should.containEql('Custom LESS styles');
    });

    it('Should contain Custom fonts', () => {
        str.should.containEql('Custom Fonts');
    });

});