import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  globalIgnores([
    'dist',
  ]),
  {
    files: [
      '**/*.ts',
      '**/*.js',
    ],
    extends: [
      stylistic.configs.recommended,
      eslint.configs.recommended,
      tseslint.configs.recommended,
    ],
  },
])
