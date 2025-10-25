import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: () => {
		const navigate = useNavigate();
		navigate({ to: '/' });
	},
});

function RootComponent() {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
}
