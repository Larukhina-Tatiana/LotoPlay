import svgsprite from "gulp-svg-sprite";

export const svgStack = () => {
  return (
    app.gulp
      .src(app.path.src.svgsprite, { sourcemaps: true })
      // Плюмбер
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "svgStack",
            massage: "Error <%= error.message %>",
          })
        )
      )
      .pipe(
        svgsprite({
          mode: {
            stack: {
              example: true,
            },
          },
          shape: {
            transform: [
              {
                svgo: {
                  js2svg: { indent: 4, pretty: true },
                },
              },
            ],
          },
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browserSync.stream())
  );
};

export const svgSymbol = () => {
  return (
    app.gulp
      .src(app.path.src.svgsprite, { sourcemaps: true })
      // Плюмбер
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "svgSymbol",
            massage: "Error <%= error.message %>",
          })
        )
      )
      .pipe(
        svgsprite({
          mode: {
            symbol: {
              sprite: "../sprite.symbol.svg",
            },
          },
          shape: {
            transform: [
              {
                svgo: {
                  js2svg: { indent: 4, pretty: true },
                  plugins: [
                    {
                      name: "removeAttrs",
                      params: {
                        attrs: "(fill|stroke)",
                      },
                    },
                  ],
                },
              },
            ],
          },
        })
          .pipe(app.gulp.dest(app.path.build.svgsprite))
          .pipe(app.plugins.browserSync.stream())
      )
  );
};
