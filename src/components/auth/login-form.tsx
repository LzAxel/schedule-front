import type React from 'react';
import { useState } from 'react';
import { AuthService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';

export function LoginForm() {
	const [credentials, setCredentials] = useState({
		username: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await AuthService.login(credentials);
			toast({
				title: 'Успешный вход',
				description: 'Добро пожаловать!',
			});
			navigate({ to: '/admin' });
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

	const inputClass = "w-full flex h-9 rounded-md bg-background-light px-3 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors";

	return (
		<div className="min-h-screen bg-background-dark p-5 flex items-center justify-center">
			<div className="w-full max-w-sm">
				<div className="text-center mb-6">
					<div className="flex items-center justify-center gap-2 mb-2">
						<Sparkles className="w-6 h-6 text-primary" />
						<span className="text-xl font-semibold text-text">Админ-панель</span>
					</div>
					<p className="text-sm text-text-muted">Войдите для управления расписанием</p>
				</div>
				
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="space-y-1.5">
						<label className="text-xs text-text-muted">Имя пользователя</label>
						<input
							type="text"
							value={credentials.username}
							onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
							required
							disabled={isLoading}
							className={inputClass}
							placeholder="Введите имя"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs text-text-muted">Пароль</label>
						<input
							type="password"
							value={credentials.password}
							onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
							required
							disabled={isLoading}
							className={inputClass}
							placeholder="Введите пароль"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Вход...' : 'Войти'}
					</button>
				</form>
			</div>
		</div>
	);
}
