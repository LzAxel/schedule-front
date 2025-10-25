import { AuthGuard } from '@/components/auth/auth-guard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { ParityToggle } from '@/components/admin/parity-toggle';
import { SystemInfo } from '@/components/admin/system-info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/appButton';
// import Link from 'next/link';
// import { BookOpen, ExternalLink, Eye, Settings } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/settings')({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<AuthGuard>
			<AdminLayout activeTab="settings">
				<div className="space-y-8">
					<div>
						<h1 className="text-3xl font-bold text-balance">Настройки системы</h1>
						<p className="text-muted-foreground mt-2">
							Управление параметрами и конфигурацией системы расписания
						</p>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						<div className="space-y-6">
							<ParityToggle />

							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										{/*<ExternalLink className="h-5 w-5 text-primary" />*/}
										<CardTitle>Быстрые ссылки</CardTitle>
									</div>
									<CardDescription>Полезные ссылки для управления системой</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<AppButton
										asChild
										variant='outline'
										className="w-full justify-start bg-transparent"
									>
										{/*<Link href='/schedule'>*/}
										{/*	<Eye className="h-4 w-4 mr-2" />*/}
										{/*	Просмотреть публичное расписание*/}
										{/*</Link>*/}
									</AppButton>
									<AppButton
										asChild
										variant='outline'
										className="w-full justify-start bg-transparent"
									>
										{/*<Link href="/admin/lessons">*/}
										{/*	<BookOpen className="h-4 w-4 mr-2" />*/}
										{/*	Управление занятиями*/}
										{/*</Link>*/}
									</AppButton>
									<AppButton
										asChild
										variant='outline'
										className="w-full justify-start bg-transparent"
									>
										{/*<Link href='/admin'>*/}
										{/*	<Settings className="h-4 w-4 mr-2" />*/}
										{/*	Главная панель*/}
										{/*</Link>*/}
									</AppButton>
								</CardContent>
							</Card>
						</div>

						<SystemInfo />
					</div>
				</div>
			</AdminLayout>
		</AuthGuard>
	)
}
