import { rollup } from 'rollup';
import rollupBabelPackage from '@rollup/plugin-babel';
import rollupGzip from 'rollup-plugin-gzip';
import rollupUglifyPackage from 'rollup-plugin-uglify';
import { terser as rollupTerser } from 'rollup-plugin-terser';
import fs from 'fs/promises';

const { getBabelOutputPlugin: rollupBabel } = rollupBabelPackage;
const { uglify: rollupUglify } = rollupUglifyPackage;

const buildBundle = async options => {
    const result = await rollup({
        ...options.input,
        plugins: options.plugins
    });

    options.output = Array.isArray(options.output) ? options.output : [options.output];

    await Promise.all(options.output.map(output => result.write(output)));
};

(async root => {
    const bundles = [];

    // TODO: check why this is not red by default
    const babelConfigStream = await fs.readFile('./babel.config.json');
    const babelConfig = JSON.parse(babelConfigStream);

    ['amd', 'iife', 'system', 'es', 'cjs', 'umd'].forEach(type => [true, false].forEach(min => bundles.push({
        compact: min,
        sourcemap: true,
        format: type,
        name: 'ScrollPadlock',
        file: `${root}dist/${type}/scroll-padlock${ min ? '.min' : '' }.js`,
        exports: 'auto',
        plugins: (() => {
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

            return plugins;
        })()
    })));

    await buildBundle({
        input: {
            input: `${root}src/padlock.mjs`
        },

        output: bundles
    });
})('./');
