var concat = require('gulp-concat'),
	del  = require('del'),
	eslint = require('gulp-eslint'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
    mocha = require('gulp-mocha');


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
    	.pipe(gulpif(function(file) {
    			return /(.*).less/.test(file.path);
    		}, less()))
        .pipe(minifyCSS())
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest('build/css'));
});