'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { Server, Database, Users, BookOpen, Calendar, Clock } from 'lucide-react';
import { isCurrentWeekEven } from '@/lib/parity';

interface SystemInfo {
	totalLessons: number;
	totalAdmins: number;
	currentParity: string;
	lessonsThisWeek: number;
	lastUpdate: string;
}

export function SystemInfo() {
	const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSystemInfo = async () => {
			try {
				setIsLoading(true);
				const [lessons, admins, settings, schedule] = await Promise.all([
					apiService.getLessons(),
					apiService.getAdmins(),
					apiService.getParity(),
					apiService.getSchedule(),
				]);

				const lessonsThisWeek = Object.values(schedule).flat().length;

				setSystemInfo({
					totalLessons: lessons.length,
					totalAdmins: admins.length,
					currentParity: isCurrentWeekEven(settings.parity) ? 'нечётная' : 'чётная',
					lessonsThisWeek,
					lastUpdate: new Date().toLocaleString('ru-RU'),
				});
			} catch (error) {
				console.error('Error fetching system info:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSystemInfo();
	}, []);

	if (isLoading) {
		return (
			<div className="bg-background rounded-lg border border-border/50 p-4">
				<div className="flex items-center gap-2 mb-3">
					<div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
					<div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
				</div>
				<div className="space-y-2">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-8 bg-muted rounded animate-pulse"></div>
					))}
				</div>
			</div>
		);
	}

	if (!systemInfo) return null;

	const infoItems = [
		{ label: 'Всего занятий', value: systemInfo.totalLessons, icon: BookOpen },
		{ label: 'Админы', value: systemInfo.totalAdmins, icon: Users },
		{ label: 'Неделя', value: systemInfo.currentParity, icon: Calendar },
		{ label: 'На неделе', value: systemInfo.lessonsThisWeek, icon: Clock },
	];

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<div className="flex items-center gap-2 mb-3">
				<Server className="w-4 h-4 text-primary" />
				<span className="text-sm font-medium text-text">Система</span>
			</div>

			<div className="space-y-2">
				{infoItems.map((item, index) => {
					const Icon = item.icon;
					return (
						<div
							key={index}
							className="flex items-center justify-between p-2 rounded-md bg-background-light/50"
						>
							<div className="flex items-center gap-2">
								<Icon className="w-4 h-4 text-text-muted" />
								<span className="text-sm text-text-muted">{item.label}</span>
							</div>
							<span className="text-sm font-medium text-text">{item.value}</span>
						</div>
					);
				})}
			</div>

			<div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2 text-xs text-text-muted">
				<Database className="w-3 h-3" />
				<span>{systemInfo.lastUpdate}</span>
			</div>
		</div>
	);
}
