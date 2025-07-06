import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import pluginJsDoc from 'eslint-plugin-jsdoc';
import { flatConfigs as importsPluginConfigs } from 'eslint-plugin-import';
import globals from 'globals';
import rules from './eslint-rules.json' with { type: 'json' };

export default [
  {
    ignores: [
      'eslint.config.js',
      'node_modules/*',
      'dist/*',
      'coverage/*',
    ],
  },
  ...[
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ].map((conf) => ({
    ...conf,
    files: [
      '**/*.ts',
    ],
  })),
  {
    ...eslint.configs.recommended,
    ...tseslint.configs.disableTypeChecked,
    files: [
      '**/*.js',
      '**/*.mjs',
    ],
  },
  importsPluginConfigs.recommended,
  pluginJsDoc.configs['flat/recommended'],
  {
    plugins: {
      jsdoc: pluginJsDoc,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 13,
      sourceType: 'module',
    },
  },
  {
    rules,
  },
];
