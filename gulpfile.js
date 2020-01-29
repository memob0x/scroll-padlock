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
const rename = require("gulp-rename");

const LIB = "./";
const DEMO = "./demo";

const _sourcemaps = () =>
    sourcemaps.init({
        loadMaps: false,
        largeFile: false
    });

const _rollup = () =>
    rollup(
        {},
        {
            format: "umd",
            name: "bodyScroll"
        }
    ).on("error", err => console.log(err));

const _minify = () => minify({ ext: { min: ".min.js" } });

const _babel = () => babel().on("error", err => console.log(err));

const styles = done =>
    pump(
        [
            gulp.src(`${DEMO}/src/*.scss`),

            _sourcemaps(),

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

            _sourcemaps(),

            _babel(),

            _minify(),

            sourcemaps.write("."),

            gulp.dest(`${DEMO}/dist/`)
        ],
        done
    );
};

const libraryEs5 = done => {
    const source = `${LIB}src/body-scroll.{mjs,js}`;

    return pump(
        [
            gulp.src(source),

            _sourcemaps(),

            _rollup(),

            _babel(),

            rename({
                extname: ".es5.js"
            }),

            _minify(),

            sourcemaps.write("."),

            gulp.dest(`${LIB}dist/`)
        ],
        done
    );
};

const library = done => {
    const source = `${LIB}src/body-scroll.{mjs,js}`;

    return pump(
        [
            gulp.src(source),

            _sourcemaps(),

            _rollup(),

            rename({
                extname: ".js"
            }),

            _minify(),

            sourcemaps.write("."),

            gulp.dest(`${LIB}dist/`)
        ],
        done
    );
};

gulp.task("default", gulp.parallel(library, libraryEs5, scripts, styles));
