import { defineConfig } from 'rollup';
import rollupGzip from 'rollup-plugin-gzip';
import rollupTerser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default defineConfig([
  {
    input: 'src/set-style.ts',
    output: [
      {
        file: 'dist/scroll-padlock.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      rollupGzip(),
      rollupTerser(),
      typescript(),
    ],
  },

  {
    input: 'src/set-style.ts',
    output: {
      file: 'dist/scroll-padlock.umd.js',
      format: 'umd',
      name: 'scrollPadlock',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      rollupGzip(),
      rollupTerser(),
      typescript(),
    ],
  },
]);
