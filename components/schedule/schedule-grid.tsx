'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService, Lesson, type Schedule, type Settings } from '@/lib/api';
import { Clock, MapPin, User, Calendar, LucideUser, LucideMapPin } from 'lucide-react';
import { isCurrentWeekEven } from '@/lib/parity';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { DAY_NAMES } from '@/const/days';
import { MAX_PAIRS_COUNT, PAIR_TIMES } from '@/const/pairs';
import { PARITY_LABELS } from '@/const/parity';
import { filterNotHiddenLessons, isCurrentLessonDayEmpty } from '@/lib/lessons';
import { LessonItem } from '@/components/lesson/lesson-item';
import { CoupledLessonItem } from '@/components/lesson/copuled-lesson-item';
import { SettingsMenu } from '@/components/settings/settings-menu';
import { useLocalSettings } from '@/store/localSettingsStore';
import { ScheduleTable } from '@/modules/schedule/ScheduleTable';

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

	return (
		<div className="min-h-screen bg-background-dark p-5">
			<ScheduleTable />
		</div>
	);
}
