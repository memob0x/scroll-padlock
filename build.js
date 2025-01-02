import { dirname, resolve } from 'node:path';
import { rollup } from 'rollup';
import { createProgram } from 'typescript';
import rollupGzip from 'rollup-plugin-gzip';
import rollupTerser from '@rollup/plugin-terser';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const pathRoot = resolve('.');

const sourceFolder = 'src';

const distFolder = 'dist';

const moduleName = 'scroll-padlock';

const formats = [
  'umd',

  'es',
];

const rollupResult = await rollup({
  input: `${pathRoot}/${sourceFolder}/set-scroll-padlock-style.js`,
});

const tasks = [];

for (let formatIndex = 0, { length } = formats; formatIndex < length; formatIndex += 1) {
  const format = formats[formatIndex];

  for (let versionIndex = 0; versionIndex < 2; versionIndex += 1) {
    const plugins = [];

    let suffixes = '';

    if (format !== 'es') {
      suffixes += `.${format}`;
    }

    if (versionIndex % 2) {
      plugins.push(rollupTerser());

      suffixes += '.min';
    }

    plugins.push(rollupGzip());

    tasks.push(rollupResult.write({
      sourcemap: true,

      format,

      name: 'setScrollPadlockStyle',

      file: `${pathRoot}/${distFolder}/${moduleName}${suffixes}.js`,

      exports: 'default',

      plugins,
    }));
  }
}

await Promise.all(tasks);

createProgram([
  `${pathRoot}/${sourceFolder}/typedef.js`,

  `${pathRoot}/${distFolder}/${moduleName}.js`,
], {
  allowJs: true, // include JS files
  declaration: true, // generate .d.ts files
  emitDeclarationOnly: true, // only output declarations
  declarationMap: true, // create declaration maps
  outFile: `${pathRoot}/${distFolder}/${moduleName}.d.ts`, // output single .d.ts file
}).emit();

const dtsPath = resolve(
  dirname(fileURLToPath(import.meta.url)),

  `${pathRoot}/${distFolder}/${moduleName}.d.ts`,
);

const content = await readFile(dtsPath, 'utf-8');

const updatedContent = content.replace(
  new RegExp(`declare module "${distFolder}/${moduleName}"`, 'g'),

  `declare module "${moduleName}"`,
);

await writeFile(dtsPath, updatedContent, 'utf-8');
