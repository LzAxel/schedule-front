'use client';

import type React from 'react';

import { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { AppButton } from '@/components/ui/appButton';
import { AuthService } from '@/lib/auth';
import { LogOut, Calendar, BookOpen, Users, Settings } from 'lucide-react';

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

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
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
		<div className="min-h-screen bg-background-dark p-5 flex flex-col gap-[24px]">
			<div className="flex flex-col xl:flex-row gap-[12px] xl:items-center xl:justify-between">
				<div className="flex items-center gap-[12px]">
					<h1 className="text-2xl font-bold text-primary">Админ-панель</h1>
				</div>
				<div className="flex flex-wrap gap-[8px]">
					{navigation.map((item) => {
						const Icon = item.icon;
						const isActive = currentPath === item.href || (item.href === '/admin' && currentPath === '/admin');
						return (
							<AppButton
								key={item.id}
								variant={isActive ? 'default' : 'outline'}
								onClick={() => handleNavigation(item.href)}
								className="gap-2"
							>
								<Icon className="h-4 w-4" />
								{item.label}
							</AppButton>
						);
					})}
					<AppButton variant="outline" onClick={handleLogout} className="gap-2 text-danger hover:text-danger">
						<LogOut className="h-4 w-4" />
						Выйти
					</AppButton>
				</div>
			</div>
			{children}
		</div>
	);
}
