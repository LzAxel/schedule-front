import { formatDateRange } from '@/lib/date';

interface Props {
	isEven: boolean;
	weekStartDate: Date;
	weekEndDate: Date;
}

export const WeekStatus = (props: Props) => {
	return (
		<div className="items-center w-full whitespace-nowrap text-xs sm:text-sm rounded-md bg-background-light flex flex-row gap-3 justify-between px-2.5 py-1.5 border border-border/30">
			<div className="text-text-muted">{formatDateRange(props.weekStartDate, props.weekEndDate)}</div>
			{props.isEven ? (
				<div className="text-primary font-medium">Чётная (знам.)</div>
			) : (
				<div className="text-secondary font-medium">Нечётная (числ.)</div>
			)}
		</div>
	);
};
