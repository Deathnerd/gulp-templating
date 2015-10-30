//TODO: Implement automagic spritesheet generation and image optimization
var gulp = require('gulp');
var browserSync = require('browser-sync');
var swig = require('gulp-swig');
var reload = browserSync.reload;
var usemin = require('gulp-usemin');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var uglify = require("gulp-uglify");
var psi = require("psi");
var argv = require("yargs").argv;

var src = {
    root: 'src/',
    css: 'src/css',
    js: 'src/js',
    html: 'src/*.html'
};

var dist = {
    root: "./dist"
};

var site_url = "http://example.com";

// Start a serve task that will start a browserSync static server and set up a
// reload task when the js/html/css change
gulp.task('serve', function () {
    browserSync({
        server: "./dist"
    });
    gulp.watch(src.root + "/*", ['build-watch']);
});

// set up a task to build everything
gulp.task('build', function () {
    return gulp.src(src.html)
        .pipe(swig())
        .pipe(usemin({
            css: [function () {
                return autoprefixer('last 10 versions');
            }, minifyCss, 'concat'],
            js: [uglify, 'concat'],
            html: [function () {
                return minifyHtml({empty: true});
            }]
        }))
        .pipe(gulp.dest(dist.root));
});

/*
 * Gulp task to run page-speed analysis
 */
gulp.task('psi', function (cb) {
    return psi.output(site_url, {
        nokey: 'true', // or use key: ‘YOUR_API_KEY’
        strategy: argv.strategy || "mobile"
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
    });
});

// default task
gulp.task('default', ['serve']);

// only reload after the build is complete
gulp.task('build-watch', ['build'], browserSync.reload);