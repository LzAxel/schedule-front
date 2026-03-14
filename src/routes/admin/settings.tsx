import { ParityToggle } from '@/components/admin/parity-toggle';
import { SystemInfo } from '@/components/admin/system-info';
import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { Eye, BookOpen, LayoutDashboard } from 'lucide-react';

export const Route = createFileRoute('/admin/settings')({
	component: SettingsPage,
});

function SettingsPage() {
	const navigate = useNavigate();

	return (
		<div>
			<h2 className="text-lg font-semibold text-text mb-4">Настройки</h2>

			<div className="grid gap-4 lg:grid-cols-2">
				<div className="space-y-4">
					<ParityToggle />

					<div className="bg-background rounded-lg border border-border/50 p-4">
						<h3 className="text-sm font-medium text-text mb-3">Быстрые ссылки</h3>
						<div className="space-y-2">
							<button
								onClick={() => navigate({ to: '/schedule' })}
								className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-background-light/50 transition-colors"
							>
								<Eye className="w-4 h-4" />
								Публичное расписание
							</button>
							<button
								onClick={() => navigate({ to: '/admin/lessons' })}
								className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-background-light/50 transition-colors"
							>
								<BookOpen className="w-4 h-4" />
								Управление занятиями
							</button>
							<button
								onClick={() => navigate({ to: '/admin' })}
								className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-background-light/50 transition-colors"
							>
								<LayoutDashboard className="w-4 h-4" />
								Панель управления
							</button>
						</div>
					</div>
				</div>

				<SystemInfo />
			</div>
		</div>
	);
}
