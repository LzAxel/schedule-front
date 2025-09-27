'use client';

import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {apiService, type Admin} from '@/lib/api';
import {useToast} from '@/hooks/use-toast';
import {User, Shield, Crown, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';

interface AdminsListProps {
	refreshTrigger: number
}

export function AdminsList({refreshTrigger}: AdminsListProps) {
	const [admins, setAdmins] = useState<Admin[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const {toast} = useToast();

	const handleDelete = (id: number) => {
		apiService.deleteAdmin(id).then(() => {
			toast({
				title: 'Администратор удалён',
				variant: 'default'
			});
			setAdmins((prev) => prev.filter((admin) => admin.id !== id));
		}).catch(() => {
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
				// Sort admins by ID to show the original admin first
				const sortedAdmins = data.sort((a, b) => a.id - b.id);
				setAdmins(sortedAdmins);
			} catch (error) {
				toast({
					title: 'Ошибка',
					description: 'Не удалось загрузить список администраторов',
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
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(3)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<div className="h-6 bg-muted rounded animate-pulse"></div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="h-4 bg-muted rounded animate-pulse"></div>
								<div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (admins.length === 0) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center py-8">
						<User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50"/>
						<p className="text-muted-foreground">Администраторы не найдены</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{admins.map((admin, index) => {
				const isOriginalAdmin = admin.is_super; // First admin is the original hardcoded one

				return (
					<Card key={admin.id} className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg flex items-center gap-2">
									{isOriginalAdmin ? (
										<Crown className="h-5 w-5 text-yellow-500"/>
									) : (
										<Shield className="h-5 w-5 text-primary"/>
									)}
									{admin.username}
								</CardTitle>
								<Badge variant={isOriginalAdmin ? 'default' : 'secondary'}>
									{isOriginalAdmin ? 'Главный' : 'Админ'}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 shrink-0"/>
									<span>ID: {admin.id}</span>
								</div>
								{isOriginalAdmin && (
									<div className="pt-2 border-t">
										<p className="text-xs text-muted-foreground">Системный администратор с полными
											правами доступа</p>
									</div>
								)}
								{!admin.is_super && <div className="flex justify-end">
									<Button
										size="sm"
										variant="outline"
										onClick={() => handleDelete(admin.id)}
										className="hover:bg-destructive text-destructive hover:text-white bg-transparent"
									>
										<Trash2 className="h-4 w-4"/>
									</Button>
								</div>}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
