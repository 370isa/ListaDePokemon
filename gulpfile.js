const gulp = require('gulp');
const scss = require('gulp-sass');

scss.compiler = require('node-sass');

compileScss = () => {
  return gulp
    .src('src/assets/scss/**/*.scss')
    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
    .pipe(gulp.dest('dist/css'));
}

compileJs = () => {
  return gulp
    .src('src/assets/js/*')
    .pipe(gulp.dest('dist/js'));
}

compileImage = () => {
  return gulp
    .src('src/assets/images/*')
    .pipe(gulp.dest('dist/images'));
}

watch = () => {
  gulp.watch('src/assets/scss/**/*.scss', compileScss);
}

gulp.task('scss', compileScss);
gulp.task('js', compileJs);
gulp.task('image', compileImage);
gulp.task('default', watch);