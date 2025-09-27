'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminForm } from '@/components/admin/admin-form';
import { AdminsList } from '@/components/admin/admins-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

export default function AdminsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <AuthGuard>
      <AdminLayout activeTab="admins">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">Управление администраторами</h1>
              <p className="text-muted-foreground mt-2">Добавление новых администраторов системы</p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить администратора
              </Button>
            )}
          </div>

          {/* Security notice */}
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <CardTitle className="text-yellow-800 dark:text-yellow-200">Важная информация</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Новые администраторы получат полный доступ к системе управления расписанием. Убедитесь, что вы доверяете
                пользователю перед предоставлением административных прав.
              </CardDescription>
            </CardContent>
          </Card>

          {showForm ? (
            <div className="space-y-4">
              <Button variant="outline" onClick={handleFormCancel} className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к списку
              </Button>
              <AdminForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Список администраторов</CardTitle>
                  </div>
                  <CardDescription>Все пользователи с административными правами в системе</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminsList refreshTrigger={refreshTrigger} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
