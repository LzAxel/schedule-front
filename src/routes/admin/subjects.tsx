import { useState } from 'react';
import { SubjectForm, SubjectsList } from '@/components/admin/subjects/subjects-components';
import type { Subject } from '@/lib/api';
import { Plus } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/subjects')({
	component: SubjectsPage,
});

function SubjectsPage() {
	const [showForm, setShowForm] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleEdit = (subject: Subject) => {
		setEditingSubject(subject);
		setShowForm(true);
	};

	const handleFormSuccess = () => {
		setShowForm(false);
		setEditingSubject(undefined);
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingSubject(undefined);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text">Управление предметами</h2>
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
				<SubjectForm subject={editingSubject} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
			) : (
				<SubjectsList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
			)}
		</div>
	);
}
