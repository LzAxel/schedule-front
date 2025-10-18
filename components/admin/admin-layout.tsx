'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppButton } from '@/components/ui/appButton';
import { AuthService } from '@/lib/auth';
import { Calendar, BookOpen, Users, Settings, LogOut, Menu, X } from 'lucide-react';

interface AdminLayoutProps {
	children: React.ReactNode;
	activeTab: string;
}

const navigation = [
	{ id: 'dashboard', label: 'Панель управления', icon: Calendar, href: '/admin' },
	{ id: 'lessons', label: 'Управление занятиями', icon: BookOpen, href: '/admin/lessons' },
	{ id: 'admins', label: 'Администраторы', icon: Users, href: '/admin/admins' },
	{ id: 'settings', label: 'Настройки', icon: Settings, href: '/admin/settings' },
];

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const router = useRouter();

	const handleLogout = () => {
		AuthService.logout();
		router.push('/login');
	};

	const handleNavigation = (href: string) => {
		router.push(href);
		setIsMobileMenuOpen(false);
	};

	return (
		<div className="min-h-screen bg-muted/30">
			{/* Mobile menu button */}
			<div className="lg:hidden fixed top-4 left-4 z-50">
				<AppButton
					variant="outline"
					size="icon"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="bg-background"
				>
					{isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
				</AppButton>
			</div>

			{/* Sidebar */}
			<div
				className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:inset-0
      `}
			>
				<div className="flex flex-col h-full">
					<div className="p-6 border-b border-border">
						<h1 className="text-xl font-bold text-primary">Админ панель</h1>
						<p className="text-sm text-muted-foreground mt-1">Система управления расписанием</p>
					</div>

					<nav className="flex-1 p-4 space-y-3">
						{navigation.map((item) => {
							const Icon = item.icon;
							const isActive = activeTab === item.id;

							return (
								<AppButton
									key={item.id}
									variant={isActive ? 'default' : 'ghost'}
									className="py-4 w-full justify-start cursor-pointer bg-background-light hover:bg-background border-border border shadow-sm"
									onClick={() => handleNavigation(item.href)}
								>
									<Icon className="h-4 w-4 mr-3" />
									{item.label}
								</AppButton>
							);
						})}
					</nav>

					<div className="p-4 border-t border-border">
						<AppButton
							variant="outline"
							className="w-full justify-start border-border bg-background-light shadow-sm text-danger hover:border-danger cursor-pointer"
							onClick={handleLogout}
						>
							<LogOut className="h-4 w-4 mr-3" />
							Выйти
						</AppButton>
					</div>
				</div>
			</div>

			{/* Mobile overlay */}
			{isMobileMenuOpen && (
				<div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
			)}

			{/* Main content */}
			<div className="lg:ml-64">
				<div className="p-4 lg:p-8">{children}</div>
			</div>
		</div>
	);
}
