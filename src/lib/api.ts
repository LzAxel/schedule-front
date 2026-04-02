import { AuthService } from './auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface Group {
	id: number;
	name: string;
	course: number;
	created_at: string;
}

export interface Lesson {
	id: number;
	schedule_version_id: number;
	subject_id: number;
	teacher_id: number;
	location_id: number;
	group_id: number;
	pair_number: number;
	day_of_week: string;
	parity_type: 'even' | 'odd' | 'static';
	lesson_type: 'lection' | 'practice' | 'lab';
}

export interface LessonExtended extends Lesson {
	subject_name: string;
	teacher_name: string;
	location_name: string;
	group_name: string;
}

export interface Admin {
	id: number;
	username: string;
	is_super: boolean;
}

export interface Settings {
	parity: 'even' | 'odd';
	version_id?: number;
}

export interface Schedule {
	[day: string]: LessonExtended[];
}

export interface Teacher {
	id: number;
	name: string;
}

export interface Subject {
	id: number;
	name: string;
}

export interface Location {
	id: number;
	building: string;
	room: string;
	full_name: string;
}

export interface ScheduleVersion {
	id: number;
	week_start: string;
	parity: 'even' | 'odd';
	semester_id: number;
	is_current: boolean;
}

export interface Semester {
	id: number;
	name: string;
	start_date: string;
	end_date: string;
	is_active: boolean;
}

export interface Conflict {
	type: 'teacher' | 'location' | 'group';
	message: string;
	existing_id: number;
}

type LessonFormData = Omit<Lesson, 'id'>;

class ApiService {
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${API_BASE_URL}${endpoint}`;
		const config: RequestInit = {
			headers: {
				'Content-Type': 'application/json',
				...AuthService.getAuthHeaders(),
				...options.headers,
			},
			...options,
		};

		const response = await fetch(url, config);

		if (!response.ok) {
			throw new Error(`API Error: ${response.statusText}`);
		}

		return response.json();
	}

	async getSchedule(groupId: number, versionId?: number): Promise<Schedule> {
		const params = new URLSearchParams({ group_id: groupId.toString() });
		if (versionId) params.append('version_id', versionId.toString());
		return this.request<Schedule>(`/schedule?${params}`);
	}

	async getParity(): Promise<Settings> {
		return this.request<Settings>('/parity');
	}

	async getLessons(versionId?: number): Promise<LessonExtended[]> {
		const params = versionId ? `?version_id=${versionId}` : '';
		return this.request<LessonExtended[]>(`/lessons${params}`);
	}

	async createLesson(lesson: LessonFormData, versionId: number): Promise<{ id: number }> {
		return this.request<{ id: number }>(`/lessons?version_id=${versionId}`, {
			method: 'POST',
			body: JSON.stringify(lesson),
		});
	}

	async updateLesson(id: number, lesson: LessonFormData): Promise<void> {
		await this.request(`/lessons/${id}`, {
			method: 'PUT',
			body: JSON.stringify(lesson),
		});
	}

	async deleteLesson(id: number): Promise<void> {
		await this.request(`/lessons/${id}`, {
			method: 'DELETE',
		});
	}

	async getAdmins(): Promise<Admin[]> {
		return this.request<Admin[]>('/admins');
	}

	async createAdmin(admin: { username: string; password: string }): Promise<void> {
		await this.request('/admins', {
			method: 'POST',
			body: JSON.stringify(admin),
		});
	}

	async deleteAdmin(id: number): Promise<void> {
		await this.request(`/admins/${id}`, {
			method: 'DELETE',
		});
	}

	async toggleParity(): Promise<Settings> {
		return this.request<Settings>('/parity', {
			method: 'PUT',
		});
	}

	async getGroups(): Promise<Group[]> {
		return this.request<Group[]>('/groups');
	}

	async getGroup(id: number): Promise<Group> {
		return this.request<Group>(`/groups/${id}`);
	}

	async createGroup(name: string, course: number): Promise<Group> {
		return this.request<Group>('/groups', {
			method: 'POST',
			body: JSON.stringify({ name, course }),
		});
	}

	async updateGroup(id: number, name: string, course: number): Promise<void> {
		await this.request(`/groups/${id}`, {
			method: 'PUT',
			body: JSON.stringify({ name, course }),
		});
	}

	async deleteGroup(id: number): Promise<void> {
		await this.request(`/groups/${id}`, {
			method: 'DELETE',
		});
	}

	async getTeachers(): Promise<Teacher[]> {
		return this.request<Teacher[]>('/teachers');
	}

	async createTeacher(name: string): Promise<Teacher> {
		return this.request<Teacher>('/teachers', {
			method: 'POST',
			body: JSON.stringify({ name }),
		});
	}

	async updateTeacher(id: number, name: string): Promise<void> {
		await this.request(`/teachers/${id}`, {
			method: 'PUT',
			body: JSON.stringify({ name }),
		});
	}

	async deleteTeacher(id: number): Promise<void> {
		await this.request(`/teachers/${id}`, { method: 'DELETE' });
	}

	async getTeacherSubjects(teacherId: number): Promise<Subject[]> {
		return this.request<Subject[]>(`/teachers/${teacherId}/subjects`);
	}

	async addTeacherSubject(teacherId: number, subjectId: number): Promise<void> {
		await this.request(`/teachers/${teacherId}/subjects`, {
			method: 'POST',
			body: JSON.stringify({ subject_id: subjectId }),
		});
	}

	async removeTeacherSubject(teacherId: number, subjectId: number): Promise<void> {
		await this.request(`/teachers/${teacherId}/subjects/${subjectId}`, { method: 'DELETE' });
	}

	async getSubjects(): Promise<Subject[]> {
		return this.request<Subject[]>('/subjects');
	}

	async createSubject(name: string): Promise<Subject> {
		return this.request<Subject>('/subjects', {
			method: 'POST',
			body: JSON.stringify({ name }),
		});
	}

	async updateSubject(id: number, name: string): Promise<void> {
		await this.request(`/subjects/${id}`, {
			method: 'PUT',
			body: JSON.stringify({ name }),
		});
	}

	async deleteSubject(id: number): Promise<void> {
		await this.request(`/subjects/${id}`, { method: 'DELETE' });
	}

	async getSubjectTeachers(subjectId: number): Promise<Teacher[]> {
		return this.request<Teacher[]>(`/subjects/${subjectId}/teachers`);
	}

	async getLocations(): Promise<Location[]> {
		return this.request<Location[]>('/locations');
	}

	async createLocation(building: string, room: string): Promise<Location> {
		return this.request<Location>('/locations', {
			method: 'POST',
			body: JSON.stringify({ building, room }),
		});
	}

	async updateLocation(id: number, building: string, room: string): Promise<void> {
		await this.request(`/locations/${id}`, {
			method: 'PUT',
			body: JSON.stringify({ building, room }),
		});
	}

	async deleteLocation(id: number): Promise<void> {
		await this.request(`/locations/${id}`, { method: 'DELETE' });
	}

	async getScheduleVersions(): Promise<ScheduleVersion[]> {
		return this.request<ScheduleVersion[]>('/versions');
	}

	async createScheduleVersion(weekStart: string, parity: string, semesterId: number): Promise<ScheduleVersion> {
		return this.request<ScheduleVersion>('/versions', {
			method: 'POST',
			body: JSON.stringify({ week_start: weekStart, parity, semester_id: semesterId }),
		});
	}

	async setCurrentVersion(id: number): Promise<void> {
		await this.request(`/versions/${id}/current`, { method: 'PUT' });
	}

	async deleteScheduleVersion(id: number): Promise<void> {
		await this.request(`/versions/${id}`, { method: 'DELETE' });
	}

	async copyScheduleVersion(fromVersionId: number, toVersionId: number): Promise<void> {
		await this.request('/versions/copy', {
			method: 'POST',
			body: JSON.stringify({ from_version_id: fromVersionId, to_version_id: toVersionId }),
		});
	}

	async getSemesters(): Promise<Semester[]> {
		return this.request<Semester[]>('/semesters');
	}

	async createSemester(name: string, startDate: string, endDate: string): Promise<Semester> {
		return this.request<Semester>('/semesters', {
			method: 'POST',
			body: JSON.stringify({ name, start_date: startDate, end_date: endDate }),
		});
	}

	async setActiveSemester(id: number): Promise<void> {
		await this.request(`/semesters/${id}/active`, { method: 'PUT' });
	}

	async validateLesson(params: {
		teacher_id: number;
		location_id: number;
		group_id: number;
		day_of_week: string;
		pair_number: number;
		parity_type: string;
		exclude_id?: string;
	}): Promise<{ conflicts: Conflict[] }> {
		return this.request<{ conflicts: Conflict[] }>('/validate/lesson', {
			method: 'POST',
			body: JSON.stringify(params),
		});
	}
}

export const apiService = new ApiService();
