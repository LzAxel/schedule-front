'use client';

import type React from 'react';

import { useNavigate, useLocation } from '@tanstack/react-router';
import { ThemeSwitcher } from '@/components/my-ui/ThemeSwitcher';
import { AuthService } from '@/lib/auth';
import { LogOut, Calendar, BookOpen, Users, Settings, Sparkles } from 'lucide-react';

interface AdminLayoutProps {
	children: React.ReactNode;
	activeTab: string;
}

const navigation = [
	{ id: 'dashboard', label: 'Расписание', icon: Calendar, href: '/admin' },
	{ id: 'lessons', label: 'Занятия', icon: BookOpen, href: '/admin/lessons' },
	{ id: 'admins', label: 'Админы', icon: Users, href: '/admin/admins' },
	{ id: 'settings', label: 'Настройки', icon: Settings, href: '/admin/settings' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		AuthService.logout();
		navigate({ to: '/login' });
	};

	const handleNavigation = (href: string) => {
		navigate({ to: href });
	};

	const currentPath = location.pathname;

	return (
		<div className="min-h-screen bg-background-dark flex flex-col">
			<header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
				<div className="flex items-center gap-3">
					<ThemeSwitcher />
					<div className="flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-primary" />
						<span className="text-lg font-semibold text-text">Админ-панель</span>
					</div>
				</div>
				<nav className="flex items-center gap-1">
					{navigation.map((item) => {
						const Icon = item.icon;
						const isActive = currentPath === item.href || (item.href === '/admin' && currentPath === '/admin');
						return (
							<button
								key={item.id}
								onClick={() => handleNavigation(item.href)}
								className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
									isActive
										? 'bg-primary/10 text-primary'
										: 'text-text-muted hover:text-text hover:bg-background-light/50'
								}`}
							>
								<Icon className="w-4 h-4" />
								<span className="hidden sm:inline">{item.label}</span>
							</button>
						);
					})}
					<div className="w-px h-5 bg-border mx-1" />
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-danger hover:bg-danger/10 transition-all"
					>
						<LogOut className="w-4 h-4" />
						<span className="hidden sm:inline">Выйти</span>
					</button>
				</nav>
			</header>
			<main className="flex-1 p-4">
				{children}
			</main>
		</div>
	);
}
