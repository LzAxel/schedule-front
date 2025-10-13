import { FC } from 'react';
import { Schedule } from '@/lib/api';
import { DAY_NAMES } from '@/const/days';
import { MAX_PAIRS_COUNT, PAIR_TIMES } from '@/const/pairs';
import { ScheduleTableItem } from '@/modules/schedule/ScheduleTableItem';
import { ScheduleTableItemEmpty } from '@/modules/schedule/ScheduleTableItemEmpty';

interface Props {
	schedule: Schedule;
}

export const ScheduleTable: FC<Props> = ({ schedule }) => {
	return (
		<div className="grid grid-cols-[85px_1fr] gap-[12px]">
			<div className=""></div>
			<div className="flex flex-row gap-[20px] px-[18px] py-[12px] rounded-md bg-background shadow-sm">
				{Object.values(DAY_NAMES).map((day) => {
					return <div className="w-full text-center">{day}</div>;
				})}
			</div>
			<div className="flex flex-col bg-background shadow-sm rounded-md px-[2px] py-[18px] gap-[10px] items-center">
				{new Array(MAX_PAIRS_COUNT).fill(0).map((_, index) => {
					const num = (index + 1) as unknown as keyof typeof PAIR_TIMES;
					return (
						<div className="flex flex-row items-center h-full px-[8px] py-[18px] gap-[8px]">
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
						<div className="grid grid-rows-8 gap-y-[15px]">
							{new Array(MAX_PAIRS_COUNT).fill(0).map((_, index) => {
								const num = index + 1;
								const pair = schedule[weekday].find((checkPair) => {
									return checkPair.pair_number === num;
								});
								if (pair) {
									return (
										<ScheduleTableItem
											title={pair.name}
											teacher={pair.teacher}
											place={pair.location}
										/>
									);
								}
								return <ScheduleTableItemEmpty />;
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};
