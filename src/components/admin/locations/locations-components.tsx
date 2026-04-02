'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { apiService, type Location } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface LocationFormProps {
	location?: Location;
	onSuccess: () => void;
	onCancel: () => void;
}

export function LocationForm({ location, onSuccess, onCancel }: LocationFormProps) {
	const [formData, setFormData] = useState({
		building: location?.building || '',
		room: location?.room || '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.building.trim() || !formData.room.trim()) {
			toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
			return;
		}
		setIsLoading(true);

		try {
			if (location?.id) {
				await apiService.updateLocation(location.id, formData.building, formData.room);
				toast({ title: 'Аудитория обновлена', description: 'Изменения сохранены' });
			} else {
				await apiService.createLocation(formData.building, formData.room);
				toast({ title: 'Аудитория создана', description: 'Новая аудитория добавлена' });
			}
			onSuccess();
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось сохранить аудиторию', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<h3 className="text-base font-semibold text-text mb-4">{location ? 'Редактировать аудиторию' : 'Новая аудитория'}</h3>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div className="grid gap-3 md:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Корпус</label>
						<input
							type="text"
							value={formData.building}
							onChange={(e) => setFormData({ ...formData, building: e.target.value })}
							placeholder="Например: Главный"
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-text-muted">Аудитория</label>
						<input
							type="text"
							value={formData.room}
							onChange={(e) => setFormData({ ...formData, room: e.target.value })}
							placeholder="Например: 101"
							disabled={isLoading}
							className="w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
						/>
					</div>
				</div>

				<div className="flex gap-2 pt-3">
					<button
						type="submit"
						disabled={isLoading}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Сохранение...' : location ? 'Обновить' : 'Создать'}
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

interface LocationsListProps {
	onEdit: (location: Location) => void;
	refreshTrigger: number;
}

export function LocationsList({ onEdit, refreshTrigger }: LocationsListProps) {
	const [locations, setLocations] = useState<Location[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		loadLocations();
	}, [refreshTrigger]);

	const loadLocations = async () => {
		setIsLoading(true);
		try {
			const data = await apiService.getLocations();
			setLocations(data);
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось загрузить аудитории', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Удалить аудиторию?')) return;
		try {
			await apiService.deleteLocation(id);
			setLocations((prev) => prev.filter((l) => l.id !== id));
			toast({ title: 'Аудитория удалена' });
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось удалить аудиторию', variant: 'destructive' });
		}
	};

	if (isLoading) {
		return <div className="text-center py-8 text-text-muted">Загрузка...</div>;
	}

	if (locations.length === 0) {
		return <div className="text-center py-8 text-text-muted">Аудиторий пока нет</div>;
	}

	const groupedByBuilding = locations.reduce(
		(acc, loc) => {
			if (!acc[loc.building]) acc[loc.building] = [];
			acc[loc.building].push(loc);
			return acc;
		},
		{} as Record<string, Location[]>,
	);

	return (
		<div className="space-y-4">
			{Object.entries(groupedByBuilding)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([building, locs]) => (
					<div key={building}>
						<h4 className="text-sm font-medium text-text-muted mb-2">{building}</h4>
						<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
							{locs.map((loc) => (
								<div
									key={loc.id}
									className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/30"
								>
									<p className="font-medium text-text">{loc.room}</p>
									<div className="flex gap-1">
										<button
											onClick={() => onEdit(loc)}
											className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-text transition-colors"
										>
											<Pencil className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDelete(loc.id)}
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
