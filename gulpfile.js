var gulp = require('gulp')
browserSync = require('browser-sync').create(),
clean = require('gulp-clean');


var paths = {
	webroot: './dist/',
	node_module: './node_modules/'
};

paths.angular = paths.node_module + 'angular/angular.js';
paths.angularRoute = paths.node_module + 'angular-route/angular-route.js';
paths.angularCookies = paths.node_module + 'angular-cookies/angular-cookies.js';
paths.angularAnimate = paths.node_module + 'angular-animate/angular-animate.js';
paths.bootstrapCSS = paths.node_module + 'bootstrap/dist/css/bootstrap.css';
paths.bootstrapJS = paths.node_module + 'bootstrap/dist/js/bootstrap.js';
paths.bootstrapFonts = paths.node_module + 'bootstrap/dist/fonts/*';

paths.templatesDest = paths.webroot + 'templates';
paths.jsDest = paths.webroot + 'js';
paths.cssDest = paths.webroot + 'css';
paths.fontDest = paths.cssDest + '/fonts';
paths.imagDest = paths.webroot + 'images';

gulp.task('server', function () {
	browserSync.init({
		server: {
			baseDir: paths.webroot
		},
		port: 2109,
		ui: {
			port: 2100
		}
	});
});

gulp.task('clean', function () {
	return gulp.src(paths.webroot + '*')
	.pipe(clean({ force: true }));
});

