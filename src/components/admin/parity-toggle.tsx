'use client';

import { useEffect, useState } from 'react';
import { apiService, type Settings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Calendar, RotateCcw } from 'lucide-react';
import { isCurrentWeekEven } from '@/lib/parity';

export function ParityToggle() {
	const [settings, setSettings] = useState<Settings | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isToggling, setIsToggling] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				setIsLoading(true);
				const data = await apiService.getParity();
				setSettings(data);
			} catch (error) {
				toast({
					title: 'Ошибка',
					description: 'Не удалось загрузить настройки',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchSettings();
	}, [toast]);

	const handleToggle = async () => {
		if (!settings) return;

		setIsToggling(true);
		try {
			const newSettings = await apiService.toggleParity();
			setSettings(newSettings);
			toast({
				title: 'Четность изменена',
			});
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось изменить четность',
				variant: 'destructive',
			});
		} finally {
			setIsToggling(false);
		}
	};

	if (isLoading) {
		return (
			<div className="bg-background rounded-lg border border-border/50 p-4">
				<div className="h-5 bg-muted rounded w-32 mb-3 animate-pulse"></div>
				<div className="h-10 bg-muted rounded animate-pulse"></div>
			</div>
		);
	}

	if (!settings) return null;

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<div className="flex items-center gap-2 mb-3">
				<Calendar className="w-4 h-4 text-primary" />
				<span className="text-sm font-medium text-text">Четность недели</span>
			</div>

			<div className="flex items-center justify-between p-3 rounded-lg bg-background-light/50 mb-3">
				<span className="text-sm text-text-muted">Текущая</span>
				<span className="text-sm font-medium text-primary">
					{isCurrentWeekEven(settings.parity) ? 'Нечётная' : 'Чётная'}
				</span>
			</div>

			<button
				onClick={handleToggle}
				disabled={isToggling}
				className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
			>
				<RotateCcw className={`w-4 h-4 ${isToggling ? 'animate-spin' : ''}`} />
				{isToggling ? 'Переключение...' : 'Переключить'}
			</button>
		</div>
	);
}
