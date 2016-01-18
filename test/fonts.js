'use strict';

const fs = require('fs');


describe('The build/fonts directory...', () => {

    let files = [];

    before(done => {
        fs.readdir('build/fonts/', (err, arr) => {
            if (err) throw err;
            files = arr;
            done();
        });
    });

    it('Should include Colfax Medium files', () => {
        files.should.containEql('Colfax-Medium.eot');
        files.should.containEql('Colfax-Medium.otf');
        files.should.containEql('Colfax-Medium.svg');
        files.should.containEql('Colfax-Medium.ttf');
        files.should.containEql('Colfax-Medium.woff');
    });

    it('Should include Colfax Regular files', () => {
        files.should.containEql('Colfax-Regular.eot');
        files.should.containEql('Colfax-Regular.otf');
        files.should.containEql('Colfax-Regular.svg');
        files.should.containEql('Colfax-Regular.ttf');
        files.should.containEql('Colfax-Regular.woff');
    });

    it('Should include Colfax Regular Italic files', () => {
        files.should.containEql('Colfax-RegularItalic.eot');
        files.should.containEql('Colfax-RegularItalic.otf');
        files.should.containEql('Colfax-RegularItalic.svg');
        files.should.containEql('Colfax-RegularItalic.ttf');
        files.should.containEql('Colfax-RegularItalic.woff');
    });

});
