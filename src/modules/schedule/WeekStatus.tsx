import { formatDateRange } from '@/lib/date';

interface Props {
	isEven: boolean;
	weekStartDate: Date;
	weekEndDate: Date;
}

export const WeekStatus = (props: Props) => {
	return (
		<div className="w-full whitespace-nowrap text-xs sm:text-sm rounded-md bg-background flex flex-row gap-[15px] justify-between p-[10px]">
			<div className="text-text-muted">{formatDateRange(props.weekStartDate, props.weekEndDate)}</div>
			{props.isEven ? (
				<div className="text-primary">Чётная (знам.)</div>
			) : (
				<div className="text-secondary">Нечётная (числ.)</div>
			)}
		</div>
	);
};
