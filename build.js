import { resolve } from 'node:path';
import { rollup } from 'rollup';
import rollupGzip from 'rollup-plugin-gzip';
import rollupTerser from '@rollup/plugin-terser';

const pathRoot = resolve('.');

const formats = [
  'umd',

  'amd',

  'cjs',

  'iife',

  'es',

  'system',
];

const rollupResult = await rollup({
  input: `${pathRoot}/src/scroll-padlock.js`,
});

const tasks = [];

for (let formatIndex = 0, { length } = formats; formatIndex < length; formatIndex += 1) {
  const format = formats[formatIndex];

  const folder = `dist/${format}`;

  for (let versionIndex = 0; versionIndex < 2; versionIndex += 1) {
    const plugins = [];

    let suffixes = '';

    if (versionIndex % 2) {
      plugins.push(rollupTerser());

      suffixes += '.min';
    }

    plugins.push(rollupGzip());

    tasks.push(rollupResult.write({
      sourcemap: true,

      format,

      name: 'ScrollPadlock',

      file: `${pathRoot}/${folder}/scroll-padlock${suffixes}.js`,

      exports: 'default',

      plugins,
    }));
  }
}

await Promise.all(tasks);
