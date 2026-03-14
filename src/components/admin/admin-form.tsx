'use client';

import type React from 'react';

import { useState } from 'react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface AdminFormProps {
	onSuccess: () => void;
	onCancel: () => void;
}

export function AdminForm({ onSuccess, onCancel }: AdminFormProps) {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		confirmPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast({
				title: 'Ошибка',
				description: 'Пароли не совпадают',
				variant: 'destructive',
			});
			return;
		}

		if (formData.password.length < 4) {
			toast({
				title: 'Ошибка',
				description: 'Пароль должен содержать минимум 4 символа',
				variant: 'destructive',
			});
			return;
		}

		setIsLoading(true);

		try {
			await apiService.createAdmin({
				username: formData.username,
				password: formData.password,
			});
			toast({
				title: 'Администратор создан',
				description: 'Новый администратор успешно добавлен',
			});
			onSuccess();
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось создать администратора',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const inputClass = "w-full flex h-8 rounded-md bg-background-light px-2.5 text-sm border border-border/30 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none";

	return (
		<div className="bg-background rounded-lg border border-border/50 p-4">
			<h3 className="text-sm font-medium text-text mb-3">Новый администратор</h3>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div className="space-y-1.5">
					<label className="text-xs text-text-muted">Имя пользователя</label>
					<input
						type="text"
						value={formData.username}
						onChange={(e) => setFormData({ ...formData, username: e.target.value })}
						placeholder="Введите имя"
						required
						disabled={isLoading}
						minLength={3}
						className={inputClass}
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs text-text-muted">Пароль</label>
					<div className="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							placeholder="Пароль"
							required
							disabled={isLoading}
							minLength={4}
							className={inputClass + " pr-8"}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
						>
							{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
						</button>
					</div>
				</div>

				<div className="space-y-1.5">
					<label className="text-xs text-text-muted">Подтверждение</label>
					<div className="relative">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							value={formData.confirmPassword}
							onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
							placeholder="Повторите пароль"
							required
							disabled={isLoading}
							minLength={4}
							className={inputClass + " pr-8"}
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
						>
							{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
						</button>
					</div>
				</div>

				<div className="flex gap-2 pt-2">
					<button
						type="submit"
						disabled={isLoading}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						{isLoading ? 'Создание...' : 'Создать'}
					</button>
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-text-muted hover:text-text hover:bg-background-light/50 transition-colors"
					>
						Отмена
					</button>
				</div>
			</form>
		</div>
	);
}
