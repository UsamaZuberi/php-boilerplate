/**
 * Settings
 * Turn on/off build features
 */

const settings = {
  clean: true,
  scripts: true,
  styles: true,
  svgs: true,
  images: true,
  fonts: true,
  icons: true,
  reload: true
};


/**
* Paths to project folders
*/

const paths = {
  input: 'src/',
  output: 'build/',
  scripts: {
    input: 'src/assets/js/**/*',
    output: 'build/js/'
  },
  styles: {
    // input: 'src/assets/styles/**/*.{scss,sass}',
    input: ["src/assets/styles/main.scss", "src/assets/styles/pages/*"],
    output: 'build/css/'
  },
  svgs: {
    input: 'src/assets/svg/**/*.svg',
    output: 'build/svg/'
  },
  images: {
    input: 'src/assets/images/**/*.{png,jgp,jpeg,webp,ico}',
    output: 'build/images/'
  },
  fonts: {
    input: './src/assets/fonts/**/*',
    output: 'build/fonts/'
  },
  icons: {
    input: './src/assets/styles/icons.scss',
    output: 'build/css/'
  },
  reload: 'http://localhost/php-boilerplate/src/pages'
};


/**
* Gulp Packages
*/

// General
const { src, dest, watch, series, parallel } = require('gulp');
const del = require('del');
// const rename = require('gulp-rename');

// Scripts
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// Styles
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss');
const prefix = require('autoprefixer');
// const minify = require('cssnano');

// SVGs
const svgmin = require('gulp-svgmin');

// Images
const imagemin = require("gulp-imagemin");

// BrowserSync
const browserSync = require('browser-sync');



/**
* Gulp Tasks
*/

// 1. Remove pre-existing content from output folders
const cleanBuild = (done) => {

  // Make sure this feature is activated before running
  if (!settings.clean) return done();

  // Clean the build folder
  del.sync([
    paths.output
  ]);

  // Signal completion
  return done();

};

// 2. Copy, Compile, Minify & Concatenate Javascript
const buildScripts = (done) => {
  // Make sure this feature is activated before running
  if (!settings.scripts) return done();

  // Compile Scripts
  src(paths.scripts.input)
    .pipe(uglify())
    .pipe(concat("all.js", { newLine: ";\n" }))
    .pipe(dest(paths.scripts.output));

  // Signal completion
  return done();
}

// 3. Lint scripts
const lintScripts = (done) => {

  // Make sure this feature is activated before running
  if (!settings.scripts) return done();

  // Lint scripts
  return src([`${paths.scripts.input}`, '!src/assets/js/*.{min.js}'], { allowEmpty: true })
    .pipe(jshint({ esnext: true }))
    .pipe(jshint.reporter('jshint-stylish'));

};

// 4. Process, Lint, & Minify Sass files
const buildStyles = (done) => {

  // Make sure this feature is activated before running
  if (!settings.styles) return done();

  // Run tasks on all Sass files

  return src(paths.styles.input, { allowEmpty: true })
    .pipe(sass({
      outputStyle: 'compressed',
      sourceComments: false
    }))
    .on("error", sass.logError)
    .pipe(postcss([
      prefix({
        cascade: true,
        remove: true,
      })
    ]))
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(postcss([
    //     minify({
    //         discardComments: {
    //             removeAll: true
    //         }
    //     })
    // ]))
    .pipe(dest(paths.styles.output));
};

// 5. Process Icon files
const buildIcons = (done) => {

  // Make sure this feature is activated before running
  if (!settings.icons) return done();

  // Run tasks on all icon files
  return src(paths.icons.input, { allowEmpty: true })
    .pipe(sass({
      outputStyle: 'compressed',
      sourceComments: false
    }))
    .on("error", sass.logError)
    .pipe(dest(paths.icons.output));
};

// 6. Optimize SVG files
const buildSVGs = (done) => {

  // Make sure this feature is activated before running
  if (!settings.svgs) return done();

  // Optimize SVG files
  return src(paths.svgs.input)
    .pipe(svgmin())
    .pipe(dest(paths.svgs.output));
}

// 7. Optimize Image files
const buildImages = (done) => {
  // Make sure this feature is activated before running
  if (!settings.images) return done();

  // Optimize Images
  return src(paths.images.input)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(paths.images.output));
}

// 8. Process Fonts
const buildFonts = (done) => {
  // Make sure this feature is activated before running
  if (!settings.fonts) return done();

  // Copy Fonts
  return src(paths.fonts.input).pipe(dest(paths.fonts.output));
}

// 9. Watch for changes to the src directory
const startServer = (done) => {

  // Make sure this feature is activated before running
  if (!settings.reload) return done();

  // Initialize BrowserSync
  browserSync.init({
    // server: {
    //     baseDir: paths.reload
    // }
    proxy: paths.reload,
  });

  // Signal completion
  return done();

};

// 10. Reload the browser when files change
const reloadBrowser = (done) => {

  // Make sure this feature is activated before running
  if (!settings.reload) return done();

  // Reload Browser
  browserSync.reload();

  // Signal completion
  return done();
};

// 11. Watch for changes
const watchSource = (done) => {
  watch("./src/assets/js/**/*.js", series(buildScripts, reloadBrowser)),
    watch("./src/assets/styles/**/*", series(buildStyles, reloadBrowser)),
    watch("./src/assets/styles/icons.scss", series(buildIcons, reloadBrowser)),
    watch("./src/assets/svgs/**/*", series(buildSVGs, reloadBrowser)),
    watch("./src/assets/images/**/*", series(buildImages, reloadBrowser)),
    watch("./src/assets/fonts/*", series(buildFonts, reloadBrowser)),
    watch("./src/**/*.php", reloadBrowser)

  return done();
};


/**
* Export Tasks
*/

// Default Task
// gulp
exports.default = series(
  cleanBuild,
  parallel(
    buildScripts,
    lintScripts,
    buildStyles,
    buildIcons,
    buildSVGs,
    buildImages,
    buildFonts
  )
);


// Watch & Reload
// gulp watch
exports.watch = series(
  exports.default,
  startServer,
  watchSource
);
