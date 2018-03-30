/*  */
var gulp = require('gulp');
var gutil = require('gulp-util');//异常提示
var less= require('gulp-less');//less文件编译
var minifycss = require('gulp-minify-css');//css文件压缩
var autoprefixer = require('gulp-autoprefixer');//自动添加css前缀
var sourcemaps = require('gulp-sourcemaps');//便于压缩后调试代码
var rename = require('gulp-rename');//重命名文件名称
var uglify = require('gulp-uglify');//js压缩
var jshint = require('gulp-jshint');//js语法检查
var combiner = require('stream-combiner2');

//less文件编译与合并
gulp.task('less',function(){
    gulp.src('src/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browers:['last 2 versions','Android>=4.0'],
            remove:true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css/'))
        .pipe(rename({suffix:'.min'}))
        .pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});
//语法检查
gulp.task('jshint',function(){
    return gulp.src('src/js/**/*.js')
               .pipe(jshint())
               .pipe(jshint.reporter('default'))
})
var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}
//js文件配置
gulp.task('uglifyjs',function(){
    var combined = combiner.obj([
        gulp.src('src/js/**/*.js')
            .pipe(rename({suffix:'.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('dist/js'))
        ])
    combined.on('error', handleError)
})

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js',['jshint','uglify']);
    gulp.watch('src/less/**/*.less,'['less','sourcemaps']);
})


gulp.task('default', [
    'less','jshint','uglifyjs', 'watch'
    ]
)
