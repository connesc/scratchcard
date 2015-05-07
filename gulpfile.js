/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var merge = require('merge-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('build', function build() {
	var regular = browserify({
		entries: './index.js',
		standalone: 'Scratchcard',
		debug: true
	});

	var standalone = browserify({
		entries: './shim.js',
		standalone: 'Scratchcard',
		debug: true
	});

	var bundles = [
		regular.bundle().pipe(source('scratchcard.js')),
		standalone.bundle().pipe(source('scratchcard-standalone.js'))
	];

	return merge(bundles)
		.pipe(gulp.dest('dist'))
		.pipe(rename({suffix: '.min'}))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', function clean(callback) {
	return del(['dist'], callback);
});

gulp.task('default', ['build']);
