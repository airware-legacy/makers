'use strict';

var argv         = require('yargs').argv,
    Author       = require('./lib/Author'),
    del          = require('del'),
    express      = require('express'),
    extend       = require('jquery-extend'),
    fs           = require('fs'),
    g            = require('gulp-load-plugins')(),
    gulp         = require('gulp'),
    hb           = require('handlebars'),
    highlight    = require('highlight.js'),
    layouts      = require('handlebars-layouts'),
    moment       = require('moment'),
    Page         = require('./lib/Page'),
    path         = require('path'),
    Post         = require('./lib/Post'),
    reviewerList = require('./lib/hb-helper-reviewerlist');


// Config HB
layouts.register(hb);
hb.registerHelper('reviewerList', reviewerList);


// Shared data object for passing between tasks
var data;


/* *
 * Build Step 0
 */

// Clean data and build dirs
gulp.task('clean', (done) => {
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
gulp.task('static', ['clean'], () => {
    return gulp.src('src/static/**')
        .pipe(g.if(/robots\.txt/, g.tap((file) => {
            if ( process.env.TRAVIS_BRANCH == 'master' )
                file.contents = new Buffer('');
        })))
        .pipe(g.gzip({ append: false }))
        .pipe(gulp.dest('build'));
});


// Minify and combine all CSS
gulp.task('styles', ['clean'], () => {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/highlight.js/styles/default.css',
        'src/less/custom.less'
    ])
    .pipe(g.if(/[.]less$/, g.less()))
    .pipe(g.concat('all.min.css'))
    .pipe(g.cssnano())
    .pipe(g.gzip({ append: false }))
    .pipe(gulp.dest('build'));
});


// Minify and combine all JavaScript
gulp.task('scripts', ['clean'], () => {
    return gulp.src('src/js/*.js')
        .pipe(g.babel({
            presets  : ['es2015'],
            comments : true
        }))
        .pipe(g.addSrc.prepend([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/velocity-animate/velocity.js',
            'node_modules/velocity-animate/velocity.ui.js',
            'node_modules/hammerjs/hammer.js',
            'node_modules/jquery-hammerjs/jquery.hammer.js',
            'node_modules/bootstrap/dist/js/bootstrap.js'
        ]))
        .pipe(g.concat('all.min.js'))
        .pipe(g.uglify({ preserveComments: 'some' }))
        .pipe(g.gzip({ append: false }))
        .pipe(gulp.dest('build'));
});


// Register HB partials
gulp.task('partials', ['clean'], () => {
    return gulp.src('src/partials/*.html')
        .pipe(g.tap((file) => {
            var name = path.parse(file.path).name;
            var html = file.contents.toString();
            hb.registerPartial(name, html);
        }));
});


// Load authors
gulp.task('authors', ['clean'], () => {
    return gulp.src('src/authors/*.md')
        .pipe(g.frontMatter())
        .pipe(g.marked())
        .pipe(g.tap((file) => {
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
gulp.task('posts', ['static', 'styles', 'scripts', 'partials', 'authors'], (done) => {
    fs.readFile('src/partials/post.html', 'utf-8', (err, str) => {
        if (err) throw err;
        var template = hb.compile(str);

        gulp.src('src/posts/*.md')
            .pipe(g.frontMatter())
            .pipe(g.marked({
                highlight: (code) => {
                    return highlight.highlightAuto(code).value;
                }
            }))
            .pipe(g.tap((file) => {
                var post = new Post(extend(true, {}, file.frontMatter, {
                    path       : file.path,
                    content    : file.contents.toString(),
                    authors    : data.authors,
                    pageTitle  : data.pageTitle,
                    year       : data.year,
                    timestamp  : data.timestamp
                }));

                // Populate the posts object for reuse
                data.posts.push(post);

                // Alter the path, write the rendered template, and put back in stream
                file.path = post.path;
                file.contents = new Buffer(template(post));
            }))
            .pipe(g.htmlmin())
            .pipe(g.gzip({ append: false }))
            .pipe(gulp.dest('build'))
            .on('end', () => {
                // Sort posts by date descending
                data.posts.sort((a, b) => {
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
gulp.task('pages', ['posts'], (done) => {
    fs.readFile('src/partials/rss.xml', 'utf-8', (err, rssStr) => {
        if (err) throw err;
        var rssTemplate = hb.compile(rssStr);

        gulp.src('src/pages/**/*.html')
            .pipe(g.frontMatter())
            .pipe(g.tap((file) => {
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
            .pipe(g.htmlmin())
            .pipe(g.gzip({ append: false }))
            .pipe(gulp.dest('build'))
            .pipe(g.filter((file) => {
                return file.data.rss;
            }))
            .pipe(g.tap((file) => {
                file.path = file.data.rssPath;
                file.contents = new Buffer(rssTemplate(file.data));
            }))
            .pipe(g.gzip({ append: false }))
            .pipe(gulp.dest('build'))
            .on('end', done);
    });
});


/* *
 * Build Step 4
 */

// Run tests and product coverage
gulp.task('test', ['pages'], () => {
    return gulp.src('test/*.js')
        .pipe(g.mocha({
            require : ['should']
        }));
});


/* *
 * Build Step 5
 */

// Lint as JS files (including this one)
gulp.task('lint', ['test'], () => {
    return gulp.src([
        'gulpfile.js',
        'src/js/*.js',
        'test/*.js',
        'lib/*.js',
        '!node_modules/**'
    ])
    .pipe(g.eslint())
    .pipe(g.eslint.format());
});


/* * 
 * Helper Tasks
 */

// Serve files for local development
gulp.task('serve', (done) => {
    var port = argv.p || 3000;

    express()
        // Set compression header for all requests
        .use((req, res, next) => {
            res.header('Content-Encoding', 'gzip');
            next();
        })
        // Static middleware
        .use(express.static('build'))
        // Serve error page
        .use((req, res) => {
            res.status(404)
                .sendFile(__dirname + '/build/error.html');
        })
        .listen(port, () => {
            g.util.log('Server listening on port', port);
            done();
        });
});


// Check deps with David service
gulp.task('deps', () => {
    return gulp.src('package.json')
        .pipe(g.david({ update: true }))
        .pipe(g.david.reporter)
        .pipe(gulp.dest('.'));
});


// Watch certain files
gulp.task('watch', ['build'], () => {
    return gulp.watch([
        'src/**/*',
        'test/*',
        'lib/**'
    ], ['build']);
});


// Build Macro
gulp.task('build', [
    // Step 0: 'clean'
    // Step 1: 'static', 'styles', 'scripts', 'partials', 'authors'
    // Step 2: 'posts'
    // Step 3: 'pages'
    // Step 4: 'test',
    'lint'
]);


// What to do when you run `$ gulp`
gulp.task('default', [
    'watch',
    'serve',
    'deps'
]);