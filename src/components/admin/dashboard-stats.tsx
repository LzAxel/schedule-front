'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { BookOpen, Users, Calendar, Clock } from 'lucide-react';

export function DashboardStats() {
	const [stats, setStats] = useState<{
		totalLessons: number;
		totalAdmins: number;
		currentParity: string;
		lessonsThisWeek: number;
		totalGroups: number;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setIsLoading(true);
				const [lessons, admins, settings, groups] = await Promise.all([
					apiService.getLessons(),
					apiService.getAdmins(),
					apiService.getParity(),
					apiService.getGroups(),
				]);

				let lessonsThisWeek = 0;
				if (groups.length > 0) {
					const schedule = await apiService.getSchedule(groups[0].id);
					lessonsThisWeek = Object.values(schedule).flat().length;
				}

				setStats({
					totalLessons: lessons.length,
					totalAdmins: admins.length,
					currentParity: settings.parity === 'even' ? 'нечётная' : 'чётная',
					lessonsThisWeek,
					totalGroups: groups.length,
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
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="bg-background rounded-lg border border-border/50 p-3">
						<div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse"></div>
						<div className="h-6 bg-muted rounded w-12 animate-pulse"></div>
					</div>
				))}
			</div>
		);
	}

	if (!stats) return null;

	const statCards = [
		{ title: 'Всего занятий', value: stats.totalLessons, icon: BookOpen },
		{ title: 'Группы', value: stats.totalGroups, icon: Users },
		{ title: 'Неделя', value: stats.currentParity, icon: Calendar },
		{ title: 'На неделе', value: stats.lessonsThisWeek, icon: Clock },
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
			{statCards.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<div
						key={index}
						className="bg-background rounded-lg border border-border/50 p-3 flex items-center gap-3"
					>
						<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
							<Icon className="w-4 h-4 text-primary" />
						</div>
						<div>
							<div className="text-lg font-semibold text-text">{stat.value}</div>
							<div className="text-xs text-text-muted">{stat.title}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
