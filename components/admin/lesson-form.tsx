'use client';

import type React from 'react';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {apiService, type Lesson} from '@/lib/api';
import {useToast} from '@/hooks/use-toast';
import {MAX_PAIRS_COUNT} from '@/const/pairs';
import {PARITY_LABELS} from '@/const/parity';

interface LessonFormProps {
	lesson?: Lesson
	onSuccess: () => void
	onCancel: () => void
}

const DAYS = [
	{value: 'Monday', label: 'Понедельник'},
	{value: 'Tuesday', label: 'Вторник'},
	{value: 'Wednesday', label: 'Среда'},
	{value: 'Thursday', label: 'Четверг'},
	{value: 'Friday', label: 'Пятница'},
	{value: 'Saturday', label: 'Суббота'},
];

const PAIR_NUMBERS = new Array(MAX_PAIRS_COUNT).fill(0).map((_, index) => index + 1);

const LESSON_TYPES = Object.entries(PARITY_LABELS).map((type) => ({
	value: type[0], label: type[1]
}));

export function LessonForm({lesson, onSuccess, onCancel}: LessonFormProps) {
	const [formData, setFormData] = useState({
		name: lesson?.name || '',
		teacher: lesson?.teacher || '',
		pair_number: lesson?.pair_number || 1,
		location: lesson?.location || '',
		type: lesson?.type || 'static',
		day: lesson?.day || 'Monday',
	});
	const [isLoading, setIsLoading] = useState(false);
	const {toast} = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (lesson?.id) {
				await apiService.updateLesson(lesson.id, formData);
				toast({
					title: 'Занятие обновлено',
					description: 'Изменения успешно сохранены',
				});
			} else {
				await apiService.createLesson(formData);
				toast({
					title: 'Занятие создано',
					description: 'Новое занятие добавлено в расписание',
				});
			}
			onSuccess();
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось сохранить занятие',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{lesson ? 'Редактировать занятие' : 'Новое занятие'}</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="name">Название занятия</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => setFormData({...formData, name: e.target.value})}
								placeholder="Например: Математика"
								required
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="teacher">ФИО преподавателя</Label>
							<Input
								id="teacher"
								value={formData.teacher}
								onChange={(e) => setFormData({...formData, teacher: e.target.value})}
								placeholder="Например: Иванов И.И."
								required
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="day">День недели</Label>
							<Select
								value={formData.day}
								onValueChange={(value) => setFormData({...formData, day: value})}
								disabled={isLoading}
							>
								<SelectTrigger>
									<SelectValue placeholder="Выберите день"/>
								</SelectTrigger>
								<SelectContent>
									{DAYS.map((day) => (
										<SelectItem key={day.value} value={day.value}>
											{day.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="pair_number">Номер пары</Label>
							<Select
								value={formData.pair_number.toString()}
								onValueChange={(value) => setFormData({
									...formData,
									pair_number: Number.parseInt(value)
								})}
								disabled={isLoading}
							>
								<SelectTrigger>
									<SelectValue placeholder="Выберите пару"/>
								</SelectTrigger>
								<SelectContent>
									{PAIR_NUMBERS.map((num) => (
										<SelectItem key={num} value={num.toString()}>
											{num} пара
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">Место проведения</Label>
							<Input
								id="location"
								value={formData.location}
								onChange={(e) => setFormData({...formData, location: e.target.value})}
								placeholder="Например: Аудитория 101"
								required
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="type">Тип проведения</Label>
							<Select
								value={formData.type}
								onValueChange={(value) => setFormData({
									...formData,
									type: value as 'static' | 'even' | 'odd'
								})}
								disabled={isLoading}
							>
								<SelectTrigger>
									<SelectValue placeholder="Выберите тип"/>
								</SelectTrigger>
								<SelectContent>
									{LESSON_TYPES.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex gap-3 pt-4">
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Сохранение...' : lesson ? 'Обновить' : 'Создать'}
						</Button>
						<Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
							Отмена
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
