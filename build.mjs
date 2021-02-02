import { rollup } from 'rollup';
import rollupBabelPackage from '@rollup/plugin-babel';
import rollupGzip from 'rollup-plugin-gzip';
import rollupUglifyPackage from 'rollup-plugin-uglify';
import { terser as rollupTerser } from 'rollup-plugin-terser';
import fs from 'fs/promises';

const { getBabelOutputPlugin: rollupBabel } = rollupBabelPackage;
const { uglify: rollupUglify } = rollupUglifyPackage;

const root = '.';

const types = ['amd', 'iife', 'system', 'es', 'cjs', 'umd'];

(async () => {
    const streams = await Promise.all([
        // TODO: check why this is not read by default
        fs.readFile(`${root}/babel.config.json`),

        rollup({
            input: `${root}/src/padlock.mjs`
        })
    ]);

    const babelConfig = JSON.parse(streams[0]);

    const rollupResult = streams[1];

    const writing = [];
    
    for( let ii = 0, jj = types.length; ii < jj; ii++ ){
        const type = types[ii];

        for( let i = 0; i < 2; i++ ){
            const min = i === 1;

            const plugins = [];
    
            plugins.push(
                rollupBabel({
                    ...babelConfig,
                    comments: false,
                    allowAllFormats: true
                })
            );

            if( min ){
                plugins.push(type === 'es' ? rollupTerser() : rollupUglify());
            }

            plugins.push(rollupGzip());

            writing.push(rollupResult.write({
                sourcemap: true,
                format: type,
                name: 'ScrollPadlock',
                file: `${root}/dist/${type}/scroll-padlock${ min ? '.min' : '' }.js`,
                exports: 'auto',
                plugins
            }));
        }
    }

    await Promise.all(writing);
})();
