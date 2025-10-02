import { SettingsDisplayType, useLocalSettings } from '@/store/localSettingsStore';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const SettingsMenu = () => {
	const { settings, changeDisplay } = useLocalSettings();

	const getDisplayButtonVariant = (display: SettingsDisplayType) => {
		if (settings.display === display) {
			return 'secondary';
		}
		return 'outline';
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button variant="outline">Настройки</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="start">
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>Отображение пар</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => changeDisplay('all')}>Все</DropdownMenuItem>
							<DropdownMenuItem>
								onClick={() => changeDisplay('current')}
								Текущие
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button onClick={() => changeDisplay('even')} variant={getDisplayButtonVariant('even')}>
									Числитель (нечётные)
								</Button>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button onClick={() => changeDisplay('odd')} variant={getDisplayButtonVariant('odd')}>
									Знаменатель (чётные)
								</Button>
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
