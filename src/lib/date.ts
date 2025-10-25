export function formatDateRange(startDate: Date, endDate: Date): string {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`.replace(/ г\./g, '');
}

export function getCurrentWeekRange(): { start: Date; end: Date } {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (вс) - 6 (сб)
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Смещение до понедельника

    const start = new Date(today);
    start.setDate(today.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0); // Начало дня

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999); // Конец дня

    return {start, end};
}

export function formatDateToDayMonth(date: Date, delta?: number): string {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
    const newDate = addDaysToDate(date, delta || 0)
    return formatter.format(newDate);
}

export function addDaysToDate(date: Date, days: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setDate(date.getDate() + days);

    return newDate;
}

export function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}