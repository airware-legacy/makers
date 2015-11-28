var del  = require('del'),
	eslint = require('gulp-eslint'),
	gulp = require('gulp'),
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