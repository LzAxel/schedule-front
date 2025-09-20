"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {apiService, type Lesson} from "@/lib/api"
import {useToast} from "@/hooks/use-toast"
import {Edit, Trash2, Clock, MapPin, User, Calendar} from "lucide-react"

interface LessonsListProps {
	onEdit: (lesson: Lesson) => void
	refreshTrigger: number
}

const DAY_NAMES = {
	Monday: "Понедельник",
	Tuesday: "Вторник",
	Wednesday: "Среда",
	Thursday: "Четверг",
	Friday: "Пятница",
	Saturday: "Суббота",
}

const TYPE_LABELS = {
	even: "Четная неделя",
	odd: "Нечетная неделя",
	static: "Каждую неделю",
}

const PAIR_TIMES = {
	1: "08:00 - 09:30",
	2: "09:40 - 11:10",
	3: "11:25 - 12:55",
	4: "13:05 - 14:35",
	5: "14:45 - 16:15",
	6: "16:30 - 18:00",
	7: "18:10 - 19:40",
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
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
									<Card key={lesson.id}
									      className="flex flex-row p-0 hover:shadow-md transition-shadow gap-0 overflow-hidden">
										<div
											className="w-6 text-xl bg-accent opacity-70 text-white rounded-l-lg flex items-center justify-center">{lesson.pair_number}</div>
										<div className="p-4 pl-2 flex flex-col grow-1">
											<CardHeader className="pb-3 pl-2 pr-2">
												<div className="flex items-start justify-between">
													<CardTitle
														className="text-lg text-pretty leading-tight overflow-hidden truncate">{lesson.name}</CardTitle>
												</div>
											</CardHeader>
											<CardContent className="space-y-3 pl-2 pr-0 flex flex-col grow-1">
												<div className="space-y-2 text-sm">
													<div className="flex items-center gap-2 text-muted-foreground">
														<Calendar className="h-4 w-4 shrink-0"/>
														<span>{DAY_NAMES[lesson.day as keyof typeof DAY_NAMES]}</span>
													</div>

													<div className="flex items-center gap-2 text-muted-foreground">
														<Clock className="h-4 w-4 shrink-0"/>
														<span>{PAIR_TIMES[lesson.pair_number as keyof typeof PAIR_TIMES]}</span>
													</div>

													<div className="flex items-center gap-2 text-muted-foreground">
														<User className="h-4 w-4 shrink-0"/>
														<span className="text-pretty">{lesson.teacher}</span>
													</div>

													<div className="flex items-center gap-2 text-muted-foreground">
														<MapPin className="h-4 w-4 shrink-0"/>
														<span>{lesson.location}</span>
													</div>
												</div>

												<div className="pt-2 border-t">
													<Badge variant={lesson.type === "static" ? "default" : "outline"}
													       className="text-xs">
														{TYPE_LABELS[lesson.type]}
													</Badge>
												</div>

												<div className="flex gap-2 pt-2">
													<Button size="sm" variant="outline" onClick={() => onEdit(lesson)}
													        className="flex-1">
														<Edit className="h-4 w-4 mr-1"/>
														Изменить
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => lesson.id && handleDelete(lesson.id)}
														className="hover:bg-destructive text-destructive hover:text-white bg-transparent"
													>
														<Trash2 className="h-4 w-4"/>
													</Button>
												</div>
											</CardContent>

										</div>
									</Card>
								))
						}
					</CardContent>
				</Card>
			})}
		</div>
	)
}
