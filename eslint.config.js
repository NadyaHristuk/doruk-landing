import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import unicorn from 'eslint-plugin-unicorn';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'public', 'doruk', 'sourse', 'node_modules'] },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      unicorn: unicorn
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      // Filenames: Components PascalCase, hooks camelCase; allow both here
      'unicorn/filename-case': [
        'error',
        { cases: { pascalCase: true, camelCase: true } }
      ]
    }
  },
  // Enforce kebab-case for asset files
  {
    files: ['src/assets/**'],
    rules: {
      'unicorn/filename-case': ['error', { cases: { kebabCase: true } }]
    }
  }
];
