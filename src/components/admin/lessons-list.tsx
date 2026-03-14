'use client';

import { useEffect, useState } from 'react';
import { apiService, type Lesson } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Calendar, ChevronDown, ChevronRight } from 'lucide-react';
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
	const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});
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
			});
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось удалить занятие',
				variant: 'destructive',
			});
		}
	};

	const toggleDay = (day: string) => {
		setCollapsedDays(prev => ({ ...prev, [day]: !prev[day] }));
	};

	const hasAnyLessons = Object.values(lessons).some(arr => arr.length > 0);

	if (isLoading) {
		return (
			<div className="space-y-2">
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

	if (!hasAnyLessons) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Calendar className="w-10 h-10 text-text-muted opacity-40 mb-3" />
				<p className="text-text-muted text-sm">Нет занятий</p>
				<p className="text-text-muted text-xs mt-1">Добавьте занятия для отображения в расписании</p>
			</div>
		);
	}

	return (
		<div className="space-y-2 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-3 lg:space-y-0">
			{Object.keys(lessons).map((day) => {
				const dayLessons = lessons[day as keyof typeof DAY_NAMES] || [];
				const isCollapsed = collapsedDays[day];
				const isEmpty = dayLessons.length === 0;

				if (isEmpty) return null;

				return (
					<div key={day} className="bg-background rounded-lg border border-border/50 overflow-hidden">
						<button
							onClick={() => toggleDay(day)}
							className="w-full px-3 py-2.5 flex items-center justify-between bg-background-light/50 border-b border-border/30 hover:bg-background-light/70 transition-colors md:cursor-default"
						>
							<span className="text-sm font-medium text-primary flex items-center gap-2">
								{DAY_NAMES[day as keyof typeof DAY_NAMES]}
								<span className="text-xs font-normal text-text-muted">({dayLessons.length})</span>
							</span>
							<ChevronDown className={`w-4 h-4 text-text-muted transition-transform md:hidden ${isCollapsed ? '-rotate-90' : ''}`} />
						</button>
						<div className={`p-2 space-y-2 ${isCollapsed ? 'hidden md:block' : ''}`}>
							{dayLessons.map((lesson) => (
								<LessonItem
									lesson={lesson}
									onDelete={() => handleDelete(lesson.id!)}
									onEdit={() => onEdit(lesson)}
									onDuplicate={() => onDuplicate(lesson)}
									isEditable={true}
								/>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
