import { useState } from 'react';
import { GroupForm, GroupsList } from '@/components/admin/groups/group-components';
import type { Group } from '@/lib/api';
import { Plus } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/groups')({
	component: GroupsPage,
});

function GroupsPage() {
	const [showForm, setShowForm] = useState(false);
	const [editingGroup, setEditingGroup] = useState<Group | undefined>();
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleEdit = (group: Group) => {
		setEditingGroup(group);
		setShowForm(true);
	};

	const handleFormSuccess = () => {
		setShowForm(false);
		setEditingGroup(undefined);
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingGroup(undefined);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text">Управление группами</h2>
				{!showForm && (
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
					>
						<Plus className="w-4 h-4" />
						Добавить
					</button>
				)}
			</div>

			{showForm ? (
				<GroupForm group={editingGroup} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
			) : (
				<GroupsList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
			)}
		</div>
	);
}
