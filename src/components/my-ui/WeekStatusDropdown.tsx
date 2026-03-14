import React, { forwardRef, ReactNode } from 'react';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectItemText,
	SelectPortal,
	SelectTrigger,
	SelectValue,
	SelectViewport,
} from '@radix-ui/react-select';
import { LucideChevronDown } from 'lucide-react';
import { SettingsDisplayType } from '@/store/localSettingsStore';

interface Props {
	value: SettingsDisplayType;
	onSelect: (value: SettingsDisplayType) => void;
}

export const WeekStatusDropdown = (props: Props) => {
	return (
		<Select onValueChange={props.onSelect} value={props.value}>
			<SelectTrigger className="flex flex-row gap-2 justify-between items-center w-full p-[10px] text-sm rounded-md bg-background-light border border-border/30 hover:bg-background-light/80 transition-colors outline-none">
				<SelectValue />
				<SelectIcon>
					<LucideChevronDown className="w-4 h-4 text-text-muted" />
				</SelectIcon>
			</SelectTrigger>
			<SelectPortal>
				<SelectContent className="w-full" align="center" sideOffset={8} position="popper">
					<SelectViewport className="flex flex-col gap-1 p-1.5 bg-background rounded-lg border border-border/30 shadow-lg">
						<SelectItem value="all" asChild={true}>
							<WeekStatusDropdownColorItem>Отображать все пары</WeekStatusDropdownColorItem>
						</SelectItem>
						<SelectItem value="current" asChild={true}>
							<WeekStatusDropdownColorItem>Отображать текущие пары</WeekStatusDropdownColorItem>
						</SelectItem>
						<SelectItem value="even" asChild={true}>
							<WeekStatusDropdownColorItem>
								Только <span className="text-primary">чётные пары (знам.)</span>
							</WeekStatusDropdownColorItem>
						</SelectItem>
						<SelectItem value="odd" asChild={true}>
							<WeekStatusDropdownColorItem>
								Только <span className="text-secondary">нечётные пары (числ.)</span>
							</WeekStatusDropdownColorItem>
						</SelectItem>
					</SelectViewport>
				</SelectContent>
			</SelectPortal>
		</Select>
	);
};

const WeekStatusDropdownColorItem = forwardRef<
	HTMLButtonElement,
	{
		children: ReactNode;
		onClick?: React.MouseEventHandler;
	}
>(({ children, onClick }, ref) => {
	return (
		<button
			className="flex flex-row gap-2 justify-between items-center w-full px-2.5 py-1.5 text-sm rounded-md text-text hover:bg-primary/10 hover:text-primary transition-colors"
			onClick={onClick}
		>
			<SelectItemText>{children}</SelectItemText>
		</button>
	);
});
