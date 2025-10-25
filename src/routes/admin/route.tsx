import { AdminLayout } from '@/components/admin/admin-layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
	component: AdminDashboard,
});

function AdminDashboard() {
	return (
		<AdminLayout activeTab="dashboard">
			<Outlet />
		</AdminLayout>
	);
}
