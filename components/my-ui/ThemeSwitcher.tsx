import React from 'react';
import { LucideMoon, LucideSun } from 'lucide-react';
import { useLocalSettings } from '@/store/localSettingsStore';

export const ThemeSwitcher = () => {
	const [localSettings, setIsDarkTheme] = useLocalSettings();

	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				setIsDarkTheme(!localSettings.isDarkTheme);
			}}
			className="w-fit flex p-[8px] rounded-md shadow-sm bg-background-light text-text-muted text-sm"
		>
			{localSettings.isDarkTheme ? <LucideMoon /> : <LucideSun />}
		</button>
	);
};
