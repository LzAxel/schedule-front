export function getAcademicWeekNumber(currentDate: Date): number {
	// Определяем год начала учебного года
	const currentYear = currentDate.getFullYear();
	const academicYearStart = new Date(currentYear, 8, 1); // 1 сентября текущего года (месяцы 0-based)

	// Если текущая дата до 1 сентября, используем прошлый год
	const yearStart = currentDate < academicYearStart ? currentYear - 1 : currentYear;
	const startOfAcademicYear = new Date(yearStart, 8, 1); // 1 сентября учебного года

	// Функция для получения номера ISO недели
	function getISOWeekNumber(date: Date): number {
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		const dayNum = d.getUTCDay() || 7; // Преобразуем воскресенье (0) в 7
		d.setUTCDate(d.getUTCDate() + 4 - dayNum); // Смещаем к ближайшему четвергу
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
	}

	// Получаем ISO номера недель для текущей даты и начала учебного года
	const currentWeek = getISOWeekNumber(currentDate);
	const academicYearStartWeek = getISOWeekNumber(startOfAcademicYear);

	// Вычисляем номер недели учебного года
	let academicWeekNumber = currentWeek - academicYearStartWeek + 1;
	if (academicWeekNumber < 1) {
		// Если текущая неделя раньше начала учебного года, добавляем 52 или 53 недели (в зависимости от года)
		academicWeekNumber += getISOWeekNumber(new Date(yearStart, 11, 31)) === 53 ? 53 : 52;
	}

	return academicWeekNumber;
}

export const isCurrentWeekEven = (paritySetting: 'even' | 'odd') => {
	const weekNumber = getAcademicWeekNumber(new Date());
	return paritySetting === 'even' ? weekNumber % 2 === 0 : weekNumber % 2 !== 0;
};
