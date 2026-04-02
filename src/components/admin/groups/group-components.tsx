'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { apiService, type Group } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface GroupFormProps {
	group?: Group;
	onSuccess: () => void;
	onCancel: () => void;
}

export function GroupForm({ group, onSuccess, onCancel }: GroupFormProps) {
	const [formData, setFormData] = useState({
		name: group?.name || '',
		course: group?.course || 1,
	});
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (group?.id) {
				await apiService.updateGroup(group.id, formData.name, formData.course);
				toast({ title: 'Группа обновлена', description: 'Изменения сохранены' });
			} else {
				await apiService.createGroup(formData.name, formData.course);
				toast({ title: 'Группа создана', description: 'Новая группа добавлена' });
			}
			onSuccess();
		} catch {
			toast({
				title: 'Ошибка',
				description: 'Не удалось сохранить группу',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<h3 className="text-base font-semibold text-text mb-4">{group ? 'Редактировать группу' : 'Новая группа'}</h3>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div className="grid gap-3 md:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Название</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="Например: ИС-21"
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Курс</label>
						<select
							value={formData.course}
							onChange={(e) => setFormData({ ...formData, course: Number(e.target.value) })}
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						>
							{[1, 2, 3, 4, 5, 6].map((c) => (
								<option key={c} value={c}>
									{c} курс
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
						{isLoading ? 'Сохранение...' : group ? 'Обновить' : 'Создать'}
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

interface GroupsListProps {
	onEdit: (group: Group) => void;
	refreshTrigger: number;
}

export function GroupsList({ onEdit, refreshTrigger }: GroupsListProps) {
	const [groups, setGroups] = useState<Group[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		loadGroups();
	}, [refreshTrigger]);

	const loadGroups = async () => {
		try {
			const data = await apiService.getGroups();
			setGroups(data);
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось загрузить группы', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Удалить группу?')) return;
		try {
			await apiService.deleteGroup(id);
			setGroups((prev) => prev.filter((g) => g.id !== id));
			toast({ title: 'Группа удалена' });
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось удалить группу', variant: 'destructive' });
		}
	};

	const groupedByCourse = groups.reduce(
		(acc, grp) => {
			if (!acc[grp.course]) acc[grp.course] = [];
			acc[grp.course].push(grp);
			return acc;
		},
		{} as Record<number, Group[]>,
	);

	if (isLoading) {
		return <div className="text-center py-8 text-text-muted">Загрузка...</div>;
	}

	if (groups.length === 0) {
		return <div className="text-center py-8 text-text-muted">Групп пока нет</div>;
	}

	return (
		<div className="space-y-4">
			{Object.entries(groupedByCourse)
				.sort(([a], [b]) => Number(b) - Number(a))
				.map(([course, courseGroups]) => (
					<div key={course}>
						<h4 className="text-sm font-medium text-text-muted mb-2">{course} курс</h4>
						<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
							{courseGroups.map((grp) => (
								<div
									key={grp.id}
									className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/30"
								>
									<div>
										<p className="font-medium text-text">{grp.name}</p>
									</div>
									<div className="flex gap-1">
										<button
											onClick={() => onEdit(grp)}
											className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-text transition-colors"
										>
											<Pencil className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDelete(grp.id)}
											className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-destructive transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
		</div>
	);
}
