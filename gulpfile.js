"use strict";

const gulp = require("gulp");
const pump = require("pump");
const rollup = require("gulp-better-rollup");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-minify");

const sourcemapsOptions = {
    loadMaps: false,
    largeFile: false
};

const LIB = "./";
const DEMO = "./demo";

const styles = done =>
    pump(
        [
            gulp.src(`${DEMO}/src/*.scss`),

            sourcemaps.init(sourcemapsOptions),

            sass({
                outputStyle: "compressed"
            }).on("error", err => console.log(err)),

            postcss([autoprefixer()]).on("error", err => console.log(err)),

            sourcemaps.write("."),

            gulp.dest(`${DEMO}/dist`)
        ],
        done
    );

const scripts = done => {
    return pump(
        [
            gulp.src(`${DEMO}/src/*.js`),

            sourcemaps.init(sourcemapsOptions),

            babel().on("error", err => console.log(err)),

            minify({
                ext: {
                    min: ".js"
                },
                noSource: true
            }),

            sourcemaps.write("."),

            gulp.dest(`${DEMO}/dist/`)
        ],
        done
    );
};

const library = done => {
    const source = `${LIB}src/body-scroll.{mjs,js}`;

    return pump(
        [
            gulp.src(source),

            sourcemaps.init(sourcemapsOptions),

            rollup(
                {},
                {
                    format: "umd",
                    name: "bodyScroll"
                }
            ).on("error", err => console.log(err)),

            babel().on("error", err => console.log(err)),

            minify({ ext: { min: ".min.js" } }),

            sourcemaps.write("."),

            gulp.dest(`${LIB}dist/`)
        ],
        done
    );
};

gulp.task("default", gulp.parallel(library, scripts, styles));
