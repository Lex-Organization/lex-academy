export interface DayPrompt {
  week: string;
  slug: string;
  weekNum: number;
  dayNum: number;
  dayName: string;
  title: string;
  focus: string;
  build: string;
  content: string;
  checklist: string[];
  hours: { label: string; title: string; duration: string; topics: string[] }[];
  weekRecap: string[];
  workFolder: string;
}

export interface WeekInfo {
  slug: string;
  num: number;
  title: string;
  phase: string;
  days: DayPrompt[];
}

export interface CourseData {
  preamble: string;
  deepDivePreamble: string;
  weeks: WeekInfo[];
}
