"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {apiService, type Schedule, type Settings} from "@/lib/api"
import {Clock, MapPin, User, Calendar} from "lucide-react"
import {getCurrentWeekParity} from "@/lib/parity";
import {Toggle} from "@/components/ui/toggle";
import {Switch} from "@/components/ui/switch";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DAY_NAMES = {
	Monday: "Понедельник",
	Tuesday: "Вторник",
	Wednesday: "Среда",
	Thursday: "Четверг",
	Friday: "Пятница",
	Saturday: "Суббота",
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

const TYPE_LABELS = {
	even: "Четная неделя",
	odd: "Нечетная неделя",
	static: "Каждую неделю",
}

export function ScheduleGrid() {
	const [schedule, setSchedule] = useState<Schedule>({})
	const [settings, setSettings] = useState<Settings | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hidePairs, setHidePairs] = useState(false);

	const changeHidePairs = (value: boolean) => {
		localStorage.setItem("hidePairs", JSON.stringify(value))
		setHidePairs(value)
	}

	useEffect(() => {
		if (window) {
			try {
				const value = JSON.parse(localStorage.getItem("hidePairs")!!) ?? false;
				setHidePairs(value);
			} catch (e) {}
		}

		const fetchData = async () => {
			try {
				setIsLoading(true)
				const [scheduleData, settingsData] = await Promise.all([apiService.getSchedule(), apiService.getParity()])
				setSchedule(scheduleData)
				setSettings(settingsData)
			} catch (err) {
				setError("Ошибка загрузки расписания")
				console.error("Error fetching schedule:", err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<p className="text-center text-destructive">{error}</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	const currentParity = getCurrentWeekParity(settings?.parity!) ? 'even' : 'odd';

	return (
		<div className="min-h-screen bg-muted/30">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-balance mb-4">Расписание занятий</h1>
					{settings && (
						<div className="flex items-center justify-center gap-2">
							<Calendar className="h-5 w-5 text-muted-foreground"/>
							<span className="text-lg text-muted-foreground">
                Текущая неделя:{" "}
								<span
									className="font-semibold text-primary">{getCurrentWeekParity(settings.parity) ? "четная" : "нечетная"}</span>
              </span>
						</div>
					)}
					<div
						className="mx-auto flex flex-row items-center gap-2 bg-white rounded-lg border py-2 px-3 w-fit mt-4 shadow-sm">
						<Switch checked={hidePairs} onCheckedChange={(value) => changeHidePairs(value)}/>
						<p>Скрывать лишние пары</p>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
					{DAYS.map((day) => (
						<Card key={day} className="h-fit">
							<CardHeader className="pb-4">
								<CardTitle className="text-xl text-center text-primary">
									{DAY_NAMES[day as keyof typeof DAY_NAMES]}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{schedule[day] && schedule[day].length > 0 ? (
									schedule[day].filter((lesson) => !(hidePairs && lesson.type !== 'static' && lesson.type !== currentParity)).map((lesson) => (
										<div key={lesson.id}
										     className="rounded-lg border bg-card hover:shadow-md transition-shadow flex flex-row">
											<div
												className="w-6 text-xl bg-accent opacity-70 text-white rounded-l-lg flex items-center justify-center">{lesson.pair_number}</div>
											<div className="p-4 pl-3 flex flex-col grow-1">
												<div className="flex items-start justify-between mb-3">
													<h3 className="font-semibold text-card-foreground text-pretty leading-tight">{lesson.name}</h3>
												</div>

												<div className="space-y-2 text-sm text-muted-foreground">
													<div className="flex items-center gap-2">
														<Clock className="h-4 w-4 shrink-0"/>
														<span>{PAIR_TIMES[lesson.pair_number as keyof typeof PAIR_TIMES]}</span>
													</div>

													<div className="flex items-center gap-2">
														<User className="h-4 w-4 shrink-0"/>
														<span className="text-pretty">{lesson.teacher}</span>
													</div>

													<div className="flex items-center gap-2">
														<MapPin className="h-4 w-4 shrink-0"/>
														<span>{lesson.location}</span>
													</div>
												</div>

												{lesson.type !== "static" && (
													<div className="mt-3 pt-2 border-t">
														<Badge
															variant={(lesson.type === (getCurrentWeekParity(settings?.parity!) ? 'even' : 'odd')) ? "default" : "outline"}
															className="text-xs">
															{TYPE_LABELS[lesson.type]}
														</Badge>
													</div>
												)}</div>
										</div>
									))
								) : (
									<div className="text-center py-8 text-muted-foreground">
										<Calendar className="h-12 w-12 mx-auto mb-3 opacity-50"/>
										<p>Занятий нет</p>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	)
}
