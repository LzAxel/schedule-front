import { useState } from 'react';
import { TeacherForm, TeachersList } from '@/components/admin/teachers/teachers-components';
import type { Teacher, Subject } from '@/lib/api';
import { Plus } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

type TeacherWithSubjects = Teacher & { subjects: Subject[] };

export const Route = createFileRoute('/admin/teachers')({
	component: TeachersPage,
});

function TeachersPage() {
	const [showForm, setShowForm] = useState(false);
	const [editingTeacher, setEditingTeacher] = useState<TeacherWithSubjects | undefined>();
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleEdit = (teacher: TeacherWithSubjects) => {
		setEditingTeacher(teacher);
		setShowForm(true);
	};

	const handleFormSuccess = () => {
		setShowForm(false);
		setEditingTeacher(undefined);
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingTeacher(undefined);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text">Управление преподавателями</h2>
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
				<TeacherForm teacher={editingTeacher} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
			) : (
				<TeachersList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
			)}
		</div>
	);
}
