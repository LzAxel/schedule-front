import { AuthService } from './auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface Lesson {
	id?: number;
	name: string;
	teacher: string;
	pair_number: number;
	location: string;
	type: 'even' | 'odd' | 'static';
	day: string;
}

export interface Admin {
	id: number;
	username: string;
	is_super: boolean;
}

export interface Settings {
	parity: 'even' | 'odd';
}

export interface Schedule {
	[day: string]: Lesson[];
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

	// Public endpoints
	async getSchedule(): Promise<Schedule> {
		return this.request<Schedule>('/schedule');
	}

	async getParity(): Promise<Settings> {
		return this.request<Settings>('/parity');
	}

	// Protected endpoints
	async getLessons(): Promise<Lesson[]> {
		return this.request<Lesson[]>('/lessons');
	}

	async createLesson(lesson: Omit<Lesson, 'id'>): Promise<void> {
		await this.request('/lessons', {
			method: 'POST',
			body: JSON.stringify(lesson),
		});
	}

	async updateLesson(id: number, lesson: Omit<Lesson, 'id'>): Promise<void> {
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

	// Reference entities
	async getTeachers(): Promise<Teacher[]> {
		return this.request<Teacher[]>('/teachers');
	}

	async createTeacher(name: string): Promise<Teacher> {
		return this.request<Teacher>('/teachers', {
			method: 'POST',
			body: JSON.stringify({ name }),
		});
	}

	async deleteTeacher(id: number): Promise<void> {
		await this.request(`/teachers/${id}`, { method: 'DELETE' });
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

	async deleteSubject(id: number): Promise<void> {
		await this.request(`/subjects/${id}`, { method: 'DELETE' });
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

	async deleteLocation(id: number): Promise<void> {
		await this.request(`/locations/${id}`, { method: 'DELETE' });
	}
}

export const apiService = new ApiService();
