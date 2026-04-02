import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LessonExtended } from '@/lib/api';
import React from 'react';
import { PAIR_TIMES } from '@/const/pairs';
import { PARITY_LABELS } from '@/const/parity';
import { ParityType } from '@/types/parity';

const CoupledLesson = ({ lesson, currentParity }: { lesson: LessonExtended; currentParity?: ParityType }) => {
	return (
		<Card key={lesson.id} className="flex border-none flex-row p-0 gap-0 overflow-hidden shadow-none">
			<div className="px-3 pl-2 flex flex-col grow-1">
				<CardHeader className="block p-0 pb-2">
					<div className="flex flex-col items-start justify-between overflow-hidden">
						<CardTitle className="text-lg text-pretty leading-tight overflow-hidden truncate">
							{lesson.subject_name}
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-3 p-0 flex flex-col grow-1">
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-2 text-muted-foreground">
							<User className="h-4 w-4 shrink-0" />
							<span className="text-pretty">{lesson.teacher_name}</span>
						</div>

						<div className="flex items-center gap-2 text-muted-foreground">
							<MapPin className="h-4 w-4 shrink-0" />
							<span>{lesson.location_name}</span>
						</div>
					</div>

					<div className="">
						<Badge
							variant={lesson.parity_type === 'static' || lesson.parity_type === currentParity ? 'default' : 'outline'}
							className="text-xs"
						>
							{PARITY_LABELS[lesson.parity_type as keyof typeof PARITY_LABELS]}
						</Badge>
					</div>
				</CardContent>
			</div>
		</Card>
	);
};

interface Props {
	lessons: LessonExtended[];
	currentParity?: ParityType;
}

export const CoupledLessonItem: React.FC<Props> = ({ lessons, currentParity }) => {
	const evenLesson = lessons.find((lesson) => lesson.parity_type === 'even');
	const oddLesson = lessons.find((lesson) => lesson.parity_type === 'odd');

	const pair_number = (evenLesson || oddLesson)!.pair_number;

	return (
		<Card className="flex flex-row p-0 hover:shadow-md transition-shadow gap-0 overflow-hidden">
			<div className="w-6 text-xl bg-accent opacity-80 text-white rounded-l flex items-center justify-center shrink-0">
				{pair_number}
			</div>
			<div className="p-3 pl-2 flex flex-col grow-1">
				<CardHeader className="block pt-0 pl-2 pr-2 pb-2">
					<div className="overflow-hidden">
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<span>{PAIR_TIMES[pair_number as keyof typeof PAIR_TIMES]}</span>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-2 px-0">
					{evenLesson && <CoupledLesson lesson={evenLesson} currentParity={currentParity} />}
					<div className="h-px opacity-30 bg-muted-foreground my-2"></div>
					{oddLesson && <CoupledLesson lesson={oddLesson} currentParity={currentParity} />}
				</CardContent>
			</div>
		</Card>
	);
};
