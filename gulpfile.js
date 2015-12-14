var Author = require('./lib/Author'),
    concat = require('gulp-concat'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    express = require('express'),
    extend = require('jquery-extend'),
    frontMatter = require('gulp-front-matter'),
    fs = require('fs'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    gzip = require('gulp-gzip'),
    hb = require('handlebars'),
    highlight = require('highlight.js'),
    indexify = require('./lib/gulp-indexify'),
    layouts = require('handlebars-layouts'),
    less = require('gulp-less'),
    marked = require('gulp-marked'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    minifyJS = require('gulp-uglify'),
    mocha = require('gulp-mocha'),
    moment = require('moment'),
    parsePath = require('parse-filepath'),
    processPages = require('./lib/gulp-process-pages'),
    processPosts = require('./lib/gulp-process-posts'),
    tap = require('gulp-tap'),
    argv = require('yargs').argv;


// Config HB
layouts.register(hb);


// Shared data object for passing between tasks
var data;


/* *
 * Build Step 0
 */

// Clean data and build dirs
gulp.task('clean', function(done) {
    data = {
        authors   : [], // Populated by 'authors' task
        posts     : [], // Populated by 'posts' task
        tags      : [], // Populated by 'posts' task
        pageTitle : 'Airware Makers',
        year      : moment().format('YYYY'),
        timestamp : moment().format('YYYY-MM-DD-HH-mm-ss')
    };

    del(['build/**', '!build'])
        .then(done());
});


/* *
 * Build Step 1
 */

// Copy static files to build dir
gulp.task('static', ['clean'], function() {
    return gulp.src('src/static/**')
        .pipe(gulpif(/robots\.txt/, tap(function(file) {
            // Clear robots.txt if we're building production
            if ( process.env.TRAVIS_BRANCH == 'master' ) file.contents = new Buffer('');
        })))
        .pipe(gzip({ append: false }))
        .pipe(gulp.dest('build'));
});


// Minify and combine all CSS
gulp.task('styles', ['clean'], function() {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/highlight.js/styles/default.css',
        'src/less/*.less'
    ])
    .pipe(gulpif(/[.]less$/, less()))
    .pipe(concat('all.min.css'))
    .pipe(minifyCSS())
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('build'));
});


// Minify and combine all JavaScript
gulp.task('scripts', ['clean'], function() {
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


// Register HB partials
gulp.task('partials', ['clean'], function() {
    return gulp.src('src/partials/*.html')
        .pipe(tap(function(file) {
            var name = parsePath(file.path).name;
            var html = file.contents.toString();
            hb.registerPartial(name, html);
        }));
});


// Load authors
gulp.task('authors', ['clean'], function() {
    return gulp.src('src/authors/*.md')
        .pipe(frontMatter())
        .pipe(marked())
        .pipe(tap(function(file) {
            var author = new Author(extend(true, {}, file.frontMatter, {
                slug    : parsePath(file.path).name,
                bio     : file.contents.toString()
            }));
            data.authors.push(author);
        }));
});


/* *
 * Build Step 2
 */

// Generate posts
gulp.task('posts', ['static', 'styles', 'scripts', 'partials', 'authors'], function(done) {
    fs.readFile('src/partials/post.html', 'utf-8', function(err, str) {
        if (err) throw err;
        var template = hb.compile(str);

        gulp.src('src/posts/*.md')
            .pipe(frontMatter())
            .pipe(marked({
                highlight: function(code) {
                    return highlight.highlightAuto(code).value;
                }
            }))
            .pipe(processPosts(data, template))
            .pipe(minifyHTML())
            .pipe(gzip({ append: false }))
            .pipe(gulp.dest('build'))
            .on('end', function() {
                // Sort posts by date descending
                data.posts.sort(function(a, b) {
                    return moment(a.date).format('X') < moment(b.date).format('X'); // DESC
                });
                done();
            });
    });

});

/* *
 * Build Step 3
 */

// Generate posts
gulp.task('pages', ['posts'], function() {
    return gulp.src('src/pages/**/*.html')
        .pipe(frontMatter())
        .pipe(processPages(data, hb))
        .pipe(indexify({
            exempt : [ 'error' ]
        }))
        .pipe(minifyHTML())
        .pipe(gzip({ append: false }))
        .pipe(gulp.dest('build'));
});


/* *
 * Build Step 4
 */

// Run tests and product coverage
gulp.task('test', ['pages'], function () {
    return gulp.src('test/*.js')
        .pipe(mocha());
});


// Lint as JS files (including this one)
gulp.task('lint', ['pages'], function () {
    return gulp.src([
        'gulpfile.js',
        'src/js/*.js',
        'test/*.js',
        'lib/**/*.js',
        '!node_modules/**'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
});


/* * 
 * Helper Tasks
 */

// Serve files for local development
gulp.task('serve', function(done) {
    var port = argv.p || 3000;

    express()
        // Set compression header for all requests
        .use(function(req, res, next) {
            res.header('Content-Encoding', 'gzip');
            next();
        })
        // Static middleware
        .use(express.static('build'))
        // Serve error page
        .use(function(req, res) {
            res.status(404)
                .sendFile(__dirname + '/build/error.html');
        })
        .listen(port, function() {
            gutil.log('Server listening on port', port);
            done();
        });
});


// Watch certain files
gulp.task('watch', ['build'], function() {
    return gulp.watch([
        'src/**/*',
        'test/*',
        'lib/**'
    ], ['build']);
});


// Build Macro
gulp.task('build', [
    // 'clean'
    // 'static', 'styles', 'scripts', 'partials', 'authors'
    // 'posts'
    // 'pages'
    'test', 'lint'
]);


// What to do when you run `$ gulp`
gulp.task('default', ['watch', 'serve']);