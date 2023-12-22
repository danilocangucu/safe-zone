module.exports = function (config) {
  config.set({
    // ...
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    // ...
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox",
          "--disable-gpu",
          "--disable-software-rasterizer",
        ],
      },
    },
    // ...
    browsers: ["ChromeHeadlessNoSandbox"],
    // ...
  });
};
