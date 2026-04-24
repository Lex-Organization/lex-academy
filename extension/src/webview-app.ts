import type { CourseData, DayPrompt, WeekInfo } from "./course-types";
import type { CourseProgress } from "./progress-state";
import { normalizeChecklistProgress, serializeChecklistProgress } from "./progress-state";

declare function acquireVsCodeApi(): { postMessage(message: WebviewMessage): void };

type WebviewMessage =
  | { type: "saveProgress"; key: string; value: unknown }
  | { type: "copyToClipboard"; text: string }
  | { type: "prepareWorkspace"; workFolder: string };

const PHASE_CLASSES: Record<string, string> = {
  Foundations: "phase-foundations",
  TypeScript: "phase-typescript",
  React: "phase-react",
  "Next.js": "phase-next",
  "Tailwind & UI": "phase-tailwind",
  "AI-Assisted Eng": "phase-ai",
  "Portfolio & Prep": "phase-portfolio",
};

const HOUR_EMOJI = ["&#128161;", "&#128296;", "&#128640;", "&#11088;"];

const vscode = acquireVsCodeApi();
const appRoot = document.getElementById("app");
if (!(appRoot instanceof HTMLElement)) {
  throw new Error("Missing #app root");
}
const app = appRoot;

const COURSE = readJson<CourseData>("course-data");
let progress = readJson<CourseProgress>("progress-data");
let currentView: "home" | "day" = "home";
let currentWeekSlug: string | null = null;
let currentDaySlug: string | null = null;
let expandedWeeks: Record<string, boolean> = {};
let introHidden = localStorage.getItem("introHidden") === "true";

function readJson<T>(id: string): T {
  const element = document.getElementById(id);
  if (!element?.textContent) {
    throw new Error(`Missing JSON payload: ${id}`);
  }
  return JSON.parse(element.textContent) as T;
}

function progressKey(weekSlug: string, daySlug: string): string {
  return `${weekSlug}:${daySlug}`;
}

function phaseClass(phase: string): string {
  return PHASE_CLASSES[phase] || "phase-default";
}

function getProgressForDay(week: WeekInfo, day: DayPrompt): boolean[] {
  return normalizeChecklistProgress(progress[progressKey(week.slug, day.slug)], day.checklist);
}

function setProgress(week: WeekInfo, day: DayPrompt, checked: boolean[]) {
  const key = progressKey(week.slug, day.slug);
  const value = serializeChecklistProgress(checked, day.checklist);
  progress = { ...progress, [key]: value };
  vscode.postMessage({ type: "saveProgress", key, value });
}

function getWeekProgress(week: WeekInfo) {
  let done = 0;
  let total = 0;
  for (const day of week.days) {
    total += day.checklist.length;
    done += getProgressForDay(week, day).filter(Boolean).length;
  }
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function getCurrentSelection() {
  const week = COURSE.weeks.find((item) => item.slug === currentWeekSlug);
  const day = week?.days.find((item) => item.slug === currentDaySlug);
  return week && day ? { week, day } : null;
}

function esc(value: unknown): string {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function render() {
  const selection = getCurrentSelection();
  app.innerHTML = currentView === "day" && selection ? renderDay(selection.week, selection.day) : renderHome();
}

function renderHome(): string {
  let totalDone = 0;
  let totalItems = 0;
  let weeksComplete = 0;
  let daysComplete = 0;
  let totalDays = 0;

  for (const week of COURSE.weeks) {
    const weekProgress = getWeekProgress(week);
    totalDone += weekProgress.done;
    totalItems += weekProgress.total;
    if (weekProgress.pct === 100) weeksComplete++;

    for (const day of week.days) {
      totalDays++;
      const dayProgress = getProgressForDay(week, day);
      if (day.checklist.length > 0 && dayProgress.every(Boolean)) {
        daysComplete++;
      }
    }
  }

  const overallPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;
  let html = '<div class="header"><h1>Frontend Engineering</h1><p>18-module program &middot; Embroidery Store Project</p></div>';

  if (!introHidden) {
    html += '<div class="intro" id="intro">';
    html += '<p><strong>How it works:</strong> Each lesson is a prompt you copy and paste into any AI assistant (ChatGPT, Claude, Gemini, etc). The AI becomes your personal tutor for a ~4 hour hands-on session.</p>';
    html += '<p>There are <strong>5 lessons + 1 review</strong> per module. You build a real embroidery e-commerce store from scratch - it grows from static HTML all the way to a full-stack deployed app.</p>';
    html += '<p>Go at your own pace. Do one lesson a day, or binge three in a row. The checkboxes track your progress across sessions.</p>';
    html += '<button class="intro-toggle" data-action="hide-intro">Got it, hide this</button>';
    html += "</div>";
  }

  html += '<div class="stats">';
  html += `<div class="stat"><div class="stat-label">Overall</div><div class="stat-value">${overallPct}<span>%</span></div></div>`;
  html += `<div class="stat"><div class="stat-label">Modules</div><div class="stat-value">${weeksComplete}<span>/${COURSE.weeks.length}</span></div></div>`;
  html += `<div class="stat"><div class="stat-label">Lessons</div><div class="stat-value">${daysComplete}<span>/${totalDays}</span></div></div>`;
  html += "</div>";

  html += '<div class="week-list">';
  for (const week of COURSE.weeks) {
    const weekProgress = getWeekProgress(week);
    const expanded = expandedWeeks[week.slug];
    const phase = phaseClass(week.phase);

    html += '<div class="week-row">';
    html += `<button class="week-header" data-action="toggle-week" data-week="${esc(week.slug)}">`;
    html += `<div class="week-num ${phase}">${String(week.num).padStart(2, "0")}</div>`;
    html += '<div class="week-info">';
    html += `<div class="week-title">${esc(week.title)}</div>`;
    html += `<div class="week-progress"><div class="progress-bar"><div class="progress-fill ${phase} pct-${weekProgress.pct}"></div></div><span class="week-pct">${weekProgress.pct}%</span></div>`;
    html += "</div>";
    html += `<span class="chevron">${expanded ? "&#9652;" : "&#9662;"}</span>`;
    html += "</button>";

    if (expanded) {
      html += '<div class="day-list">';
      for (const day of week.days) {
        html += renderDayRow(week, day);
      }
      html += "</div>";
    }
    html += "</div>";
  }
  html += "</div>";
  return html;
}

function renderDayRow(week: WeekInfo, day: DayPrompt): string {
  const dayProgress = getProgressForDay(week, day);
  const done = dayProgress.filter(Boolean).length;
  const allDone = day.checklist.length > 0 && done === day.checklist.length;
  const cls = allDone ? "done" : done > 0 ? "partial" : "empty";
  const maxDots = Math.min(day.checklist.length, 8);
  let html = `<button class="day-row" data-action="open-day" data-week="${esc(week.slug)}" data-day="${esc(day.slug)}">`;
  html += `<div class="day-indicator ${cls}">${allDone ? "&#10003;" : day.dayNum}</div>`;
  html += `<span class="day-name">${day.dayNum === 6 ? "Review" : `Lesson ${day.dayNum}`}</span>`;
  html += `<span class="day-title">${esc(day.title)}</span>`;
  html += '<div class="dots">';
  for (let i = 0; i < maxDots; i++) {
    html += `<div class="dot ${i < done ? "filled" : "empty"}"></div>`;
  }
  html += "</div></button>";
  return html;
}

function renderDay(week: WeekInfo, day: DayPrompt): string {
  const isSaturday = day.dayNum === 6;
  const checked = getProgressForDay(week, day);
  const phase = phaseClass(week.phase);

  let html = '<div class="day-detail">';
  html += `<button class="back-btn" data-action="back">&#8592; Module ${week.num}</button>`;
  html += `<div class="day-badges"><span class="badge phase-badge ${phase}">${esc(week.phase)}</span>`;
  html += `<span class="badge">Module ${week.num} &middot; ${day.dayNum === 6 ? "Review" : `Lesson ${day.dayNum}`}</span></div>`;
  html += `<h2>${esc(day.title)}</h2>`;
  if (day.focus) html += `<p class="day-focus">${esc(day.focus)}</p>`;
  if (day.build) html += `<p class="day-build"><strong>Build:</strong> ${esc(day.build)}</p>`;

  html += '<div class="actions">';
  html += '<button class="copy-btn" data-action="copy-prompt">&#128203; Copy prompt</button>';
  html += '<button class="copy-btn deep-btn" data-action="copy-deep-dive">&#128300; Go deeper</button>';
  html += "</div>";
  if (day.workFolder) {
    html += '<div class="lesson-meta">';
    html += '<span class="meta-label">Folder</span>';
    html += '<div class="work-folder">';
    html += '<button class="prepare-icon-btn" data-action="prepare-workspace" title="Create folder" aria-label="Create folder">+</button>';
    html += '<span class="folder-divider"></span>';
    html += `<span class="folder-path">${esc(day.workFolder)}</span>`;
    html += "</div>";
    html += "</div>";
  }

  html += isSaturday ? renderSaturday(day) : renderSchedule(day, phase);
  html += renderChecklist(week, day, checked);
  html += renderNav(week, day);
  html += "</div>";
  return html;
}

function renderSaturday(day: DayPrompt): string {
  let html = '<div class="section-title">Today\'s Sessions</div>';
  html += '<div class="session-card"><div class="session-title">Mock Interview <span class="session-dur">90 min</span></div>';
  html += '<p class="session-desc">Behavioral questions, conceptual deep dives, and a live coding challenge.</p></div>';
  html += '<div class="session-card"><div class="session-title">Weekly Quiz <span class="session-dur">60 min</span></div>';
  html += '<p class="session-desc">Multiple choice, code reading, code writing. Scored out of 100.</p></div>';

  if (day.weekRecap.length > 0) {
    html += '<div class="section-title">Week Recap</div>';
    for (const line of day.weekRecap) {
      const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
      if (match) {
        html += `<div class="recap-row"><span class="recap-day">${esc(match[1])}</span><span class="recap-text">${esc(match[2])}</span></div>`;
      }
    }
  }
  return html;
}

function renderSchedule(day: DayPrompt, phase: string): string {
  if (day.hours.length === 0) return "";
  let html = '<div class="section-title">Today\'s Schedule</div>';
  day.hours.forEach((hour, index) => {
    html += '<div class="hour-card"><div class="hour-top">';
    html += `<div class="hour-icon ${phase}">${HOUR_EMOJI[index] || "-"}</div>`;
    html += `<span class="hour-title">${esc(hour.title)}</span>`;
    html += `<span class="hour-duration">${esc(hour.duration)}</span>`;
    html += "</div>";
    if (hour.topics.length > 0) {
      html += '<ul class="hour-topics">';
      hour.topics.forEach((topic) => {
        html += `<li>${esc(topic)}</li>`;
      });
      html += "</ul>";
    }
    html += "</div>";
  });
  return html;
}

function renderChecklist(week: WeekInfo, day: DayPrompt, checked: boolean[]): string {
  if (day.checklist.length === 0) return "";
  const doneCount = checked.filter(Boolean).length;
  let html = '<div class="checklist-section">';
  html += '<div class="checklist-header"><div class="section-title checklist-title">Checklist</div>';
  html += '<div class="checklist-header-actions">';
  html += `<span class="checklist-count">${doneCount}/${day.checklist.length}</span>`;
  if (doneCount > 0) {
    html += `<button class="reset-btn" data-action="reset" data-week="${esc(week.slug)}" data-day="${esc(day.slug)}">Reset</button>`;
  }
  html += "</div></div>";
  day.checklist.forEach((item, index) => {
    html += `<button class="check-item" data-action="toggle-check" data-index="${index}" data-week="${esc(week.slug)}" data-day="${esc(day.slug)}">`;
    html += `<div class="check-box ${checked[index] ? "checked" : ""}">${checked[index] ? "&#10003;" : ""}</div>`;
    html += `<span class="check-text ${checked[index] ? "done" : ""}">${esc(item)}</span>`;
    html += "</button>";
  });
  html += "</div>";
  return html;
}

function renderNav(week: WeekInfo, day: DayPrompt): string {
  const allDays = COURSE.weeks.flatMap((item) => item.days.map((child) => ({ week: item, day: child })));
  const index = allDays.findIndex((item) => item.week.slug === week.slug && item.day.slug === day.slug);
  const prev = index > 0 ? allDays[index - 1] : null;
  const next = index < allDays.length - 1 ? allDays[index + 1] : null;
  let html = '<div class="lesson-nav">';
  if (prev) {
    html += `<button class="back-btn" data-action="open-day" data-week="${esc(prev.week.slug)}" data-day="${esc(prev.day.slug)}">&#8592; ${prev.day.dayNum === 6 ? "Review" : `Lesson ${prev.day.dayNum}`}</button>`;
  } else {
    html += "<span></span>";
  }
  if (next) {
    html += `<button class="back-btn" data-action="open-day" data-week="${esc(next.week.slug)}" data-day="${esc(next.day.slug)}">${next.day.dayNum === 6 ? "Review" : `Lesson ${next.day.dayNum}`} &#8594;</button>`;
  }
  html += "</div>";
  return html;
}

function handleClick(event: MouseEvent) {
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-action]") : null;
  if (!target) return;

  const action = target.dataset.action;
  if (action === "toggle-week" && target.dataset.week) {
    expandedWeeks = { ...expandedWeeks, [target.dataset.week]: !expandedWeeks[target.dataset.week] };
    render();
    return;
  }

  if (action === "open-day" && target.dataset.week && target.dataset.day) {
    currentView = "day";
    currentWeekSlug = target.dataset.week;
    currentDaySlug = target.dataset.day;
    render();
    return;
  }

  if (action === "back") {
    currentView = "home";
    render();
    return;
  }

  if (action === "hide-intro") {
    introHidden = true;
    localStorage.setItem("introHidden", "true");
    render();
    return;
  }

  const selection = getCurrentSelection();
  if (!selection) return;

  if (action === "copy-prompt") {
    postCopy(target, COURSE.preamble + selection.day.content);
    return;
  }

  if (action === "copy-deep-dive") {
    const deepTopics = selection.day.title + (selection.day.focus ? `. ${selection.day.focus}` : "");
    postCopy(target, COURSE.deepDivePreamble + deepTopics);
    return;
  }

  if (action === "prepare-workspace" && selection.day.workFolder) {
    vscode.postMessage({ type: "prepareWorkspace", workFolder: selection.day.workFolder });
    flashButton(target, "...");
    return;
  }

  if (action === "toggle-check" && target.dataset.index) {
    const checked = getProgressForDay(selection.week, selection.day);
    const index = Number.parseInt(target.dataset.index, 10);
    if (Number.isInteger(index) && index >= 0 && index < checked.length) {
      checked[index] = !checked[index];
      setProgress(selection.week, selection.day, checked);
      render();
    }
    return;
  }

  if (action === "reset") {
    setProgress(selection.week, selection.day, new Array(selection.day.checklist.length).fill(false));
    render();
  }
}

function postCopy(button: HTMLElement, text: string) {
  vscode.postMessage({ type: "copyToClipboard", text });
  flashButton(button, "Copied!");
}

function flashButton(button: HTMLElement, text: string) {
  const originalText = button.textContent || "";
  button.textContent = text;
  window.setTimeout(() => {
    button.textContent = originalText;
  }, 2000);
}

app.addEventListener("click", handleClick);
render();
