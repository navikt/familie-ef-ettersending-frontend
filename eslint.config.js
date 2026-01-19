import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      react: react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
