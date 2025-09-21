import { notify } from "browser-sync";

export const server = (done) => {
  app.plugins.browserSync.init({
    server: {
      baseDir: `${app.path.build.html}`,
    },
    notify: false,
    port: 8000,
  });
};
