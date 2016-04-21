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
    './bower_components/animate.css/animate.min.css',
    './bower_components/ng-dialog/css/ngDialog-theme-default.min.css',
    './bower_components/ng-dialog/css/ngDialog.min.css',
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

var bowerFiles = [
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/jquery.cookie/jquery.cookie.js',
    './bower_components/bootstrap/dist/js/bootstrap.min.js',
    './bower_components/numeral/min/numeral.min.js',
    './bower_components/moment/min/moment.min.js',
    './bower_components/lodash/dist/lodash.min.js',
    './bower_components/angular/angular.min.js',
    './bower_components/angular-ui-router/release/angular-ui-router.min.js',
    './bower_components/angular-resource/angular-resource.min.js',
    './bower_components/ng-dialog/js/ngDialog.min.js'
];
gulp.task("bower", function() {
    return gulp.src(bowerFiles)
        .pipe(concat('bower_components.js'))
        .pipe(gulp.dest('dist/js'))
        .on('error', util.log)
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Bower task complete' }));
});

gulp.task('clean', function() {
    return del(['./dist/**', './deploy/**/*']);
});

gulp.task('serve',function() {
    return gulp.src('./server/**/*')
        .pipe(gulp.dest("./dist/server"));
});

gulp.task('move_favicons',function() {
    return gulp.src([
        './favicon/*'
    ])
        .pipe(gulp.dest("./dist/favicon"));
});
gulp.task('move_fonts',function() {
    return gulp.src([
            './bower_components/font-awesome/fonts/*'
        ])
        .pipe(gulp.dest("./dist/fonts"));
});
gulp.task('move_views',function() {
    return gulp.src('./app/views/**/*')
        .pipe(cleanUrls())
        .pipe(gulp.dest("./dist/views"));
});
gulp.task('move_imgs',function() {
    return gulp.src('./app/imgs/**/*')
        .pipe(gulp.dest("./dist/imgs"));
});

gulp.task('move_files',function() {
    gulp.start('move_favicons', 'move_views', 'move_imgs');
});

var cleanUrls = function() {
    return change(function (content, done) {
        var newContent = content.replace(/([src|href]=[\'\"])(\/)?([a-z]+\/.*)/g, "$1/dist/$3");
        done(null, newContent);
    })
};

var change = require('gulp-change');
gulp.task("clean_urls", ["clean_js", "clean_styles"]);
gulp.task("clean_js",  function() {
    return gulp.src(["./dist/js/*.js"])
        .pipe(change(function (content, done) {
            var newContent = content.replace(/([=|\:]\s[\'\"])(\/)?([a-z]+\/.*)/g, "$1/dist/$3");
            done(null, newContent);
        }))
        .pipe(gulp.dest("./dist/js"));
});
gulp.task("clean_styles",  function() {
    return gulp.src("./dist/css/*.css")
        .pipe(change(function (content, done) {
            var newContent = content.replace(/(\/)?(imgs\/.*)/g, "/dist/$2");
            done(null, newContent);
        }))
        .pipe(gulp.dest("./dist/css"));
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

//DEPLOY
var deployUrl = "dashboard-61580.onmodulus.net";

gulp.task('move_deploy_files', [], function() {
    return gulp.src('./dist/**/*')
        .pipe(change(function(content, done) {
            var newContent = content.replace(/localhost:3337/g, deployUrl);
            newContent = newContent.replace(/\/dist/g, "");
            done(null, newContent);
        }))
        .pipe(gulp.dest("./deploy"));
});
gulp.task('deploy', ['move_deploy_files'], function() {
    return gulp.src(['./index.html', 'app.js', 'package.json',])
        .pipe(change(function(content, done) {
            var newContent = content.replace(/\/dist/g, "");
            done(null, newContent);
        }))
        .pipe(gulp.dest("./deploy"));
});

// Default task
gulp.task('build', ['clean'], function() {
    gulp.start('bower', 'serve', 'scripts', 'styles', "move_files");
});