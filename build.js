import { dirname } from 'node:path';
import { rollup } from 'rollup';
import { createProgram } from 'typescript';
import rollupGzip from 'rollup-plugin-gzip';
import rollupTerser from '@rollup/plugin-terser';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const FOLDER_NAME_SRC = 'src';
const FOLDER_NAME_DIST = 'dist';
const FILE_NAME_MODULE = 'scroll-padlock';

const pathRoot = dirname(fileURLToPath(import.meta.url));

const fileContentJsDocTypes = await readFile(`${pathRoot}/${FOLDER_NAME_SRC}/types.js`, 'utf8');

const jsDocTypedefs = fileContentJsDocTypes.match(/\/\*\*[\s\S]*?@typedef[\s\S]*?\*\//g)?.reduce((acc, typedef) => {
  const match = typedef.match(/@typedef\s+(\w+)/);

  if (match) {
    acc[match[1]] = typedef;
  }

  return acc;
}, {});

const rollupResult = await rollup({
  input: `${pathRoot}/${FOLDER_NAME_SRC}/index.js`,

  plugins: [
    {
      transform: (code) => ({
        code: code.replace(
          /\/\*\*\s*@typedef\s*\{import\(['"].*['"]\)\.(\w+)\}\s*\1\s*\*\//g,
          (match, typeName) => jsDocTypedefs?.[typeName] || match,
        ),
        map: null,
      }),
    },
  ],
});

const moduleNameCamelCase = FILE_NAME_MODULE.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

await Promise.all([
  'es',

  'umd',
].reduce((tasks, format) => {
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
      name: moduleNameCamelCase,
      file: `${pathRoot}/${FOLDER_NAME_DIST}/${FILE_NAME_MODULE}${suffixes}.js`,
      plugins,
    }));
  }

  return tasks;
}, []));

const pathDtsFile = `${pathRoot}/${FOLDER_NAME_DIST}/${FILE_NAME_MODULE}.d.ts`;

createProgram([
  `${pathRoot}/${FOLDER_NAME_DIST}/${FILE_NAME_MODULE}.js`,
], {
  allowJs: true,
  declaration: true,
  emitDeclarationOnly: true,
  declarationMap: true,
  outFile: pathDtsFile,
  paths: {
    [FILE_NAME_MODULE]: [`${pathRoot}/${FOLDER_NAME_DIST}/${FILE_NAME_MODULE}.js`],
  },
}).emit();
