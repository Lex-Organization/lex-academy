import * as vscode from "vscode";
import type { CourseData } from "./course-types";
import type { CourseProgress } from "./progress-state";
import { getChecklistForKey, normalizeCourseProgress, serializeChecklistProgress } from "./progress-state";

export class CourseProgressStore {
  private saveQueue = Promise.resolve();

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly course: CourseData
  ) {}

  load(): CourseProgress {
    return normalizeCourseProgress(this.context.globalState.get("courseProgress", {}), this.course);
  }

  queueSave(key: unknown, rawValue: unknown) {
    if (typeof key !== "string") return;
    const checklist = getChecklistForKey(this.course, key);
    if (!checklist) return;

    const value = serializeChecklistProgress(rawValue, checklist);
    this.saveQueue = this.saveQueue
      .then(async () => {
        const current = this.load();
        current[key] = value;
        await this.context.globalState.update("courseProgress", current);
      })
      .then(undefined, (error) => {
        console.error("Failed to save course progress", error);
      });
  }

  flush(): Promise<void> {
    return this.saveQueue;
  }
}
