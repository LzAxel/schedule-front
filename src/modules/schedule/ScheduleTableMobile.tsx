import { Schedule } from '@/lib/api';
import { DAY_NAMES } from '@/const/days';
import { ScheduleTableMobileItem } from '@/modules/schedule/ScheduleTableMobileItem';
import { addDaysToDate, formatDateToDayMonth, isToday } from '@/lib/date';
import clsx from 'clsx';
import { SettingsDisplayType } from '@/store/localSettingsStore';

interface Props {
	schedule: Schedule;
	weekStartDate: Date;
	mode: SettingsDisplayType;
}

export const ScheduleTableMobile = ({ schedule, weekStartDate, mode }: Props) => {
	return (
		<div className="flex flex-col gap-[10px]">
			{Object.entries(DAY_NAMES).map(([weekday, weekdayName], index) => {
				const daySchedule = schedule[weekday] || [];
				return (
					<div
						key={weekday}
						className={clsx(
							'rounded-md bg-background shadow-sm flex flex-col gap-[10px] p-[10px] pb-[5px]',
							isToday(addDaysToDate(weekStartDate, index)) && 'outline-primary outline',
						)}
					>
						<p className="text-xs text-text-muted">{`${weekdayName}, ${formatDateToDayMonth(weekStartDate, index)}`}</p>
						<div className="flex flex-col gap-[6px]">
							{daySchedule.length > 0 ? (
								daySchedule.map((pair) => (
									<ScheduleTableMobileItem
										key={`${weekday}-${pair.id}`}
										title={pair.subject_name}
										teacher={pair.teacher_name}
										place={pair.location_name}
										pairNumber={pair.pair_number}
										parity={pair.parity_type}
									/>
								))
							) : (
								<div className="text-text-muted text-center text-xs pb-[5px]">Свободный день</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};
