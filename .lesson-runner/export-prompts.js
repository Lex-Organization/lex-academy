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
  17: { title: "Building with AI", phase: "AI-Powered Dev" },
  18: { title: "Job Readiness", phase: "Portfolio & Prep" },
};

const WEEK_WORK_FOLDERS = {
  1: "workspace/vanilla-store", 2: "workspace/vanilla-store",
  3: "workspace/vanilla-store", 4: "workspace/typescript-exercises",
  5: "workspace/vanilla-store", 6: "workspace/react-store",
  7: "workspace/react-store", 8: "workspace/react-store",
  9: "workspace/react-store", 10: "workspace/nextjs-store",
  11: "workspace/nextjs-store", 12: "workspace/nextjs-store",
  13: "workspace/nextjs-store", 14: "workspace/nextjs-store",
  15: "workspace/nextjs-store", 16: "workspace/nextjs-store",
  17: "workspace/nextjs-store", 18: "workspace/nextjs-store",
};

function parseDayFile(weekDir, filename) {
  const raw = fs.readFileSync(path.join(PROMPTS_DIR, weekDir, filename), "utf-8");
  const slug = filename.replace(".md", "");
  const weekNum = parseInt(weekDir.replace("week-", ""), 10);

  const fileMatch = slug.match(/day-(\d+)-(\w+)/);
  const dayNum = fileMatch ? parseInt(fileMatch[1], 10) : 0;
  const dayName = fileMatch ? fileMatch[2].charAt(0).toUpperCase() + fileMatch[2].slice(1) : "";

  const titleMatch = raw.match(/^#\s+.+?—\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;

  const focusMatch = raw.match(/\*\*Today's focus:\*\*\s*(.+)/);
  const focus = focusMatch ? focusMatch[1].trim() : "";

  const buildMatch = raw.match(/\*\*Today's build:\*\*\s*(.+)/);
  const build = buildMatch ? buildMatch[1].trim() : "";

  const checklistSection = raw.split("## Checklist")[1] || "";
  const checklist = [...checklistSection.matchAll(/^- \[ \] (.+)$/gm)].map(m => m[1]);

  // Hours
  const hours = [];
  const hourMatches = [...raw.matchAll(/^## (Hour \d+):\s*(.+?)\s*\((\d+ min)\)/gm)];
  const skipPatterns = /^(key takeaways|code review|refactoring|stretch goal|wrap-up|tomorrow|acceptance criteria)/i;
  for (let h = 0; h < hourMatches.length; h++) {
    const hm = hourMatches[h];
    const startIdx = hm.index + hm[0].length;
    const endIdx = h + 1 < hourMatches.length ? hourMatches[h + 1].index
      : raw.indexOf("## Checklist") !== -1 ? raw.indexOf("## Checklist") : raw.length;
    const section = raw.slice(startIdx, endIdx);
    const topics = [...section.matchAll(/^### (.+)$/gm)].map(m => {
      let t = m[1].trim();
      t = t.replace(/^[\d.]+\s*—?\s*/, "");
      t = t.replace(/^Step \d+\s*[:—]?\s*/, "");
      t = t.replace(/^Challenge:\s*/i, "");
      t = t.replace(/\s*\(\d+ min\)\s*$/, "");
      t = t.replace(/:$/, "");
      t = t.replace(/`/g, "");
      return t.trim();
    }).filter(t => t.length > 0 && !skipPatterns.test(t));
    hours.push({ label: hm[1], title: hm[2].trim(), duration: hm[3], topics });
  }

  // Week recap
  const recapSection = raw.split("## What You Covered This Week")[1]?.split(/\n## /)[0] || "";
  const weekRecap = [...recapSection.matchAll(/^- \*\*(\w+?):\*\*\s*(.+)$/gm)].map(
    m => `**${m[1]}:** ${m[2]}`
  );

  // Work folder
  const folderMatch = raw.match(/\*\*Work folder:\*\*\s*`?([^`\n]+)`?/);
  const workFolder = folderMatch ? folderMatch[1].trim() : WEEK_WORK_FOLDERS[weekNum] || "";

  return { week: weekDir, slug, weekNum, dayNum, dayName, title, focus, build, content: raw, checklist, hours, weekRecap, workFolder };
}

// Build data
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

const output = { preamble, deepDivePreamble, weeks };
const outPath = path.join(__dirname, "course-data.json");
fs.writeFileSync(outPath, JSON.stringify(output));
console.log(`Exported ${weeks.length} weeks, ${weeks.reduce((s, w) => s + w.days.length, 0)} days to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
