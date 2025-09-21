export const copyicons = () => {
  return app.gulp
    .src(app.path.src.icons, {
      encoding: false,
      removeBOM: false,
    })
    .pipe(app.gulp.dest(app.path.build.icons));
};
