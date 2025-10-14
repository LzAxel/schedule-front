import React, { ReactNode } from 'react';
import { LucideChevronDown } from 'lucide-react';
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

interface Props {
	value: 'current' | 'even' | 'odd';
	onSelect: (value: 'current' | 'even' | 'odd') => void;
}

export const WeekStatusDropdown = (props: Props) => {
	return (
		<Select onValueChange={props.onSelect} value={props.value}>
			<SelectTrigger className="">
				<SelectValue>{props.value}</SelectValue>
				<SelectIcon />
			</SelectTrigger>
			<SelectPortal>
				<SelectContent>
					<SelectViewport className="flex flex-col gap-[8px] shadow-sm p-[12px] bg-background-dark rounded-md">
						<SelectItem
							className="flex flex-row gap-[10px] justify-between items-center w-full p-[10px] text-sm rounded-md bg-background-light shadow-sm hover:bg-background"
							value="current"
							key="current"
						>
							<SelectItemText>Отображать текущие пары</SelectItemText>
						</SelectItem>
						<SelectItem value="even" key="even">
							<SelectItemText>
								Только <span className="text-primary">чётные пары (знам.)</span>
							</SelectItemText>
						</SelectItem>
						<SelectItem value="odd" key="odd">
							<SelectItemText>
								Только <span className="text-secondary">нечётные пары (числ.)</span>
							</SelectItemText>
						</SelectItem>
					</SelectViewport>
				</SelectContent>
			</SelectPortal>
		</Select>
	);
};

const WeekStatusDropdownColorItem = ({
	children,
	onClick,
	isDropdown,
}: {
	children: ReactNode;
	onClick?: React.MouseEventHandler;
	isDropdown?: boolean;
}) => {
	return (
		<button
			className="flex flex-row gap-[10px] justify-between items-center w-full p-[10px] text-sm rounded-md bg-background-light shadow-sm hover:bg-background"
			onClick={onClick}
		>
			<div className="">{children}</div>
			{isDropdown && <LucideChevronDown className="w-[16px] h-[16px] text-text" />}
		</button>
	);
};
