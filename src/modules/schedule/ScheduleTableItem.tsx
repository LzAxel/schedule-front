import { FC } from 'react';
import { LucideMapPin, LucideUser } from 'lucide-react';
import { ParityType } from '@/types/parity';
import { clsx } from 'clsx';

interface Props {
	title: string;
	teacher: string;
	place: string;
	parity?: ParityType;
}

export const ScheduleTableItem: FC<Props> = ({ title, teacher, place, parity }) => {
	return (
		<div
			className={clsx(
				parity === 'static' && 'max-h-full h-full',
				'bg-gradient shrink-0 rounded-sm flex border border-border flex-col gap-[8px] p-[16px] justify-between overflow-hidden shadow-sm min-w-[150px]',
			)}
		>
			<p
				className={clsx('text-sm line-clamp-2', {
					'text-primary': parity === 'even',
					'text-secondary': parity === 'odd',
				})}
			>
				{title}
			</p>
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
