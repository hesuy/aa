/*  */
var gulp = require('gulp');
var gutil = require('gulp-util');//异常提示
var less = require('gulp-less');//less文件编译
var minifycss = require('gulp-minify-css');//css文件压缩
var autoprefixer = require('gulp-autoprefixer');//自动添加css前缀
var sourcemaps = require('gulp-sourcemaps');//便于压缩后调试代码
var rename = require('gulp-rename');//重命名文件名称
var uglify = require('gulp-uglify');//js压缩
var jshint = require('gulp-jshint');//js语法检查
var concat = require('gulp-concat');//文件合并
var imagemin = require('gulp-imagemin');//图片压缩
var plumber = require('gulp-plumber');
var rev = require('gulp-rev');//添加版本号
var revCollector = require('gulp-rev-collector');//替换html中的js，css引用文件
var clean = require('gulp-clean');//删除目录文件
//less文件编译
gulp.task('less', function () {
    gulp.src('src/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css/'))
});
//css文件合并压缩
gulp.task('minifycss', function () {
    gulp.src('src/css/**/*.css')
        .pipe(autoprefixer({
            browers: ['last 2 versions', 'Android>=4.0'],
            remove: true
        }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/css'))
})
//js语法检查
//gulp.task('jshint', function () {
//    return gulp.src('src/js/**/*.js')
//               .pipe(jshint())
//               .pipe(jshint.reporter('default'))
//})

//js文件编译并压缩
gulp.task('uglifyjs', function () {
    gulp.src('src/js/**/*.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/js'))
})
//image压缩
gulp.task('imagemin', function () {
    gulp.src('src/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
})
//版本号替换
gulp.task('rev', function () {
    gulp.src(['src/**/*.json', 'Views/**/*.cshtml'])
    .pipe(revCollector({
        replaceReved: true,
        dirReplacements: {
            'dist/css': 'dist/css',
            'dist/js': 'dist/js'
        }
    }))
    .pipe(gulp.dest('Views/'))
});
//删除目录文件
gulp.task('clean-js', function () {
    return gulp.src('dist/js/**/*.js',{read:true})
           .pipe(clean());
});
gulp.task('clean-css', function () {
    return gulp.src('dist/css/**/*.css', { read: false })
           .pipe(clean());
});
gulp.task('deploy', ['clean-css','clean-js']);

gulp.task('watch', function () {
    gulp.watch('src/js/**/*.js', ['uglifyjs']);
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/css/**/*.css', ['minifycss']);
    gulp.watch('src/images/**/*', ['imagemin']);
})


//gulp.task('default', [
//    'less', 'minifycss', 'imagemin', 'rev', 'uglifyjs', 'watch'
//]
//)
gulp.task('default', ['clean-css', 'clean-js'],function(){
    gulp.start('less', 'minifycss', 'imagemin', 'rev', 'uglifyjs', 'watch')
})
