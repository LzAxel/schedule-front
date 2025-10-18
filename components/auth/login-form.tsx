'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppButton } from '@/components/ui/appButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
	const [credentials, setCredentials] = useState({
		username: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await AuthService.login(credentials);
			toast({
				title: 'Успешный вход',
				description: 'Добро пожаловать в админ панель!',
			});
			router.push('/admin');
		} catch (error) {
			toast({
				title: 'Ошибка входа',
				description: 'Неверные учетные данные',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background-dark p-5 flex flex-col items-center justify-center gap-[24px]">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
					<CardDescription>Введите учетные данные для доступа к админ панели</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Имя пользователя</Label>
							<Input
								id="username"
								type="text"
								value={credentials.username}
								onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
								required
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Пароль</Label>
							<Input
								id="password"
								type="password"
								value={credentials.password}
								onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
								required
								disabled={isLoading}
							/>
						</div>
						<AppButton type="submit" className="w-full text-text bg-primary" disabled={isLoading}>
							{isLoading ? 'Вход...' : 'Войти'}
						</AppButton>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
