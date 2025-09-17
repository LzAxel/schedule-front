"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiService, type Lesson } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, Clock, MapPin, User, Calendar } from "lucide-react"

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
  Sunday: "Воскресенье",
}

const TYPE_LABELS = {
  even: "Четная неделя",
  odd: "Нечетная неделя",
  static: "Каждую неделю",
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

export function LessonsList({ onEdit, refreshTrigger }: LessonsListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true)
        const data = await apiService.getLessons()
        // Sort lessons by day and pair number
        const sortedLessons = data.sort((a, b) => {
          const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
          const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
          if (dayDiff !== 0) return dayDiff
          return a.pair_number - b.pair_number
        })
        setLessons(sortedLessons)
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

    fetchLessons()
  }, [refreshTrigger, toast])

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это занятие?")) return

    try {
      await apiService.deleteLesson(id)
      setLessons(lessons.filter((lesson) => lesson.id !== id))
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

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Занятия не найдены</p>
            <p className="text-sm text-muted-foreground mt-1">Создайте первое занятие для начала работы</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="hover:shadow-md transition-shadow justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg text-pretty leading-tight">{lesson.name}</CardTitle>
              <Badge variant="secondary" className="ml-2 shrink-0">
                {lesson.pair_number} пара
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 flex flex-col">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{DAY_NAMES[lesson.day as keyof typeof DAY_NAMES]}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{PAIR_TIMES[lesson.pair_number as keyof typeof PAIR_TIMES]}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4 shrink-0" />
                <span className="text-pretty">{lesson.teacher}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{lesson.location}</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Badge variant={lesson.type === "static" ? "default" : "outline"} className="text-xs">
                {TYPE_LABELS[lesson.type]}
              </Badge>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(lesson)} className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Изменить
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => lesson.id && handleDelete(lesson.id)}
                className="hover:bg-destructive text-destructive hover:text-white bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
