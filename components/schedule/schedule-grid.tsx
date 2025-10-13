'use client';

import { useEffect, useState } from 'react';
import { apiService, type Schedule, type Settings } from '@/lib/api';
import { isCurrentWeekEven } from '@/lib/parity';
import { DAY_NAMES } from '@/const/days';
import { useLocalSettings } from '@/store/localSettingsStore';
import { ScheduleTable } from '@/modules/schedule/ScheduleTable';
import { WeekStatus } from '@/modules/schedule/WeekStatus';

const DAYS = Object.keys(DAY_NAMES);

export function ScheduleGrid() {
	const [schedule, setSchedule] = useState<Schedule>({});
	const [settings, setSettings] = useState<Settings | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [localSettings] = useLocalSettings();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [scheduleData, settingsData] = await Promise.all([
					apiService.getSchedule(),
					apiService.getParity(),
				]);
				setSchedule(scheduleData);
				setSettings(settingsData);
			} catch (err) {
				setError('Ошибка загрузки расписания');
				console.error('Error fetching schedule:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	const currentParity = isCurrentWeekEven(settings?.parity!) ? 'even' : 'odd';

	function getCurrentWeekRange(): { start: Date; end: Date } {
		const today = new Date();
		const dayOfWeek = today.getDay(); // 0 (вс) - 6 (сб)
		const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Смещение до понедельника

		const start = new Date(today);
		start.setDate(today.getDate() - diffToMonday);
		start.setHours(0, 0, 0, 0); // Начало дня

		const end = new Date(start);
		end.setDate(start.getDate() + 6);
		end.setHours(23, 59, 59, 999); // Конец дня

		return { start, end };
	}

	const currentWeekRange = getCurrentWeekRange();

	return (
		<div className="min-h-screen bg-background-dark p-5 flex flex-col gap-[24px]">
			<WeekStatus
				isEven={isCurrentWeekEven(settings?.parity!)}
				weekEndDate={currentWeekRange.end}
				weekStartDate={currentWeekRange.start}
			/>
			<ScheduleTable schedule={schedule} />
		</div>
	);
}
