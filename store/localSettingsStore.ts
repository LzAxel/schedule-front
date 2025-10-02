import { useState, useEffect } from 'react';

export type SettingsDisplayType = 'all' | 'current' | 'even' | 'odd';

interface LocalSettings {
	isDarkTheme: boolean;
	display: SettingsDisplayType;
}

const DEFAULT_SETTINGS: LocalSettings = {
	isDarkTheme: false,
	display: 'all',
};

const STORAGE_KEY = 'localSettings';

export const useLocalSettings = () => {
	const [settings, setSettings] = useState<LocalSettings>(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (
					typeof parsed.isDarkTheme === 'boolean' &&
					['all', 'current', 'even', 'odd'].includes(parsed.display)
				) {
					return parsed as LocalSettings;
				}
			}
		} catch (error) {
			console.error('Error reading from localStorage:', error);
		}
		return DEFAULT_SETTINGS;
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		} catch (error) {
			console.error('Error writing to localStorage:', error);
		}
	}, [settings]);

	const changeTheme = (isDarkTheme: boolean) => {
		setSettings((prev) => ({ ...prev, isDarkTheme }));
	};

	const changeDisplay = (display: SettingsDisplayType) => {
		setSettings((prev) => ({ ...prev, display }));
	};

	return { settings, changeTheme, changeDisplay };
};
