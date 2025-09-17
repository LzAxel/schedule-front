"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiService, type Schedule, type Settings } from "@/lib/api"
import { Clock, MapPin, User, Calendar } from "lucide-react"
import {getCurrentWeekParity} from "@/lib/parity";

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
  2: "09:45 - 11:15",
  3: "11:30 - 13:00",
  4: "13:45 - 15:15",
  5: "15:30 - 17:00",
  6: "17:15 - 18:45",
  7: "19:00 - 20:30",
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

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-4">Расписание занятий</h1>
          {settings && (
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">
                Текущая неделя:{" "}
                <span className="font-semibold text-primary">{getCurrentWeekParity(settings.parity) ? "четная" : "нечетная"}</span>
              </span>
            </div>
          )}
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
                  schedule[day].map((lesson) => (
                    <div key={lesson.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-card-foreground text-pretty leading-tight">{lesson.name}</h3>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          {lesson.pair_number} пара
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>{PAIR_TIMES[lesson.pair_number as keyof typeof PAIR_TIMES]}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 shrink-0" />
                          <span className="text-pretty">{lesson.teacher}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{lesson.location}</span>
                        </div>
                      </div>

                      {lesson.type !== "static" && (
                        <div className="mt-3 pt-2 border-t">
                          <Badge variant={(lesson.type === (getCurrentWeekParity(settings?.parity!) ? 'even' : 'odd')) ? "default" : "outline"} className="text-xs">
                            {TYPE_LABELS[lesson.type]}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
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
