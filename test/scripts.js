'use strict';

const fs = require('fs');


describe('The dynamically concatenated and minified JS...', () => {
    let str;

    it('Should exist', done => {
        fs.readFile('build/all.min.js', (err, data) => {
            if (err) throw err;
            str = data.toString();
            done();
        });
    });

    it('Should contain jQuery', () => {
        str.should.containEql('jQuery JavaScript Library');
    });

    it('Should contain VelocityJS', () => {
        str.should.containEql('velocityQueueEntryFlag');
        str.should.containEql('Velocity UI Pack');
    });

    it('Should contain HammerJS', () => {
        str.should.containEql('Hammer.JS');
        str.should.containEql('data("hammer")');
    });


    it('Should contain Bootstrap', () => {
        str.should.containEql('Bootstrap');
    });

    it('Should contain custom JavaScript', () => {
        const scripts = [
            'Custom Headline',
            'Custom Mobile Menu',
            'Custom Post',
            'Custom Layout',
            'Custom Lightbox',
            'Custom Animations'
        ];

        scripts.forEach(script => {
            str.should.containEql(script);
        });
    });

    it('Should contain Google Analytics', () => {
        str.should.containEql('Google Analytics');
    });
});
