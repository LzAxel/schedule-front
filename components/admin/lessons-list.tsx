"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {apiService, type Lesson} from "@/lib/api"
import {useToast} from "@/hooks/use-toast"
import {Edit, Trash2, Clock, MapPin, User, Calendar} from "lucide-react"
import {DAY_NAMES} from "@/const/days";
import {LessonItem} from "@/components/lesson/lesson-item";

interface LessonsListProps {
	onEdit: (lesson: Lesson) => void
	refreshTrigger: number
}

export function LessonsList({onEdit, refreshTrigger}: LessonsListProps) {
	const [lessons, setLessons] = useState<Record<keyof typeof DAY_NAMES, Lesson[]>>({
		Monday: [],
		Friday: [],
		Saturday: [],
		Thursday: [],
		Tuesday: [],
		Wednesday: [],
	})
	const [isLoading, setIsLoading] = useState(true)
	const {toast} = useToast()

	const fetchLessons = async () => {
		try {
			setIsLoading(true)
			const data = await apiService.getLessons()

			const groupedPairs = Object.fromEntries((Object.keys(DAY_NAMES) as Array<keyof typeof DAY_NAMES>)
				.map((day) => ([day, data
					.filter((lesson) => lesson.day === day)
					.sort((a, b) => a.pair_number - b.pair_number)]))) as Record<keyof typeof DAY_NAMES, Lesson[]>;

			setLessons(groupedPairs)
		} catch (error) {
			toast({
				title: "Ошибка",
				description: "Не удалось загрузить список занятий",
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchLessons()
	}, [refreshTrigger, toast])

	const handleDelete = async (id: number) => {
		if (!confirm("Вы уверены, что хотите удалить это занятие?")) return

		try {
			await apiService.deleteLesson(id)
			fetchLessons();
			toast({
				title: "Занятие удалено",
				description: "Занятие успешно удалено из расписания",
			})
		} catch (error) {
			toast({
				title: "Ошибка",
				description: "Не удалось удалить занятие",
				variant: "destructive",
			})
		}
	}

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<div className="h-6 bg-muted rounded animate-pulse"></div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="h-4 bg-muted rounded animate-pulse"></div>
								<div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
			{Object.keys(lessons).map((day) => {
				return <Card key={day} className="h-fit">
					<CardHeader className="pb-4">
						<CardTitle className="text-xl text-center text-primary">
							{DAY_NAMES[day as keyof typeof DAY_NAMES]}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 grow-1">
						{
							(lessons[day as keyof typeof DAY_NAMES].length < 1) ?
								<div className="h-[calc(100%-2rem)] flex items-center justify-center">
									<div className="text-center py-8 text-muted-foreground">
										<Calendar className="h-12 w-12 mx-auto mb-3 opacity-50"/>
										<p>Занятий нет</p>
									</div>
								</div>
								: lessons[day as keyof typeof DAY_NAMES].map((lesson) => (
									<LessonItem lesson={lesson} onDelete={() => handleDelete(lesson.id!)}
									            onEdit={() => onEdit(lesson)} isEditable={true}/>
								))
						}
					</CardContent>
				</Card>
			})}
		</div>
	)
}
