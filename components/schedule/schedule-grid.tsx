'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService, Lesson, type Schedule, type Settings } from '@/lib/api';
import { Clock, MapPin, User, Calendar } from 'lucide-react';
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

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<p className="text-center text-destructive">{error}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const currentParity = isCurrentWeekEven(settings?.parity!) ? 'even' : 'odd';

	console.log(localSettings);
	return (
		<div className="min-h-screen bg-muted/30">
			<div className="w-full max-w-[2500px] mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-balance mb-4">Расписание занятий</h1>
					{settings && (
						<div className="flex items-center justify-center gap-2">
							<Calendar className="h-5 w-5 text-muted-foreground" />
							<span className="text-lg text-muted-foreground">
								Текущая неделя:{' '}
								<span className="font-semibold text-primary">
									{isCurrentWeekEven(settings.parity) ? 'четная' : 'нечетная'}
								</span>
							</span>
						</div>
					)}
					<div className="mx-auto mt-4">
						<SettingsMenu />
					</div>
				</div>

				<div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
					{DAYS.map((day) => (
						<Card key={day} className="h-fit">
							<CardHeader className="pb-0">
								<CardTitle className="text-xl text-center text-primary">
									{DAY_NAMES[day as keyof typeof DAY_NAMES]}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{schedule[day] &&
								!isCurrentLessonDayEmpty(schedule[day], localSettings.display, currentParity) ? (
									filterNotHiddenLessons(schedule[day], localSettings.display, currentParity)
										.reduce(
											(prev, lesson) => {
												if (!prev[lesson.pair_number - 1]) {
													prev[lesson.pair_number - 1] = [];
												}
												prev[lesson.pair_number - 1].push(lesson);
												return prev;
											},
											new Array(MAX_PAIRS_COUNT) as Array<Lesson[]>,
										)
										.map((lesson, index) => {
											if (lesson.length === 2) {
												return (
													<CoupledLessonItem
														key={`${day}-${lesson.length}-${lesson[0].pair_number}-${index}`}
														lessons={lesson}
														currentParity={currentParity}
													/>
												);
											} else if (lesson.length === 1) {
												return (
													<LessonItem
														key={`${day}-${lesson.length}-${lesson[0].pair_number}-${index}`}
														lesson={lesson[0]}
														currentParity={currentParity}
													/>
												);
											}
										})
								) : (
									<div className="text-center py-8 text-muted-foreground">
										<Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
										<p>Занятий нет</p>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
