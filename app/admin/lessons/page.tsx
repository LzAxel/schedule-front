'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { LessonForm } from '@/components/admin/lesson-form';
import { LessonsList } from '@/components/admin/lessons-list';
import { AppButton } from '@/components/ui/appButton';
import type { Lesson } from '@/lib/api';
import { Plus, ArrowLeft } from 'lucide-react';

export default function LessonsPage() {
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
		<AuthGuard>
			<AdminLayout activeTab="lessons">
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-balance">Управление занятиями</h1>
							<p className="text-muted-foreground mt-2">Создание и редактирование расписания занятий</p>
						</div>
						{!showForm && (
							<AppButton onClick={() => setShowForm(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Добавить занятие
							</AppButton>
						)}
					</div>

					{showForm ? (
						<div className="space-y-4">
							<AppButton variant="outline" onClick={handleFormCancel} className="bg-transparent">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Назад к списку
							</AppButton>
							<LessonForm
								lesson={editingLesson}
								onSuccess={handleFormSuccess}
								onCancel={handleFormCancel}
							/>
						</div>
					) : (
						<LessonsList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
					)}
				</div>
			</AdminLayout>
		</AuthGuard>
	);
}
