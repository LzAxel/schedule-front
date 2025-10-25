import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
	plugins: [
		tanstackRouter({
			target: 'react',
		}),
		react(),
	],
	build: {
		outDir: 'dist',
	},
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			'@': '/src',
		},
	},
});
