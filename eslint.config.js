import reactHooks from 'eslint-plugin-react-hooks';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
    },
    {
        plugins: { 'react-hooks': reactHooks },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react/no-unescaped-entities': 'off',
            '@typescript-eslint/no-unused-expressions': 'off'
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
);