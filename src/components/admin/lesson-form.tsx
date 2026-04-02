'use client';

import type React from 'react';

import { useState, useEffect, useCallback } from 'react';
import { apiService, type Lesson, type Teacher, type Subject, type Location, type Group, type Conflict } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { MAX_PAIRS_COUNT } from '@/const/pairs';
import { PARITY_LABELS } from '@/const/parity';
import { Autocomplete } from '@/components/ui/autocomplete';
import { AlertTriangle } from 'lucide-react';

interface LessonFormProps {
	lesson?: Lesson;
	versionId: number;
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

const PARITY_TYPES = Object.entries(PARITY_LABELS).map(([value, label]) => ({ value, label }));

const LESSON_TYPE_OPTIONS = [
	{ value: 'lection', label: 'Лекция' },
	{ value: 'practice', label: 'Практика' },
	{ value: 'lab', label: 'Лабораторная' },
];

export function LessonForm({ lesson, versionId, onSuccess, onCancel }: LessonFormProps) {
	const [formData, setFormData] = useState({
		subject_id: lesson?.subject_id || 0,
		teacher_id: lesson?.teacher_id || 0,
		location_id: lesson?.location_id || 0,
		group_id: lesson?.group_id || 0,
		pair_number: lesson?.pair_number || 1,
		day_of_week: lesson?.day_of_week || 'Monday',
		parity_type: lesson?.parity_type || 'static',
		lesson_type: lesson?.lesson_type || 'lection',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [locations, setLocations] = useState<Location[]>([]);
	const [groups, setGroups] = useState<Group[]>([]);
	const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
	const [refsLoading, setRefsLoading] = useState(true);
	const [conflicts, setConflicts] = useState<Conflict[]>([]);
	const [isValidating, setIsValidating] = useState(false);
	const { toast } = useToast();

	const selectedSubject = subjects.find((s) => s.id === formData.subject_id);
	const selectedTeacher = teachers.find((t) => t.id === formData.teacher_id);
	const selectedLocation = locations.find((l) => l.id === formData.location_id);
	const selectedGroup = groups.find((g) => g.id === formData.group_id);

	const loadReferences = useCallback(async () => {
		try {
			const [teachersData, subjectsData, locationsData, groupsData] = await Promise.all([
				apiService.getTeachers(),
				apiService.getSubjects(),
				apiService.getLocations(),
				apiService.getGroups(),
			]);
			setTeachers(teachersData);
			setSubjects(subjectsData);
			setLocations(locationsData);
			setGroups(groupsData);
		} catch (err) {
			console.error('Failed to load references:', err);
		} finally {
			setRefsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadReferences();
	}, [loadReferences]);

	useEffect(() => {
		if (formData.subject_id && formData.teacher_id) {
			validateConflicts();
		}
	}, [formData.teacher_id, formData.location_id, formData.group_id, formData.day_of_week, formData.pair_number, formData.parity_type]);

	const validateConflicts = async () => {
		if (!formData.teacher_id && !formData.location_id && !formData.group_id) {
			setConflicts([]);
			return;
		}

		setIsValidating(true);
		try {
			const result = await apiService.validateLesson({
				teacher_id: formData.teacher_id,
				location_id: formData.location_id,
				group_id: formData.group_id,
				day_of_week: formData.day_of_week,
				pair_number: formData.pair_number,
				parity_type: formData.parity_type,
				exclude_id: lesson?.id?.toString(),
			});
			setConflicts(result.conflicts);
		} catch {
			setConflicts([]);
		} finally {
			setIsValidating(false);
		}
	};

	const handleSubjectChange = (name: string) => {
		const subject = subjects.find((s) => s.name === name);
		if (subject) {
			setFormData({ ...formData, subject_id: subject.id, teacher_id: 0 });
			apiService.getSubjectTeachers(subject.id).then(setFilteredTeachers);
		}
	};

	const handleAddTeacher = async (name: string) => {
		const teacher = await apiService.createTeacher(name);
		setTeachers((prev) => [...prev, teacher]);
		if (formData.subject_id) {
			await apiService.addTeacherSubject(teacher.id, formData.subject_id);
		}
		setFilteredTeachers((prev) => [...prev, teacher]);
	};

	const handleAddSubject = async (name: string) => {
		const subject = await apiService.createSubject(name);
		setSubjects((prev) => [...prev, subject]);
		setFormData({ ...formData, subject_id: subject.id });
	};

	const handleAddLocation = async (fullName: string) => {
		const parts = fullName.trim().split(/\s+/);
		const building = parts[0] || '';
		const room = parts.slice(1).join(' ') || '';
		const location = await apiService.createLocation(building, room);
		setLocations((prev) => [...prev, location]);
		setFormData({ ...formData, location_id: location.id });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.subject_id || !formData.teacher_id || !formData.location_id || !formData.group_id) {
			toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
			return;
		}

		setIsLoading(true);

		try {
			const payload = {
				schedule_version_id: versionId,
				subject_id: formData.subject_id,
				teacher_id: formData.teacher_id,
				location_id: formData.location_id,
				group_id: formData.group_id,
				pair_number: formData.pair_number,
				day_of_week: formData.day_of_week,
				parity_type: formData.parity_type as 'even' | 'odd' | 'static',
				lesson_type: formData.lesson_type as 'lection' | 'practice' | 'lab',
			};

			if (lesson?.id) {
				await apiService.updateLesson(lesson.id, payload);
				toast({ title: 'Занятие обновлено', description: 'Изменения успешно сохранены' });
			} else {
				await apiService.createLesson(payload, versionId);
				toast({ title: 'Занятие создано', description: 'Новое занятие добавлено в расписание' });
			}
			onSuccess();
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось сохранить занятие', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	const locationItems = locations.map((loc) => ({ id: loc.id, name: loc.full_name }));

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<h3 className="text-base font-semibold text-text mb-4">{lesson ? 'Редактировать' : 'Новое занятие'}</h3>

			{conflicts.length > 0 && (
				<div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
					<div className="flex items-center gap-2 text-destructive text-sm font-medium mb-2">
						<AlertTriangle className="w-4 h-4" />
						Внимание! Конфликты:
					</div>
					<ul className="text-sm text-destructive/80 space-y-1">
						{conflicts.map((c, i) => (
							<li key={i}>{c.message}</li>
						))}
					</ul>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-3">
				<div className="grid gap-3 md:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Группа *</label>
						<select
							value={formData.group_id}
							onChange={(e) => setFormData({ ...formData, group_id: Number(e.target.value) })}
							disabled={isLoading || refsLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						>
							<option value={0}>Выберите группу</option>
							{groups.map((g) => (
								<option key={g.id} value={g.id}>
									{g.name} ({g.course} курс)
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Предмет *</label>
						<Autocomplete
							value={selectedSubject?.name || ''}
							onChange={handleSubjectChange}
							items={subjects}
							onAddNew={handleAddSubject}
							placeholder="Например: Математика"
							disabled={isLoading || refsLoading}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Преподаватель *</label>
						<Autocomplete
							value={selectedTeacher?.name || ''}
							onChange={(name) => {
								const t = [...teachers, ...filteredTeachers].find((t) => t.name === name);
								setFormData({ ...formData, teacher_id: t?.id || 0 });
							}}
							items={filteredTeachers.length > 0 ? filteredTeachers : teachers}
							onAddNew={handleAddTeacher}
							placeholder="Например: Иванов И.И."
							disabled={isLoading || refsLoading}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Аудитория *</label>
						<Autocomplete
							value={selectedLocation?.full_name || ''}
							onChange={(name) => {
								const l = locations.find((l) => l.full_name === name);
								setFormData({ ...formData, location_id: l?.id || 0 });
							}}
							items={locationItems}
							onAddNew={handleAddLocation}
							placeholder="Например: Главный 101"
							disabled={isLoading || refsLoading}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">День</label>
						<select
							value={formData.day_of_week}
							onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
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
							onChange={(e) => setFormData({ ...formData, pair_number: Number(e.target.value) })}
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
						<label className="text-xs font-medium text-text-muted">Чётность</label>
						<select
							value={formData.parity_type}
							onChange={(e) => setFormData({ ...formData, parity_type: e.target.value as 'even' | 'odd' | 'static' })}
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						>
							{PARITY_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Тип занятия</label>
						<select
							value={formData.lesson_type}
							onChange={(e) => setFormData({ ...formData, lesson_type: e.target.value as 'lection' | 'practice' | 'lab' })}
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						>
							{LESSON_TYPE_OPTIONS.map((type) => (
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
