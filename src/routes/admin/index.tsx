import { createFileRoute } from '@tanstack/react-router';
import { AdminScheduleGrid } from '@/components/admin/admin-schedule-grid';

export const Route = createFileRoute('/admin/')({
	component: AdminIndex,
});

function AdminIndex() {
	return <AdminScheduleGrid />;
}
