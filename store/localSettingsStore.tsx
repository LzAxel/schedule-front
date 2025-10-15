import React, { createContext, useContext, useEffect, useState } from 'react';

export type SettingsDisplayType = 'all' | 'current' | 'even' | 'odd';

interface LocalSettings {
	isDarkTheme: boolean;
	display: SettingsDisplayType;
}

const DEFAULT_SETTINGS: LocalSettings = {
	isDarkTheme: false,
	display: 'current',
};

const STORAGE_KEY = 'localSettings';

const LocalSettingsContext = createContext<
	| {
			settings: LocalSettings;
			changeTheme: (isDarkTheme: boolean) => void;
			changeDisplay: (display: SettingsDisplayType) => void;
	  }
	| undefined
>(undefined);

const toggleDarkTheme = (isDark: boolean) => {
	if (isDark) {
		document.querySelector('body')!.classList.add('dark');
	} else {
		document.querySelector('body')!.classList.remove('dark');
	}
};

export const LocalSettingsProvider = ({ children }: { children: React.ReactNode }) => {
	const [settings, setSettings] = useState<LocalSettings>(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (
					typeof parsed.isDarkTheme === 'boolean' &&
					['all', 'current', 'even', 'odd'].includes(parsed.display)
				) {
					if (document) {
						toggleDarkTheme(parsed.isDarkTheme);
					}
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
			toggleDarkTheme(settings.isDarkTheme);
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

	return (
		<LocalSettingsContext.Provider value={{ settings, changeTheme, changeDisplay }}>
			{children}
		</LocalSettingsContext.Provider>
	);
};

export const useLocalSettings = () => {
	const context = useContext(LocalSettingsContext);
	if (!context) {
		throw new Error('useLocalSettings must be used within a LocalSettingsProvider');
	}
	return [context.settings, context.changeTheme, context.changeDisplay] as const;
};
