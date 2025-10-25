import { FC, useMemo } from 'react';
import { Schedule } from '@/lib/api';
import { DAY_NAMES } from '@/const/days';
import { PAIR_TIMES } from '@/const/pairs';
import { ScheduleTableItem } from '@/modules/schedule/ScheduleTableItem';
import { ScheduleTableItemEmpty } from '@/modules/schedule/ScheduleTableItemEmpty';
import { addDaysToDate, formatDateToDayMonth, isToday } from '@/lib/date';
import { clsx } from 'clsx';
import { SettingsDisplayType } from '@/store/localSettingsStore';

interface Props {
	schedule: Schedule;
	weekStartDate: Date;
	mode: SettingsDisplayType;
}

export const ScheduleTable: FC<Props> = ({ schedule, weekStartDate, mode }) => {
	const maxPairInWeek = useMemo(() => {
		return Object.values(schedule).reduce((acc, week) => {
			let maxCount = acc;
			week.forEach((pair) => {
				if (pair.pair_number > maxCount) {
					maxCount = pair.pair_number;
				}
			});

			return maxCount;
		}, 1);
	}, [schedule]);

	return (
		<div className="grid grid-cols-[85px_1fr] gap-[12px]">
			<div className=""></div>
			<div className="flex flex-row gap-[20px] px-[18px] py-[12px] rounded-md bg-background shadow-sm">
				{Object.values(DAY_NAMES).map((day, index) => {
					return (
						<div key={day} className="flex flex-col items-center w-full text-center">
							<p className={clsx(isToday(addDaysToDate(weekStartDate, index)) && 'text-primary')}>
								{day}
							</p>
							<p className="text-text-muted text-xs">{formatDateToDayMonth(weekStartDate, index)}</p>
						</div>
					);
				})}
			</div>
			<div className="flex flex-col bg-background shadow-sm rounded-md px-[2px] py-[18px] gap-[10px] items-center">
				{new Array(maxPairInWeek).fill(0).map((_, index) => {
					const num = (index + 1) as unknown as keyof typeof PAIR_TIMES;
					return (
						<div key={index} className="flex flex-row items-center h-full px-[8px] py-[18px] gap-[8px]">
							<p className="text-2xl">{index + 1}</p>
							<div className="text-xs text-text-muted">
								<p>{PAIR_TIMES[num].split(' - ')[0]}</p>
								<p>{PAIR_TIMES[num].split(' - ')[1]}</p>
							</div>
						</div>
					);
				})}
			</div>
			<div className="grid grid-cols-[repeat(6,1fr)] p-[18px] gap-x-[20px] bg-background rounded-md shadow-sm">
				{Object.keys(DAY_NAMES).map((weekday) => {
					return (
						<div
							key={weekday}
							className="grid gap-y-[15px]"
							style={{ gridTemplateRows: `repeat(${maxPairInWeek}, 1fr)` }}
						>
							{new Array(maxPairInWeek).fill(0).map((_, index) => {
								const num = index + 1;
								const pairs = schedule[weekday].filter((checkPair) => {
									return checkPair.pair_number === num;
								});

								if (pairs.length === 0) {
									return <ScheduleTableItemEmpty key={`${index}-${weekday}`} />;
								}

								if (mode === 'all') {
									const odd = pairs.find((pair) => pair.type === 'odd');
									const even = pairs.find((pair) => pair.type === 'even');
									const staticPair = pairs.find((pair) => pair.type === 'static');

									if (staticPair) {
										return (
											<ScheduleTableItem
												key={staticPair.id}
												title={staticPair.name}
												teacher={staticPair.teacher}
												place={staticPair.location}
												parity={staticPair.type}
											/>
										);
									}

									return (
										<div
											key={`${index}-${weekday}`}
											className="grid grid-cols-1 grid-rows-2 gap-[8px]"
										>
											{odd ? (
												<ScheduleTableItem
													key={odd.id}
													title={odd.name}
													teacher={odd.teacher}
													place={odd.location}
													parity={odd.type}
												/>
											) : (
												<ScheduleTableItemEmpty />
											)}
											{even ? (
												<ScheduleTableItem
													key={even.id}
													title={even.name}
													teacher={even.teacher}
													place={even.location}
													parity={even.type}
												/>
											) : (
												<ScheduleTableItemEmpty />
											)}
										</div>
									);
								}

								return (
									<ScheduleTableItem
										key={pairs[0].id}
										title={pairs[0].name}
										teacher={pairs[0].teacher}
										place={pairs[0].location}
										parity={pairs[0].type}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};
