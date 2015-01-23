var gulp       = require('gulp'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    del        = require('del'),
    jade       = require('gulp-jade'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    uglify     = require('gulp-uglify')

gulp.task('clean', function(opts) {
    del([
        'dist/*',
        'index.html'
    ], opts)
})

gulp.task('jade', function() {
    gulp.src('jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('.'))
})

gulp.task('scripts:bundle', function() {
    return browserify()
        .require('./js/colors.json')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
})

gulp.task('scripts:index', function() {
    return browserify('./js/graph.js')
        .external('./js/colors.json')
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
})

gulp.task('watch', function() {
    gulp.watch('js/graph.js', ['scripts:index'])
    gulp.watch('jade/index.jade', ['jade'])
})

gulp.task('default', ['scripts:index', 'jade'])
gulp.task('install', ['scripts:index', 'scripts:bundle', 'jade'])
