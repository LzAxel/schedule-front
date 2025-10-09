'use client';
import { ScheduleGrid } from '@/components/schedule/schedule-grid';
import { LocalSettingsProvider } from '@/store/localSettingsStore';

export default function SchedulePage() {
	return (
		<LocalSettingsProvider>
			<ScheduleGrid />
		</LocalSettingsProvider>
	);
}
