const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const esbuild = require("esbuild");

function loadModule() {
  const outfile = path.join(os.tmpdir(), `progress-state-${Date.now()}-${Math.random()}.cjs`);
  esbuild.buildSync({
    entryPoints: [path.join(__dirname, "..", "src", "progress-state.ts")],
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node18",
    outfile,
  });
  const mod = require(outfile);
  fs.unlinkSync(outfile);
  return mod;
}

test("normalizes stale checklist state to the current checklist length", () => {
  const { normalizeChecklistProgress } = loadModule();

  assert.deepEqual(normalizeChecklistProgress([true, true, true], 2), [true, true]);
  assert.deepEqual(normalizeChecklistProgress([true], 3), [true, false, false]);
});

test("counts completed checklist items from normalized state only", () => {
  const { countCompletedChecklistItems } = loadModule();

  assert.equal(countCompletedChecklistItems([true, true, true], 2), 2);
  assert.equal(countCompletedChecklistItems([true, "yes", 1, false], 4), 1);
});

test("normalizes saved progress maps to known course checklist keys", () => {
  const { normalizeCourseProgress } = loadModule();
  const course = {
    weeks: [
      {
        slug: "week-01",
        days: [
          { slug: "day-1-monday", checklist: ["A", "B"] },
          { slug: "day-2-tuesday", checklist: ["A", "B", "C"] },
        ],
      },
    ],
  };

  assert.deepEqual(
    normalizeCourseProgress(
      {
        "week-01:day-1-monday": [true, true, true],
        "week-01:day-2-tuesday": [true],
        "old-week:old-day": [true],
      },
      course
    ),
    {
      "week-01:day-1-monday": { version: 2, checked: { A: true, B: true } },
      "week-01:day-2-tuesday": { version: 2, checked: { A: true } },
    }
  );
});

test("stored progress follows checklist item identity across insertions", () => {
  const { normalizeChecklistProgress, serializeChecklistProgress } = loadModule();
  const stored = serializeChecklistProgress([true, false, true], ["A", "B", "C"]);

  assert.deepEqual(normalizeChecklistProgress(stored, ["Intro", "A", "B", "C"]), [
    false,
    true,
    false,
    true,
  ]);
});
