var concat = require('gulp-concat'),
    eslint = require('gulp-eslint'),
    express = require('express'),
    extend = require('jquery-extend'),
    frontMatter = require('gulp-front-matter'),
    fs = require('fs'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gzip = require('gulp-gzip'),
    hb = require('handlebars'),
    less = require('gulp-less'),
    marked = require('gulp-marked'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    minifyJS = require('gulp-uglify'),
    mocha = require('gulp-mocha'),
    moment = require('moment'),
    rename = require('gulp-rename'),
    tap = require('gulp-tap'),
    zlib = require('zlib');


// HB data
var data = {
    authors : {}, // Populated from MArkdown by 'authors' task
    pageTitle : 'Airware Makers',
    year : moment().format('YYYY'),
    timestamp : moment().format('YYYY-MM-DD-HH-mm-ss')
};


// Run tests and product coverage
gulp.task('test', ['build'], function () {
    return gulp.src(['test/*.js'])
        .pipe(mocha());
});


// Lint as JS files (including this one)
gulp.task('lint', ['test'], function () {
    return gulp.src([
        'src/js/*.js',
        'gulpfile.js',
        'test/*.js',
        '!node_modules/**'
    ])
    .pipe(eslint({
        rules : {
            'no-mixed-spaces-and-tabs' : 2,
            'space-after-keywords' : 2,
            'semi' : 2,
            'camelcase' : 1,
            'curly' : 2,
            'no-unused-vars' : 0,
            'comma-dangle' : 2,
            'quotes' : 0,
            'indent': 2
        }
    }))
    .pipe(eslint.format());
});


// Minify and combine all CSS
gulp.task('styles', function() {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'src/less/*.less'
    ])
    .pipe(gulpif(/[.]less$/, less()))
    .pipe(concat('all.min.css'))
    .pipe(minifyCSS())
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('build'));
});


// Minify and combine all JavaScript
gulp.task('scripts', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'src/js/*.js'
    ])
    .pipe(concat('all.min.js'))
    .pipe(minifyJS({ preserveComments: 'some' }))
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('build'));
});


// Copy static files to build dir
gulp.task('static', function() {
    return gulp.src('src/static/**')
        .pipe(gzip({ append: false }))
        .pipe(gulp.dest('build'));
});


// Register HB partials
gulp.task('partials', function() {
    return gulp.src('src/views/partials/*.html')
        .pipe(rename({ extname: '' }))
        .pipe(tap(function(file) {
            hb.registerPartial(file.relative, file.contents.toString());
        }));
});


// Load authors
gulp.task('authors', function() {
    return gulp.src('src/markdown/authors/*.md')
        .pipe(frontMatter({ property: 'data' }))
        .pipe(marked())
        .pipe(rename({ extname : '' }))
        .pipe(tap(function(file) {
            data.authors[file.relative] = extend(file.data, {
                bio : file.contents.toString()
            });
        }));
});


// Generate posts
gulp.task('posts', ['partials', 'authors'], function() {
    var template = hb.compile(fs.readFileSync('./src/views/layouts/base.html', 'utf-8'));

    return gulp.src('src/markdown/posts/**/*.md')
        .pipe(frontMatter({ property: 'data' }))
        .pipe(marked())
        .pipe(tap(function(file) { console.log(file.data);
            file.contents = new Buffer(template(extend(true, {}, data, {
                view : 'post',
                pageTitle : file.data.title + ' | ' + data.pageTitle,
                title : file.data.title,
                author : data.authors[file.data.author],
                post : file.contents.toString()
            })), 'utf-8');
        }))
        .pipe(rename({
            suffix: '/index',
            extname: '.html'
        }))
        .pipe(minifyHTML())
        .pipe(gzip({ append: false }))
        .pipe(gulp.dest('build'));
});


// Serve files for local development
gulp.task('serve', function(callback) {
    express()
        .use(function(req, res, next) {
            res.header('Content-Encoding', 'gzip');
            next();
        })
        .use(express.static('build'))
        .use(function(req, res) {
            res.status(404)
                .sendFile(__dirname + '/build/error.html');
        })
        .listen(3000, callback);
});


// Build macro
gulp.task('build', [
    'static',
    'styles',
    'scripts',
    'partials',
    'authors',
    'posts'
]);


// Watch certain files
gulp.task('watch', ['serve', 'lint'], function() {
    gulp.watch(['src/**', 'test/**'], ['lint']);
});


// What to do when you run `$ gulp`
gulp.task('default', ['watch']);