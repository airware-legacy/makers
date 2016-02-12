'use strict';

const argv = require('yargs').argv,
    fs     = require('fs'),
    jsdom  = require('jsdom').jsdom,
    moment = require('moment');


// Helper to instantiate JSDom
function loadDocument (data) {
    const port = argv.p || 3000;
    return jsdom(data.toString(), {
        url : `http://localhost:${port}/`
    }).defaultView.document;
}


// Set var for the tests
const year = moment().format('YYYY');
const copy = `© Copyright ${year}, <a class="external" href="https://www.airware.com/">Airware</a>. All Rights Reserved.`;


describe('The dynamically generated home page...', () => {
    let document;

    it('Should exist', done => {
        fs.readFile('build/index.html', (err, data) => {
            if (err) throw err;
            document = loadDocument(data);
            done();
        });
    });

    it('Should contain a <title> element from the header partial', () => {
        document.getElementsByTagName('title')[0].innerHTML
            .should.equal('Blog | Airware Makers');
    });

    it('Should contain just one <h1> element', () => {
        document.getElementsByTagName('h1').length.should.equal(1);
    });

    it('Should contain copyright text from the footer partial', () => {
        document.getElementsByClassName('copyright')[0].innerHTML
            .should.containEql(copy);
    });
});


describe('The dynamically generated engineering page...', () => {
    let document;

    it('Should exist', done => {
        fs.readFile('build/engineering/index.html', (err, data) => {
            if (err) throw err;
            document = loadDocument(data);
            done();
        });
    });

    it('Should contain a <title> element from the header partial', () => {
        document.getElementsByTagName('title')[0].innerHTML
            .should.equal('Engineering | Airware Makers');
    });

    it('Should contain just one <h1> element', () => {
        document.getElementsByTagName('h1').length.should.equal(1);
    });

    it('Should contain copyright text from the footer partial', () => {
        document.getElementsByClassName('copyright')[0].innerHTML
            .should.containEql(copy);
    });
});


describe('The dynamically generated design page...', () => {
    let document;

    it('Should exist', done => {
        fs.readFile('build/design/index.html', (err, data) => {
            if (err) throw err;
            document = loadDocument(data);
            done();
        });
    });

    it('Should contain a <title> element from the header partial', () => {
        document.getElementsByTagName('title')[0].innerHTML
            .should.equal('Design | Airware Makers');
    });

    it('Should contain just one <h1> element', () => {
        document.getElementsByTagName('h1').length.should.equal(1);
    });

    it('Should contain copyright text from the footer partial', () => {
        document.getElementsByClassName('copyright')[0].innerHTML
            .should.containEql(copy);
    });
});
