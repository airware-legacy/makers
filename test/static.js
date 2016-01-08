var fs = require('fs');


describe('The assets copied from the src/static directory...', () => {

    it('Should include a favicon file', (done) => {
        fs.stat('build/favicon.ico', (err) => {
            if (err) throw err;
            done();
        });
    });

    it('Should include ALL images in /img', (done) => {
        fs.readdir('build/img', (err, built) => {
            if (err) throw err;
            fs.readdir('src/static/img', (err, source) => {
                if (err) throw err;
                built.should.eql(source);
                done();
            });
        });
    });

});