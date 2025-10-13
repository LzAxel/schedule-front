import { FC } from 'react';
import { LucideMapPin, LucideUser } from 'lucide-react';

interface Props {
	title: string;
	teacher: string;
	place: string;
}

export const ScheduleTableItem: FC<Props> = ({ title, teacher, place }) => {
	return (
		<div className="bg-gradient max-h-[130px] rounded-sm flex border border-border flex-col gap-[8px] p-[16px] justify-between overflow-hidden shadow-sm min-w-[150px]">
			<p className="text-sm line-clamp-2">{title}</p>
			<div className="text-text-muted text-xs flex flex-col gap-y-[5px]">
				<div className="flex flex-row items-center gap-[5px]">
					<LucideUser className="w-[14px] h-[14px]" />
					{teacher}
				</div>
				<div className="flex flex-row items-center gap-[5px]">
					<LucideMapPin className="w-[14px] h-[14px]" />
					{place}
				</div>
			</div>
		</div>
	);
};
