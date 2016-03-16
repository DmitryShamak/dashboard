var gulp = require("gulp");

var webserver = require("gulp-webserver");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var notify = require('gulp-notify');
var del = require('del');
var livereload = require('gulp-livereload');
var path = require("path");
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var util = require("gulp-util");

var stylesSrc = [
    'app/styles/*.scss'
];
gulp.task('styles', function () {
    return gulp
        // Find all `.scss` files from the `stylesheets/` folder
        .src(stylesSrc)
        // Run Sass on those files
        .pipe(sass())
        .pipe(concat('style.css'))
        // Write the resulting CSS in the output folder
        .pipe(gulp.dest('dist/css'));
});

var scriptsSrc = [
    'app/scripts/app.js',
    'app/scripts/config.js',
    'app/scripts/**/*js'
];
gulp.task("scripts", function() {
    return gulp.src(scriptsSrc)
        .pipe(concat('ng-script.js'))
        .pipe(gulp.dest('dist/js'))
        .on('error', util.log)
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('clean', function() {
    return del(['dist/**']);
});

gulp.task('serve',function() {
    return gulp.src('build')
        .pipe(webserver({open: true, livereload: true, host:"0.1.1.0"}));
});

gulp.task('move_files',function() {
    return gulp.src('./app/views/**/*')
        .pipe(gulp.dest("./dist/views"));
});

var cleanUrls = function() {
    return change(function (content, done) {
        var newContent = content.replace(/([src|href]=[\'\"])(\/)?([a-z]+\/.*)/g, "$1/dist/$3");
        done(null, newContent);
    })
};

var change = require('gulp-change');
gulp.task("clean_urls", ["clean_js"]);
gulp.task("clean_js",  function() {
    return gulp.src(["./dist/js/*.js"])
        .pipe(change(function (content, done) {
            var newContent = content.replace(/([=|\:]\s[\'\"])(\/)?([a-z]+\/.*)/g, "$1/dist/$3");
            done(null, newContent);
        }))
        .pipe(gulp.dest("./dist/js"));
});

gulp.task('watch', function() {
    // Create LiveReload server
    //livereload.listen();

    //// Watch any files in dist/, reload on change
    //gulp.watch(['dist/**']).on('change', livereload.changed);

    // Watch .less files
    gulp.watch('app/styles/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    // Watch image files
    //gulp.watch('src/images/**/*', ['images']);
});


// Default task
gulp.task('build', ['clean'], function() {
    gulp.start('scripts', 'styles', "move_files");
});