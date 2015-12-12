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
    Page = require('./lib/Page'),
    Post = require('./lib/Post'),
    rename = require('gulp-rename'),
    tap = require('gulp-tap');


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
gulp.task('posts', ['static', 'styles', 'scripts', 'partials', 'authors'], function() {
    var template = hb.compile(fs.readFileSync('src/partials/post.html', 'utf-8'));

    return gulp.src('src/posts/*.md')
        .pipe(frontMatter())
        .pipe(marked({
            highlight: function(code) {
                return highlight.highlightAuto(code).value;
            }
        }))
        .pipe(tap(function(file) {

            var author = data.authors.find(function(author) {
                return author.slug == file.frontMatter.author;
            });

            var post = new Post(extend(true, {}, file.frontMatter, {
                slug      : parsePath(file.path).name,
                content   : file.contents.toString(),
                author    : author,
                pageTitle : data.pageTitle,
                year      : data.year,
                timestamp : data.timestamp
            }));

            // Populate the posts object
            data.posts.push(post);

            // Change file and put back into stream
            file.path = post.makePath(file.path);
            file.contents = new Buffer(template(post));
        }))
        .pipe(minifyHTML())
        .pipe(gzip({ append: false }))
        .pipe(gulp.dest('build'))
        .on('end', function() {
            data.posts.sort(function(a, b) {
                // Sort posts
                var timestampA = moment(a.date).format('X');
                var timestampB = moment(b.date).format('X');
                return timestampA < timestampB; // DESC
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
        .pipe(tap(function(file) {
            // Map data
            var page = new Page(extend(true, {}, file.frontMatter, {
                slug      : parsePath(file.path).name,
                content   : file.contents.toString(),
                posts     : data.posts,
                year      : data.year,
                timestamp : data.timestamp,
                pageTitle : data.pageTitle
            }));

            // Rewrite file for stream
            var template = hb.compile(page.content);
            file.contents = new Buffer(template(page));
        }))
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
        .listen(3000, done);
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