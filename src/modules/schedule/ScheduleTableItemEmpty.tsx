import { FC } from 'react';
import { LucideMapPin, LucideUser } from 'lucide-react';

interface Props {}

export const ScheduleTableItemEmpty: FC<Props> = () => {
	return (
		<div className="bg-background rounded-sm flex border-border flex-col gap-[8px] p-[16px] overflow-hidden shadow-sm min-w-[150px] h-full"></div>
	);
};
