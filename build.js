import { dirname, resolve } from 'node:path';
import { rollup } from 'rollup';
import { createProgram } from 'typescript';
import rollupGzip from 'rollup-plugin-gzip';
import rollupTerser from '@rollup/plugin-terser';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

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
  input: `${pathRoot}/src/set-scroll-padlock-style.js`,
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

      name: 'setScrollPadlockStyle',

      file: `${pathRoot}/${folder}/scroll-padlock${suffixes}.js`,

      exports: 'default',

      plugins,
    }));
  }
}

await Promise.all(tasks);

createProgram([
  'src/typedef.js',

  'dist/es/scroll-padlock.js',
], {
  allowJs: true, // include JS files
  declaration: true, // generate .d.ts files
  emitDeclarationOnly: true, // only output declarations
  declarationMap: true, // create declaration maps
  outFile: 'dist/scroll-padlock.d.ts', // output single .d.ts file
}).emit();

const dtsPath = resolve(
  dirname(fileURLToPath(import.meta.url)),

  'dist/scroll-padlock.d.ts',
);

const content = await readFile(dtsPath, 'utf-8');

const updatedContent = content.replace(
  /declare module "dist\/es\/scroll-padlock"/g,

  'declare module "scroll-padlock"',
);

await writeFile(dtsPath, updatedContent, 'utf-8');
