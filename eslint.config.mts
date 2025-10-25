import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default defineConfig([
	{
		ignores: ['.next/**', 'public/**', 'postcss.config.js', '.prettierrc.js', 'eslint.config.mts'],
	},
	{
		...js.configs.recommended,
		files: ['**/*.{js,ts,jsx,tsx}'],
	},
	{
		files: ['**/*.{js,ts,jsx,tsx,mts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				sourceType: 'module',
				ecmaVersion: 2020,
			},
		},
		settings: {
			react: {
				version: 'detect', // Автоматическое определение версии React
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			react: pluginReact,
			prettier: eslintPluginPrettier,
		},
		rules: {
			'linebreak-style': 'off',
			'no-console': 'warn', // Предупреждение при использовании console.log
			quotes: ['error', 'single'], // Требуем одинарные кавычки
			semi: ['error', 'always'], // Требуем точку с запятой
			'react/jsx-uses-react': 'off', // Отключаем необходимость импорта React в JSX
			'react/react-in-jsx-scope': 'off', // React не нужен в скоупе в новых версиях

			// Разрешаем использование @ts-ignore
			//"@typescript-eslint/ban-ts-comment": "off",

			// Другие правила для TypeScript
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'no-unused-vars': 'warn',
		},
	},
]);
