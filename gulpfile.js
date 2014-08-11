var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('build', function() {
  var assets = $.useref.assets();
  return gulp.src('app/*.html')
    .pipe(assets)
    .on('error', console.error.bind(console))
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({comments: true})))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'build'}));
})

gulp.task('copy', function () {
  return gulp.src(['app/*', '!app/*.html'], {dot: true})
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build', 'copy');
});
