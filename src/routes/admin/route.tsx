import { AuthGuard } from '@/components/auth/auth-guard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
	component: AdminDashboard,
});

function AdminDashboard() {
	return (
		<AuthGuard>
			<AdminLayout activeTab="dashboard">
				<Outlet />
			</AdminLayout>
		</AuthGuard>
	);
}
