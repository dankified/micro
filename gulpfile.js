const gulp = require('gulp');
const del = require('del');
const ava = require('gulp-ava');
const babel = require('gulp-babel');
const cache = require('gulp-cached');
const eslint = require('gulp-eslint');
const help = require('gulp-task-listing');

gulp.task('help', help);

gulp.task('compile', [
  'compile-bin',
  'compile-test'
]);

gulp.task('compile-bin', function () {
  return gulp.src('bin/*')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('build/bin'));
});

gulp.task('compile-test', function () {
  return gulp.src('test/*.js')
  .pipe(cache('test'))
  .pipe(babel({
    presets: ['es2015'],
    plugins: [
      'transform-runtime',
      'syntax-async-functions',
      'transform-async-to-generator'
    ]
  }))
  .pipe(gulp.dest('build/test'));
});

gulp.task('test', ['compile'], function () {
  return gulp.src('build/test/*.js')
  .pipe(ava());
});

gulp.task('lint', function () {
  return gulp.src([
    'gulpfile.js',
    'test/*.js',
    'bin/*'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('clean', function () {
  return del(['build']);
});

gulp.task('default', ['lint', 'compile', 'test']);
