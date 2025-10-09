import { AuthGuard } from '@/components/auth/auth-guard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { RecentActivity } from '@/components/admin/recent-activity';
import { AppButton } from '@/components/ui/appButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, Eye, Settings, Users } from 'lucide-react';

export default function AdminDashboard() {
	return (
		<AuthGuard>
			<AdminLayout activeTab="dashboard">
				<div className="space-y-8">
					<div>
						<h1 className="text-3xl font-bold text-balance">Панель управления</h1>
						<p className="text-muted-foreground mt-2">Добро пожаловать в систему управления расписанием</p>
					</div>

					<DashboardStats />

					<div className="grid gap-6 lg:grid-cols-2">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Быстрые действия</CardTitle>
									<CardDescription>Основные функции системы управления</CardDescription>
								</CardHeader>
								<CardContent className="grid gap-3">
									<AppButton asChild className="justify-start">
										<Link href="/admin/lessons">
											<Plus className="h-4 w-4 mr-2" />
											Добавить занятие
										</Link>
									</AppButton>
									<AppButton asChild variant="outline" className="justify-start bg-transparent">
										<Link href="/schedule">
											<Eye className="h-4 w-4 mr-2" />
											Просмотреть расписание
										</Link>
									</AppButton>
									<AppButton asChild variant="outline" className="justify-start bg-transparent">
										<Link href="/admin/admins">
											<Users className="h-4 w-4 mr-2" />
											Управление админами
										</Link>
									</AppButton>
									<AppButton asChild variant="outline" className="justify-start bg-transparent">
										<Link href="/admin/settings">
											<Settings className="h-4 w-4 mr-2" />
											Настройки системы
										</Link>
									</AppButton>
								</CardContent>
							</Card>
						</div>

						<RecentActivity />
					</div>
				</div>
			</AdminLayout>
		</AuthGuard>
	);
}
