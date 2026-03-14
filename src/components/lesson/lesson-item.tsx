import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Edit, MapPin, Trash2, User, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Lesson } from '@/lib/api';
import React from 'react';
import { PAIR_TIMES } from '@/const/pairs';
import { PARITY_LABELS } from '@/const/parity';
import { ParityType } from '@/types/parity';

interface Props {
	lesson: Lesson;
	onEdit?: () => void;
	onDelete?: () => void;
	onDuplicate?: () => void;
	isEditable?: boolean;
	currentParity?: ParityType;
}

export const LessonItem: React.FC<Props> = ({ lesson, onEdit, onDelete, onDuplicate, isEditable, currentParity }) => {
	return (
		<Card key={lesson.id} className="flex flex-row p-0 hover:shadow-md transition-shadow gap-0 overflow-hidden">
			<div className="w-6 text-xl bg-accent opacity-80 text-white rounded-l flex items-center justify-center shrink-0">
				{lesson.pair_number}
			</div>
			<div className="p-3 pl-2 flex flex-col grow-1">
				<CardHeader className="block pt-0 pl-2 pr-2 pb-2">
					<div className="flex flex-col items-start gap-1 overflow-hidden">
						<div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
							<span>{PAIR_TIMES[lesson.pair_number as keyof typeof PAIR_TIMES]}</span>
						</div>
						<CardTitle className="text-lg text-pretty leading-tight overflow-hidden truncate">
							{lesson.name}
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-3 pl-2 pr-0 flex flex-col grow-1">
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-2 text-muted-foreground">
							<User className="h-4 w-4 shrink-0" />
							<span className="text-pretty">{lesson.teacher}</span>
						</div>

						<div className="flex items-center gap-2 text-muted-foreground">
							<MapPin className="h-4 w-4 shrink-0" />
							<span>{lesson.location}</span>
						</div>
					</div>

					<div className="">
						<Badge
							variant={lesson.type === 'static' || lesson.type === currentParity ? 'default' : 'outline'}
							className="text-xs"
						>
							{PARITY_LABELS[lesson.type]}
						</Badge>
					</div>

					{isEditable && (
						<div className="flex gap-2">
							<button
								onClick={() => onEdit?.()}
								className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-background-light text-text-muted text-sm shadow-sm hover:bg-background transition-colors"
							>
								<Edit className="h-4 w-4" />
								Изменить
							</button>
							<button
								onClick={() => onDuplicate?.()}
								className="flex items-center justify-center px-2 py-1.5 rounded-md bg-background-light text-text-muted text-sm shadow-sm hover:bg-background transition-colors"
								title="Дублировать"
							>
								<Copy className="h-4 w-4" />
							</button>
							<button
								onClick={() => onDelete?.()}
								className="flex items-center justify-center px-2 py-1.5 rounded-md bg-background-light text-danger text-sm shadow-sm hover:bg-destructive/10 transition-colors"
								title="Удалить"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					)}
				</CardContent>
			</div>
		</Card>
	);
};
