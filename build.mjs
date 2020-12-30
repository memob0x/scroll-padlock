import { rollup } from 'rollup';
import rollupBabel from '@rollup/plugin-babel';
import rollupGzip from 'rollup-plugin-gzip';

const babelPresets = ['@babel/preset-env'];
const babelPlugins = ['@babel/plugin-proposal-class-properties'];

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

    ['amd', 'iife', 'system', 'es', 'cjs', 'umd'].forEach(type => [true, false].forEach(min => bundles.push({
        compact: min,
        sourcemap: true,
        format: type,
        name: 'ScrollPadlock',
        file: `${root}dist/${type}/scroll-padlock${ min ? '.min' : '' }.js`,
        exports: 'auto',
        plugins: [
            rollupBabel.getBabelOutputPlugin({
                compact: min,
                comments: false,
                presets: babelPresets,
                plugins: babelPlugins,
                allowAllFormats: true
            }),
            
            rollupGzip()
        ]
    })));

    await buildBundle({
        input: {
            input: `${root}src/padlock.mjs`
        },

        output: bundles
    });
})('./');
