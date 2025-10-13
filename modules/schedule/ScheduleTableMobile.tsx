import {Schedule} from "@/lib/api";
import {DAY_NAMES} from "@/const/days";
import {ScheduleTableMobileItem} from "@/modules/schedule/ScheduleTableMobileItem";
import {addDaysToDate, formatDateToDayMonth, isToday} from "@/lib/date";
import clsx from "clsx";

interface Props {
    schedule: Schedule;
    weekStartDate: Date;
}

export const ScheduleTableMobile = ({schedule, weekStartDate}: Props) => {
    return <div className="flex flex-col gap-[10px]">
        {
            Object.entries(DAY_NAMES).map(([weekday, weekdayName], index) => {
                return <div className={clsx("rounded-md bg-background shadow-sm flex flex-col gap-[10px] p-[10px] pb-[5px]", isToday(addDaysToDate(weekStartDate, index)) && "outline-primary outline")}>
                    <p className="text-xs text-text-muted">{`${weekdayName}, ${formatDateToDayMonth(weekStartDate, index)}`}</p>
                    <div className="flex flex-col gap-[6px]">
                        {
                            schedule[weekday].length > 1 ?
                                schedule[weekday].map((pair) => (
                                    <ScheduleTableMobileItem title={pair.name} teacher={pair.teacher}
                                                             place={pair.location}
                                                             pairNumber={pair.pair_number}/>
                                )) :
                                <div className="text-text-muted text-center text-xs pb-[5px]">Свободный день</div>
                        }
                    </div>
                </div>
            })
        }
    </div>
}