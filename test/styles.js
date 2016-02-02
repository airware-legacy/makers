'use strict';

const fs = require('fs');


describe('The dynamically concatenated and minified CSS...', () => {
    let str;

    it('Should exist', done => {
        fs.readFile('build/css/all.min.css', (err, data) => {
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
