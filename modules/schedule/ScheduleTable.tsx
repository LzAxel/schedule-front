import { FC } from 'react';
import { ScheduleTableItem } from '@/modules/schedule/ScheduleTableItem';

const weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

interface Props {
	items: any[];
}

export const ScheduleTable: FC<Props> = ({ items }) => {
	return (
		<div className="grid grid-cols-[85px_1fr] gap-[12px]">
			<div className=""></div>
			<div className="flex flex-row gap-[20px] px-[18px] py-[12px] rounded-md bg-background shadow-sm">
				{weekdays.map((day) => {
					return <div className="w-full text-center">{day}</div>;
				})}
			</div>
			<div className="flex flex-col bg-background shadow-sm rounded-md px-[2px] py-[18px] gap-[10px] items-center">
				{new Array(8).fill(0).map(() => {
					return (
						<div className="flex flex-row items-center h-full px-[8px] py-[18px] gap-[8px]">
							<p className="text-2xl">1</p>
							<div className="text-xs text-text-muted">
								<p>08:00</p>
								<p>09:30</p>
							</div>
						</div>
					);
				})}
			</div>
			<div className="grid grid-cols-[repeat(6,1fr)] grid-rows-8 p-[18px] gap-y-[15px] gap-x-[20px] bg-background rounded-md shadow-sm">
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
				<ScheduleTableItem title="Математический анализ" teacher="Марков И.А." place="ФТИ 203" />
			</div>
		</div>
	);
};
