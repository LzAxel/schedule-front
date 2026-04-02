import { LessonExtended } from '@/lib/api';
import { ParityType } from '@/types/parity';
import { SettingsDisplayType } from '@/store/localSettingsStore';

export const filterNotHiddenLessons = (
	lessons: LessonExtended[],
	displayMode: SettingsDisplayType,
	currentParity: ParityType,
): LessonExtended[] => {
	if (displayMode === 'all') {
		return lessons;
	}

	if (displayMode === 'current') {
		return lessons.filter((lesson) => lesson.parity_type === 'static' || lesson.parity_type === currentParity);
	} else {
		return lessons.filter((lesson) => lesson.parity_type === 'static' || lesson.parity_type === displayMode);
	}
};

export const isCurrentLessonDayEmpty = (
	lessons: LessonExtended[],
	displayMode: SettingsDisplayType,
	currentParity: ParityType,
) => {
	if (lessons.length < 1) {
		return true;
	}

	return filterNotHiddenLessons(lessons, displayMode, currentParity).length < 1;
};
