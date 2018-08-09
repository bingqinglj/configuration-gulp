/*
 *author:lvjing
 *create-time:2018-8-9
 *version:1.0
 */

var path = require('path');
// npm
var gulp = require('gulp');
// 自动刷新
var livereload = require('gulp-livereload');
//合并文件；
var concat = require('gulp-concat');
// 编码
var chinese2unicode = require('jy-gulp-chinese2unicode');
// 压缩JS
var uglify = require('gulp-uglify');
//压缩CSS
var uglifycss = require('gulp-uglifycss');
// 压缩html
var htmlmin = require('gulp-htmlmin');
//对文件名加MD5后缀
var rev = require('gulp-rev');
//路径替换
var revCollector = require('gulp-rev-collector');
// 清除
var del = require('del');

var inject = require('gulp-inject');
// 项目
var config = {
    name: 'toutiaopc3'
};
/**
 * 添加监听
 */
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['css/*.css', 'js/**/*.js', 'tpls/*.js']).on('change', livereload.changed);
});

gulp.task('clean-scripts', function() {
    return del(['build', 'test']);
});

// JS
gulp.task('scripts', ['clean-scripts'], function() {
    gulp.src(['src/js/*.js'])
        .pipe(gulp.dest('test/js'))
        .pipe(uglify())
        .pipe(chinese2unicode('utf-8'))
        .pipe(gulp.dest('build/js'));
});

//CSS
gulp.task('styles', ['clean-scripts'], function() {

    gulp.src(['src/css/*.css'])
        .pipe(gulp.dest('test/css'))
        .pipe(uglifycss())
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev'));
});

//IMAGE
gulp.task('imgs', ['clean-scripts'], function() {
    gulp.src(['src/img/*'])
        .pipe(gulp.dest('test/img'))
        .pipe(gulp.dest('build/img'));
});

//HTML
gulp.task('htmls', ['clean-scripts'], function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: false, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: false, //压缩页面JS
        minifyCSS: false //压缩页面CSS
    };

    gulp.src(['rev/**/*.json', 'src/html/*.html'])
        .pipe(htmlmin(options))
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '../css/': '../build/css',
                '../js/': '../build/js/',
                'cdn/': function(manifest_value) {
                    return '//n.sinaimg.cn/finance/pc/cj/kandian/img/' + manifest_value;
                }
            }
        }))
        .pipe(gulp.dest('build/html'))
        .pipe(gulp.dest('test/html'));
});


/**
 * build 项目
 */
gulp.task('build', ['scripts', 'styles', 'imgs', 'htmls']);
