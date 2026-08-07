import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

const ignorePatterns = ['build', '__test__'];

const ignoreUnusedVars = {
  argsIgnorePattern: '^_',
  varsIgnorePattern: '^_',
  destructuredArrayIgnorePattern: '^_',
  caughtErrorsIgnorePattern: '^_'
};

export const getRules = (newRules = {}) => ({
  indent: ['error', 2, {
    'SwitchCase': 1,
  }],
  'linebreak-style': ['error', 'unix'],
  quotes: ['error', 'single'],
  semi: ['error', 'always'],
  'no-console': 'warn',
  'arrow-body-style': ['error', 'as-needed'],
  'no-unused-vars': ['error', ignoreUnusedVars],
  'prefer-const': 'error',
  'arrow-parens': ['error', 'always'],
  'comma-dangle': ['error', 'always-multiline'],
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],
  'no-multiple-empty-lines': ['error', { max: 1 }],
  'max-len': ['error', { code: 100 }],
  ...newRules,
});

const settings = {
  'import/resolver': {
    typescript: {
      project: './tsconfig.json',
    },
  },
};

export const getPlugins = (plugins = {}) => ({
  '@typescript-eslint': tsPlugin,
  ...plugins,
});


export const getFiles = (files = []) => ['**/*.ts', ...files];

export default [
  {
    files: getFiles(),
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: getPlugins(),
    rules: getRules(),
    settings,
    ignores: ignorePatterns,
  },
];

