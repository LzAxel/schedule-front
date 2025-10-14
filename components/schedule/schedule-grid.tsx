'use client';

import { useEffect, useState } from 'react';
import { apiService, type Schedule, type Settings } from '@/lib/api';
import { isCurrentWeekEven } from '@/lib/parity';
import { DAY_NAMES } from '@/const/days';
import { useLocalSettings } from '@/store/localSettingsStore';
import { ScheduleTable } from '@/modules/schedule/ScheduleTable';
import { WeekStatus } from '@/modules/schedule/WeekStatus';
import { ScheduleTableMobile } from '@/modules/schedule/ScheduleTableMobile';
import { getCurrentWeekRange } from '@/lib/date';
import { WeekStatusDropdown } from '@/components/my-ui/WeekStatusDropdown';

const DAYS = Object.keys(DAY_NAMES);

export function ScheduleGrid() {
	const [schedule, setSchedule] = useState<Schedule>({});
	const [settings, setSettings] = useState<Settings | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [localSettings, _, setDisplay] = useLocalSettings();

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

	const currentWeekRange = getCurrentWeekRange();

	return (
		<div className="min-h-screen bg-background-dark p-5 flex flex-col gap-[24px]">
			<div className="gap-[12px] flex flex-col xl:flex-row w-full xl:w-fit">
				<WeekStatus
					isEven={isCurrentWeekEven(settings?.parity!)}
					weekEndDate={currentWeekRange.end}
					weekStartDate={currentWeekRange.start}
				/>
				<WeekStatusDropdown value={localSettings.display} onSelect={(value) => setDisplay(value)} />
			</div>
			<div className="hidden xl:block">
				<ScheduleTable schedule={schedule} weekStartDate={currentWeekRange.start} />
			</div>
			<div className="block xl:hidden">
				<ScheduleTableMobile schedule={schedule} weekStartDate={currentWeekRange.start} />
			</div>
		</div>
	);
}
