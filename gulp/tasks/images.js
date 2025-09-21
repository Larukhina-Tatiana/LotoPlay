import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
import avif from "gulp-avif";
export const imgAvif = () => {
  return app.gulp
    .src(app.path.src.avif, { encoding: false })
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(avif({ quality: 50 }))
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browserSync.stream());
};

export const imgWebp = () => {
  return app.gulp
    .src(app.path.src.images, { encoding: false })
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(webp({ quality: 85 }))
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browserSync.stream());
};
export const imgImage = () => {
  return app.gulp
    .src(app.path.src.images, { encoding: false })
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(
      imagemin({
        progressive: true,
        interlaced: true,
        quality: 75,
        optimizationLevel: 5,
      })
    )
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browserSync.stream());
};
