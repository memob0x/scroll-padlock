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

const BASE_DEMO = "./demo/";

const _src = (ext = "", base = "./") => [
    gulp.src(`${base}src/+([a-z])?(\-+([a-z]))${ext}`),

    sourcemaps.init({
        loadMaps: false,
        largeFile: false
    })
];

const _dest = (base = "./") => [
    sourcemaps.write("."),

    gulp.dest(`${base}dist/`)
];

const _rollupLibJs = () => rollup({}, { format: "umd", name: "bodyScroll" });

const _minJs = () => minify({ ext: { min: ".min.js" } });

const demoCss = done =>
    pump(
        [
            //
            ..._src(".scss", BASE_DEMO),
            //
            sass({ outputStyle: "compressed" }),
            //
            postcss([autoprefixer()]),
            //
            ..._dest(BASE_DEMO)
        ],
        done
    );

const demoJs = done =>
    pump(
        [
            //
            ..._src(".js", BASE_DEMO),
            //
            babel({ compact: true }),
            //
            ..._dest(BASE_DEMO)
        ],
        done
    );

const libEs5 = done =>
    pump(
        [
            //
            ..._src(".mjs"),
            //
            _rollupLibJs(),
            //
            babel(),
            //
            rename({ extname: ".es5.js" }),
            //
            _minJs(),
            //
            ..._dest()
        ],
        done
    );

const libEs6 = done =>
    pump(
        [
            //
            ..._src(".mjs"),
            //
            _rollupLibJs(),
            //
            rename({ extname: ".js" }),
            //
            _minJs(),
            //
            ..._dest()
        ],
        done
    );

gulp.task("default", gulp.parallel(libEs6, libEs5, demoJs, demoCss));
