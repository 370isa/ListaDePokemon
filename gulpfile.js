const gulp = require('gulp');
const scss = require('gulp-sass');

scss.compiler = require('node-sass');

compileScss = () => {
  return gulp
    .src('src/template/scss/**/*.scss')
    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
    .pipe(gulp.dest('dist/css'));
}

compileJs = () => {
  return gulp
    .src('src/template/js/*')
    .pipe(gulp.dest('dist/js'));
}

compileImage = () => {
  return gulp
    .src('src/template/images/*')
    .pipe(gulp.dest('dist/images'));
}

watch = () => {
  gulp.watch('src/template/scss/**/*.scss', compileScss);
}

gulp.task('scss', compileScss);
gulp.task('js', compileJs);
gulp.task('image', compileImage);
gulp.task('default', watch);