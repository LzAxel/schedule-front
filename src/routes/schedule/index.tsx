import { LocalSettingsProvider } from '@/store/localSettingsStore';
import { createFileRoute } from '@tanstack/react-router';
import { ScheduleGrid } from '@/components/schedule/schedule-grid';

export const Route = createFileRoute('/schedule/')({
	component: SchedulePage,
});

function SchedulePage() {
	return (
		<LocalSettingsProvider>
			<ScheduleGrid />
		</LocalSettingsProvider>
	)
}
