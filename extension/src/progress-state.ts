import type { CourseData } from "./course-types";

export type ChecklistProgress = boolean[];
export interface StoredChecklistProgress {
  version: 2;
  checked: Record<string, true>;
}
export type CourseProgress = Record<string, StoredChecklistProgress>;

function getSafeLength(itemCount: number): number {
  return Number.isSafeInteger(itemCount) && itemCount > 0 ? itemCount : 0;
}

function getChecklistKey(item: unknown): string {
  return String(item);
}

function isStoredChecklistProgress(value: unknown): value is StoredChecklistProgress {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value as StoredChecklistProgress).version === 2 &&
    !!(value as StoredChecklistProgress).checked &&
    typeof (value as StoredChecklistProgress).checked === "object" &&
    !Array.isArray((value as StoredChecklistProgress).checked)
  );
}

export function normalizeChecklistProgress(value: unknown, checklist: number | unknown[]): ChecklistProgress {
  if (Array.isArray(checklist)) {
    if (isStoredChecklistProgress(value)) {
      return checklist.map((item) => value.checked[getChecklistKey(item)] === true);
    }

    const source = Array.isArray(value) ? value : [];
    return checklist.map((_, index) => source[index] === true);
  }

  const source = Array.isArray(value) ? value : [];
  return Array.from({ length: getSafeLength(checklist) }, (_, index) => source[index] === true);
}

export function countCompletedChecklistItems(value: unknown, itemCount: number): number {
  return normalizeChecklistProgress(value, itemCount).filter(Boolean).length;
}

export function getChecklistForKey(course: CourseData, key: string): string[] | undefined {
  for (const week of course.weeks) {
    for (const day of week.days) {
      if (`${week.slug}:${day.slug}` === key) {
        return day.checklist;
      }
    }
  }
  return undefined;
}

export function serializeChecklistProgress(value: unknown, checklist: unknown[]): StoredChecklistProgress {
  const checkedValues = normalizeChecklistProgress(value, checklist);
  const checked: Record<string, true> = {};

  checklist.forEach((item, index) => {
    if (checkedValues[index]) {
      checked[getChecklistKey(item)] = true;
    }
  });

  return { version: 2, checked };
}

export function normalizeCourseProgress(value: unknown, course: CourseData): CourseProgress {
  const source =
    value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const normalized: CourseProgress = {};

  for (const week of course.weeks) {
    for (const day of week.days) {
      const key = `${week.slug}:${day.slug}`;
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        normalized[key] = serializeChecklistProgress(source[key], day.checklist);
      }
    }
  }

  return normalized;
}
