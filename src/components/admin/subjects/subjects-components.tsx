'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { apiService, type Subject } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface SubjectFormProps {
	subject?: Subject;
	onSuccess: () => void;
	onCancel: () => void;
}

export function SubjectForm({ subject, onSuccess, onCancel }: SubjectFormProps) {
	const [formData, setFormData] = useState({
		name: subject?.name || '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			toast({ title: 'Ошибка', description: 'Введите название предмета', variant: 'destructive' });
			return;
		}
		setIsLoading(true);

		try {
			if (subject?.id) {
				await apiService.updateSubject(subject.id, formData.name);
				toast({ title: 'Предмет обновлён', description: 'Изменения сохранены' });
			} else {
				await apiService.createSubject(formData.name);
				toast({ title: 'Предмет создан', description: 'Новый предмет добавлен' });
			}
			onSuccess();
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось сохранить предмет', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<h3 className="text-base font-semibold text-text mb-4">{subject ? 'Редактировать предмет' : 'Новый предмет'}</h3>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-text-muted">Название</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="Например: Математика"
						disabled={isLoading}
						className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
					/>
				</div>

				<div className="flex gap-2 pt-3">
					<button
						type="submit"
						disabled={isLoading}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Сохранение...' : subject ? 'Обновить' : 'Создать'}
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

interface SubjectsListProps {
	onEdit: (subject: Subject) => void;
	refreshTrigger: number;
}

export function SubjectsList({ onEdit, refreshTrigger }: SubjectsListProps) {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		loadSubjects();
	}, [refreshTrigger]);

	const loadSubjects = async () => {
		setIsLoading(true);
		try {
			const data = await apiService.getSubjects();
			setSubjects(data);
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось загрузить предметы', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Удалить предмет?')) return;
		try {
			await apiService.deleteSubject(id);
			setSubjects((prev) => prev.filter((s) => s.id !== id));
			toast({ title: 'Предмет удалён' });
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось удалить предмет', variant: 'destructive' });
		}
	};

	if (isLoading) {
		return <div className="text-center py-8 text-text-muted">Загрузка...</div>;
	}

	if (subjects.length === 0) {
		return <div className="text-center py-8 text-text-muted">Предметов пока нет</div>;
	}

	return (
		<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
			{subjects.map((subject) => (
				<div
					key={subject.id}
					className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/30"
				>
					<p className="font-medium text-text">{subject.name}</p>
					<div className="flex gap-1">
						<button
							onClick={() => onEdit(subject)}
							className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-text transition-colors"
						>
							<Pencil className="w-4 h-4" />
						</button>
						<button
							onClick={() => handleDelete(subject.id)}
							className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-destructive transition-colors"
						>
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
