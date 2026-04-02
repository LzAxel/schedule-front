'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { apiService, type Teacher, type Subject } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface TeacherWithSubjects extends Teacher {
	subjects: Subject[];
}

interface TeacherFormProps {
	teacher?: Teacher;
	onSuccess: () => void;
	onCancel: () => void;
}

export function TeacherForm({ teacher, onSuccess, onCancel }: TeacherFormProps) {
	const [formData, setFormData] = useState({
		name: teacher?.name || '',
	});
	const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
	const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		loadSubjects();
		if (teacher?.id) {
			loadTeacherSubjects();
		}
	}, [teacher?.id]);

	const loadSubjects = async () => {
		try {
			const subjects = await apiService.getSubjects();
			setAllSubjects(subjects);
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось загрузить предметы', variant: 'destructive' });
		}
	};

	const loadTeacherSubjects = async () => {
		if (!teacher?.id) return;
		try {
			const subjects = await apiService.getTeacherSubjects(teacher.id);
			setSelectedSubjectIds(subjects.map((s) => s.id));
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось загрузить предметы преподавателя', variant: 'destructive' });
		}
	};

	const toggleSubject = (subjectId: number) => {
		setSelectedSubjectIds((prev) =>
			prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			toast({ title: 'Ошибка', description: 'Введите имя преподавателя', variant: 'destructive' });
			return;
		}
		setIsLoading(true);

		try {
			if (teacher?.id) {
				await apiService.updateTeacher(teacher.id, formData.name);

				const currentSubjects = await apiService.getTeacherSubjects(teacher.id);
				const currentIds = currentSubjects.map((s) => s.id);

				for (const id of currentIds) {
					if (!selectedSubjectIds.includes(id)) {
						await apiService.removeTeacherSubject(teacher.id, id);
					}
				}
				for (const id of selectedSubjectIds) {
					if (!currentIds.includes(id)) {
						await apiService.addTeacherSubject(teacher.id, id);
					}
				}

				toast({ title: 'Преподаватель обновлён', description: 'Изменения сохранены' });
			} else {
				const newTeacher = await apiService.createTeacher(formData.name);
				for (const id of selectedSubjectIds) {
					await apiService.addTeacherSubject(newTeacher.id, id);
				}
				toast({ title: 'Преподаватель создан', description: 'Новый преподаватель добавлен' });
			}
			onSuccess();
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось сохранить преподавателя', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<h3 className="text-base font-semibold text-text mb-4">{teacher ? 'Редактировать преподавателя' : 'Новый преподаватель'}</h3>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-text-muted">Имя</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="Например: Иванов И.И."
						disabled={isLoading}
						className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-text-muted">Предметы</label>
					<div className="flex flex-wrap gap-2 p-2 rounded-md bg-background-light border border-border/30 min-h-[40px]">
						{allSubjects.length === 0 ? (
							<span className="text-xs text-text-muted px-2 py-1">Нет доступных предметов</span>
						) : (
							allSubjects.map((subject) => (
								<button
									key={subject.id}
									type="button"
									onClick={() => toggleSubject(subject.id)}
									className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
										selectedSubjectIds.includes(subject.id)
											? 'bg-primary text-primary-foreground'
											: 'bg-background border border-border/30 text-text-muted hover:border-primary/50'
									}`}
								>
									{selectedSubjectIds.includes(subject.id) ? (
										<Check className="w-3 h-3" />
									) : (
										<X className="w-3 h-3" />
									)}
									{subject.name}
								</button>
							))
						)}
					</div>
				</div>

				<div className="flex gap-2 pt-3">
					<button
						type="submit"
						disabled={isLoading}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Сохранение...' : teacher ? 'Обновить' : 'Создать'}
					</button>
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background-light text-text-muted text-sm font-medium hover:bg-background transition-colors"
					>
						Отмена
					</button>
				</div>
			</form>
		</div>
	);
}

interface TeachersListProps {
	onEdit: (teacher: TeacherWithSubjects) => void;
	refreshTrigger: number;
}

export function TeachersList({ onEdit, refreshTrigger }: TeachersListProps) {
	const [teachers, setTeachers] = useState<TeacherWithSubjects[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		loadTeachers();
	}, [refreshTrigger]);

	const loadTeachers = async () => {
		setIsLoading(true);
		try {
			const allTeachers = await apiService.getTeachers();
			const teachersWithSubjects = await Promise.all(
				allTeachers.map(async (teacher) => {
					const subjects = await apiService.getTeacherSubjects(teacher.id);
					return { ...teacher, subjects };
				}),
			);
			setTeachers(teachersWithSubjects);
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось загрузить преподавателей', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Удалить преподавателя?')) return;
		try {
			await apiService.deleteTeacher(id);
			setTeachers((prev) => prev.filter((t) => t.id !== id));
			toast({ title: 'Преподаватель удалён' });
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось удалить преподавателя', variant: 'destructive' });
		}
	};

	if (isLoading) {
		return <div className="text-center py-8 text-text-muted">Загрузка...</div>;
	}

	if (teachers.length === 0) {
		return <div className="text-center py-8 text-text-muted">Преподавателей пока нет</div>;
	}

	return (
		<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{teachers.map((teacher) => (
				<div
					key={teacher.id}
					className="flex flex-col p-3 bg-background rounded-lg border border-border/30"
				>
					<div className="flex items-start justify-between mb-2">
						<p className="font-medium text-text">{teacher.name}</p>
						<div className="flex gap-1">
							<button
								onClick={() => onEdit(teacher)}
								className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-text transition-colors"
							>
								<Pencil className="w-4 h-4" />
							</button>
							<button
								onClick={() => handleDelete(teacher.id)}
								className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-destructive transition-colors"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
					</div>
					<div className="flex flex-wrap gap-1 mt-auto">
						{teacher.subjects.length === 0 ? (
							<span className="text-xs text-text-muted">Без предметов</span>
						) : (
							teacher.subjects.map((subject) => (
								<span
									key={subject.id}
									className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary"
								>
									{subject.name}
								</span>
							))
						)}
					</div>
				</div>
			))}
		</div>
	);
}
