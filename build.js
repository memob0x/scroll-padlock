import { rollup } from 'rollup';
import rollupBabelPackage from '@rollup/plugin-babel';
import rollupGzip from 'rollup-plugin-gzip';
import { terser as rollupTerser } from 'rollup-plugin-terser';
import fs from 'fs/promises';

const { getBabelOutputPlugin: rollupBabel } = rollupBabelPackage;

const root = '.';

const bundlesTypes = ['amd', 'iife', 'system', 'es', 'cjs', 'umd'];

(async () => {
    const [
        babelConfigStream = 0,

        rollupResult = 1
    ] = await Promise.all([
        // TODO: check why this is not read by default
        fs.readFile(`${root}/babel.config.json`),

        rollup({
            input: `${root}/src/padlock.js`
        })
    ]);

    const babelConfig = JSON.parse(babelConfigStream);

    const writing = [];
    
    for( let bundlnesTypesIndex = 0, bundlesTypesLength = bundlesTypes.length; bundlnesTypesIndex < bundlesTypesLength; bundlnesTypesIndex++ ){
        const bundleType = bundlesTypes[bundlnesTypesIndex];

        for( let i = 0; i < 2; i++ ){
            const isMinBundle = i === 1;

            const plugins = [rollupBabel({
                ...babelConfig,
                comments: false,
                allowAllFormats: true
            })];

            if( isMinBundle ){
                plugins.push(rollupTerser());
            }

            plugins.push(rollupGzip());

            writing.push(rollupResult.write({
                sourcemap: true,
                format: bundleType,
                name: 'ScrollPadlock',
                file: `${root}/dist/${bundleType}/scroll-padlock${ isMinBundle ? '.min' : '' }.js`,
                exports: 'default',
                plugins
            }));
        }
    }

    await Promise.all(writing);
})();
