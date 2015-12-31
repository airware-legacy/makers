var argv   = require('yargs'),
    fs     = require('fs'),
    jsdom  = require('jsdom').jsdom,
    moment = require('moment'),
    zlib   = require('zlib');


// Helper to instantiate JSDom
function loadDocument(data) {
    var port = argv.p || 3000;
    return jsdom(data.toString(), {
        url : 'http://localhost:' + port + '/'
    }).defaultView.document;
}


describe('The dynamically generated home page...', function() {

    var handle = 'build/index.html';
    var buf, document;

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
            document = loadDocument(data);
            done();
        });
    });

    it('Should contain a <title> element from the header partial', function() {
        document.getElementsByTagName('title')[0].innerHTML
            .should.equal('Blog | Airware Makers');
    });

    it('Should contain just one <h1> element', function() {
        document.getElementsByTagName('h1').length
            .should.equal(1);
    });

    it('Should contain copyright text from the footer partial', function() {
        var year = moment().format('YYYY');
        document.getElementsByClassName('copy-right-text')[0].innerHTML
            .should.containEql('© Copyright ' + year + ', Airware. All Rights Reserved.');
    });

});


describe('The dynamically generated engineering page...', function() {

    var handle = 'build/engineering/index.html';
    var buf, document;

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
            document = loadDocument(data);
            done();
        });
    });

    it('Should contain a <title> element from the header partial', function() {
        document.getElementsByTagName('title')[0].innerHTML
            .should.equal('Engineering | Airware Makers');
    });

    it('Should contain just one <h1> element', function() {
        document.getElementsByTagName('h1').length
            .should.equal(1);
    });

    it('Should contain copyright text from the footer partial', function() {
        var year = moment().format('YYYY');
        document.getElementsByClassName('copy-right-text')[0].innerHTML
            .should.containEql('© Copyright ' + year + ', Airware. All Rights Reserved.');
    });

});


describe('The dynamically generated design page...', function() {

    var handle = 'build/design/index.html';
    var buf, document;

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
            document = loadDocument(data);
            done();
        });
    });

    it('Should contain a <title> element from the header partial', function() {
        document.getElementsByTagName('title')[0].innerHTML
            .should.equal('Design | Airware Makers');
    });

    it('Should contain just one <h1> element', function() {
        document.getElementsByTagName('h1').length
            .should.equal(1);
    });

    it('Should contain copyright text from the footer partial', function() {
        var year = moment().format('YYYY');
        document.getElementsByClassName('copy-right-text')[0].innerHTML
            .should.containEql('© Copyright ' + year + ', Airware. All Rights Reserved.');
    });

});