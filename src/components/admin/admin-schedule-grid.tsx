'use client';

import { useState, useEffect } from 'react';
import { apiService, type Schedule, type LessonExtended, type Group } from '@/lib/api';
import { DAY_NAMES } from '@/const/days';
import { PAIR_TIMES, MAX_PAIRS_COUNT } from '@/const/pairs';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LessonForm } from '@/components/admin/lesson-form';
import { Lesson } from '@/lib/api';

const DAYS = Object.keys(DAY_NAMES);

const EMPTY_SCHEDULE: Schedule = {
	Monday: [],
	Tuesday: [],
	Wednesday: [],
	Thursday: [],
	Friday: [],
	Saturday: [],
	Sunday: [],
};

export function AdminScheduleGrid() {
	const [schedule, setSchedule] = useState<Schedule>(EMPTY_SCHEDULE);
	const [groups, setGroups] = useState<Group[]>([]);
	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
	const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [editingLesson, setEditingLesson] = useState<Lesson | undefined>();
	const [showForm, setShowForm] = useState(false);
	const [formSlot, setFormSlot] = useState<{ day: string; pair: number } | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		loadInitialData();
	}, []);

	const loadInitialData = async () => {
		setIsLoading(true);
		try {
			const [groupsData, versionsData] = await Promise.all([
				apiService.getGroups(),
				apiService.getScheduleVersions(),
			]);
			setGroups(groupsData);
			const currentVersion = versionsData.find((v) => v.is_current) || versionsData[0];
			if (currentVersion) {
				setSelectedVersionId(currentVersion.id);
			}
			if (groupsData.length > 0) {
				setSelectedGroupId(groupsData[0].id);
			}
		} catch {
			toast({ title: 'Ошибка загрузки', variant: 'destructive' });
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (selectedGroupId && selectedVersionId) {
			loadSchedule();
		}
	}, [selectedGroupId, selectedVersionId]);

	const loadSchedule = async () => {
		if (!selectedGroupId || !selectedVersionId) return;
		try {
			const data = await apiService.getSchedule(selectedGroupId, selectedVersionId);
			setSchedule(data || EMPTY_SCHEDULE);
		} catch {
			toast({ title: 'Ошибка загрузки расписания', variant: 'destructive' });
		}
	};

	const handleAddLesson = (day: string, pair: number) => {
		setFormSlot({ day, pair });
		setEditingLesson({
			id: 0,
			schedule_version_id: selectedVersionId!,
			subject_id: 0,
			teacher_id: 0,
			location_id: 0,
			group_id: selectedGroupId!,
			pair_number: pair,
			day_of_week: day,
			parity_type: 'static',
			lesson_type: 'lection',
		});
		setShowForm(true);
	};

	const handleEditLesson = (lesson: LessonExtended) => {
		setFormSlot(null);
		setEditingLesson({
			id: lesson.id,
			schedule_version_id: lesson.schedule_version_id,
			subject_id: lesson.subject_id,
			teacher_id: lesson.teacher_id,
			location_id: lesson.location_id,
			group_id: lesson.group_id,
			pair_number: lesson.pair_number,
			day_of_week: lesson.day_of_week,
			parity_type: lesson.parity_type,
			lesson_type: lesson.lesson_type,
		});
		setShowForm(true);
	};

	const handleDeleteLesson = async (id: number) => {
		if (!confirm('Удалить занятие?')) return;
		try {
			await apiService.deleteLesson(id);
			toast({ title: 'Занятие удалено' });
			loadSchedule();
		} catch {
			toast({ title: 'Ошибка', variant: 'destructive' });
		}
	};

	const handleFormSuccess = () => {
		setShowForm(false);
		setEditingLesson(undefined);
		setFormSlot(null);
		loadSchedule();
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingLesson(undefined);
		setFormSlot(null);
	};

	if (isLoading) {
		return <div className="text-center py-8 text-text-muted">Загрузка...</div>;
	}

	const maxPairs = MAX_PAIRS_COUNT;

	return (
		<div>
			<div className="flex items-center gap-4 mb-4">
				<select
					value={selectedGroupId || ''}
					onChange={(e) => setSelectedGroupId(Number(e.target.value))}
					className="h-8 px-3 rounded-md bg-background text-text text-sm border border-border/30 focus:border-primary outline-none"
				>
					{groups.map((g) => (
						<option key={g.id} value={g.id}>{g.name}</option>
					))}
				</select>
				<button
					onClick={loadSchedule}
					className="px-3 py-1 text-sm bg-background-light text-text-muted rounded-md hover:bg-background"
				>
					Обновить
				</button>
			</div>

			{showForm && editingLesson && selectedVersionId ? (
				<LessonForm
					lesson={editingLesson}
					versionId={selectedVersionId}
					onSuccess={handleFormSuccess}
					onCancel={handleFormCancel}
				/>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr>
								<th className="p-2 text-left text-xs font-medium text-text-muted w-20">Время</th>
								{DAYS.map((day) => (
									<th key={day} className="p-2 text-center text-xs font-medium text-text-muted">
										{DAY_NAMES[day as keyof typeof DAY_NAMES]}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: maxPairs }, (_, pairIndex) => {
								const pairNum = pairIndex + 1;
								const times = (PAIR_TIMES as Record<string, string>)[`pair_${pairNum}`]?.split(' - ') || ['', ''];
								return (
									<tr key={pairNum} className="border-t border-border/30">
										<td className="p-2 align-top">
											<div className="text-sm font-medium text-text">{pairNum}</div>
											<div className="text-xs text-text-muted">{times[0]}</div>
											<div className="text-xs text-text-muted">{times[1]}</div>
										</td>
										{DAYS.map((day) => {
											const dayLessons = schedule[day]?.filter(
												(l) => l.pair_number === pairNum,
											) || [];

											return (
												<td
													key={day}
													className="p-1 align-top border-l border-border/30"
													style={{ minWidth: 150 }}
												>
													<div className="space-y-1">
														{dayLessons.map((lesson) => (
															<div
																key={lesson.id}
																className={`p-2 rounded text-xs ${
																	lesson.parity_type === 'odd'
																		? 'bg-blue-50 border border-blue-200'
																		: lesson.parity_type === 'even'
																		? 'bg-purple-50 border border-purple-200'
																		: 'bg-background-light border border-border/30'
																}`}
															>
																<div className="font-medium text-text">
																	{lesson.subject_name}
																</div>
																<div className="text-text-muted">
																	{lesson.teacher_name}
																</div>
																<div className="text-text-muted">
																	{lesson.location_name}
																</div>
																<div className="flex gap-1 mt-1">
																	<button
																		onClick={() => handleEditLesson(lesson)}
																		className="p-1 hover:bg-background rounded"
																	>
																		<Pencil className="w-3 h-3" />
																	</button>
																	<button
																		onClick={() => handleDeleteLesson(lesson.id)}
																		className="p-1 hover:bg-destructive/10 rounded text-destructive"
																	>
																		<Trash2 className="w-3 h-3" />
																	</button>
																</div>
															</div>
														))}
														<button
															onClick={() => handleAddLesson(day, pairNum)}
															className="w-full p-1.5 text-xs text-text-muted hover:text-text hover:bg-background-light rounded border border-dashed border-border/50 flex items-center justify-center gap-1"
														>
															<Plus className="w-3 h-3" />
														</button>
													</div>
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
