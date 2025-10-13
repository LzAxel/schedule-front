export function formatDateRange(startDate: Date, endDate: Date): string {
	const formatter = new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
	return `${formatter.format(startDate)} - ${formatter.format(endDate)}`.replace(/ г\./g, '');
}
