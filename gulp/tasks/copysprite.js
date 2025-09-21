export const copysprite = () => {
  return app.gulp
    .src(app.path.src.svgsprite, {
      encoding: false,
      removeBOM: false,
    })
    .pipe(app.gulp.dest(app.path.build.svgsprite));
};
