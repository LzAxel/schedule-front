import React, {forwardRef, ReactNode} from 'react';
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
import {LucideChevronDown} from "lucide-react";
import {SettingsDisplayType} from "@/store/localSettingsStore";

interface Props {
    value: SettingsDisplayType;
    onSelect: (value: SettingsDisplayType) => void;
}

export const WeekStatusDropdown = (props: Props) => {
    return (
        <Select onValueChange={props.onSelect} value={props.value}>
            <SelectTrigger className="flex flex-row gap-[10px] outline-none justify-between items-center w-full p-[10px] text-sm rounded-md bg-background-light shadow-sm hover:bg-background">
                <SelectValue/>
                <SelectIcon>
                    <LucideChevronDown className="w-[16px] h-[16px] text-text"/>
                </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
                <SelectContent className="w-full" align="center" sideOffset={12} position="popper">
                    <SelectViewport
                        className="flex flex-col gap-[8px] shadow-sm p-[12px] bg-background-dark rounded-md">
                        <SelectItem value="all" asChild={true}>
                            <WeekStatusDropdownColorItem>
                                Отображать все пары
                            </WeekStatusDropdownColorItem>
                        </SelectItem>
                        <SelectItem value="current" asChild={true}>
                            <WeekStatusDropdownColorItem>
                                Отображать текущие пары
                            </WeekStatusDropdownColorItem>
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

const WeekStatusDropdownColorItem = forwardRef<HTMLButtonElement, {
        children: ReactNode;
        onClick?: React.MouseEventHandler;
    }>(({
            children,
            onClick,
        }, ref) => {
            return (
                <button
                    className="flex flex-row gap-[10px] justify-between items-center w-full p-[10px] text-sm rounded-md bg-background-light shadow-sm hover:bg-background"
                    onClick={onClick}
                >
                    <SelectItemText>
                        {children}
                    </SelectItemText>
                </button>
            );
        }
    )
;
