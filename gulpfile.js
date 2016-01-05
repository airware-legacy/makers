var argv         = require('yargs').argv,
    Author       = require('./lib/Author'),
    concat       = require('gulp-concat'),
    cssNano      = require('gulp-cssnano'),
    david        = require('gulp-david'),
    del          = require('del'),
    eslint       = require('gulp-eslint'),
    express      = require('express'),
    extend       = require('jquery-extend'),
    filter       = require('gulp-filter'),
    frontMatter  = require('gulp-front-matter'),
    fs           = require('fs'),
    gulp         = require('gulp'),
    gulpif       = require('gulp-if'),
    gutil        = require('gulp-util'),
    gzip         = require('gulp-gzip'),
    hb           = require('handlebars'),
    highlight    = require('highlight.js'),
    htmlMin      = require('gulp-htmlmin'),
    layouts      = require('handlebars-layouts'),
    less         = require('gulp-less'),
    marked       = require('gulp-marked'),
    mocha        = require('gulp-mocha'),
    moment       = require('moment'),
    Page         = require('./lib/Page'),
    path         = require('path'),
    Post         = require('./lib/Post'),
    reviewerList = require('./lib/hb-helper-reviewerlist'),
    tap          = require('gulp-tap'),
    uglify       = require('gulp-uglify');


// Config HB
layouts.register(hb);
hb.registerHelper('reviewerList', reviewerList);


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
        'src/less/custom.less'
    ])
    .pipe(gulpif(/[.]less$/, less()))
    .pipe(concat('all.min.css'))
    .pipe(cssNano())
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('build'));
});

// Minify and combine all JavaScript
gulp.task('scripts', ['clean'], function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/velocity-animate/velocity.js',
        'node_modules/velocity-animate/velocity.ui.js',
        'node_modules/hammerjs/hammer.js',
        'node_modules/jquery-hammerjs/jquery.hammer.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'src/js/*.js'
    ])
    .pipe(concat('all.min.js'))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('build'));
});


// Register HB partials
gulp.task('partials', ['clean'], function() {
    return gulp.src('src/partials/*.html')
        .pipe(tap(function(file) {
            var name = path.parse(file.path).name;
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
                slug    : path.parse(file.path).name,
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
            .pipe(tap(function(file) {
                var post = new Post(extend(true, {}, file.frontMatter, {
                    slug       : path.parse(file.path).name,
                    content    : file.contents.toString(),
                    authors    : data.authors,
                    pageTitle  : data.pageTitle,
                    year       : data.year,
                    timestamp  : data.timestamp
                }));

                // Populate the posts object for reuse
                data.posts.push(post);

                // Alter the path, write the rendered template, and put back in stream
                file.path = post.makePath(file.path);
                file.contents = new Buffer(template(post));
            }))
            .pipe(htmlMin())
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
gulp.task('pages', ['posts'], function(done) {
    fs.readFile('src/partials/rss.xml', 'utf-8', function(err, rssStr) {
        if (err) throw err;
        var rssTemplate = hb.compile(rssStr);

        gulp.src('src/pages/**/*.html')
            .pipe(frontMatter())
            .pipe(tap(function(file) {
                file.data = new Page(extend(true, {}, file.frontMatter, {
                    path      : file.path,
                    posts     : data.posts,
                    year      : data.year,
                    timestamp : data.timestamp,
                    pageTitle : data.pageTitle
                }));
                file.path = file.data.path;
                var template = hb.compile(file.contents.toString());
                file.contents = new Buffer(template(file.data));
            }))
            .pipe(htmlMin())
            .pipe(gzip({ append: false }))
            .pipe(gulp.dest('build'))
            .pipe(filter(function(file) {
                return file.data.rss;
            }))
            .pipe(tap(function(file) {
                file.path = file.data.rssPath;
                file.contents = new Buffer(rssTemplate(file.data));
            }))
            .pipe(gzip({ append: false }))
            .pipe(gulp.dest('build'))
            .on('end', done);
    });
});


/* *
 * Build Step 4
 */

// Run tests and product coverage
gulp.task('test', ['pages'], function () {
    return gulp.src('test/*.js')
        .pipe(mocha({
            require : ['should']
        }));
});


/* *
 * Build Step 5
 */

// Lint as JS files (including this one)
gulp.task('lint', ['test'], function () {
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


// Check deps with David service
gulp.task('deps', function() {
    return gulp.src('package.json')
        .pipe(david({ update: true }))
        .pipe(david.reporter)
        .pipe(gulp.dest('.'));
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
    // 'test',
    'lint'
]);


// What to do when you run `$ gulp`
gulp.task('default', [
    'watch',
    'serve',
    'deps'
]);