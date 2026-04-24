/**
 * Exports all parsed prompt data + teacher preamble to a single JSON file.
 * Run: node export-prompts.js
 */
const fs = require("fs");
const path = require("path");

const PROMPTS_DIR = path.join(__dirname, "prompts");
const PREAMBLE_PATH = path.join(__dirname, "teacher-preamble.md");

const WEEK_META = {
  1: { title: "HTML, CSS & Web Fundamentals", phase: "Foundations" },
  2: { title: "JavaScript & the DOM", phase: "Foundations" },
  3: { title: "JavaScript Deep Dive", phase: "Foundations" },
  4: { title: "TypeScript Fundamentals", phase: "TypeScript" },
  5: { title: "TypeScript in Practice", phase: "TypeScript" },
  6: { title: "React Fundamentals", phase: "React" },
  7: { title: "React Hooks & Effects", phase: "React" },
  8: { title: "React State & Routing", phase: "React" },
  9: { title: "Forms, Testing & Modern React", phase: "React" },
  10: { title: "Next.js Fundamentals", phase: "Next.js" },
  11: { title: "Next.js Data & Server Actions", phase: "Next.js" },
  12: { title: "Next.js Advanced Features", phase: "Next.js" },
  13: { title: "Full-Stack Store (Part 1)", phase: "Next.js" },
  14: { title: "Full-Stack Store (Part 2)", phase: "Next.js" },
  15: { title: "Tailwind CSS + E2E Testing", phase: "Tailwind & UI" },
  16: { title: "Component Libraries & Design Systems", phase: "Tailwind & UI" },
  17: { title: "AI-Assisted Engineering", phase: "AI-Assisted Eng" },
  18: { title: "Job Readiness", phase: "Portfolio & Prep" },
};

const WEEK_WORK_FOLDERS = {
  1: "workspace/vanilla-store", 2: "workspace/vanilla-store",
  3: "workspace/vanilla-store", 4: "workspace/vanilla-store",
  5: "workspace/vanilla-store", 6: "workspace/react-store",
  7: "workspace/react-store", 8: "workspace/react-store",
  9: "workspace/react-store", 10: "workspace/nextjs-store",
  11: "workspace/nextjs-store", 12: "workspace/nextjs-store",
  13: "workspace/nextjs-store", 14: "workspace/nextjs-store",
  15: "workspace/nextjs-store", 16: "workspace/nextjs-store",
  17: "workspace/nextjs-store", 18: "workspace/nextjs-store",
};

const NO_WORK_FOLDER_DAYS = new Set([
  "17:6",
  "18:4",
  "18:5",
  "18:6",
]);

function getSection(raw, heading) {
  const match = raw.match(new RegExp(`^##\\s+${heading}\\s*$`, "m"));
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  const nextHeading = raw.slice(start).match(/^##\s+/m);
  const end = nextHeading && nextHeading.index !== undefined ? start + nextHeading.index : raw.length;
  return raw.slice(start, end);
}

function parseDayContent(raw, weekDir, filename) {
  const slug = filename.replace(".md", "");
  const weekNum = parseInt(weekDir.replace("week-", ""), 10);

  const fileMatch = slug.match(/day-(\d+)-(\w+)/);
  const dayNum = fileMatch ? parseInt(fileMatch[1], 10) : 0;
  const dayName = fileMatch ? fileMatch[2].charAt(0).toUpperCase() + fileMatch[2].slice(1) : "";

  const titleMatch = raw.match(/^#\s+.+?(?:—|â€”|-)\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;

  const focusMatch = raw.match(/\*\*Today's focus:\*\*\s*(.+)/);
  const focus = focusMatch ? focusMatch[1].trim() : "";

  const buildMatch = raw.match(/\*\*Today's build:\*\*\s*(.+)/);
  const build = buildMatch ? buildMatch[1].trim() : "";

  const checklistSection = getSection(raw, "Checklist");
  const checklist = [...checklistSection.matchAll(/^\s*-\s+\[\s\]\s+(.+)$/gm)].map(m => m[1].trim());
  validateUniqueChecklistItems(checklist, `${weekDir}/${filename}`);

  const hours = [];
  const hourMatches = [...raw.matchAll(/^## (Hour \d+):\s*(.+?)\s*\((\d+ min)\)/gm)];
  const skipPatterns = /^(key takeaways|code review|refactoring|stretch goal|wrap-up|tomorrow|acceptance criteria)/i;
  for (let h = 0; h < hourMatches.length; h++) {
    const hm = hourMatches[h];
    const startIdx = hm.index + hm[0].length;
    const checklistMatch = raw.match(/^##\s+Checklist\s*$/m);
    const checklistIndex = checklistMatch && checklistMatch.index !== undefined ? checklistMatch.index : raw.length;
    const endIdx = h + 1 < hourMatches.length ? hourMatches[h + 1].index : checklistIndex;
    const section = raw.slice(startIdx, endIdx);
    const topics = [...section.matchAll(/^### (.+)$/gm)].map(m => {
      let t = m[1].trim();
      t = t.replace(/^[\d.]+\s*(?:—|â€”|-)?\s*/, "");
      t = t.replace(/^Step \d+\s*[:—â€”]?\s*/, "");
      t = t.replace(/^Challenge:\s*/i, "");
      t = t.replace(/\s*\(\d+ min\)\s*$/, "");
      t = t.replace(/:$/, "");
      t = t.replace(/`/g, "");
      return t.trim();
    }).filter(t => t.length > 0 && !skipPatterns.test(t));
    hours.push({ label: hm[1], title: hm[2].trim(), duration: hm[3], topics });
  }

  const recapSection = getSection(raw, "What You Covered This Week");
  const weekRecap = [...recapSection.matchAll(/^- \*\*(\w+?):\*\*\s*(.+)$/gm)].map(
    m => `**${m[1]}:** ${m[2]}`
  );

  const workFolder = inferWorkFolder(raw, weekNum, dayNum);

  return { week: weekDir, slug, weekNum, dayNum, dayName, title, focus, build, content: raw, checklist, hours, weekRecap, workFolder };
}

function parseDayFile(weekDir, filename) {
  const raw = fs.readFileSync(path.join(PROMPTS_DIR, weekDir, filename), "utf-8");
  return parseDayContent(raw, weekDir, filename);
}

function validateUniqueChecklistItems(checklist, location) {
  const seen = new Set();
  for (const item of checklist) {
    if (seen.has(item)) {
      throw new Error(`Duplicate checklist item in ${location}: ${item}`);
    }
    seen.add(item);
  }
}

function inferWorkFolder(raw, weekNum, dayNum = 0) {
  const explicitFolder = raw.match(/\*\*Work folder:\*\*\s*`?([^`\n]+)`?/);
  if (explicitFolder) return normalizeFolder(explicitFolder[1]);

  if (NO_WORK_FOLDER_DAYS.has(`${weekNum}:${dayNum}`)) return "";

  const savedFolder = raw.match(/All (?:week's )?(?:exercise |project |test )?code(?: and notes)? (?:saved|organized) in `([^`]+)`/i);
  if (savedFolder) return normalizeFolder(savedFolder[1]);

  return WEEK_WORK_FOLDERS[weekNum] || "";
}

function normalizeFolder(value) {
  return value.trim().replace(/\/+$/, "");
}

function buildCourseData() {
  const preamble = fs.readFileSync(PREAMBLE_PATH, "utf-8");
  const deepDivePreamble = fs.readFileSync(path.join(__dirname, "deep-dive-preamble.md"), "utf-8");
  const weekDirs = fs.readdirSync(PROMPTS_DIR).filter(d => d.startsWith("week-")).sort();
  const weeks = weekDirs.map(weekDir => {
    const num = parseInt(weekDir.replace("week-", ""), 10);
    const meta = WEEK_META[num] || { title: `Week ${num}`, phase: "Unknown" };
    const files = fs.readdirSync(path.join(PROMPTS_DIR, weekDir)).filter(f => f.endsWith(".md")).sort();
    const days = files.map(f => parseDayFile(weekDir, f));
    return { slug: weekDir, num, title: meta.title, phase: meta.phase, days };
  });
  return { preamble, deepDivePreamble, weeks };
}

function exportCourseData() {
  const output = buildCourseData();
  const outPath = path.join(__dirname, "course-data.json");
  fs.writeFileSync(outPath, JSON.stringify(output));
  console.log(`Exported ${output.weeks.length} weeks, ${output.weeks.reduce((s, w) => s + w.days.length, 0)} days to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
}

if (require.main === module) {
  exportCourseData();
}

module.exports = {
  buildCourseData,
  exportCourseData,
  getSection,
  inferWorkFolder,
  parseDayContent,
  parseDayFile,
};
