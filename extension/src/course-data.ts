import * as fs from "fs";
import * as path from "path";
import type { CourseData } from "./course-types";

function isCourseData(value: unknown): value is CourseData {
  const course = value as CourseData;
  return (
    !!course &&
    typeof course === "object" &&
    typeof course.preamble === "string" &&
    typeof course.deepDivePreamble === "string" &&
    Array.isArray(course.weeks)
  );
}

export function loadCourseData(extensionPath: string): CourseData {
  const dataPath = path.join(extensionPath, "media", "course-data.json");
  const parsed = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  if (!isCourseData(parsed)) {
    throw new Error("Invalid course-data.json shape");
  }
  return parsed;
}
