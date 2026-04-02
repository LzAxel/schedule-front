import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { apiService, type Schedule, type Settings, type Group } from '@/lib/api';
import { getCurrentWeekParity, isCurrentWeekEven } from '@/lib/parity';
import { DAY_NAMES } from '@/const/days';
import { useLocalSettings } from '@/store/localSettingsStore';
import { ScheduleTable } from '@/modules/schedule/ScheduleTable';
import { WeekStatus } from '@/modules/schedule/WeekStatus';
import { ScheduleTableMobile } from '@/modules/schedule/ScheduleTableMobile';
import { getCurrentWeekRange } from '@/lib/date';
import { WeekStatusDropdown } from '@/components/my-ui/WeekStatusDropdown';
import { filterNotHiddenLessons } from '@/lib/lessons';
import { ThemeSwitcher } from '@/components/my-ui/ThemeSwitcher';
import { Settings as SettingsIcon } from 'lucide-react';

const DAYS = Object.keys(DAY_NAMES);

const EMPTY_SCHEDULE: Schedule = {
	Monday: [],
	Tuesday: [],
	Wednesday: [],
	Thursday: [],
	Friday: [],
	Saturday: [],
	Sunday: [],
};

export function ScheduleGrid() {
	const navigate = useNavigate();
	const [schedule, setSchedule] = useState<Schedule>(EMPTY_SCHEDULE);
	const [settings, setSettings] = useState<Settings | null>(null);
	const [groups, setGroups] = useState<Group[]>([]);
	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [localSettings, _, setDisplay] = useLocalSettings();

	useEffect(() => {
		const loadGroups = async () => {
			try {
				const groupsData = await apiService.getGroups();
				setGroups(groupsData);
				if (groupsData.length > 0 && !selectedGroupId) {
					setSelectedGroupId(groupsData[0].id);
				}
			} catch (err) {
				console.error('Error fetching groups:', err);
			}
		};
		loadGroups();
	}, []);

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const settingsData = await apiService.getParity();
				setSettings(settingsData);
			} catch (err) {
				console.error('Error fetching settings:', err);
			}
		};
		fetchSettings();
	}, []);

	useEffect(() => {
		const fetchSchedule = async () => {
			if (!selectedGroupId) return;
			try {
				setIsLoadingSchedule(true);
				const scheduleData = await apiService.getSchedule(selectedGroupId);
				setSchedule(scheduleData || EMPTY_SCHEDULE);
				setError(null);
			} catch (err) {
				setError('Ошибка загрузки расписания');
				setSchedule(EMPTY_SCHEDULE);
				console.error('Error fetching schedule:', err);
			} finally {
				setIsLoadingSchedule(false);
				setIsLoading(false);
			}
		};

		fetchSchedule();
	}, [selectedGroupId]);

	const currentWeekRange = getCurrentWeekRange();
	const currentWeekParity = getCurrentWeekParity(settings?.parity!);

	const filteredSchedule = useMemo(() => {
		const filtered = { ...schedule };

		Object.keys(filtered).forEach((key) => {
			if (filtered[key]) {
				filtered[key] = filterNotHiddenLessons(filtered[key], localSettings.display, currentWeekParity);
			}
		});

		return filtered as Schedule;
	}, [schedule, localSettings.display]);

	if (isLoading && groups.length === 0) {
		return (
			<div className="min-h-screen bg-background-dark p-5 flex items-center justify-center gap-[24px]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background-dark p-5 flex flex-col gap-[24px]">
			<div className="gap-[12px] flex flex-col xl:flex-row w-full xl:w-fit items-start xl:items-center">
				<ThemeSwitcher />
				<select
					value={selectedGroupId || ''}
					onChange={(e) => setSelectedGroupId(Number(e.target.value))}
					className="h-8 px-3 rounded-md bg-background text-text text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
				>
					{groups.length === 0 && <option value="">Нет групп</option>}
					{groups.map((group) => (
						<option key={group.id} value={group.id}>
							{group.name}
						</option>
					))}
				</select>
				<button
					onClick={() => navigate({ to: '/admin' })}
					className="w-fit flex p-[8px] rounded-md shadow-sm bg-background-light text-text-muted text-sm hover:bg-background transition-colors"
				>
					<SettingsIcon />
				</button>
				<WeekStatus
					isEven={isCurrentWeekEven(settings?.parity!)}
					weekEndDate={currentWeekRange.end}
					weekStartDate={currentWeekRange.start}
				/>
				<WeekStatusDropdown value={localSettings.display} onSelect={(value) => setDisplay(value)} />
			</div>

			{isLoadingSchedule && (
				<div className="flex items-center justify-center py-8">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
				</div>
			)}

			{error && (
				<div className="text-center py-8 text-text-muted">{error}</div>
			)}

			{!isLoadingSchedule && !error && (
				<>
					<div className="hidden xl:block">
						<ScheduleTable
							mode={localSettings.display}
							schedule={filteredSchedule}
							weekStartDate={currentWeekRange.start}
						/>
					</div>
					<div className="block xl:hidden">
						<ScheduleTableMobile
							mode={localSettings.display}
							schedule={filteredSchedule}
							weekStartDate={currentWeekRange.start}
						/>
					</div>
				</>
			)}
		</div>
	);
}
