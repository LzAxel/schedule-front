'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { apiService, type Lesson, type Teacher, type Subject, type Location } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { MAX_PAIRS_COUNT } from '@/const/pairs';
import { PARITY_LABELS } from '@/const/parity';
import { Autocomplete } from '@/components/ui/autocomplete';

interface LessonFormProps {
	lesson?: Lesson;
	onSuccess: () => void;
	onCancel: () => void;
}

const DAYS = [
	{ value: 'Monday', label: 'Понедельник' },
	{ value: 'Tuesday', label: 'Вторник' },
	{ value: 'Wednesday', label: 'Среда' },
	{ value: 'Thursday', label: 'Четверг' },
	{ value: 'Friday', label: 'Пятница' },
	{ value: 'Saturday', label: 'Суббота' },
];

const PAIR_NUMBERS = new Array(MAX_PAIRS_COUNT).fill(0).map((_, index) => index + 1);

const LESSON_TYPES = Object.entries(PARITY_LABELS).map((type) => ({
	value: type[0],
	label: type[1],
}));

export function LessonForm({ lesson, onSuccess, onCancel }: LessonFormProps) {
	const [formData, setFormData] = useState({
		name: lesson?.name || '',
		teacher: lesson?.teacher || '',
		pair_number: lesson?.pair_number || 1,
		location: lesson?.location || '',
		type: lesson?.type || 'static',
		day: lesson?.day || 'Monday',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [locations, setLocations] = useState<Location[]>([]);
	const [refsLoading, setRefsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		const loadReferences = async () => {
			try {
				const [teachersData, subjectsData, locationsData] = await Promise.all([
					apiService.getTeachers(),
					apiService.getSubjects(),
					apiService.getLocations(),
				]);
				setTeachers(teachersData);
				setSubjects(subjectsData);
				setLocations(locationsData);
			} catch (err) {
				console.error('Failed to load references:', err);
			} finally {
				setRefsLoading(false);
			}
		};
		loadReferences();
	}, []);

	const handleAddTeacher = async (name: string) => {
		const teacher = await apiService.createTeacher(name);
		setTeachers((prev) => [...prev, teacher]);
	};

	const handleAddSubject = async (name: string) => {
		const subject = await apiService.createSubject(name);
		setSubjects((prev) => [...prev, subject]);
	};

	const handleAddLocation = async (fullName: string) => {
		const parts = fullName.trim().split(/\s+/);
		const building = parts[0] || '';
		const room = parts.slice(1).join(' ') || '';
		const location = await apiService.createLocation(building, room);
		setLocations((prev) => [...prev, location]);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (lesson?.id) {
				await apiService.updateLesson(lesson.id, formData);
				toast({
					title: 'Занятие обновлено',
					description: 'Изменения успешно сохранены',
				});
			} else {
				await apiService.createLesson(formData);
				toast({
					title: 'Занятие создано',
					description: 'Новое занятие добавлено в расписание',
				});
			}
			onSuccess();
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось сохранить занятие',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const locationItems = locations.map((loc) => ({
		id: loc.id,
		name: loc.full_name,
	}));

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<h3 className="text-base font-semibold text-text mb-4">
				{lesson ? 'Редактировать' : 'Новое занятие'}
			</h3>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div className="grid gap-3 md:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Предмет</label>
						<Autocomplete
							value={formData.name}
							onChange={(value) => setFormData({ ...formData, name: value })}
							items={subjects}
							onAddNew={handleAddSubject}
							placeholder="Например: Математика"
							disabled={isLoading || refsLoading}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Преподаватель</label>
						<Autocomplete
							value={formData.teacher}
							onChange={(value) => setFormData({ ...formData, teacher: value })}
							items={teachers}
							onAddNew={handleAddTeacher}
							placeholder="Например: Иванов И.И."
							disabled={isLoading || refsLoading}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">День</label>
						<select
							value={formData.day}
							onChange={(e) => setFormData({ ...formData, day: e.target.value })}
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						>
							{DAYS.map((day) => (
								<option key={day.value} value={day.value}>
									{day.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Пара</label>
						<select
							value={formData.pair_number}
							onChange={(e) =>
								setFormData({
									...formData,
									pair_number: Number.parseInt(e.target.value),
								})
							}
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						>
							{PAIR_NUMBERS.map((num) => (
								<option key={num} value={num}>
									{num} пара
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Аудитория</label>
						<Autocomplete
							value={formData.location}
							onChange={(value) => setFormData({ ...formData, location: value })}
							items={locationItems}
							onAddNew={handleAddLocation}
							placeholder="Например: Главный 101"
							disabled={isLoading || refsLoading}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Тип</label>
						<select
							value={formData.type}
							onChange={(e) =>
								setFormData({
									...formData,
									type: e.target.value as 'static' | 'even' | 'odd',
								})
							}
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						>
							{LESSON_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="flex gap-2 pt-3">
					<button
						type="submit"
						disabled={isLoading}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Сохранение...' : lesson ? 'Обновить' : 'Создать'}
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
