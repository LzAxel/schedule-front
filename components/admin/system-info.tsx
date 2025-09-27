'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { Server, Database, Users, BookOpen, Calendar, Clock } from 'lucide-react';
import {isCurrentWeekEven} from '@/lib/parity';

interface SystemInfo {
  totalLessons: number
  totalAdmins: number
  currentParity: string
  lessonsThisWeek: number
  lastUpdate: string
}

export function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setIsLoading(true);
        const [lessons, admins, settings, schedule] = await Promise.all([
          apiService.getLessons(),
          apiService.getAdmins(),
          apiService.getParity(),
          apiService.getSchedule(),
        ]);

        const lessonsThisWeek = Object.values(schedule).flat().length;

        setSystemInfo({
          totalLessons: lessons.length,
          totalAdmins: admins.length,
          currentParity: isCurrentWeekEven(settings.parity) ? 'четная' : 'нечетная',
          lessonsThisWeek,
          lastUpdate: new Date().toLocaleString('ru-RU'),
        });
      } catch (error) {
        console.error('Error fetching system info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!systemInfo) return null;

  const infoItems = [
    {
      label: 'Всего занятий',
      value: systemInfo.totalLessons,
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Администраторы',
      value: systemInfo.totalAdmins,
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Текущая неделя',
      value: systemInfo.currentParity,
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Занятий на неделе',
      value: systemInfo.lessonsThisWeek,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <CardTitle>Информация о системе</CardTitle>
        </div>
        <CardDescription>Общая статистика и состояние системы управления расписанием</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Последнее обновление</span>
            </div>
            <span>{systemInfo.lastUpdate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
