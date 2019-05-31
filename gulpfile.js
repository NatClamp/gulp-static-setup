const { src, series, parallel, dest, watch } = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const cleanCss = require("gulp-clean-css");
const imagemin = require("gulp-imagemin")

sass.compiler = require('node-sass')

// Run reload server
const runServer = () => {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    })
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

// Watch for any changes to the sass folder
const watchSass = () => {
    return watch('./app/src/sass/**', compileSass);
}


exports.build = series(compileSass, miniSass, compressImgs)
exports.default = parallel(runServer, watchSass, watchImages)