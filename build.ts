import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import flatDts from 'rollup-plugin-flat-dts';
import { dirname } from 'node:path';
import {
  rollup,
  ModuleFormat,
  Plugin,
  RollupOutput,
} from 'rollup';
import rollupGzip from 'rollup-plugin-gzip';
import rollupTerser from '@rollup/plugin-terser';
import { fileURLToPath } from 'node:url';

const pathRoot = dirname(fileURLToPath(import.meta.url));

const rollupResult = await rollup({
  input: `${pathRoot}/src/set-style.ts`,
  plugins: [
    typescript(),
    cleanup({ comments: 'none' }),
  ],
});

const formats: ModuleFormat[] = [
  'es',
  'umd',
];

await Promise.all(formats.reduce((outputs: Promise<RollupOutput>[], format: ModuleFormat) => {
  for (let versionIndex = 0; versionIndex < 2; versionIndex += 1) {
    const plugins: Plugin[] = [];

    let suffixes = '';

    if (format !== 'es') {
      suffixes += `.${format}`;
    }

    if (versionIndex % 2) {
      plugins.push(rollupTerser());

      suffixes += '.min';
    }

    plugins.push(flatDts(), rollupGzip());

    outputs.push(rollupResult.write({
      sourcemap: true,
      format,
      name: 'scrollPadlock',
      file: `${pathRoot}/dist/scroll-padlock${suffixes}.js`,
      plugins,
    }));
  }

  return outputs;
}, []));
