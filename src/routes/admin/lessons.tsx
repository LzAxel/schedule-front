import { useState } from 'react';
import { LessonForm } from '@/components/admin/lesson-form';
import { LessonsList } from '@/components/admin/lessons-list';
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

	const handleDuplicate = (lesson: Lesson) => {
		const duplicated: Lesson = {
			...lesson,
			id: undefined,
		};
		setEditingLesson(duplicated);
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
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text">Управление занятиями</h2>
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
				<LessonForm lesson={editingLesson} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
			) : (
				<LessonsList onEdit={handleEdit} onDuplicate={handleDuplicate} refreshTrigger={refreshTrigger} />
			)}
		</div>
	);
}
