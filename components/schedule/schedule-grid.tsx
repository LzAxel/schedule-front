'use client';

import {useEffect, useMemo, useState} from 'react';
import {apiService, type Schedule, type Settings} from '@/lib/api';
import {getCurrentWeekParity, isCurrentWeekEven} from '@/lib/parity';
import {DAY_NAMES} from '@/const/days';
import {useLocalSettings} from '@/store/localSettingsStore';
import {ScheduleTable} from '@/modules/schedule/ScheduleTable';
import {WeekStatus} from '@/modules/schedule/WeekStatus';
import {ScheduleTableMobile} from '@/modules/schedule/ScheduleTableMobile';
import {getCurrentWeekRange} from '@/lib/date';
import {WeekStatusDropdown} from '@/components/my-ui/WeekStatusDropdown';
import {filterNotHiddenLessons} from "@/lib/lessons";

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

    const currentWeekRange = getCurrentWeekRange();
    const currentWeekParity = getCurrentWeekParity(settings?.parity!)

    const filteredSchedule = useMemo(() => {
        const filtered = {...schedule};

        Object.keys(filtered).forEach((key) => {
            filtered[key] = filterNotHiddenLessons(filtered[key], localSettings.display, currentWeekParity);
        })

        return filtered as Schedule;
    }, [schedule, localSettings.display])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark p-5 flex flex-col gap-[24px]">
            <div className="">

            </div>
            <div className="gap-[12px] flex flex-col xl:flex-row w-full xl:w-fit">
                <WeekStatus
                    isEven={isCurrentWeekEven(settings?.parity!)}
                    weekEndDate={currentWeekRange.end}
                    weekStartDate={currentWeekRange.start}
                />
                <WeekStatusDropdown value={localSettings.display} onSelect={(value) => setDisplay(value)}/>
            </div>
            <div className="hidden xl:block">
                <ScheduleTable mode={localSettings.display} schedule={filteredSchedule}
                               weekStartDate={currentWeekRange.start}/>
            </div>
            <div className="block xl:hidden">
                <ScheduleTableMobile mode={localSettings.display} schedule={filteredSchedule}
                                     weekStartDate={currentWeekRange.start}/>
            </div>
        </div>
    );
}
