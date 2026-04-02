import { useState, useEffect } from 'react';
import { LessonForm } from '@/components/admin/lesson-form';
import { LessonsList } from '@/components/admin/lessons-list';
import { apiService, type Lesson, type LessonExtended } from '@/lib/api';
import { Plus } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';

export const Route = createFileRoute('/admin/lessons')({
	component: LessonsPage,
});

function LessonsPage() {
	const [showForm, setShowForm] = useState(false);
	const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [versionId, setVersionId] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		apiService
			.getScheduleVersions()
			.then((versions) => {
				const current = versions.find((v) => v.is_current);
				if (current) {
					setVersionId(current.id);
				} else if (versions.length > 0) {
					setVersionId(versions[0].id);
				}
			})
			.catch(() => {
				toast({ title: 'Ошибка', description: 'Не удалось загрузить версии расписания', variant: 'destructive' });
			})
			.finally(() => setLoading(false));
	}, []);

	const ensureSemester = async (): Promise<number> => {
		const semesters = await apiService.getSemesters();
		if (semesters.length > 0) {
			return semesters[0].id;
		}
		const today = new Date().toISOString().split('T')[0];
		const year = new Date().getFullYear();
		const newSemester = await apiService.createSemester(`${year}-${year + 1}`, today, today);
		await apiService.setActiveSemester(newSemester.id);
		return newSemester.id;
	};

	const handleEdit = (lesson: LessonExtended) => {
		setEditingLesson({
			id: lesson.id,
			schedule_version_id: lesson.schedule_version_id,
			subject_id: lesson.subject_id,
			teacher_id: lesson.teacher_id,
			location_id: lesson.location_id,
			group_id: lesson.group_id,
			pair_number: lesson.pair_number,
			day_of_week: lesson.day_of_week,
			parity_type: lesson.parity_type,
			lesson_type: lesson.lesson_type,
		});
		setShowForm(true);
	};

	const handleDuplicate = (lesson: LessonExtended) => {
		setEditingLesson({
			id: 0,
			schedule_version_id: lesson.schedule_version_id,
			subject_id: lesson.subject_id,
			teacher_id: lesson.teacher_id,
			location_id: lesson.location_id,
			group_id: lesson.group_id,
			pair_number: lesson.pair_number,
			day_of_week: lesson.day_of_week,
			parity_type: lesson.parity_type,
			lesson_type: lesson.lesson_type,
		});
		setShowForm(true);
	};

	const handleFormSuccess = () => {
		setShowForm(false);
		setEditingLesson(null);
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingLesson(null);
	};

	if (loading) {
		return <div className="text-center py-8 text-text-muted">Загрузка...</div>;
	}

	if (!versionId) {
		return (
			<div className="text-center py-8">
				<p className="text-text-muted mb-4">Сначала создайте версию расписания</p>
				<button
					onClick={async () => {
						const today = new Date().toISOString().split('T')[0];
						const semesterId = await ensureSemester();
						const version = await apiService.createScheduleVersion(today, 'even', semesterId);
						setVersionId(version.id);
					}}
					className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
				>
					Создать версию
				</button>
			</div>
		);
	}

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
				<LessonForm
					lesson={editingLesson || undefined}
					versionId={versionId}
					onSuccess={handleFormSuccess}
					onCancel={handleFormCancel}
				/>
			) : (
				<LessonsList
					onEdit={handleEdit}
					onDuplicate={handleDuplicate}
					refreshTrigger={refreshTrigger}
					versionId={versionId}
				/>
			)}
		</div>
	);
}
