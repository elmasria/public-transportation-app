var gulp = require('gulp')
	uglify = require('gulp-uglify'),
	merge = require('merge-stream');
	strip = require('gulp-strip-comments'),
	htmlmin = require('gulp-htmlmin'),
	removeHtmlComments = require('gulp-remove-html-comments'),
	sass = require('gulp-sass');
	stripCssComments = require('gulp-strip-css-comments'),
	cleanCSS = require('gulp-clean-css'),
	cssmin = require('gulp-cssmin'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	development = true;

var paths = {
	node_module: './node_modules/',
	source :'./src/'
};

if (development) {

	paths.webroot= './public-transportation-app/dist/';
}else{

	paths.webroot= './dist/';
}

paths.templatesDest = paths.webroot + 'templates';
paths.jsDest = paths.webroot + 'js';
paths.cssDest = paths.webroot + 'css';
paths.fontDest = paths.webroot + '/fonts';
paths.imagDest = paths.webroot + 'images';

/// Vendors

// Angular
paths.angular = paths.node_module + 'angular/angular.js';
paths.angularRoute = paths.node_module + 'angular-route/angular-route.js';
paths.angularCookies = paths.node_module + 'angular-cookies/angular-cookies.js';
paths.angularAnimate = paths.node_module + 'angular-animate/angular-animate.js';

// JQuery
paths.jquery = paths.node_module + 'jquery/dist/jquery.js';

// Bootstrap
paths.bootstrapCSS = paths.node_module + 'bootstrap/dist/css/bootstrap.css';
paths.bootstrapJS = paths.node_module + 'bootstrap/dist/js/bootstrap.js';
paths.bootstrapFonts = paths.node_module + 'bootstrap/dist/fonts/**/*';

// Indec DB
paths.indexDB = paths.source + 'vendors/indexeddb-promised/idb.js';


/// Project

// JS
paths.sw = paths.source + 'js/sw.js';
paths.app = paths.source + 'js/app.js';
paths.appConfig = paths.source + 'js/app.config.js';
paths.appRoutes = paths.source + 'js/app.routes.js';

// Controllers
paths.angularMainCtrl = paths.source + 'js/controllers/main.js';

// Services
paths.angularConstants = paths.source + 'js/services/constants.js';
paths.angularToastService = paths.source + 'js/services/toast.js';
paths.angularHTTPService = paths.source + 'js/services/http-service.js';
paths.angularIndexDbService = paths.source + 'js/services/indexeddb-service.js';

// Directives
paths.angularModalDirective = paths.source + 'js/directives/modal-directive.js';
paths.angularTripScheduleDirective = paths.source + 'js/directives/trip-schedule.js';


// HTML
paths.mainHtml = paths.source  +'index.html';
paths.generateNewTripModalHtml = paths.source  +'templates/generate-trip-modal.html';
paths.TripScheduleHtml = paths.source  +'templates/trip-schedule.html';


// SCSS
paths.mainSCSS = paths.source  +'scss/main.scss';
paths.toastSCSS = paths.source  +'scss/toast.scss';
paths.navSCSS = paths.source  +'scss/nav.scss';
paths.modalDirectiveSCSS = paths.source  +'scss/modal-directive.scss';

// Static
paths.manifest = paths.source + 'manifest.json';
paths.favicon = paths.source + 'images/favicon.ico';
paths.images = paths.source + 'images/**/*';
paths.scss = paths.source + 'scss/**/*.scss';
paths.stations = paths.source + 'data/stations.json'


gulp.task('default',['copy:static', 'copy:images', 'minify:html','minify:html-templates', 'min:css', 'min:js', 'watch', 'server']);

gulp.task('server', function () {
	browserSync.init({
		server: {
			baseDir: './'
		},
		port: 2109,
		ui: {
			port: 2100
		}
	});
});

gulp.task('watch', function () {
	gulp.watch(paths.mainHtml, ['minify:html']);

	gulp.watch([
		paths.angularToastService,
		paths.angularModalDirective,
		paths.angularHTTPService,
		paths.angularIndexDbService,
		paths.angularTripScheduleDirective], ['min:js']);

	gulp.watch(paths.angularMainCtrl, ['min:js']);

	gulp.watch([
		paths.generateNewTripModalHtml,
		paths.TripScheduleHtml], ['minify:html-templates']);
	gulp.watch(paths.toastSCSS, ['min:css']);
	gulp.watch([
		paths.navSCSS,
		paths.modalDirectiveSCSS,
		paths.mainSCSS], ['min:css']);
	gulp.watch([paths.sw], ['copy:static']);
});

gulp.task('clean', function () {
	return gulp.src(paths.webroot + '*')
	.pipe(clean({ force: true }));
});

gulp.task('copy:static', function(){
	gulp.src([paths.favicon, paths.manifest])
	.pipe(gulp.dest(paths.webroot));

	gulp.src([paths.bootstrapFonts])
	.pipe(gulp.dest(paths.fontDest));


	gulp.src([paths.stations])
	.pipe(gulp.dest(paths.webroot + 'data'));


	gulp.src([paths.sw])
	.pipe(gulp.dest(paths.webroot))
	.pipe(reload({stream: true}));
});

gulp.task('copy:images', function () {
	return gulp.src([paths.images])
	.pipe(gulp.dest(paths.imagDest));
});

gulp.task('minify:html', function() {
	return gulp.src([paths.mainHtml])
	.pipe(removeHtmlComments())
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(paths.webroot))
	.pipe(reload({stream: true}));
});

gulp.task('minify:html-templates', function() {
	return gulp.src([
		paths.generateNewTripModalHtml,
		paths.TripScheduleHtml])
	.pipe(removeHtmlComments())
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(paths.templatesDest))
	.pipe(reload({stream: true}));
});

gulp.task('min:js', function() {
	return gulp.src([paths.jquery,
		paths.indexDB,
		paths.bootstrapJS,
		paths.angular,
		paths.angularRoute,
		paths.angularCookies,
		paths.angularAnimate,
		paths.app,
		paths.appConfig,
		paths.appRoutes,
		paths.angularConstants,
		paths.angularMainCtrl,
		paths.angularToastService,
		paths.angularHTTPService,
		paths.angularIndexDbService,
		paths.angularModalDirective,
		paths.angularTripScheduleDirective ])
	.pipe(concat(paths.jsDest +'/app.min.js'))
	.pipe(strip())
	.pipe(uglify())
	.pipe(gulp.dest('.'))
	.pipe(reload({stream: true}));
});

gulp.task('min:css', function () {
	var cssStream = gulp.src([paths.bootstrapCSS])
	.pipe(concat('css-files.css'))
	.pipe(stripCssComments({ preserve: false }))
	.pipe(cleanCSS({ compatibility: 'ie8' })),

	scssStream = gulp.src([paths.scss])
	.pipe(concat('css-files.css'))
	.pipe(sass({
		outputStyle: 'compressed'
	}).on('error', sass.logError))
	.pipe(autoprefixer({
		browser: ['last 2 versions']
	}))
	.pipe(stripCssComments({ preserve: false }))
	.pipe(cleanCSS({ compatibility: 'ie8' })),

	mergedStream = merge(cssStream, scssStream)
		.pipe(concat(paths.cssDest + '/app.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('.'))
		.pipe(reload({stream: true}));


	return mergedStream;
});

