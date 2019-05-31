const { src, series, parallel, dest, watch } = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const cleanCss = require("gulp-clean-css");
const imagemin = require("gulp-imagemin")
const eslint = require("gulp-eslint");
const nunjucks = require("gulp-nunjucks");
const fs = require("fs");
const yaml = require("yaml")

sass.compiler = require('node-sass')

// Run reload server
const runServer = () => {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    })
}

// HTML //

// Compile HTML
const compileHTML = () => {
    return src("./app/src/views/*.html")
        .pipe(nunjucks.compile(yaml.parse(fs.readFileSync("./content.yml", "utf8"))))
        .pipe(dest("./public/views"))
}

// SCSS //

// Compile the sass file
const compileSass = () => {
    return src("./app/src/sass/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(dest("./public/stylesheets"))
        .pipe(browserSync.stream());
}

// Minify the resultant CSS
const miniSass = () => {
    return src("./public/stylesheets/*.css")
        .pipe(cleanCss({compatibility: "ie8"}))
        .pipe(dest("public/stylesheets"))
}

// IMG //

// Compress any images
const compressImgs = () => {
    return src("./app/src/images/*")
        .pipe(imagemin())
        .pipe(dest("public/images"))
}

// WATCH //

// Watch for any changes to the image folder
const watchImages = () => {
    watch('./app/src/images/*', compressImgs)
    .on("change", browserSync.reload)
}

// Watch for any changes to HTML files
const watchHTML = () => {
    watch("./app/src/views.*.html", compileHTML)
        .on("change", browserSync.reload)
}

// Watch for any changes to the sass folder
const watchSass = () => {
    return watch('./app/src/sass/**', compileSass);
}

// LINTING //

// Lint the javascript
const lint = () => {
    return src("./app/src/js/*.js")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

exports.lint = lint;
exports.build = series(lint, compileHTML, compileSass, miniSass, compressImgs)
exports.default = parallel(runServer, watchHTML, watchSass, watchImages)
