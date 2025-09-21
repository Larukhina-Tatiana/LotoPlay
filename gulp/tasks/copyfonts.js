export const copyfonts = () => {
  return app.gulp
    .src(app.path.src.fonts, {
      encoding: false,
      removeBOM: false,
    })
    .pipe(app.gulp.dest(app.path.build.fonts));
};
