# Lesson 6 (Module 16) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** shadcn/ui fundamentals — installation, CLI, component anatomy, `cva()` for variants, CSS variable theming with the store's rose brand, rebuilt store navigation, product cards, and customer account interface
- **Lesson 2:** Forms with shadcn Form + native forms + Zod — checkout form with shipping/order options, account settings with address book, multi-step "Design Your Own" custom embroidery order form with conditional fields and useFieldArray
- **Lesson 3:** Complex components — product inventory DataTable with TanStack Table (sorting, filtering, pagination, bulk actions), order management table with status workflow, Command palette (Cmd+K) for admin, Sheet for product/order details, Dialog for CRUD
- **Lesson 4:** Accessibility deep dive — ARIA roles/states for e-commerce (color swatches, cart drawer, checkout forms), keyboard navigation for the full purchase flow, focus management, built accessible thread color combobox, full store audit
- **Lesson 5:** Build day — embroidery store admin dashboard with stat cards, Recharts analytics, product CRUD DataTable, order management with status timeline, settings with tabs, Command palette, skeleton loading, accessibility compliance

## This Week's Store Milestone
The embroidery store now has a professional admin dashboard:
- Product inventory management with DataTable (sort, filter, search, CRUD)
- Order management with embroidery workflow status tracking (Pending -> Embroidering -> Quality Check -> Shipped -> Delivered)
- Store analytics with revenue charts and top-selling products
- Command palette (Cmd+K) for power-user admin navigation
- Full accessibility compliance: keyboard navigation, screen reader support, WCAG AA contrast
- All forms use the shadcn Form + native forms + Zod production stack

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

## Student Support

### Before You Start
Open `workspace/nextjs-store` and start from the last committed version of the store. This is a review day, so gather the week's code, notes, and questions before starting.

**Folder:** `workspace/nextjs-store`

### Where This Fits
You are evolving the store into the production Next.js version: full-stack data, auth, admin flows, design systems, accessibility, testing, and deployment quality.

### Expected Outcome
By the end of this lesson, the student should have: **Interview & Quiz**.

### Acceptance Criteria
- You can explain today's focus in your own words: the lesson topic.
- The expected outcome is present and reviewable: the lesson deliverable.
- Any code or project notes are saved under `workspace/nextjs-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: Interview & Quiz. Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
```

```text
Review my current work against the acceptance criteria for this lesson. Tell me what is already solid, what is missing, and the next smallest fix.
```

```text
Give me a hint, not the answer. I want to understand the concept and make the next edit myself.
```

### Glossary Builder
Add 2-3 terms from today to `docs/glossary.md`. For each term, write one plain-English definition and one sentence about how it showed up in the embroidery store.

### Portfolio Evidence
- Make sure the week's finished work is committed with clear messages.
- Add or update one README/dev-note sentence explaining what changed and why.
- Record one decision you made today: the tradeoff, the alternative, and why this choice fits the store.

### Module Checkpoint
Checkpoint: the store should now look and behave like a polished product, with a design system, accessibility pass, and E2E confidence.

### AI Pairing Guardrails
- The assistant may explain, review, and suggest; the student still owns the final decision.
- Prefer hints and small steps before full solutions.
- Keep changes bounded to today's goal and acceptance criteria.
- Never paste secrets, API keys, private customer data, or proprietary code into an AI tool.

## Checklist
- [ ] Completed mock interview
- [ ] Reviewed interview feedback and noted areas for improvement
- [ ] Completed weekly quiz
- [ ] Quiz score recorded: ___/100
- [ ] Reviewed wrong answers and understood corrections
- [ ] Identified weakest topic of the week for weekend review
- [ ] All week's exercise code organized in `workspace/nextjs-store`
