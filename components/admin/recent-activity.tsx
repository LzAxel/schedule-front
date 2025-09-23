"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiService, type Lesson } from "@/lib/api"
import { Clock, MapPin, User } from "lucide-react"
import {DAY_NAMES} from "@/const/days";

export function RecentActivity() {
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentLessons = async () => {
      try {
        setIsLoading(true)
        const lessons = await apiService.getLessons()
        // Get the 5 most recent lessons (by ID)
        const recent = lessons.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5)
        setRecentLessons(recent)
      } catch (error) {
        console.error("Error fetching recent lessons:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentLessons()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Последние занятия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние занятия</CardTitle>
      </CardHeader>
      <CardContent>
        {recentLessons.length > 0 ? (
          <div className="space-y-4">
            {recentLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-pretty leading-tight">{lesson.name}</h4>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      {lesson.pair_number} пара
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 shrink-0" />
                      <span className="truncate">{lesson.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{lesson.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{DAY_NAMES[lesson.day as keyof typeof DAY_NAMES]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">Занятия не найдены</p>
        )}
      </CardContent>
    </Card>
  )
}
