'use strict';

var path = require('path');

var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var src = 'sass/';
var dest = 'css/';
var copy = 'docs/css/';

gulp.task('styles', function() {
    return gulp.src(path.join(src, '_frow.scss'))
        .pipe(rename("frow.scss"))
        // .pipe(sourcemaps.init()) breaks from the file rename?
        .pipe(sass({
            includePaths: [src]
        }))
        .pipe(rename("frow.css"))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest))
        .pipe(gulp.dest(copy))
        .pipe(cssnano())
        .pipe(rename("frow.min.css"))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest))
        .pipe(gulp.dest(copy));
});

gulp.task('default', ['styles']);
