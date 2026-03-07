import { useState } from 'react';
import { LessonForm } from '@/components/admin/lesson-form';
import { LessonsList } from '@/components/admin/lessons-list';
import { AppButton } from '@/components/ui/appButton';
import type { Lesson } from '@/lib/api';
import { Plus } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/lessons')({
	component: LessonsPage,
});

function LessonsPage() {
	const [showForm, setShowForm] = useState(false);
	const [editingLesson, setEditingLesson] = useState<Lesson | undefined>();
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleEdit = (lesson: Lesson) => {
		setEditingLesson(lesson);
		setShowForm(true);
	};

	const handleFormSuccess = () => {
		setShowForm(false);
		setEditingLesson(undefined);
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingLesson(undefined);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-text">Управление занятиями</h1>
				{!showForm && (
					<AppButton onClick={() => setShowForm(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Добавить занятие
					</AppButton>
				)}
			</div>

			{showForm ? (
				<LessonForm lesson={editingLesson} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
			) : (
				<LessonsList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
			)}
		</div>
	);
}
