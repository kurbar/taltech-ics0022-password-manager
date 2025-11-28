const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const vuePlugin = require('eslint-plugin-vue');
const vueParser = require('vue-eslint-parser');
const globals = require('globals');

module.exports = [
  // Ignore patterns first
  {
    ignores: [
      'node_modules/**',
      'out/**',
      '.vite/**',
      'dist/**',
      '*.config.js',
      '*.config.ts',
      '*.config.cjs',
      '*.config.mjs',
    ],
  },

  // Base JavaScript rules
  js.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Recommended TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-unused-vars': 'off', // TypeScript handles this
    },
  },

  // Vue files
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      // Vue 3 recommended rules
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/require-default-prop': 'off',
    },
  },
];
