import fileinclude from "gulp-file-include";
import avifWebpHtml from "gulp-avif-webp-retina-html";
import typograf from "gulp-typograf";
import versionNumber from "gulp-version-number";
import htmlclean from "gulp-htmlclean";

// export const plumberNotify = (title) => {
//   return {
//     errorHandler: notify.onError({
//       title: title,
//       massage: "Error <%= error.message %>",
//     }),
//   };
// };

export const html = () => {
  return app.gulp
    .src(app.path.src.html)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "HTML",
          massage: "Error <%= error.message %>",
        })
      )
    )
    .pipe(fileinclude({ prefix: "@", basepath: "@file" }))
    .pipe(
      avifWebpHtml({
        extensions: ["avif", "webp", "jpg"],
        retina: {
          // 1: "",
          1: "@1x",
          2: "@2x",
          // 3: "@3x",
          // 4: "@4x",
        },
        // checkExists: true,
        noAvif: false,
        noWebp: false,
        // publicPath: "img/",
        publicPath: "./docs/images/**/",
      })
    )
    .pipe(app.plugins.replace(/@img\//g, "images/"))
    .pipe(
      app.plugins.replace(
        /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
        "$1./$4$5$7$1"
      )
    )
    .pipe(
      typograf({
        locale: ["ru", "en-US"],
        htmlEntity: { type: "digit" },
        safeTags: [
          ["<\\?php", "\\?>"],
          ["<no-typography>", "</no-typography>"],
        ],
      })
    )
    .pipe(
      app.plugins.if(
        app.isBuild,
        versionNumber({
          value: "%DT%",
          append: {
            key: "_v",
            cover: 0,
            to: ["css", "js"],
          },
          output: {
            file: "gulp/version.json",
          },
        })
      )
    )
    .pipe(app.plugins.if(app.isBuild, htmlclean()))
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browserSync.stream());
};
