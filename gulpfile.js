"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var runSequence= require('run-sequence');  // 运行组件，原生为run,多任务并行或顺序
var rename = require('gulp-rename');  // 重命名
var clean = require('gulp-clean');  // 清空文件夹
var cleanCSS = require('gulp-clean-css');  // css压缩
var uglify = require('gulp-uglify');  // js压缩

//定义路径
var paths = {
    // js:['./src/static/js/**'],
    // css:['./src/static/css/*'],
    // libs:['./src/static/js/libs/**'],
    // img:['./src/static/img/*'],
    staticFile: ['./src/static/**','!./src/static/js/config.js'],
    template:['./src/template/**'],
    appvue:['./app/dist/**','!./app/dist/static/config.js'],

    //分环境移动配置文件
    devConfig:['./src/config/config_dev.js'],
    testConfig:['./src/config/config_test.js'],
    preConfig:['./src/config/config_pre.js'],
    proConfig:['./src/config/config_pro.js']
};

gulp.task("sass", function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('./src/static/css'));
});

gulp.task("sass-vue", function() {
    return gulp.src('./app/src/assets/sass/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('./app/src/assets/css'));
});



// move
gulp.task('buildMov', function () {
    gulp.src(paths.staticFile)
        .pipe(gulp.dest('./dist/static/'));
    gulp.src(paths.template)
        .pipe(gulp.dest('./dist/template/'));
    gulp.src(paths.appvue)
        .pipe(gulp.dest('./dist/appv/'));
});

/**
 * dev pro test
 * **/
//多环境文件移动
gulp.task('devDist', function () {
    gulp.src(paths.devConfig)
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./dist/static/js'))
        .pipe(gulp.dest('./dist/appv/static'));
});
gulp.task('testDist', function () {
    gulp.src(paths.testConfig)
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./dist/static/js'))
        .pipe(gulp.dest('./dist/appv/static'));
});
gulp.task('preDist', function () {
    gulp.src(paths.preConfig)
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./dist/static/js'))
        .pipe(gulp.dest('./dist/appv/static'));
});
gulp.task('productDist', function () {
    gulp.src(paths.proConfig)
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./dist/static/js'))
        .pipe(gulp.dest('./dist/appv/static'));
});

// clean
gulp.task('clean', function() {
    return gulp.src(['./dist/'], {read: false})
        .pipe(clean({force: true}));
});

// 压缩
gulp.task('minifycss', function() {
    return gulp.src('./src/static/css/**/*.css')      //压缩的文件
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/static/css'));  // 输出文件夹
});




//==========================================================
//终端gulp watch，动态实时监控早期项目
gulp.task('watch', function() {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});

//终端gulp vue-watch，动态实时监控VUE 项目
gulp.task('vue-watch', function() {
    gulp.watch('./app/src/assets/sass/*.scss', ['sass-vue']);
});


// run dev (dev)
gulp.task('dev', ['clean'], function() {
    runSequence('buildMov','devDist')
});

// run test
gulp.task('test',['clean'], function() {
    runSequence('buildMov','testDist')
});

// run pre
gulp.task('pre', function() {
    runSequence('buildMov','preDist')
});

// run pro
gulp.task('pro', function() {
    runSequence('buildMov','productDist');//中括号为并行执行
});