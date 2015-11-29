var concat = require('gulp-concat'),
	del  = require('del'),
	eslint = require('gulp-eslint'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	hb = require('handlebars'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	minifyJS = require('gulp-uglify'),
    mocha = require('gulp-mocha')
    regPartials = require('./lib/gulp-hb-partials.js');


// Clean the build dir
gulp.task('clean', function() {
	return del('build/**');
});


// Run tests and product coverage
gulp.task('test', function () {
    return gulp.src(['test/*.js'])
        .pipe(mocha());
});


// Lint as JS files (including this one)
gulp.task('lint', function () {
    return gulp.src([
            '**/*.js',
            '!node_modules/**'
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


// Minify and combine all CSS
gulp.task('styles', ['clean'], function() {
    return gulp.src([
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'src/less/custom.less'
        ])
    	.pipe(gulpif(/[.]less$/, less()))
        .pipe(minifyCSS())
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest('build/css'));
});


// Minify and combine all JavaScript
gulp.task('scripts', ['clean'], function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'src/js/custom.js'
        ])
        .pipe(concat('all.min.js'))
        .pipe(minifyJS({preserveComments:'some'}))
        .pipe(gulp.dest('build/js'));
});


// Copy static files to build dir
gulp.task('static', ['clean'], function() {
	return gulp.src('src/static/**')
		.pipe(gulp.dest('build'))
});


// Register HBpartials
gulp.task('partials', function() {
	return gulp.src('src/views/partials/**.html')
		.pipe(regPartials(hb));
});


// Build macro
gulp.task('build', [
	'clean',
	'static',
	'styles',
	'scripts',
	'partials'
]);