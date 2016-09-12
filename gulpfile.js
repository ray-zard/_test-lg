'use strict';
var gulp = require ('gulp'),
	watch = require ('gulp-watch'),
	preFixer = require ('gulp-autoprefixer'),
	uglify = require ('gulp-uglify'),
	sass = require ('gulp-sass'),
	sourceMaps = require ('gulp-sourcemaps'),
	rigger = require ('gulp-rigger'),
	cssMin = require ('gulp-minify-css'),
	rimRaf = require ('rimraf'),
	imageMin = require('gulp-imagemin'),
	browserSync = require ('browser-sync'),
	reload = browserSync.reload;

var path = {

	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*'
	},
	clean: './build'
};

gulp.task("webserver", function () {
	browserSync({
		server: {
			baseDir: "./build"
		},
		host: 'localhost',
		port: 3000,
		tunnel: true
	});
});

gulp.task('html:build', function () {
	gulp.src(path.src.html)
		.pipe (rigger())
		.pipe (gulp.dest(path.build.html))
		.pipe (reload({stream: true}));
});

gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe (rigger())
		.pipe (sourceMaps.init())
		.pipe (uglify())
		.pipe (sourceMaps.write())
		.pipe (gulp.dest(path.build.js))
		.pipe (reload({stream: true}));
});

gulp.task('style:build', function () {
	gulp.src(path.src.style)
		.pipe (sourceMaps.init())
		.pipe (sass())
		.pipe (preFixer())
		.pipe (cssMin())
		.pipe (sourceMaps.write())
		.pipe (gulp.dest(path.build.css))
		.pipe (reload({stream: true}));
});

gulp.task('img:build', function () {
	gulp.src(path.src.img)
		.pipe (imageMin())
		.pipe(gulp.dest(path.build.img))
		.pipe (reload({stream: true}));
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'img:build',
]);

gulp.task('watch', function () {
	watch([path.watch.js], function (ev, callback) {
		gulp.start('js:build');
	});
	watch([path.watch.html], function (ev, callback) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function (ec, callback) {
		gulp.start('style:build');
	});
	watch([path.watch.img], function (ec, callback) {
		gulp.start('img:build');
	});
});

gulp.task('clean', function (callback) {
	rimRaf(path.clean, callback);
});

gulp.task('default', ['build', 'webserver', 'watch']);