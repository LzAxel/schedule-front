import { useState } from 'react';
import { AdminForm } from '@/components/admin/admin-form';
import { AdminsList } from '@/components/admin/admins-list';
import { AlertTriangle, ArrowLeft, Plus, Shield } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/admins')({
	component: AdminsPage,
});

function AdminsPage() {
	const [showForm, setShowForm] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleFormSuccess = () => {
		setShowForm(false);
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleFormCancel = () => {
		setShowForm(false);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-text">Администраторы</h2>
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

			<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
				<div className="flex items-center gap-2">
					<AlertTriangle className="w-4 h-4 text-yellow-500" />
					<span className="text-sm text-yellow-600 dark:text-yellow-400">Новые администраторы получат полный доступ к системе</span>
				</div>
			</div>

			{showForm ? (
				<div className="space-y-3">
					<button
						onClick={handleFormCancel}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-text-muted hover:text-text hover:bg-background-light/50 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Назад
					</button>
					<AdminForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
				</div>
			) : (
				<div className="bg-background rounded-lg border border-border/50 overflow-hidden">
					<div className="px-4 py-3 bg-background-light/50 border-b border-border/30 flex items-center gap-2">
						<Shield className="w-4 h-4 text-primary" />
						<span className="text-sm font-medium text-text">Список администраторов</span>
					</div>
					<div className="p-4">
						<AdminsList refreshTrigger={refreshTrigger} />
					</div>
				</div>
			)}
		</div>
	);
}
