import { useState, useEffect } from 'react';
import { apiService, type ScheduleVersion, type Semester } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Star, Trash2, Copy, Calendar } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/versions')({
	component: VersionsPage,
});

function VersionsPage() {
	const [versions, setVersions] = useState<ScheduleVersion[]>([]);
	const [semesters, setSemesters] = useState<Semester[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [copySource, setCopySource] = useState<number | null>(null);
	const [isCopying, setIsCopying] = useState(false);
	const { toast } = useToast();

	const loadData = async () => {
		setIsLoading(true);
		try {
			const [versionsData, semestersData] = await Promise.all([
				apiService.getScheduleVersions(),
				apiService.getSemesters(),
			]);
			setVersions(versionsData);
			setSemesters(semestersData);
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось загрузить данные', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleCreate = async () => {
		const semesterId = semesters.length > 0 ? semesters[0].id : 0;
		if (semesterId === 0) {
			toast({ title: 'Ошибка', description: 'Сначала создайте семестр', variant: 'destructive' });
			return;
		}

		try {
			const today = new Date().toISOString().split('T')[0];
			const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			await apiService.createScheduleVersion(nextWeek, 'even', semesterId);
			toast({ title: 'Версия создана' });
			loadData();
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось создать версию', variant: 'destructive' });
		}
	};

	const handleSetCurrent = async (id: number) => {
		try {
			await apiService.setCurrentVersion(id);
			toast({ title: 'Текущая версия обновлена' });
			loadData();
		} catch {
			toast({ title: 'Ошибка', variant: 'destructive' });
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Удалить версию расписания?')) return;
		try {
			await apiService.deleteScheduleVersion(id);
			setVersions((prev) => prev.filter((v) => v.id !== id));
			toast({ title: 'Версия удалена' });
		} catch {
			toast({ title: 'Ошибка', variant: 'destructive' });
		}
	};

	const handleCopy = async (toVersionId: number) => {
		if (!copySource) return;
		setIsCopying(true);
		try {
			await apiService.copyScheduleVersion(copySource, toVersionId);
			toast({ title: 'Расписание скопировано' });
			setCopySource(null);
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось скопировать', variant: 'destructive' });
		} finally {
			setIsCopying(false);
		}
	};

	if (isLoading) {
		return <div className="text-center py-8 text-text-muted">Загрузка...</div>;
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text">Версии расписания</h2>
				<button
					onClick={handleCreate}
					className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Новая версия
				</button>
			</div>

			{copySource && (
				<div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
					<div className="flex items-center justify-between">
						<span className="text-sm text-primary">
							Выберите версию для копирования расписания
						</span>
						<button
							onClick={() => setCopySource(null)}
							className="text-sm text-primary hover:underline"
						>
							Отмена
						</button>
					</div>
				</div>
			)}

			{versions.length === 0 ? (
				<div className="text-center py-8 text-text-muted">Версий пока нет</div>
			) : (
				<div className="space-y-2">
					{versions.map((version) => (
						<div
							key={version.id}
							className={`flex items-center justify-between p-3 bg-background rounded-lg border ${
								version.is_current ? 'border-primary/50 bg-primary/5' : 'border-border/30'
							}`}
						>
							<div className="flex items-center gap-3">
								{version.is_current && <Star className="w-4 h-4 text-primary fill-primary" />}
								<div>
									<p className="font-medium text-text">
										Неделя с {version.week_start}
									</p>
									<p className="text-xs text-text-muted">
										{version.parity === 'even' ? 'Чётная' : 'Нечётная'}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{copySource && copySource !== version.id ? (
									<button
										onClick={() => handleCopy(version.id)}
										disabled={isCopying}
										className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
									>
										Копировать сюда
									</button>
								) : (
									<>
										{!version.is_current && (
											<button
												onClick={() => setCopySource(version.id)}
												className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-text transition-colors"
												title="Копировать"
											>
												<Copy className="w-4 h-4" />
											</button>
										)}
										{!version.is_current && (
											<button
												onClick={() => handleSetCurrent(version.id)}
												className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
											>
												Сделать текущей
											</button>
										)}
										{!version.is_current && (
											<button
												onClick={() => handleDelete(version.id)}
												className="p-1.5 rounded hover:bg-background-light text-text-muted hover:text-destructive transition-colors"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										)}
									</>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
