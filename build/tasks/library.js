const gulp = require('gulp');
const pump = require('pump');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const del = require('del');
const minify = require('gulp-minify');
const log = require('fancy-log');

const settings = require('../settings');

const libraryClean = done => {
    del.sync('../dist/', { force: true });
    done();
};

const libraryRollup = done => {
    const source = '../src/body-scroll.{mjs,js}';

    // processedFiles.js.push(source);

    return pump(
        [
            gulp.src(source),
            sourcemaps.init(settings.sourcemaps),
            rollup(
                {},
                {
                    ...settings.rollup,
                    name: 'bodyScroll'
                }
            ).on('error', err => log(err)),
            babel(settings.babel).on('error', err => log(err)),
            minify({ ext: { min: '.min.js' } }),
            sourcemaps.write('.'),
            gulp.dest('../dist/')
        ],
        done
    );
};

module.exports = {
    libraryRollup: libraryRollup,
    libraryClean: libraryClean
};
