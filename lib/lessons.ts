import {Lesson} from "@/lib/api";
import {ParityType} from "@/types/parity";


export const filterNotHiddenLessons = (lessons: Lesson[], isHidePairs: boolean, currentParity: ParityType) => {
	if (!isHidePairs) {
		return lessons;
	}

	return lessons.filter((lesson) => lesson.type === 'static' || lesson.type === currentParity)
}

export const isCurrentLessonDayEmpty = (lessons: Lesson[], isHidePairs: boolean, currentParity: ParityType) => {
	if (lessons.length < 1) {
		return true
	}

	if (isHidePairs) {
		return filterNotHiddenLessons(lessons, true, currentParity).length < 1
	}

	return false;
}