import { Edit, MapPin, Trash2, User, Copy, Clock } from 'lucide-react';
import { LessonExtended } from '@/lib/api';
import React from 'react';
import { PAIR_TIMES } from '@/const/pairs';
import { PARITY_LABELS } from '@/const/parity';
import { ParityType } from '@/types/parity';
import clsx from 'clsx';

interface Props {
	lesson: LessonExtended;
	onEdit?: () => void;
	onDelete?: () => void;
	onDuplicate?: () => void;
	isEditable?: boolean;
	currentParity?: ParityType;
}

export const LessonItem: React.FC<Props> = ({ lesson, onEdit, onDelete, onDuplicate, isEditable, currentParity }) => {
	const name = lesson.subject_name;
	const teacher = lesson.teacher_name;
	const location = lesson.location_name;
	const groupName = lesson.group_name;
	const parityType = lesson.parity_type;

	const isActive = parityType === 'static' || parityType === currentParity;

	return (
		<div
			className="group relative p-2.5 rounded-md bg-background-light/40 border border-transparent hover:border-border/30 transition-all"
		>
			<div className="flex items-start gap-2">
				<div
					className={clsx(
						'w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0',
						isActive ? 'bg-primary/15 text-primary' : 'bg-muted text-text-muted',
					)}
				>
					{lesson.pair_number}
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-1.5 mb-0.5">
						<Clock className="w-3 h-3 text-text-muted shrink-0" />
						<span className="text-xs text-text-muted">{PAIR_TIMES[lesson.pair_number as keyof typeof PAIR_TIMES]}</span>
					</div>

					<div className="flex items-center gap-2 mb-0.5">
						<h4 className="text-sm font-medium text-text truncate">{name}</h4>
						{groupName && (
							<span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
								{groupName}
							</span>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-muted">
						<div className="flex items-center gap-1">
							<User className="w-3 h-3" />
							<span className="truncate max-w-[100px]">{teacher}</span>
						</div>
						<div className="flex items-center gap-1">
							<MapPin className="w-3 h-3" />
							<span>{location}</span>
						</div>
					</div>
				</div>

				<span
					className={clsx(
						'text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0',
						isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-text-muted',
					)}
				>
					{PARITY_LABELS[parityType as keyof typeof PARITY_LABELS] || parityType}
				</span>
			</div>

			{isEditable && (
				<div className="mt-2 pt-2 border-t border-border/20 flex gap-1 md:absolute md:top-1.5 md:right-1.5 md:mt-0 md:pt-0 md:border-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onEdit?.();
						}}
						className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors md:p-1"
						title="Изменить"
					>
						<Edit className="w-3.5 h-3.5 md:w-3 md:h-3" />
						<span className="hidden sm:inline">Изменить</span>
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDuplicate?.();
						}}
						className="p-1.5 rounded-md bg-background text-text-muted hover:bg-background-light text-xs transition-colors md:p-1"
						title="Дублировать"
					>
						<Copy className="w-3.5 h-3.5 md:w-3 md:h-3" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete?.();
						}}
						className="p-1.5 rounded-md bg-background text-danger hover:bg-danger/10 text-xs transition-colors md:p-1"
						title="Удалить"
					>
						<Trash2 className="w-3.5 h-3.5 md:w-3 md:h-3" />
					</button>
				</div>
			)}
		</div>
	);
};
