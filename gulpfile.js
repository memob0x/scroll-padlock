'use strict';

const gulp = require('gulp');
const pump = require('pump');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const minify = require('gulp-minify');

const sourcemapsOptions = {
    loadMaps: false,
    largeFile: false
};

const styles = done =>
    pump(
        [
            gulp.src('./demo/*.scss'),

            sourcemaps.init(sourcemapsOptions),

            sass({
                outputStyle: 'expanded'
            }).on('error', err => console.log(err)),

            postcss([autoprefixer()]).on('error', err => console.log(err)),

            sourcemaps.write('.'),

            gulp.dest('./demo/')
        ],
        done
    );

const library = done => {
    const source = './src/body-scroll.{mjs,js}';

    return pump(
        [
            gulp.src(source),

            sourcemaps.init(sourcemapsOptions),

            rollup(
                {},
                {
                    format: 'umd',
                    name: 'bodyScroll'
                }
            ).on('error', err => console.log(err)),

            babel({
                ignore: ['node_modules/', 'dist/'],
                babelrcRoots: ['../../']
            }).on('error', err => console.log(err)),

            minify({ ext: { min: '.min.js' } }),

            sourcemaps.write('.'),

            gulp.dest('./dist/')
        ],
        done
    );
};

gulp.task('default', gulp.parallel(library, styles));
