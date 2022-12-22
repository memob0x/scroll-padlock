import { rollup } from 'rollup';
import { getBabelOutputPlugin as rollupBabel } from '@rollup/plugin-babel';
import rollupGzip from 'rollup-plugin-gzip';
import rollupTerser from '@rollup/plugin-terser';
import { resolve } from 'path';

const BUNDLES_PRESETS = [
  { format: 'amd' },
  { format: 'amd', babel: true },
  { format: 'amd', min: true },
  { format: 'amd', min: true, babel: true },

  { format: 'iife' },
  { format: 'iife', babel: true },
  { format: 'iife', min: true },
  { format: 'iife', min: true, babel: true },

  { format: 'system' },
  { format: 'system', babel: true },
  { format: 'system', min: true },
  { format: 'system', min: true, babel: true },

  { format: 'es' },
  { format: 'es', babel: true },
  { format: 'es', min: true },
  { format: 'es', min: true, babel: true },

  { format: 'cjs' },
  { format: 'cjs', babel: true },
  { format: 'cjs', min: true },
  { format: 'cjs', min: true, babel: true },

  { format: 'umd' },
  { format: 'umd', babel: true },
  { format: 'umd', min: true },
  { format: 'umd', min: true, babel: true },
];

const pathRoot = resolve('.');

(async () => {
  const rollupResult = await rollup({
    input: `${pathRoot}/src/padlock.js`,
  });

  return Promise.all(BUNDLES_PRESETS.reduce((accumulator, { format, min, babel }) => {
    const plugins = [];

    if (min) {
      plugins.push(rollupTerser());
    }

    if (babel) {
      plugins.push(rollupBabel({
        presets: [
          '@babel/preset-env',
        ],

        comments: false,

        allowAllFormats: true,
      }));
    }

    plugins.push(rollupGzip());

    accumulator.push(rollupResult.write({
      sourcemap: true,

      format,

      name: 'ScrollPadlock',

      file: `${pathRoot}/dist/${format}/scroll-padlock${min ? '.min' : ''}${babel ? '.babel' : ''}.js`,

      exports: 'default',

      plugins,
    }));

    return accumulator;
  }, []));
})();
