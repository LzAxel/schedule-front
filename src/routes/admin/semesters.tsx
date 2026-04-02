import { useState, useEffect } from 'react';
import { apiService, type Semester } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Star, Trash2, Calendar } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/semesters')({
	component: SemestersPage,
});

function SemestersPage() {
	const [semesters, setSemesters] = useState<Semester[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const loadSemesters = async () => {
		setIsLoading(true);
		try {
			const data = await apiService.getSemesters();
			setSemesters(data);
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось загрузить семестры', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadSemesters();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			toast({ title: 'Ошибка', description: 'Введите название', variant: 'destructive' });
			return;
		}

		setIsSubmitting(true);
		try {
			await apiService.createSemester(formData.name, formData.startDate, formData.endDate);
			toast({ title: 'Семестр создан' });
			setShowForm(false);
			setFormData({ name: '', startDate: '', endDate: '' });
			loadSemesters();
		} catch {
			toast({ title: 'Ошибка', description: 'Не удалось создать семестр', variant: 'destructive' });
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSetActive = async (id: number) => {
		try {
			await apiService.setActiveSemester(id);
			toast({ title: 'Семестр активирован' });
			loadSemesters();
		} catch {
			toast({ title: 'Ошибка', variant: 'destructive' });
		}
	};

	if (isLoading) {
		return <div className="text-center py-8 text-text-muted">Загрузка...</div>;
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text">Семестры</h2>
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

			{showForm && (
				<div className="mb-4 bg-background rounded-lg border border-border/50 p-4">
					<h3 className="text-base font-semibold text-text mb-4">Новый семестр</h3>
					<form onSubmit={handleSubmit} className="space-y-3">
						<div className="grid gap-3 md:grid-cols-3">
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-text-muted">Название</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder="2024-2025"
									className="w-full h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary outline-none"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-text-muted">Дата начала</label>
								<input
									type="date"
									value={formData.startDate}
									onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
									className="w-full h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary outline-none"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-text-muted">Дата окончания</label>
								<input
									type="date"
									value={formData.endDate}
									onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
									className="w-full h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary outline-none"
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
							>
								{isSubmitting ? 'Сохранение...' : 'Создать'}
							</button>
							<button
								type="button"
								onClick={() => setShowForm(false)}
								className="px-3 py-1.5 bg-background-light text-text-muted rounded-md text-sm font-medium hover:bg-background"
							>
								Отмена
							</button>
						</div>
					</form>
				</div>
			)}

			{semesters.length === 0 ? (
				<div className="text-center py-8 text-text-muted">Семестров пока нет</div>
			) : (
				<div className="space-y-2">
					{semesters.map((semester) => (
						<div
							key={semester.id}
							className={`flex items-center justify-between p-3 bg-background rounded-lg border ${
								semester.is_active ? 'border-primary/50 bg-primary/5' : 'border-border/30'
							}`}
						>
							<div className="flex items-center gap-3">
								{semester.is_active && <Star className="w-4 h-4 text-primary fill-primary" />}
								<div>
									<p className="font-medium text-text">{semester.name}</p>
									<p className="text-xs text-text-muted">
										{semester.start_date} — {semester.end_date}
									</p>
								</div>
							</div>
							{!semester.is_active && (
								<button
									onClick={() => handleSetActive(semester.id)}
									className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
								>
									Активировать
								</button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
