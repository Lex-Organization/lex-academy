const assert = require("node:assert/strict");
const test = require("node:test");
const { buildCourseData, parseDayContent } = require("../export-prompts");

const fixture = `# Module 1, Lesson 2 — DOM Basics

**Today's focus:** Select elements and handle events
**Today's build:** Product card interactions
**Work folder:** \`workspace/example\`

## Hour 1: DOM Selection (60 min)
### 1. Querying
### Challenge: Click handling
### Wrap-up

## Checklist
  - [ ] Selected elements with querySelector
- [ ] Added a click event

## Notes
- [ ] This is not part of the checklist
`;

test("parses the lesson contract from markdown", () => {
  const parsed = parseDayContent(fixture, "week-01", "day-2-tuesday.md");

  assert.equal(parsed.title, "DOM Basics");
  assert.equal(parsed.focus, "Select elements and handle events");
  assert.equal(parsed.build, "Product card interactions");
  assert.equal(parsed.workFolder, "workspace/example");
  assert.deepEqual(parsed.checklist, ["Selected elements with querySelector", "Added a click event"]);
  assert.deepEqual(parsed.hours, [
    {
      label: "Hour 1",
      title: "DOM Selection",
      duration: "60 min",
      topics: ["Querying", "Click handling"],
    },
  ]);
});

test("parses alternate lesson focus and build labels", () => {
  const parsed = parseDayContent(
    `# Lesson 4 (Module 18) - Interview Preparation

**This lesson's focus:** Interview preparation
**This lesson's build:** Practice answers and coding exercise notes

## Checklist
- [ ] Prepared answers
`,
    "week-18",
    "day-4-thursday.md"
  );

  assert.equal(parsed.focus, "Interview preparation");
  assert.equal(parsed.build, "Practice answers and coding exercise notes");
});

test("rejects duplicate checklist text because progress uses item text identity", () => {
  const duplicateFixture = `# Module 1, Lesson 3 â€” Duplicate Checklist

## Checklist
- [ ] Repeated item
- [ ] Repeated item
`;

  assert.throws(
    () => parseDayContent(duplicateFixture, "week-01", "day-3-wednesday.md"),
    /Duplicate checklist item/
  );
});

test("infers the work folder from lesson save instructions before week fallback", () => {
  const inferredFolderFixture = `# Module 10, Lesson 3 - Loading UI

**Today's focus:** Loading states
**Today's build:** Product skeletons

## Hour 1: Loading UI (60 min)
### Skeletons

## Checklist
- [ ] Added product skeletons
- [ ] All exercise code saved in \`workspace/nextjs-store/\`
`;

  const parsed = parseDayContent(inferredFolderFixture, "week-10", "day-3-wednesday.md");

  assert.equal(parsed.workFolder, "workspace/nextjs-store");
});

test("explicit work folder wins over inferred checklist folders", () => {
  const explicitFolderFixture = `# Module 17, Lesson 1 - AI Pairing

**Work folder:** \`workspace/nextjs-store\`

## Hour 1: Pairing (60 min)
### Context

## Checklist
- [ ] Created an AI collaboration guide
- [ ] All exercise code saved in \`workspace/week-17/day-1/\`
`;

  const parsed = parseDayContent(explicitFolderFixture, "week-17", "day-1-monday.md");

  assert.equal(parsed.workFolder, "workspace/nextjs-store");
});

test("does not show a work folder for non-build interview lessons", () => {
  const interviewFixture = `# Lesson 6 (Module 18) - Final Interview

## What You Covered This Week
- Portfolio polish

## Checklist
- [ ] Completed final interview
- [ ] Final feedback organized for review
`;

  const parsed = parseDayContent(interviewFixture, "week-18", "day-6-saturday.md");

  assert.equal(parsed.workFolder, "");
});

test("exports the complete course contract", () => {
  const data = buildCourseData();
  const totalDays = data.weeks.reduce((sum, week) => sum + week.days.length, 0);

  assert.equal(data.weeks.length, 18);
  assert.equal(totalDays, 108);
  for (const week of data.weeks) {
    for (const day of week.days) {
      if (day.dayNum < 6) {
        assert.notEqual(day.hours.length, 0, `${week.slug}/${day.slug} has no hours`);
      }
      assert.notEqual(day.checklist.length, 0, `${week.slug}/${day.slug} has no checklist items`);
    }
  }
});

test("exports work folders as the three product generations", () => {
  const data = buildCourseData();
  const expectedFolderByWeek = new Map([
    [1, "workspace/vanilla-store"],
    [2, "workspace/vanilla-store"],
    [3, "workspace/vanilla-store"],
    [4, "workspace/vanilla-store"],
    [5, "workspace/vanilla-store"],
    [6, "workspace/react-store"],
    [7, "workspace/react-store"],
    [8, "workspace/react-store"],
    [9, "workspace/react-store"],
    [10, "workspace/nextjs-store"],
    [11, "workspace/nextjs-store"],
    [12, "workspace/nextjs-store"],
    [13, "workspace/nextjs-store"],
    [14, "workspace/nextjs-store"],
    [15, "workspace/nextjs-store"],
    [16, "workspace/nextjs-store"],
    [17, "workspace/nextjs-store"],
    [18, "workspace/nextjs-store"],
  ]);

  const noWorkFolderDays = new Set(["week-17/day-6-saturday", "week-18/day-4-thursday", "week-18/day-5-friday", "week-18/day-6-saturday"]);

  for (const week of data.weeks) {
    const expectedFolder = expectedFolderByWeek.get(week.num);
    for (const day of week.days) {
      const key = `${week.slug}/${day.slug}`;
      assert.equal(day.workFolder, noWorkFolderDays.has(key) ? "" : expectedFolder, key);
    }
  }
});
