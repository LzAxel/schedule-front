import { useState } from 'react';
import { AdminForm } from '@/components/admin/admin-form';
import { AdminsList } from '@/components/admin/admins-list';
import { AppButton } from '@/components/ui/appButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-text">Управление администраторами</h1>
				{!showForm && (
					<AppButton onClick={() => setShowForm(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Добавить
					</AppButton>
				)}
			</div>

			<Card className="border-yellow-500/30 bg-yellow-500/10">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-yellow-500" />
						<CardTitle className="text-lg text-yellow-500">Важно</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<CardDescription className="text-text-muted">
						Новые администраторы получат полный доступ к системе.
					</CardDescription>
				</CardContent>
			</Card>

			{showForm ? (
				<div className="space-y-4">
					<AppButton variant="outline" onClick={handleFormCancel} className="bg-transparent">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Назад
					</AppButton>
					<AdminForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
				</div>
			) : (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Shield className="h-5 w-5 text-primary" />
							<CardTitle>Список администраторов</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<AdminsList refreshTrigger={refreshTrigger} />
					</CardContent>
				</Card>
			)}
		</div>
	);
}
