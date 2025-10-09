'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { BookOpen, Users, Calendar, Clock } from 'lucide-react';

interface DashboardStatsProps {
	totalLessons: number;
	totalAdmins: number;
	currentParity: string;
	lessonsThisWeek: number;
}

export function DashboardStats() {
	const [stats, setStats] = useState<DashboardStatsProps | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setIsLoading(true);
				const [lessons, admins, settings, schedule] = await Promise.all([
					apiService.getLessons(),
					apiService.getAdmins(),
					apiService.getParity(),
					apiService.getSchedule(),
				]);

				const lessonsThisWeek = Object.values(schedule).flat().length;

				setStats({
					totalLessons: lessons.length,
					totalAdmins: admins.length,
					currentParity: settings.parity === 'even' ? 'нечётная' : 'чётная',
					lessonsThisWeek,
				});
			} catch (error) {
				console.error('Error fetching dashboard stats:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								<div className="h-4 bg-muted rounded animate-pulse"></div>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-8 bg-muted rounded animate-pulse"></div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!stats) return null;

	const statCards = [
		{
			title: 'Всего занятий',
			value: stats.totalLessons,
			icon: BookOpen,
			description: 'в базе данных',
		},
		{
			title: 'Администраторы',
			value: stats.totalAdmins,
			icon: Users,
			description: 'активных пользователей',
		},
		{
			title: 'Текущая неделя',
			value: stats.currentParity,
			icon: Calendar,
			description: 'четность недели',
		},
		{
			title: 'Занятий на неделе',
			value: stats.lessonsThisWeek,
			icon: Clock,
			description: 'активных занятий',
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{statCards.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
							<Icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground">{stat.description}</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
