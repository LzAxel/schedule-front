import { SettingsDisplayType, useLocalSettings } from '@/store/localSettingsStore';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { clsx } from 'clsx';

const getSettingsLabel = (value: SettingsDisplayType) => {
	switch (value) {
		case 'all':
			return 'Все';
		case 'current':
			return 'Текущие';
		case 'even':
			return 'Все нечётные (числ.)';
		case 'odd':
			return 'Все чётные (знам.)';
	}
};

export const SettingsMenu = () => {
	const [settings, _, changeDisplay] = useLocalSettings();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="border border-gray rounded-lg px-3 py-2 bg-secondary text-white hover:bg-primary shadow">
				{'Отображение пар: ' + getSettingsLabel(settings.display)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="center">
				<DropdownMenuItem
					className={clsx(settings.display === 'all' && 'bg-secondary text-white')}
					onClick={() => changeDisplay('all')}
				>
					{getSettingsLabel('all')}
				</DropdownMenuItem>
				<DropdownMenuItem
					className={clsx(settings.display === 'current' && 'bg-secondary text-white')}
					onClick={() => changeDisplay('current')}
				>
					{getSettingsLabel('current')}
				</DropdownMenuItem>
				<DropdownMenuItem
					className={clsx(settings.display === 'even' && 'bg-secondary text-white')}
					onClick={() => changeDisplay('even')}
				>
					{getSettingsLabel('even')}
				</DropdownMenuItem>
				<DropdownMenuItem
					className={clsx(settings.display === 'odd' && 'bg-secondary text-white')}
					onClick={() => changeDisplay('odd')}
				>
					{getSettingsLabel('odd')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
