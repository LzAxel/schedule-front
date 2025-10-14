import {PAIR_TIMES} from "@/const/pairs";
import {LucideMapPin, LucideUser} from "lucide-react";
import {ParityType} from "@/types/parity";
import {clsx} from "clsx";

interface Props {
    title: string;
    teacher: string;
    place: string;
    pairNumber: number;
    parity?: ParityType;
}

export const ScheduleTableMobileItem = (props: Props) => {
    return <div className="flex flex-row gap-[8px] not-last:border-b border-b-background-light">
        <div className="flex w-[15px] text-sm items-center justify-center shrink-0"><p>{props.pairNumber}</p></div>
        <div className="flex flex-col gap-[8px] pb-[8px] grow">
            <div className="flex flex-row gap-[10px] justify-between items-start">
                <p className={clsx("text-sm line-clamp-2", {
                    "text-primary": props.parity === 'even',
                    "text-secondary": props.parity === 'odd'
                })}>{props.title}</p>
                <p className="whitespace-nowrap hidden xs:block text-xs text-text-muted">{PAIR_TIMES[props.pairNumber as keyof typeof PAIR_TIMES]}</p>
                <div className="xs:hidden flex text-right flex-col gap-[3px] text-sm text-text-muted">
                    <p className="text-xs text-text-muted">{PAIR_TIMES[props.pairNumber as keyof typeof PAIR_TIMES].split(" - ")[0]}</p>
                    <p className="text-xs text-text-muted">{PAIR_TIMES[props.pairNumber as keyof typeof PAIR_TIMES].split(" - ")[1]}</p>
                </div>
            </div>
            <div className="flex flex-row gap-[10px] text-xs text-text-muted justify-between items-center">
                <div className="flex flex-row items-center gap-[5px]">
                    <LucideUser className="w-[14px] h-[14px] shrink-0"/>
                    {props.teacher}
                </div>
                <div className="flex flex-row items-center gap-[5px]">
                    <LucideMapPin className="w-[14px] h-[14px] shrink-0"/>
                    {props.place}
                </div>
            </div>
        </div>
    </div>
}