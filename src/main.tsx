import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { LocalSettingsProvider } from '@/store/localSettingsStore';
import './index.css';

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	scrollRestoration: true,
	notFoundMode: 'fuzzy',
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<LocalSettingsProvider>
			<RouterProvider router={router} />
		</LocalSettingsProvider>,
	);
}
