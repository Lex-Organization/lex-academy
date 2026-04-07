import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

interface DayPrompt {
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

interface WeekInfo {
  slug: string;
  num: number;
  title: string;
  phase: string;
  days: DayPrompt[];
}

interface CourseData {
  preamble: string;
  weeks: WeekInfo[];
}

let courseData: CourseData;

function loadCourseData(extensionPath: string): CourseData {
  const dataPath = path.join(extensionPath, "media", "course-data.json");
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

export function activate(context: vscode.ExtensionContext) {
  courseData = loadCourseData(context.extensionPath);

  const provider = new CourseDashboardProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("frontendCourse.dashboard", provider),
    vscode.commands.registerCommand("frontendCourse.openLesson", () => {
      vscode.commands.executeCommand("frontendCourse.dashboard.focus");
    })
  );

}

class CourseDashboardProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this.view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    // Load saved progress
    const progress = this.context.globalState.get<Record<string, boolean[]>>("courseProgress", {});

    webviewView.webview.html = this.getHtml(progress);

    webviewView.webview.onDidReceiveMessage((msg) => {
      switch (msg.type) {
        case "saveProgress": {
          const current = this.context.globalState.get<Record<string, boolean[]>>("courseProgress", {});
          current[msg.key] = msg.value;
          this.context.globalState.update("courseProgress", current);
          break;
        }
        case "copyToClipboard": {
          vscode.env.clipboard.writeText(msg.text);
          vscode.window.showInformationMessage("Prompt copied to clipboard!");
          break;
        }
        case "openLesson": {
          this.prepareWorkspace(msg.workFolder);
          break;
        }
      }
    });
  }

  private async prepareWorkspace(workFolder: string) {
    if (!workFolder) return;

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) return;

    const root = workspaceFolders[0].uri;
    const folderUri = vscode.Uri.joinPath(root, workFolder);

    // Silently create the folder if it doesn't exist — no focus stealing
    try {
      await vscode.workspace.fs.stat(folderUri);
    } catch {
      await vscode.workspace.fs.createDirectory(folderUri);
    }
  }

  private getHtml(progress: Record<string, boolean[]>): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${getStyles()}</style>
</head>
<body>
<div id="app"></div>
<script>
const COURSE = ${JSON.stringify(courseData).replace(/<\//g, '<\\/')};
const PROGRESS = ${JSON.stringify(progress)};
const vscode = acquireVsCodeApi();

${getAppScript()}
</script>
</body>
</html>`;
  }
}

function getStyles(): string {
  return `
:root {
  --bg: var(--vscode-sideBar-background, var(--vscode-editor-background));
  --fg: var(--vscode-sideBar-foreground, var(--vscode-editor-foreground));
  --muted: var(--vscode-descriptionForeground);
  --border: var(--vscode-sideBarSectionHeader-border, var(--vscode-widget-border, rgba(128,128,128,0.15)));
  --card: var(--vscode-sideBar-background, var(--bg));
  --accent: var(--vscode-textLink-foreground, #007acc);
  --hover: var(--vscode-list-hoverBackground, rgba(128,128,128,0.08));
  --active: var(--vscode-list-activeSelectionBackground, rgba(128,128,128,0.15));
  --badge-bg: var(--vscode-badge-background);
  --badge-fg: var(--vscode-badge-foreground);
  --success: var(--vscode-testing-iconPassed, #22c55e);
  --input-bg: var(--vscode-input-background);
  --input-border: var(--vscode-input-border, var(--border));
  --button-bg: var(--vscode-button-background);
  --button-fg: var(--vscode-button-foreground);
  --button-hover: var(--vscode-button-hoverBackground);
  --section-header: var(--vscode-sideBarSectionHeader-background, transparent);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { overflow-y: scroll; }
body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size, 13px); color: var(--fg); background: var(--bg); line-height: 1.4; }
button { font-family: inherit; font-size: inherit; cursor: pointer; border: none; background: none; color: inherit; }

.header { padding: 12px 20px 10px; background: var(--section-header); border-bottom: 1px solid var(--border); }
.header h1 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1px; }
.header p { font-size: 11px; color: var(--muted); font-weight: 400; }

.intro { padding: 10px 12px; border-bottom: 1px solid var(--border); }
.intro p { font-size: 12px; color: var(--muted); line-height: 1.5; margin: 0 0 6px 0; }
.intro p:last-child { margin-bottom: 0; }
.intro strong { color: var(--vscode-foreground); font-weight: 500; }
.intro-toggle { background: none; border: none; color: var(--muted); font-size: 11px; cursor: pointer; padding: 4px 0; text-decoration: underline; }
.intro-toggle:hover { color: var(--vscode-foreground); }
.stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; padding: 10px 12px; }
.stat { background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 3px; padding: 6px 8px; }
.stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; color: var(--muted); margin-bottom: 1px; }
.stat-value { font-size: 16px; font-weight: 600; }
.stat-value span { font-size: 11px; font-weight: 400; color: var(--muted); }

.week-list { padding: 4px 0; }
.week-row { border-bottom: 1px solid var(--border); }
.week-row:last-child { border-bottom: none; }
.week-header { display: flex; align-items: stretch; gap: 8px; padding: 8px 12px; cursor: pointer; }
.week-header:hover { background: var(--hover); }
.week-num { width: 24px; height: 24px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: white; flex-shrink: 0; align-self: flex-start; }
.week-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; }
.week-title { font-weight: 400; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1; }
.week-progress { display: flex; align-items: center; gap: 6px; }
.progress-bar { flex: 1; height: 2px; border-radius: 1px; background: var(--border); overflow: hidden; }
.progress-fill { height: 100%; border-radius: 1px; transition: width 0.3s; }
.week-pct { font-size: 10px; color: var(--muted); min-width: 28px; text-align: right; font-variant-numeric: tabular-nums; }
.chevron { color: var(--muted); font-size: 10px; flex-shrink: 0; width: 16px; text-align: center; }
.badge { font-size: 10px; padding: 0px 5px; border-radius: 3px; background: var(--input-bg); color: var(--muted); white-space: nowrap; border: 1px solid var(--input-border); }

.day-list { padding: 2px 0 4px; }
.day-row { display: flex; align-items: center; gap: 6px; padding: 4px 12px 4px 20px; cursor: pointer; }
.day-row:hover { background: var(--hover); }
.day-indicator { width: 18px; height: 18px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; flex-shrink: 0; }
.day-indicator.done { background: var(--success); color: white; }
.day-indicator.partial { background: var(--accent); color: white; }
.day-indicator.empty { background: var(--input-bg); color: var(--muted); border: 1px solid var(--input-border); }
.day-name { font-size: 12px; color: var(--muted); width: 65px; flex-shrink: 0; }
.day-title { font-size: 12px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dots { display: flex; gap: 2px; flex-shrink: 0; }
.dot { width: 3px; height: 3px; border-radius: 50%; }
.dot.filled { background: var(--success); }
.dot.empty { background: var(--border); }

/* Day detail view */
.day-detail { padding: 12px; }
.back-btn { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: var(--accent); padding: 2px 0; margin-bottom: 10px; }
.back-btn:hover { text-decoration: underline; }
.day-badges { display: flex; gap: 4px; margin-bottom: 6px; flex-wrap: wrap; }
.day-detail h2 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.day-focus { font-size: 12px; color: var(--muted); margin-bottom: 3px; line-height: 1.4; }
.day-build { font-size: 12px; margin-bottom: 3px; }
.day-build strong { font-weight: 600; }
.work-folder { display: inline-flex; align-items: center; gap: 4px; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 3px; padding: 2px 6px; font-size: 11px; color: var(--muted); margin-top: 4px; font-family: var(--vscode-editor-font-family); }

.copy-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 7px; margin: 12px 0; border-radius: 3px; background: var(--button-bg); color: var(--button-fg); font-weight: 400; font-size: 12px; }
.copy-btn:hover { background: var(--button-hover); }
.copy-btn, .deep-btn { min-height: 32px; }
.deep-btn { flex: 0 !important; white-space: nowrap; background: var(--input-bg) !important; color: var(--fg) !important; border: 1px solid var(--border); }
.deep-btn:hover { background: var(--hover) !important; }

.section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; color: var(--muted); margin: 12px 0 6px; font-weight: 600; padding: 4px 0; border-bottom: 1px solid var(--border); }

.hour-card { border: 1px solid var(--border); border-radius: 3px; padding: 8px 10px; margin-bottom: 4px; }
.hour-top { display: flex; align-items: center; gap: 6px; }
.hour-icon { width: 22px; height: 22px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
.hour-title { font-weight: 600; font-size: 12px; }
.hour-duration { font-size: 10px; color: var(--muted); margin-left: 4px; }
.hour-topics { margin-top: 4px; padding-left: 28px; }
.hour-topics li { font-size: 11px; color: var(--muted); margin-bottom: 1px; list-style: disc; }

/* Saturday */
.session-card { border: 1px solid var(--border); border-radius: 3px; padding: 8px 10px; margin-bottom: 4px; }
.session-title { font-weight: 600; font-size: 12px; }
.session-dur { font-size: 10px; color: var(--muted); }
.session-desc { font-size: 11px; color: var(--muted); margin-top: 3px; }
.recap-row { display: flex; gap: 6px; font-size: 11px; margin-bottom: 3px; }
.recap-day { color: var(--muted); width: 65px; flex-shrink: 0; font-weight: 500; }
.recap-text { color: var(--muted); flex: 1; }

.checklist-section { border: 1px solid var(--border); border-radius: 3px; padding: 10px; margin-top: 10px; }
.checklist-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.checklist-count { font-size: 11px; color: var(--muted); font-variant-numeric: tabular-nums; }
.check-item { display: flex; align-items: flex-start; gap: 6px; padding: 3px 0; cursor: pointer; }
.check-item:hover { opacity: 0.85; }
.check-box { width: 14px; height: 14px; border: 1px solid var(--input-border); border-radius: 3px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 1px; font-size: 10px; }
.check-box.checked { background: var(--success); border-color: var(--success); color: white; }
.check-text { font-size: 12px; line-height: 1.4; }
.check-text.done { color: var(--muted); text-decoration: line-through; }
.reset-btn { font-size: 10px; color: var(--muted); padding: 1px 6px; border: 1px solid var(--border); border-radius: 3px; }
.reset-btn:hover { color: var(--fg); border-color: var(--fg); }
`;
}

function getAppScript(): string {
  return `
const PHASE_COLORS = {
  "Foundations": "#f59e0b",
  "TypeScript": "#3b82f6",
  "React": "#06b6d4",
  "Next.js": "#7c3aed",
  "Tailwind & UI": "#ec4899",
  "AI-Powered Dev": "#10b981",
  "Portfolio & Prep": "#f97316",
};

const HOUR_EMOJI = ["💡", "🔨", "🚀", "⭐"];

let currentView = "home";
let currentWeek = null;
let currentDay = null;
let expandedWeeks = {};
let introHidden = localStorage.getItem("introHidden") === "true";
let progress = { ...PROGRESS };

function getProgress(weekSlug, daySlug) {
  return progress[weekSlug + ":" + daySlug] || [];
}

function setProgress(weekSlug, daySlug, arr) {
  const key = weekSlug + ":" + daySlug;
  progress[key] = arr;
  vscode.postMessage({ type: "saveProgress", key, value: arr });
}

function getWeekProgress(week) {
  let done = 0, total = 0;
  for (const d of week.days) {
    total += d.checklist.length;
    done += (getProgress(week.slug, d.slug)).filter(Boolean).length;
  }
  return { done, total, pct: total > 0 ? Math.round(done / total * 100) : 0 };
}

function render() {
  const app = document.getElementById("app");
  if (currentView === "day" && currentWeek && currentDay) {
    app.innerHTML = renderDay(currentWeek, currentDay);
  } else {
    app.innerHTML = renderHome();
  }
  attachListeners();
}

function renderHome() {
  let totalDone = 0, totalItems = 0, weeksComplete = 0, daysComplete = 0, totalDays = 0;
  const weekPcts = [];
  for (const w of COURSE.weeks) {
    const wp = getWeekProgress(w);
    totalDone += wp.done; totalItems += wp.total;
    if (wp.pct === 100) weeksComplete++;
    weekPcts.push(wp.pct);
    for (const d of w.days) {
      totalDays++;
      const p = getProgress(w.slug, d.slug);
      if (d.checklist.length > 0 && p.length === d.checklist.length && p.every(Boolean)) daysComplete++;
    }
  }
  const overallPct = totalItems > 0 ? Math.round(totalDone / totalItems * 100) : 0;

  let html = '<div class="header"><h1>Frontend Engineering</h1><p>18-module program · Embroidery Store Project</p></div>';

  if (!introHidden) {
    html += '<div class="intro" id="intro">';
    html += '<p><strong>How it works:</strong> Each lesson is a prompt you copy and paste into any AI assistant (ChatGPT, Claude, Gemini, etc). The AI becomes your personal tutor for a ~4 hour hands-on session.</p>';
    html += '<p>There are <strong>5 lessons + 1 review</strong> per module. You build a real embroidery e-commerce store from scratch — it grows from static HTML all the way to a full-stack deployed app.</p>';
    html += '<p>Go at your own pace. Do one lesson a day, or binge three in a row. The checkboxes track your progress across sessions.</p>';
    html += '<button class="intro-toggle" data-action="hide-intro">Got it, hide this</button>';
    html += '</div>';
  }

  html += '<div class="stats">';
  html += '<div class="stat"><div class="stat-label">Overall</div><div class="stat-value">' + overallPct + '<span>%</span></div></div>';
  html += '<div class="stat"><div class="stat-label">Modules</div><div class="stat-value">' + weeksComplete + '<span>/' + COURSE.weeks.length + '</span></div></div>';
  html += '<div class="stat"><div class="stat-label">Lessons</div><div class="stat-value">' + daysComplete + '<span>/' + totalDays + '</span></div></div>';
  html += '</div>';

  html += '<div class="week-list">';
  for (const w of COURSE.weeks) {
    const wp = getWeekProgress(w);
    const color = PHASE_COLORS[w.phase] || "#888";
    const expanded = expandedWeeks[w.slug];

    html += '<div class="week-row">';
    html += '<div class="week-header" data-week="' + w.slug + '">';
    html += '<div class="week-num" style="background:' + color + '">' + String(w.num).padStart(2, "0") + '</div>';
    html += '<div class="week-info">';
    html += '<div class="week-title">' + esc(w.title) + '</div>';
    html += '<div class="week-progress"><div class="progress-bar"><div class="progress-fill" style="width:' + wp.pct + '%;background:' + color + '"></div></div><span class="week-pct">' + wp.pct + '%</span></div>';
    html += '</div>';
    html += '<span class="chevron">' + (expanded ? "▴" : "▾") + '</span>';
    html += '</div>';

    if (expanded) {
      html += '<div class="day-list">';
      for (const d of w.days) {
        const p = getProgress(w.slug, d.slug);
        const done = p.filter(Boolean).length;
        const allDone = d.checklist.length > 0 && done === d.checklist.length;
        const cls = allDone ? "done" : done > 0 ? "partial" : "empty";

        html += '<div class="day-row" data-week="' + w.slug + '" data-day="' + d.slug + '">';
        html += '<div class="day-indicator ' + cls + '">' + (allDone ? "✓" : d.dayNum) + '</div>';
        html += '<span class="day-name">' + (d.dayNum === 6 ? 'Review' : 'Lesson ' + d.dayNum) + '</span>';
        html += '<span class="day-title">' + esc(d.title) + '</span>';
        html += '<div class="dots">';
        const maxDots = Math.min(d.checklist.length, 8);
        for (let i = 0; i < maxDots; i++) {
          html += '<div class="dot ' + (i < done ? "filled" : "empty") + '"></div>';
        }
        html += '</div></div>';
      }
      html += '</div>';
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function renderDay(week, day) {
  const isSaturday = day.dayNum === 6;
  const color = PHASE_COLORS[week.phase] || "#888";
  const p = getProgress(week.slug, day.slug);
  const checked = p.length === day.checklist.length ? p : new Array(day.checklist.length).fill(false);

  let html = '<div class="day-detail">';
  html += '<button class="back-btn" data-action="back">← Module ' + week.num + '</button>';

  html += '<div class="day-badges"><span class="badge" style="border-color:' + color + ';color:' + color + '">' + esc(week.phase) + '</span>';
  html += '<span class="badge">Module ' + week.num + ' · ' + (day.dayNum === 6 ? 'Review' : 'Lesson ' + day.dayNum) + '</span></div>';

  html += '<h2>' + esc(day.title) + '</h2>';
  if (day.focus) html += '<p class="day-focus">' + esc(day.focus) + '</p>';
  if (day.build) html += '<p class="day-build"><strong>Build:</strong> ' + esc(day.build) + '</p>';
  if (day.workFolder) html += '<div class="work-folder">📁 ' + esc(day.workFolder) + '</div>';

  // Copy button
  const promptText = COURSE.preamble + day.content;
  html += '<div style="display:flex;gap:6px;margin:12px 0">';
  html += '<button class="copy-btn" style="flex:1" data-action="copy" data-prompt="' + btoa(unescape(encodeURIComponent(promptText))) + '" data-folder="' + esc(day.workFolder || '') + '">📋 Copy prompt</button>';

  // Deep dive button — builds a prompt from the day's topics
  var deepTopics = day.title + (day.focus ? ". " + day.focus : "");
  var deepText = COURSE.deepDivePreamble + deepTopics;
  html += '<button class="copy-btn deep-btn" data-action="copy" data-prompt="' + btoa(unescape(encodeURIComponent(deepText))) + '" data-folder="">🔬 Go deeper</button>';
  html += '</div>';

  if (isSaturday) {
    html += '<div class="section-title">Today\\'s Sessions</div>';
    html += '<div class="session-card"><div class="session-title">Mock Interview <span class="session-dur">90 min</span></div>';
    html += '<p class="session-desc">Behavioral questions, conceptual deep dives, and a live coding challenge.</p></div>';
    html += '<div class="session-card"><div class="session-title">Weekly Quiz <span class="session-dur">60 min</span></div>';
    html += '<p class="session-desc">Multiple choice, code reading, code writing. Scored out of 100.</p></div>';

    if (day.weekRecap.length > 0) {
      html += '<div class="section-title">Week Recap</div>';
      for (const line of day.weekRecap) {
        const m = line.match(/^\\*\\*(.+?):\\*\\*\\s*(.+)$/);
        if (m) html += '<div class="recap-row"><span class="recap-day">' + esc(m[1]) + '</span><span class="recap-text">' + esc(m[2]) + '</span></div>';
      }
    }
  } else {
    if (day.hours.length > 0) {
      html += '<div class="section-title">Today\\'s Schedule</div>';
      day.hours.forEach(function(h, i) {
        html += '<div class="hour-card"><div class="hour-top">';
        html += '<div class="hour-icon" style="background:' + color + '">' + (HOUR_EMOJI[i] || "📌") + '</div>';
        html += '<span class="hour-title">' + esc(h.title) + '</span>';
        html += '<span class="hour-duration">' + esc(h.duration) + '</span>';
        html += '</div>';
        if (h.topics.length > 0) {
          html += '<ul class="hour-topics">';
          h.topics.forEach(function(t) { html += '<li>' + esc(t) + '</li>'; });
          html += '</ul>';
        }
        html += '</div>';
      });
    }
  }

  // Checklist
  if (day.checklist.length > 0) {
    const doneCount = checked.filter(Boolean).length;
    html += '<div class="checklist-section">';
    html += '<div class="checklist-header"><div class="section-title" style="margin:0">Checklist</div>';
    html += '<div style="display:flex;align-items:center;gap:8px">';
    html += '<span class="checklist-count">' + doneCount + '/' + day.checklist.length + '</span>';
    if (doneCount > 0) html += '<button class="reset-btn" data-action="reset" data-week="' + week.slug + '" data-day="' + day.slug + '">Reset</button>';
    html += '</div></div>';
    day.checklist.forEach(function(item, i) {
      html += '<div class="check-item" data-action="toggle" data-index="' + i + '" data-week="' + week.slug + '" data-day="' + day.slug + '">';
      html += '<div class="check-box ' + (checked[i] ? "checked" : "") + '">' + (checked[i] ? "✓" : "") + '</div>';
      html += '<span class="check-text ' + (checked[i] ? "done" : "") + '">' + esc(item) + '</span>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Nav
  const allDays = [];
  COURSE.weeks.forEach(function(w) { w.days.forEach(function(d) { allDays.push({ w, d }); }); });
  const idx = allDays.findIndex(function(x) { return x.w.slug === week.slug && x.d.slug === day.slug; });
  const prev = idx > 0 ? allDays[idx - 1] : null;
  const next = idx < allDays.length - 1 ? allDays[idx + 1] : null;

  html += '<div style="display:flex;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">';
  var prevLabel = prev ? (prev.d.dayNum === 6 ? 'Review' : 'Lesson ' + prev.d.dayNum) : '';
  var nextLabel = next ? (next.d.dayNum === 6 ? 'Review' : 'Lesson ' + next.d.dayNum) : '';
  if (prev) html += '<button class="back-btn" data-action="nav" data-nw="' + prev.w.slug + '" data-nd="' + prev.d.slug + '">← ' + prevLabel + '</button>';
  else html += '<span></span>';
  if (next) html += '<button class="back-btn" data-action="nav" data-nw="' + next.w.slug + '" data-nd="' + next.d.slug + '">' + nextLabel + ' →</button>';
  html += '</div>';

  html += '</div>';
  return html;
}

function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

function attachListeners() {
  // Week expand/collapse
  document.querySelectorAll(".week-header").forEach(function(el) {
    el.addEventListener("click", function() {
      const slug = this.dataset.week;
      expandedWeeks[slug] = !expandedWeeks[slug];
      render();
    });
  });

  // Day click
  document.querySelectorAll(".day-row").forEach(function(el) {
    el.addEventListener("click", function() {
      const ws = this.dataset.week, ds = this.dataset.day;
      const w = COURSE.weeks.find(function(x) { return x.slug === ws; });
      const d = w && w.days.find(function(x) { return x.slug === ds; });
      if (w && d) { currentView = "day"; currentWeek = w; currentDay = d; render(); }
    });
  });

  // Back
  document.querySelectorAll('[data-action="back"]').forEach(function(el) {
    el.addEventListener("click", function() { currentView = "home"; render(); });
  });

  // Nav prev/next
  document.querySelectorAll('[data-action="nav"]').forEach(function(el) {
    el.addEventListener("click", function() {
      const ws = this.dataset.nw, ds = this.dataset.nd;
      const w = COURSE.weeks.find(function(x) { return x.slug === ws; });
      const d = w && w.days.find(function(x) { return x.slug === ds; });
      if (w && d) { currentWeek = w; currentDay = d; render(); }
    });
  });

  // Copy
  document.querySelectorAll('[data-action="copy"]').forEach(function(el) {
    el.addEventListener("click", function() {
      const text = decodeURIComponent(escape(atob(this.dataset.prompt)));
      vscode.postMessage({ type: "copyToClipboard", text: text });
      var folder = this.dataset.folder;
      if (folder) vscode.postMessage({ type: "openLesson", workFolder: folder });
      var originalText = this.textContent;
      this.textContent = "✓ Copied!";
      var btn = this;
      setTimeout(function() { btn.textContent = originalText; }, 2000);
    });
  });

  // Checklist toggle
  document.querySelectorAll('[data-action="toggle"]').forEach(function(el) {
    el.addEventListener("click", function() {
      const ws = this.dataset.week, ds = this.dataset.day;
      const idx = parseInt(this.dataset.index);
      const day = COURSE.weeks.find(function(w) { return w.slug === ws; })
        ?.days.find(function(d) { return d.slug === ds; });
      if (!day) return;
      const arr = getProgress(ws, ds);
      const checked = arr.length === day.checklist.length ? [...arr] : new Array(day.checklist.length).fill(false);
      checked[idx] = !checked[idx];
      setProgress(ws, ds, checked);
      render();
    });
  });

  // Hide intro
  document.querySelectorAll('[data-action="hide-intro"]').forEach(function(el) {
    el.addEventListener("click", function() {
      introHidden = true;
      localStorage.setItem("introHidden", "true");
      render();
    });
  });

  // Reset
  document.querySelectorAll('[data-action="reset"]').forEach(function(el) {
    el.addEventListener("click", function() {
      const ws = this.dataset.week, ds = this.dataset.day;
      const day = COURSE.weeks.find(function(w) { return w.slug === ws; })
        ?.days.find(function(d) { return d.slug === ds; });
      if (!day) return;
      setProgress(ws, ds, new Array(day.checklist.length).fill(false));
      render();
    });
  });
}

render();
`;
}

export function deactivate() {}
