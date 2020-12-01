  /* eslint-disable no-dupe-keys */
  module.exports = {
    env: {
      es6: true,
      node: true,
      jest: true,

    },
    extends: ['airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      project: './tsconfig.json'
    },
    plugins: [
      'prettier',
      '@typescript-eslint',
      "import"
    ],
    rules: {
      'prettier/prettier': 'error',
      'class-methods-use-this': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'camelcase': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          '': 'never',
        },
      ],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        // use <root>/tsconfig.json
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it
          // doesn't contain any source code, like `@types/unist`
        },
      },
    },
  };
