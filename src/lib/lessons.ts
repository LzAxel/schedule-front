import { Lesson } from '@/lib/api';
import { ParityType } from '@/types/parity';
import { SettingsDisplayType } from '@/store/localSettingsStore';

export const filterNotHiddenLessons = (
	lessons: Lesson[],
	displayMode: SettingsDisplayType,
	currentParity: ParityType,
) => {
	if (displayMode === 'all') {
		return lessons;
	}

	if (displayMode === 'current') {
		return lessons.filter((lesson) => lesson.type === 'static' || lesson.type === currentParity);
	} else {
		return lessons.filter((lesson) => lesson.type === 'static' || lesson.type === displayMode);
	}
};

export const isCurrentLessonDayEmpty = (
	lessons: Lesson[],
	displayMode: SettingsDisplayType,
	currentParity: ParityType,
) => {
	if (lessons.length < 1) {
		return true;
	}

	return filterNotHiddenLessons(lessons, displayMode, currentParity).length < 1;
};
