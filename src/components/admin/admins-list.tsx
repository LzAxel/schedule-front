'use client';

import { useEffect, useState } from 'react';
import { apiService, type Admin } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { User, Shield, Crown, Trash2 } from 'lucide-react';

interface AdminsListProps {
	refreshTrigger: number;
}

export function AdminsList({ refreshTrigger }: AdminsListProps) {
	const [admins, setAdmins] = useState<Admin[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	const handleDelete = (id: number) => {
		apiService
			.deleteAdmin(id)
			.then(() => {
				toast({
					title: 'Администратор удалён',
				});
				setAdmins((prev) => prev.filter((admin) => admin.id !== id));
			})
			.catch(() => {
				toast({
					title: 'Ошибка',
					description: 'Не удалось удалить администратора',
					variant: 'destructive',
				});
			});
	};

	useEffect(() => {
		const fetchAdmins = async () => {
			try {
				setIsLoading(true);
				const data = await apiService.getAdmins();
				const sortedAdmins = data.sort((a, b) => a.id - b.id);
				setAdmins(sortedAdmins);
			} catch (error) {
				toast({
					title: 'Ошибка',
					description: 'Не удалось загрузить список',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchAdmins();
	}, [refreshTrigger, toast]);

	if (isLoading) {
		return (
			<div className="space-y-2">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/30">
						<div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
						<div className="space-y-1">
							<div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
							<div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (admins.length === 0) {
		return (
			<div className="text-center py-8 text-text-muted">
				<User className="w-8 h-8 mx-auto mb-2 opacity-40" />
				<p className="text-sm">Администраторы не найдены</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{admins.map((admin) => {
				const isOriginalAdmin = admin.is_super;

				return (
					<div
						key={admin.id}
						className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-background-light/30 hover:bg-background-light/50 transition-colors"
					>
						<div className="flex items-center gap-3">
							<div className={`w-8 h-8 rounded-full flex items-center justify-center ${
								isOriginalAdmin ? 'bg-yellow-500/20' : 'bg-primary/10'
							}`}>
								{isOriginalAdmin ? (
									<Crown className="w-4 h-4 text-yellow-500" />
								) : (
									<Shield className="w-4 h-4 text-primary" />
								)}
							</div>
							<div>
								<div className="text-sm font-medium text-text">{admin.username}</div>
								<div className="text-xs text-text-muted">
									{isOriginalAdmin ? 'Главный' : 'Админ'} • ID: {admin.id}
								</div>
							</div>
						</div>
						{!admin.is_super && (
							<button
								onClick={() => handleDelete(admin.id)}
								className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						)}
					</div>
				);
			})}
		</div>
	);
}
