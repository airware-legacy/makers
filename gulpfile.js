var del  = require('del');


// Clean the build dir
gulp.task('clean', function() {
	return del('build/**');
});