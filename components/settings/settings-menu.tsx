import { SettingsDisplayType, useLocalSettings } from '@/store/localSettingsStore';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

export const SettingsMenu = () => {
	const [settings, _, changeDisplay] = useLocalSettings();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button variant="outline">Настройки</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="center">
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>Отображение пар</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem
								className={clsx(settings.display === 'all' && 'bg-secondary text-white')}
								onClick={() => changeDisplay('all')}
							>
								Все
							</DropdownMenuItem>
							<DropdownMenuItem
								className={clsx(settings.display === 'current' && 'bg-secondary text-white')}
								onClick={() => changeDisplay('current')}
							>
								Только текущие
							</DropdownMenuItem>
							<DropdownMenuItem
								className={clsx(settings.display === 'even' && 'bg-secondary text-white')}
								onClick={() => changeDisplay('even')}
							>
								По числителю (нечётные)
							</DropdownMenuItem>
							<DropdownMenuItem
								className={clsx(settings.display === 'odd' && 'bg-secondary text-white')}
								onClick={() => changeDisplay('odd')}
							>
								По знаменателю (чётные)
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
