var gulp = require('gulp')
	uglify = require('gulp-uglify'),
	strip = require('gulp-strip-comments'),
	htmlmin = require('gulp-htmlmin'),
	removeHtmlComments = require('gulp-remove-html-comments'),
	stripCssComments = require('gulp-strip-css-comments'),
	cleanCSS = require('gulp-clean-css'),
	cssmin = require('gulp-cssmin'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload;


var paths = {
	webroot: './dist/',
	node_module: './node_modules/',
	source :'./src/'
};

paths.angular = paths.node_module + 'angular/angular.js';
paths.angularRoute = paths.node_module + 'angular-route/angular-route.js';
paths.angularCookies = paths.node_module + 'angular-cookies/angular-cookies.js';
paths.angularAnimate = paths.node_module + 'angular-animate/angular-animate.js';

paths.jquery = paths.node_module + 'jquery/dist/jquery.js';

paths.bootstrapCSS = paths.node_module + 'bootstrap/dist/css/bootstrap.css';
paths.bootstrapJS = paths.node_module + 'bootstrap/dist/js/bootstrap.js';
paths.bootstrapFonts = paths.node_module + 'bootstrap/dist/fonts/*';


paths.mainHtml = paths.source  +'index.html';

paths.manifest = paths.source + 'manifest.json';
paths.favicon = paths.source + 'images/favicon.ico';
paths.images = paths.source + "images/**/*";

paths.templatesDest = paths.webroot + 'templates';
paths.jsDest = paths.webroot + 'js';
paths.cssDest = paths.webroot + 'css';
paths.fontDest = paths.cssDest + '/fonts';
paths.imagDest = paths.webroot + 'images';


gulp.task('default',['copy:static', 'copy:images', 'minify:html', 'min:css', 'min:js', 'server']);

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

	gulp.watch(paths.mainHtml, ['minify:html']);
});

gulp.task('clean', function () {
	return gulp.src(paths.webroot + '*')
	.pipe(clean({ force: true }));
});

gulp.task('copy:static', function(){
	gulp.src([paths.favicon, paths.manifest])
	.pipe(gulp.dest(paths.webroot));
});

gulp.task('copy:images', function () {
    return gulp.src([paths.images])
	.pipe(gulp.dest(paths.imagDest));
});

gulp.task('minify:html', function() {
	return gulp.src(paths.mainHtml)
	.pipe(removeHtmlComments())
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(paths.webroot))
	.pipe(reload({stream: true}));
});

gulp.task('min:js', function() {
	return gulp.src([paths.jquery,
		paths.bootstrapJS,
		paths.angular,
		paths.angularRoute,
		paths.angularCookies,
		paths.angularAnimate ])
	.pipe(concat(paths.jsDest +'/app.min.js'))
	//.pipe(strip())
	//.pipe(uglify())
	.pipe(gulp.dest('.'))
	.pipe(reload({stream: true}));
});

gulp.task('min:css', function () {
    return gulp.src([paths.bootstrapCSS])
	.pipe(concat(paths.cssDest + '/app.min.css'))
	//.pipe(stripCssComments({ preserve: false }))
	//.pipe(cleanCSS({ compatibility: 'ie8' }))
	//.pipe(cssmin())
	.pipe(gulp.dest('.'));
});

