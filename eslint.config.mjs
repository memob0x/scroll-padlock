import pluginJsDoc from 'eslint-plugin-jsdoc';
import { flatConfigs } from 'eslint-plugin-import';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/*',

      'dist/*',
    ],
  },

  flatConfigs.recommended,

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

    rules: {
      'jsdoc/no-undefined-types': 0,

      'jsdoc/check-indentation': 1,
      'jsdoc/check-line-alignment': 1,
      'jsdoc/check-template-names': 1,
      'jsdoc/check-syntax': 1,
      'jsdoc/informative-docs': 1,
      'jsdoc/match-description': 1,
      'jsdoc/no-bad-blocks': 1,
      'jsdoc/no-blank-block-descriptions': 1,
      'jsdoc/no-defaults': 1,
      'jsdoc/require-asterisk-prefix': 1,
      'jsdoc/require-description': 1,
      'jsdoc/require-description-complete-sentence': 1,
      'jsdoc/require-hyphen-before-param-description': 1,
      'jsdoc/require-template': 1,
      'jsdoc/require-throws': 1,
      'jsdoc/sort-tags': 1,

      // https://eslint.org/docs/rules/accessor-pairs
      'accessor-pairs': 'off',

      // https://eslint.org/docs/rules/array-callback-return
      'array-callback-return': ['error', { allowImplicit: true }],

      // https://eslint.org/docs/rules/block-scoped-var
      'block-scoped-var': 'error',

      // https://eslint.org/docs/rules/complexity
      complexity: ['off', 20],

      // https://eslint.org/docs/rules/class-methods-use-this
      'class-methods-use-this': ['error', {
        exceptMethods: [],
      }],

      // https://eslint.org/docs/rules/consistent-return
      'consistent-return': 'error',

      // https://eslint.org/docs/rules/curly
      curly: ['error', 'multi-line'], // multiline

      // https://eslint.org/docs/rules/default-case
      'default-case': ['error', { commentPattern: '^no default$' }],

      // https://eslint.org/docs/rules/default-case-last
      'default-case-last': 'error',

      // https://eslint.org/docs/rules/default-param-last
      'default-param-last': 'error',

      // https://eslint.org/docs/rules/dot-notation
      'dot-notation': ['error', { allowKeywords: true }],

      // https://eslint.org/docs/rules/dot-location
      'dot-location': ['error', 'property'],

      // https://eslint.org/docs/rules/eqeqeq
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // https://eslint.org/docs/rules/grouped-accessor-pairs
      'grouped-accessor-pairs': 'error',

      // https://eslint.org/docs/rules/guard-for-in
      'guard-for-in': 'error',

      // https://eslint.org/docs/rules/max-classes-per-file
      'max-classes-per-file': ['error', 1],

      // https://eslint.org/docs/rules/no-alert
      'no-alert': 'warn',

      // https://eslint.org/docs/rules/no-caller
      'no-caller': 'error',

      // https://eslint.org/docs/rules/no-case-declarations
      'no-case-declarations': 'error',

      // https://eslint.org/docs/rules/no-constructor-return
      'no-constructor-return': 'error',

      // https://eslint.org/docs/rules/no-div-regex
      'no-div-regex': 'off',

      // https://eslint.org/docs/rules/no-else-return
      'no-else-return': ['error', { allowElseIf: false }],

      // https://eslint.org/docs/rules/no-empty-function
      'no-empty-function': ['error', {
        allow: [
          'arrowFunctions',
          'functions',
          'methods',
        ],
      }],

      // https://eslint.org/docs/rules/no-empty-pattern
      'no-empty-pattern': 'error',

      // https://eslint.org/docs/rules/no-eq-null
      'no-eq-null': 'off',

      // https://eslint.org/docs/rules/no-eval
      'no-eval': 'error',

      // https://eslint.org/docs/rules/no-extend-native
      'no-extend-native': 'error',

      // https://eslint.org/docs/rules/no-extra-bind
      'no-extra-bind': 'error',

      // https://eslint.org/docs/rules/no-extra-label
      'no-extra-label': 'error',

      // https://eslint.org/docs/rules/no-fallthrough
      'no-fallthrough': 'error',

      // https://eslint.org/docs/rules/no-floating-decimal
      'no-floating-decimal': 'error',

      // https://eslint.org/docs/rules/no-global-assign
      'no-global-assign': ['error', { exceptions: [] }],

      // https://eslint.org/docs/rules/no-native-reassign
      'no-native-reassign': 'off',

      // https://eslint.org/docs/rules/no-implicit-coercion
      'no-implicit-coercion': ['off', {
        boolean: false,
        number: true,
        string: true,
        allow: [],
      }],

      // https://eslint.org/docs/rules/no-implicit-globals
      'no-implicit-globals': 'off',

      // https://eslint.org/docs/rules/no-implied-eval
      'no-implied-eval': 'error',

      // https://eslint.org/docs/rules/no-invalid-this
      'no-invalid-this': 'off',

      // https://eslint.org/docs/rules/no-iterator
      'no-iterator': 'error',

      // https://eslint.org/docs/rules/no-labels
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],

      // https://eslint.org/docs/rules/no-lone-blocks
      'no-lone-blocks': 'error',

      // https://eslint.org/docs/rules/no-loop-func
      'no-loop-func': 'error',

      // https://eslint.org/docs/rules/no-magic-numbers
      'no-magic-numbers': ['off', {
        ignore: [],
        ignoreArrayIndexes: true,
        enforceConst: true,
        detectObjects: false,
      }],

      // https://eslint.org/docs/rules/no-multi-spaces
      'no-multi-spaces': ['error', {
        ignoreEOLComments: false,
      }],

      // https://eslint.org/docs/rules/no-multi-str
      'no-multi-str': 'error',

      // https://eslint.org/docs/rules/no-new
      'no-new': 'error',

      // https://eslint.org/docs/rules/no-new-func
      'no-new-func': 'error',

      // https://eslint.org/docs/rules/no-new-wrappers
      'no-new-wrappers': 'error',

      // https://eslint.org/docs/rules/no-nonoctal-decimal-escape
      'no-nonoctal-decimal-escape': 'error',

      // https://eslint.org/docs/rules/no-octal
      'no-octal': 'error',

      // https://eslint.org/docs/rules/no-octal-escape
      'no-octal-escape': 'error',

      // rule: https://eslint.org/docs/rules/no-param-reassign.html
      'no-param-reassign': ['error', {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // for reduce accumulators
          'accumulator', // for reduce accumulators
          'e', // for e.returnvalue
          'ctx', // for Koa routing
          'context', // for Koa routing
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          '$scope', // for Angular 1 scopes
          'staticContext', // for ReactRouter context
        ],
      }],

      // https://eslint.org/docs/rules/no-proto
      'no-proto': 'error',

      // https://eslint.org/docs/rules/no-redeclare
      'no-redeclare': 'error',

      // https://eslint.org/docs/rules/no-restricted-properties
      'no-restricted-properties': ['error', {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated',
      }, {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      }, {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      }, {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      }, {
        object: 'global',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      }, {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      }, {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      }, {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.',
      }, {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.',
      }, {
        object: 'Math',
        property: 'pow',
        message: 'Use the exponentiation operator (**) instead.',
      }],

      // https://eslint.org/docs/rules/no-return-assign
      'no-return-assign': ['error', 'always'],

      // https://eslint.org/docs/rules/no-return-await
      'no-return-await': 'error',

      // https://eslint.org/docs/rules/no-script-url
      'no-script-url': 'error',

      // https://eslint.org/docs/rules/no-self-assign
      'no-self-assign': ['error', {
        props: true,
      }],

      // https://eslint.org/docs/rules/no-self-compare
      'no-self-compare': 'error',

      // https://eslint.org/docs/rules/no-sequences
      'no-sequences': 'error',

      // https://eslint.org/docs/rules/no-throw-literal
      'no-throw-literal': 'error',

      // https://eslint.org/docs/rules/no-unmodified-loop-condition
      'no-unmodified-loop-condition': 'off',

      // https://eslint.org/docs/rules/no-unused-expressions
      'no-unused-expressions': ['error', {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      }],

      // https://eslint.org/docs/rules/no-unused-labels
      'no-unused-labels': 'error',

      // https://eslint.org/docs/rules/no-useless-call
      'no-useless-call': 'off',

      // https://eslint.org/docs/rules/no-useless-catch
      'no-useless-catch': 'error',

      // https://eslint.org/docs/rules/no-useless-concat
      'no-useless-concat': 'error',

      // https://eslint.org/docs/rules/no-useless-escape
      'no-useless-escape': 'error',

      // https://eslint.org/docs/rules/no-useless-return
      'no-useless-return': 'error',

      // https://eslint.org/docs/rules/no-void
      'no-void': 'error',

      // https://eslint.org/docs/rules/no-warning-comments
      'no-warning-comments': ['off', { terms: ['todo', 'fixme', 'xxx'], location: 'start' }],

      // https://eslint.org/docs/rules/no-with
      'no-with': 'error',

      // https://eslint.org/docs/rules/prefer-promise-reject-errors
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

      // https://eslint.org/docs/rules/prefer-named-capture-group
      'prefer-named-capture-group': 'off',

      'prefer-regex-literals': ['error', {
        disallowRedundantWrapping: true,
      }],

      // https://eslint.org/docs/rules/radix
      radix: 'error',

      // https://eslint.org/docs/rules/require-await
      'require-await': 'off',

      // https://eslint.org/docs/rules/require-unicode-regexp
      'require-unicode-regexp': 'off',

      // https://eslint.org/docs/rules/vars-on-top
      'vars-on-top': 'error',

      // https://eslint.org/docs/rules/wrap-iife.html
      'wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],

      // https://eslint.org/docs/rules/yoda
      yoda: 'error',

      // https://eslint.org/docs/rules/for-direction
      'for-direction': 'error',

      // https://eslint.org/docs/rules/getter-return
      'getter-return': ['error', { allowImplicit: true }],

      // https://eslint.org/docs/rules/no-async-promise-executor
      'no-async-promise-executor': 'error',

      // https://eslint.org/docs/rules/no-await-in-loop
      'no-await-in-loop': 'error',

      // https://eslint.org/docs/rules/no-compare-neg-zero
      'no-compare-neg-zero': 'error',

      'no-cond-assign': ['error', 'always'],
      'no-console': 'warn',
      'no-constant-condition': 'warn',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',

      // https://eslint.org/docs/rules/no-dupe-else-if
      'no-dupe-else-if': 'error',

      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',

      // https://eslint.org/docs/rules/no-extra-boolean-cast
      'no-extra-boolean-cast': 'error',

      // https://eslint.org/docs/rules/no-extra-parens
      'no-extra-parens': ['off', 'all', {
        conditionalAssign: true,
        nestedBinaryExpressions: false,
        returnAssign: false,
        ignoreJSX: 'all', // delegate to eslint-plugin-react
        enforceForArrowConditionals: false,
      }],

      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-import-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',

      // https://eslint.org/docs/rules/no-loss-of-precision
      'no-loss-of-precision': 'error',

      // https://eslint.org/docs/rules/no-misleading-character-class
      'no-misleading-character-class': 'error',

      'no-obj-calls': 'error',

      // Disallow returning values from Promise executor functions
      'no-promise-executor-return': 'error',

      // https://eslint.org/docs/rules/no-prototype-builtins
      'no-prototype-builtins': 'error',

      'no-regex-spaces': 'error',

      // https://eslint.org/docs/rules/no-setter-return
      'no-setter-return': 'error',

      'no-sparse-arrays': 'error',

      // https://eslint.org/docs/rules/no-template-curly-in-string
      'no-template-curly-in-string': 'error',

      // https://eslint.org/docs/rules/no-unexpected-multiline
      'no-unexpected-multiline': 'error',

      'no-unreachable': 'error',

      // https://eslint.org/docs/rules/no-unreachable-loop
      'no-unreachable-loop': ['error', {
        ignore: [], // WhileStatement, DoWhileStatement,
        // ForStatement, ForInStatement, ForOfStatement
      }],

      // https://eslint.org/docs/rules/no-unsafe-finally
      'no-unsafe-finally': 'error',

      // disallow negating the left operand of relational operators
      // https://eslint.org/docs/rules/no-unsafe-negation
      'no-unsafe-negation': 'error',

      // https://eslint.org/docs/rules/no-unsafe-optional-chaining
      'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],

      // https://eslint.org/docs/rules/no-unused-private-class-members
      'no-unused-private-class-members': 1,

      // https://eslint.org/docs/rules/no-useless-backreference
      'no-useless-backreference': 'error',

      'no-negated-in-lhs': 'off',

      // https://eslint.org/docs/rules/require-atomic-updates
      // TODO: configure
      'require-atomic-updates': 'off',

      // disallow comparisons with the value NaN
      'use-isnan': 'error',

      // https://eslint.org/docs/rules/valid-jsdoc
      'valid-jsdoc': 'off',

      // https://eslint.org/docs/rules/valid-typeof
      'valid-typeof': ['error', { requireStringLiterals: true }],

      // https://eslint.org/docs/rules/arrow-body-style
      // TODO: configure
      'arrow-body-style': ['error', 'as-needed', {
        requireReturnForObjectLiteral: false,
      }],

      // https://eslint.org/docs/rules/arrow-parens
      'arrow-parens': ['error', 'always'],

      // https://eslint.org/docs/rules/arrow-spacing
      'arrow-spacing': ['error', { before: true, after: true }],

      'constructor-super': 'error',

      // https://eslint.org/docs/rules/generator-star-spacing
      'generator-star-spacing': ['error', { before: false, after: true }],

      // https://eslint.org/docs/rules/no-class-assign
      'no-class-assign': 'error',

      // https://eslint.org/docs/rules/no-confusing-arrow
      'no-confusing-arrow': ['error', {
        allowParens: true,
      }],

      'no-const-assign': 'error',

      // https://eslint.org/docs/rules/no-dupe-class-members
      'no-dupe-class-members': 'error',

      // https://eslint.org/docs/rules/no-duplicate-imports
      'no-duplicate-imports': 'off',

      // https://eslint.org/docs/rules/no-new-symbol
      'no-new-symbol': 'error',

      // https://eslint.org/docs/rules/no-restricted-exports
      'no-restricted-exports': ['error', {
        restrictedNamedExports: [
          'default', // use `export default` to provide a default export
          'then', // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
        ],
      }],

      // https://eslint.org/docs/rules/no-restricted-imports
      'no-restricted-imports': ['off', {
        paths: [],
        patterns: [],
      }],

      // https://eslint.org/docs/rules/no-this-before-super
      'no-this-before-super': 'error',

      // https://eslint.org/docs/rules/no-useless-computed-key
      'no-useless-computed-key': 'error',

      // https://eslint.org/docs/rules/no-useless-constructor
      'no-useless-constructor': 'error',

      // https://eslint.org/docs/rules/no-useless-rename
      'no-useless-rename': ['error', {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      }],

      'no-var': 'error',

      // https://eslint.org/docs/rules/object-shorthand
      'object-shorthand': ['error', 'always', {
        ignoreConstructors: false,
        avoidQuotes: true,
      }],

      'prefer-arrow-callback': ['error', {
        allowNamedFunctions: false,
        allowUnboundThis: true,
      }],
      'prefer-const': ['error', {
        destructuring: 'any',
        ignoreReadBeforeAssign: true,
      }],

      // https://eslint.org/docs/rules/prefer-destructuring
      'prefer-destructuring': ['error', {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      }, {
        enforceForRenamedProperties: false,
      }],

      // https://eslint.org/docs/rules/prefer-numeric-literals
      'prefer-numeric-literals': 'error',

      // https://eslint.org/docs/rules/prefer-reflect
      'prefer-reflect': 'off',

      // https://eslint.org/docs/rules/prefer-rest-params
      'prefer-rest-params': 'error',

      // https://eslint.org/docs/rules/prefer-spread
      'prefer-spread': 'error',

      // https://eslint.org/docs/rules/prefer-template
      'prefer-template': 'error',

      // https://eslint.org/docs/rules/require-yield
      'require-yield': 'error',

      // https://eslint.org/docs/rules/rest-spread-spacing
      'rest-spread-spacing': ['error', 'never'],

      // https://eslint.org/docs/rules/sort-imports
      'sort-imports': ['off', {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      }],

      // https://eslint.org/docs/rules/symbol-description
      'symbol-description': 'error',

      // https://eslint.org/docs/rules/template-curly-spacing
      'template-curly-spacing': 'error',

      // https://eslint.org/docs/rules/yield-star-spacing
      'yield-star-spacing': ['error', 'after'],

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
      'import/no-unresolved': ['error', { commonjs: true, caseSensitive: true }],

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/named.md#when-not-to-use-it
      'import/named': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/default.md#when-not-to-use-it
      'import/default': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/namespace.md
      'import/namespace': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/export.md
      'import/export': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
      'import/no-named-as-default': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
      'import/no-named-as-default-member': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md
      'import/no-deprecated': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
      // TODO: configure
      // 'import/no-extraneous-dependencies': ['error', {
      //   devDependencies: [
      //     'test/**', // tape, common npm pattern
      //     'tests/**', // also common npm pattern
      //     'spec/**', // mocha, rspec-like pattern
      //     '**/__tests__/**', // jest pattern
      //     '**/__mocks__/**', // jest pattern
      //     'test.{js,jsx}', // repos with a single test file
      //     'test-*.{js,jsx}', // repos with multiple top-level test files
      //     '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension
      //     // or filename suffix denotes that it is a test
      //     '**/jest.config.js', // jest config
      //     '**/jest.setup.js', // jest setup
      //     '**/vue.config.js', // vue-cli config
      //     '**/webpack.config.js', // webpack config
      //     '**/webpack.config.*.js', // webpack config
      //     '**/rollup.config.js', // rollup config
      //     '**/rollup.config.*.js', // rollup config
      //     '**/gulpfile.js', // gulp config
      //     '**/gulpfile.*.js', // gulp config
      //     '**/Gruntfile{,.js}', // grunt config
      //     '**/protractor.conf.js', // protractor config
      //     '**/protractor.conf.*.js', // protractor config
      //     '**/karma.conf.js', // karma config
      //     '**/.eslintrc.js', // eslint config
      //   ],
      //   optionalDependencies: false,
      // }],

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md
      'import/no-mutable-exports': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-commonjs.md
      'import/no-commonjs': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-amd.md
      'import/no-amd': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-nodejs-modules.md
      'import/no-nodejs-modules': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
      'import/first': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/imports-first.md
      'import/imports-first': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
      'import/no-duplicates': 'error',

      // TODO: configure
      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-namespace.md
      'import/no-namespace': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
      // TODO: configure
      // 'import/extensions': ['error', 'ignorePackages', {
      //   js: 'never',
      //    mjs: 'never',
      //   jsx: 'never',
      //  }],

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
      'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
      'import/newline-after-import': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
      'import/prefer-default-export': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-restricted-paths.md
      'import/no-restricted-paths': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/max-dependencies.md
      'import/max-dependencies': ['off', { max: 10 }],

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-absolute-path.md
      'import/no-absolute-path': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
      'import/no-dynamic-require': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-internal-modules.md
      'import/no-internal-modules': ['off', {
        allow: [],
      }],

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/unambiguous.md
      'import/unambiguous': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
      'import/no-webpack-loader-syntax': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unassigned-import.md
      'import/no-unassigned-import': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-default.md
      'import/no-named-default': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/d9b712ac7fd1fddc391f7b234827925c160d956f/docs/rules/no-anonymous-default-export.md
      'import/no-anonymous-default-export': ['off', {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowLiteral: false,
        allowObject: false,
      }],

      // https://github.com/benmosher/eslint-plugin-import/blob/98acd6afd04dcb6920b81330114e146dc8532ea4/docs/rules/exports-last.md
      // TODO: configure
      'import/exports-last': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/group-exports.md
      'import/group-exports': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/no-default-export.md
      'import/no-default-export': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/1ec80fa35fa1819e2d35a70e68fb6a149fb57c5e/docs/rules/no-named-export.md
      'import/no-named-export': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/no-self-import.md
      'import/no-self-import': 'error',

      // https://github.com/benmosher/eslint-plugin-import/blob/d81f48a2506182738409805f5272eff4d77c9348/docs/rules/no-cycle.md
      'import/no-cycle': ['error', { maxDepth: '∞' }],

      // https://github.com/benmosher/eslint-plugin-import/blob/ebafcbf59ec9f653b2ac2a0156ca3bcba0a7cf57/docs/rules/no-useless-path-segments.md
      'import/no-useless-path-segments': ['error', { commonjs: true }],

      // https://github.com/benmosher/eslint-plugin-import/blob/ebafcbf59ec9f653b2ac2a0156ca3bcba0a7cf57/docs/rules/dynamic-import-chunkname.md
      'import/dynamic-import-chunkname': ['off', {
        importFunctions: [],
        webpackChunknameFormat: '[0-9a-zA-Z-_/.]+',
      }],

      // https://github.com/benmosher/eslint-plugin-import/blob/c34f14f67f077acd5a61b3da9c0b0de298d20059/docs/rules/no-relative-parent-imports.md
      'import/no-relative-parent-imports': 'off',

      // https://github.com/benmosher/eslint-plugin-import/blob/f63dd261809de6883b13b6b5b960e6d7f42a7813/docs/rules/no-unused-modules.md
      // TODO: configure
      'import/no-unused-modules': ['off', {
        ignoreExports: [],
        missingExports: true,
        unusedExports: true,
      }],

      // https://github.com/benmosher/eslint-plugin-import/blob/1012eb951767279ce3b540a4ec4f29236104bb5b/docs/rules/no-import-module-exports.md
      'import/no-import-module-exports': ['error', {
        exceptions: [],
      }],

      // https://github.com/benmosher/eslint-plugin-import/blob/1012eb951767279ce3b540a4ec4f29236104bb5b/docs/rules/no-relative-packages.md
      'import/no-relative-packages': 'error',

      'callback-return': 'off',

      // https://eslint.org/docs/rules/global-require
      'global-require': 'error',

      'handle-callback-err': 'off',

      // https://eslint.org/docs/rules/no-buffer-constructor
      'no-buffer-constructor': 'error',

      'no-mixed-requires': ['off', false],
      'no-new-require': 'error',

      // https://eslint.org/docs/rules/no-path-concat
      'no-path-concat': 'error',
      'no-process-env': 'off',
      'no-process-exit': 'off',
      'no-restricted-modules': 'off',
      'no-sync': 'off',
      strict: ['error', 'never'],

      // https://eslint.org/docs/rules/array-bracket-newline
      // TODO: configure
      'array-bracket-newline': ['off', 'consistent'], // object option alternative: { multiline: true, minItems: 3 }

      // https://eslint.org/docs/rules/array-element-newline
      // TODO: configure
      'array-element-newline': ['off', { multiline: true, minItems: 3 }],

      'array-bracket-spacing': ['error', 'never'],

      // https://eslint.org/docs/rules/block-spacing
      'block-spacing': ['error', 'always'],

      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],

      // https://eslint.org/docs/rules/capitalized-comments
      'capitalized-comments': ['off', 'never', {
        line: {
          ignorePattern: '.*',
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
        block: {
          ignorePattern: '.*',
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
      }],

      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      }],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last', {
        exceptions: {
          ArrayExpression: false,
          ArrayPattern: false,
          ArrowFunctionExpression: false,
          CallExpression: false,
          FunctionDeclaration: false,
          FunctionExpression: false,
          ImportDeclaration: false,
          ObjectExpression: false,
          ObjectPattern: false,
          VariableDeclaration: false,
          NewExpression: false,
        },
      }],
      'computed-property-spacing': ['error', 'never'],
      'consistent-this': 'off',
      'eol-last': ['error', 'always'],

      // https://eslint.org/docs/rules/function-call-argument-newline
      'function-call-argument-newline': ['error', 'consistent'],

      // https://eslint.org/docs/rules/func-call-spacing
      'func-call-spacing': ['error', 'never'],

      // https://eslint.org/docs/rules/func-name-matching
      'func-name-matching': ['off', 'always', {
        includeCommonJSModuleExports: false,
        considerPropertyDescriptor: true,
      }],

      // https://eslint.org/docs/rules/func-names
      'func-names': 'warn',

      // https://eslint.org/docs/rules/func-style
      // TODO: configure
      'func-style': ['off', 'expression'],

      // https://eslint.org/docs/rules/function-paren-newline
      'function-paren-newline': ['error', /* semver.satisfies(eslintPkg.version, '>= 6') ? */'multiline-arguments'],

      // https://eslint.org/docs/rules/id-denylist
      'id-denylist': 'off',

      'id-length': 'off',
      'id-match': 'off',

      // https://eslint.org/docs/rules/implicit-arrow-linebreak
      'implicit-arrow-linebreak': ['error', 'beside'],

      // https://eslint.org/docs/rules/indent
      indent: ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        // MemberExpression: null,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
        ignoredNodes: [
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
        ],
        ignoreComments: false,
      }],

      // https://eslint.org/docs/rules/jsx-quotes
      'jsx-quotes': ['off', 'prefer-double'],

      'key-spacing': ['error', { beforeColon: false, afterColon: true }],

      'keyword-spacing': ['error', {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      }],

      // https://eslint.org/docs/rules/line-comment-position
      // TODO: configure
      'line-comment-position': ['off', {
        position: 'above',
        ignorePattern: '',
        applyDefaultPatterns: true,
      }],

      // https://eslint.org/docs/rules/linebreak-style
      'linebreak-style': ['error', 'unix'],

      // https://eslint.org/docs/rules/lines-between-class-members
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],

      'lines-around-comment': 'off',

      // https://eslint.org/docs/rules/lines-around-directive
      'lines-around-directive': ['error', {
        before: 'always',
        after: 'always',
      }],

      'max-depth': ['off', 4],

      // https://eslint.org/docs/rules/max-len
      'max-len': ['error', 100, 2, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],

      // https://eslint.org/docs/rules/max-lines
      'max-lines': ['off', {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      }],

      // https://eslint.org/docs/rules/max-lines-per-function
      'max-lines-per-function': ['off', {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      }],

      'max-nested-callbacks': 'off',
      'max-params': ['off', 3],
      'max-statements': ['off', 10],

      // https://eslint.org/docs/rules/max-statements-per-line
      'max-statements-per-line': ['off', { max: 1 }],

      // https://eslint.org/docs/rules/multiline-comment-style
      'multiline-comment-style': ['off', 'starred-block'],

      // https://eslint.org/docs/rules/multiline-ternary
      // TODO: configure
      'multiline-ternary': ['off', 'never'],

      'new-cap': ['error', {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
      }],

      // https://eslint.org/docs/rules/new-parens
      'new-parens': 'error',

      'newline-after-var': 'off',

      // https://eslint.org/docs/rules/newline-before-return
      'newline-before-return': 'off',

      // https://eslint.org/docs/rules/newline-per-chained-call
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],

      'no-array-constructor': 'error',

      // https://eslint.org/docs/rules/no-bitwise
      'no-bitwise': 'error',

      // https://eslint.org/docs/rules/no-continue
      'no-continue': 'error',

      'no-inline-comments': 'off',

      // disallow if as the only statement in an else block
      'no-lonely-if': 'error',

      // https://eslint.org/docs/rules/no-mixed-operators
      'no-mixed-operators': ['error', {
        groups: [
          ['%', '**'],
          ['%', '+'],
          ['%', '-'],
          ['%', '*'],
          ['%', '/'],
          ['/', '*'],
          ['&', '|', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!=='],
          ['&&', '||'],
        ],
        allowSamePrecedence: false,
      }],

      'no-mixed-spaces-and-tabs': 'error',

      // https://eslint.org/docs/rules/no-multi-assign
      'no-multi-assign': ['error'],

      // https://eslint.org/docs/rules/no-multiple-empty-lines
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],

      // https://eslint.org/docs/rules/no-negated-condition
      'no-negated-condition': 'off',

      'no-nested-ternary': 'error',
      'no-new-object': 'error',

      // https://eslint.org/docs/rules/no-plusplus
      'no-plusplus': 'error',

      // https://eslint.org/docs/rules/no-restricted-syntax
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'ForOfStatement',
          message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],

      'no-spaced-func': 'error',
      'no-tabs': 'error',
      'no-ternary': 'off',

      'no-trailing-spaces': ['error', {
        skipBlankLines: false,
        ignoreComments: false,
      }],

      // https://eslint.org/docs/rules/no-underscore-dangle
      'no-underscore-dangle': ['error', {
        allow: [],
        allowAfterThis: false,
        allowAfterSuper: false,
        enforceInMethodNames: true,
      }],

      // https://eslint.org/docs/rules/no-unneeded-ternary
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],

      // https://eslint.org/docs/rules/no-whitespace-before-property
      'no-whitespace-before-property': 'error',

      // https://eslint.org/docs/rules/nonblock-statement-body-position
      'nonblock-statement-body-position': ['error', 'beside', { overrides: {} }],

      'object-curly-spacing': ['error', 'always'],

      // https://eslint.org/docs/rules/object-curly-newline
      'object-curly-newline': ['error', {
        ObjectExpression: { minProperties: 4, multiline: true, consistent: true },
        ObjectPattern: { minProperties: 4, multiline: true, consistent: true },
        ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
        ExportDeclaration: { minProperties: 4, multiline: true, consistent: true },
      }],

      // https://eslint.org/docs/rules/object-property-newline
      'object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: true,
      }],

      'one-var': ['error', 'never'],

      // https://eslint.org/docs/rules/one-var-declaration-per-line
      'one-var-declaration-per-line': ['error', 'always'],

      // https://eslint.org/docs/rules/operator-assignment
      'operator-assignment': ['error', 'always'],

      // https://eslint.org/docs/rules/operator-linebreak
      'operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],

      'padded-blocks': ['error', {
        blocks: 'never',
        classes: 'never',
        switches: 'never',
      }, {
        allowSingleLineBlocks: true,
      }],

      // https://eslint.org/docs/rules/padding-line-between-statements
      'padding-line-between-statements': 'off',

      // https://eslint.org/docs/rules/prefer-exponentiation-operator
      'prefer-exponentiation-operator': 'error',

      // https://eslint.org/docs/rules/prefer-object-spread
      'prefer-object-spread': 'error',

      // https://eslint.org/docs/rules/quote-props.html
      'quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

      quotes: ['error', 'single', { avoidEscape: true }],

      // https://eslint.org/docs/rules/require-jsdoc
      'require-jsdoc': 'off',

      semi: ['error', 'always'],
      'semi-spacing': ['error', { before: false, after: true }],

      // https://eslint.org/docs/rules/semi-style
      'semi-style': ['error', 'last'],
      'sort-keys': ['off', 'asc', { caseSensitive: false, natural: true }],
      'sort-vars': 'off',
      'space-before-blocks': 'error',

      // https://eslint.org/docs/rules/space-before-function-paren
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],

      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',

      // https://eslint.org/docs/rules/space-unary-ops
      'space-unary-ops': ['error', {
        words: true,
        nonwords: false,
        overrides: {
        },
      }],

      // https://eslint.org/docs/rules/spaced-comment
      'spaced-comment': ['error', 'always', {
        line: {
          exceptions: ['-', '+'],
          markers: ['=', '!', '/'], // space here to support sprockets directives, slash for TS /// comments
        },
        block: {
          exceptions: ['-', '+'],
          markers: ['=', '!', ':', '::'], // space here to support sprockets directives and flow comment types
          balanced: true,
        },
      }],

      // https://eslint.org/docs/rules/switch-colon-spacing
      'switch-colon-spacing': ['error', { after: true, before: false }],

      // https://eslint.org/docs/rules/template-tag-spacing
      'template-tag-spacing': ['error', 'never'],

      // https://eslint.org/docs/rules/unicode-bom
      'unicode-bom': ['error', 'never'],
      'wrap-regex': 'off',
      'init-declarations': 'off',
      'no-catch-shadow': 'off',
      'no-delete-var': 'error',

      // https://eslint.org/docs/rules/no-label-var
      'no-label-var': 'error',

      'no-restricted-globals': [
        'error',
        {
          name: 'isFinite',
          message:
            'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
        },
        {
          name: 'isNaN',
          message:
            'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
        },
      ].concat(
        'addEventListener',
        'blur',
        'close',
        'closed',
        'confirm',
        'defaultStatus',
        'defaultstatus',
        'event',
        'external',
        'find',
        'focus',
        'frameElement',
        'frames',
        'history',
        'innerHeight',
        'innerWidth',
        'length',
        'location',
        'locationbar',
        'menubar',
        'moveBy',
        'moveTo',
        'name',
        'onblur',
        'onerror',
        'onfocus',
        'onload',
        'onresize',
        'onunload',
        'open',
        'opener',
        'opera',
        'outerHeight',
        'outerWidth',
        'pageXOffset',
        'pageYOffset',
        'parent',
        'print',
        'removeEventListener',
        'resizeBy',
        'resizeTo',
        'screen',
        'screenLeft',
        'screenTop',
        'screenX',
        'screenY',
        'scroll',
        'scrollbars',
        'scrollBy',
        'scrollTo',
        'scrollX',
        'scrollY',
        'self',
        'status',
        'statusbar',
        'stop',
        'toolbar',
        'top',
      ),

      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',

      // https://eslint.org/docs/rules/no-undefined
      // TODO: configure
      'no-undefined': 'off',

      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
      'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
    },
  },
];
