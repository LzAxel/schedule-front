'use client';

import { useEffect, useState } from 'react';
import { apiService, type Lesson } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';
import { DAY_NAMES } from '@/const/days';
import { LessonItem } from '@/components/lesson/lesson-item';

interface LessonsListProps {
	onEdit: (lesson: Lesson) => void;
	onDuplicate: (lesson: Lesson) => void;
	refreshTrigger: number;
}

export function LessonsList({ onEdit, onDuplicate, refreshTrigger }: LessonsListProps) {
	const [lessons, setLessons] = useState<Record<keyof typeof DAY_NAMES, Lesson[]>>({
		Monday: [],
		Friday: [],
		Saturday: [],
		Thursday: [],
		Tuesday: [],
		Wednesday: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	const fetchLessons = async () => {
		try {
			setIsLoading(true);
			const data = await apiService.getLessons();

			const groupedPairs = Object.fromEntries(
				(Object.keys(DAY_NAMES) as Array<keyof typeof DAY_NAMES>).map((day) => [
					day,
					data.filter((lesson) => lesson.day === day).sort((a, b) => a.pair_number - b.pair_number),
				]),
			) as Record<keyof typeof DAY_NAMES, Lesson[]>;

			setLessons(groupedPairs);
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось загрузить список занятий',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLessons();
	}, [refreshTrigger, toast]);

	const handleDelete = async (id: number) => {
		if (!confirm('Вы уверены, что хотите удалить это занятие?')) return;

		try {
			await apiService.deleteLesson(id);
			fetchLessons();
			toast({
				title: 'Занятие удалено',
				description: 'Занятие успешно удалено из расписания',
			});
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось удалить занятие',
				variant: 'destructive',
			});
		}
	};

	if (isLoading) {
		return (
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="bg-background rounded-lg border border-border/50 p-3">
						<div className="h-5 bg-muted rounded w-24 mb-2 animate-pulse"></div>
						<div className="space-y-2">
							<div className="h-4 bg-muted rounded animate-pulse"></div>
							<div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{Object.keys(lessons).map((day) => {
				const dayLessons = lessons[day as keyof typeof DAY_NAMES] || [];
				return (
					<div key={day} className="bg-background rounded-lg border border-border/50 overflow-hidden">
						<div className="px-3 py-2 bg-background-light/50 border-b border-border/30">
							<span className="text-sm font-medium text-primary">
								{DAY_NAMES[day as keyof typeof DAY_NAMES]}
							</span>
						</div>
						<div className="p-2 space-y-2">
							{dayLessons.length === 0 ? (
								<div className="py-6 flex items-center justify-center">
									<div className="text-center text-text-muted">
										<Calendar className="w-6 h-6 mx-auto mb-1 opacity-40" />
										<p className="text-xs">Нет занятий</p>
									</div>
								</div>
							) : (
								dayLessons.map((lesson) => (
									<LessonItem
										lesson={lesson}
										onDelete={() => handleDelete(lesson.id!)}
										onEdit={() => onEdit(lesson)}
										onDuplicate={() => onDuplicate(lesson)}
										isEditable={true}
									/>
								))
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
