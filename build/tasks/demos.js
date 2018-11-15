const gulp = require('gulp');
const pump = require('pump');
const rollup = require('gulp-better-rollup');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const del = require('del');
const glob = require('glob');
const log = require('fancy-log');
const hb = require('gulp-hb');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const path = require('path');

const settings = require('../settings');

const clearRequire = module => {
    module = path.resolve(module);
    delete require.cache[module];
    return require(module);
};

const demosClean = done => {
    del.sync(['../demos/assets/dist/', '../demos/*.html'], { force: true });
    done();
};

const demosStyles = done =>
    pump(
        [
            gulp.src('../demos/assets/src/pages/*.scss'),
            sourcemaps.init(settings.sourcemaps),
            sass(settings.sass).on('error', err => log(err)),
            postcss([autoprefixer()]).on('error', err => log(err)),
            sourcemaps.write('.'),
            gulp.dest('../demos/assets/dist/')
        ],
        done
    );

const demosScripts = done =>
    pump(
        [
            gulp.src('../demos/assets/src/pages/*.{js,mjs}'),
            sourcemaps.init(settings.sourcemaps),
            rollup({}, settings.rollup).on('error', err => log(err)),
            babel(settings.babel).on('error', err => log(err)),
            sourcemaps.write('.'),
            gulp.dest('../demos/assets/dist/')
        ],
        done
    );

const buildHtml = (modules = false, done) => {
    let pumpLine = [];

    const main = '../demos/assets/src/main.hbs';
    // processedFiles.html.push(main);

    glob.sync('../demos/assets/src/pages/*.hbs').forEach(source => {
        const file = source.match(/[^\\/]+$/)[0];
        const filestruct = file.split('.');

        // processedFiles.html.push(source);

        if (filestruct.length === 2) {
            const filename = filestruct[0];

            const json = '../demos/assets/src/pages/' + filename + '.json';
            // processedFiles.json.push(json);

            pumpLine.push([
                gulp.src(main),
                hb(settings.hbs)
                    .data(clearRequire(json))
                    .data({
                        modules: modules,
                        filename: filename
                    })
                    .partials({
                        content: '{{> ' + filename + '}}'
                    })
                    .partials(source)
                    .partials('../demos/assets/src/pages/' + filename + '.*.hbs'),
                rename({
                    basename: filename,
                    extname: '.html'
                }),
                gulp.dest('../demos/')
            ]);
        }
    });

    pump(pumpLine.reduce((a, b) => a.concat(b)), done);
};

module.exports = {
    demosClean: demosClean,
    demosScripts: demosScripts,
    demosStyles: demosStyles,
    demosHtmlNativeModules: done => buildHtml(true, done),
    demosHtml: done => buildHtml(false, done)
};
