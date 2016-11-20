'use strict';

 // import
var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var ts   = require('gulp-typescript');
var merge = require('merge2');

// typescript
var tsDir = './dev_content/ts/**/*.ts'
var jsDir = './static/js/'
var defDir = './dev_content/definitions'

var tsProject = ts.createProject('./dev_content/ts/tsconfig.json');

gulp.task('typescript', function () {
  var tsResult = gulp.src(tsDir)
    .pipe(tsProject());

    // Merge the two output streams, 
    // so this task is finished when the IO of both operations is done.
    return merge([ 
        tsResult.dts.pipe(gulp.dest(defDir)),
        tsResult.js.pipe(gulp.dest(jsDir))
    ]);
});
 
gulp.task('typescript:watch', function () {
  gulp.watch(tsDir, ['typescript']);
});

 // sass
var sassDir = './dev_content/sass/**/*.sass'
var sassFile = './dev_content/sass/style.sass'
var cssDir  = './static/css/'
gulp.task('sass', function () {
  gulp.src(sassFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDir));
});
 
gulp.task('sass:watch', function () {
  gulp.watch(sassDir, ['sass']);
});

// jade
var jadeDir = './dev_content/jade/**/*.jade'
var htmlDir = './templates/'
gulp.task('jade', function() {
  var YOUR_LOCALS = {}; // wat
  gulp.src(jadeDir)
    .pipe(jade({locals: YOUR_LOCALS}))
    .pipe(gulp.dest(htmlDir))
});

gulp.task('jade:watch', function () {
  gulp.watch(jadeDir, ['jade']);
});

// Run default
gulp.task('default',[
  'sass',
  'sass:watch',
  'jade',
  'jade:watch',
  'typescript',
  'typescript:watch'
]);


