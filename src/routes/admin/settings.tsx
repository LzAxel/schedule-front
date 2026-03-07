import { ParityToggle } from '@/components/admin/parity-toggle';
import { SystemInfo } from '@/components/admin/system-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/appButton';
import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { Eye, BookOpen, LayoutDashboard } from 'lucide-react';

export const Route = createFileRoute('/admin/settings')({
	component: SettingsPage,
});

function SettingsPage() {
	const navigate = useNavigate();

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-text">Настройки системы</h1>

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="space-y-6">
					<ParityToggle />

					<Card>
						<CardHeader>
							<CardTitle>Быстрые ссылки</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<AppButton variant="outline" className="w-full justify-start" onClick={() => navigate({ to: '/schedule' })}>
								<Eye className="h-4 w-4 mr-2" />
								Публичное расписание
							</AppButton>
							<AppButton variant="outline" className="w-full justify-start" onClick={() => navigate({ to: '/admin/lessons' })}>
								<BookOpen className="h-4 w-4 mr-2" />
								Управление занятиями
							</AppButton>
							<AppButton variant="outline" className="w-full justify-start" onClick={() => navigate({ to: '/admin' })}>
								<LayoutDashboard className="h-4 w-4 mr-2" />
								Панель управления
							</AppButton>
						</CardContent>
					</Card>
				</div>

				<SystemInfo />
			</div>
		</div>
	);
}
