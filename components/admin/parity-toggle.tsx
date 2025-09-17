"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiService, type Settings } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Calendar, RotateCcw, Info } from "lucide-react"
import {getCurrentWeekParity} from "@/lib/parity";

export function ParityToggle() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        const data = await apiService.getParity()
        setSettings(data)
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить настройки четности",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleToggle = async () => {
    if (!settings) return

    setIsToggling(true)
    try {
      const newSettings = await apiService.toggleParity()
      setSettings(newSettings)
      toast({
        title: "Четность изменена",
        description: `Теперь активна ${newSettings.parity === "even" ? "четная" : "нечетная"} неделя`,
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить четность недели",
        variant: "destructive",
      })
    } finally {
      setIsToggling(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!settings) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Четность недели</CardTitle>
        </div>
        <CardDescription>Управление четностью учебных недель для корректного отображения расписания</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
          <div>
            <p className="font-medium">Текущая неделя</p>
            <p className="text-sm text-muted-foreground">Определяет, какие занятия отображаются в расписании</p>
          </div>
          <Badge variant="default" className="text-base px-3 py-1">
            {getCurrentWeekParity(settings.parity) ? "Четная" : "Нечетная"}
          </Badge>
        </div>

        <Button onClick={handleToggle} disabled={isToggling} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          {isToggling ? "Переключение..." : "Переключить четность"}
        </Button>
      </CardContent>
    </Card>
  )
}
