# Lesson 6 (Module 13) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** Architecture and planning — designed data models (Product, Category, Customer, Order, OrderItem, Review), drew entity relationships, created wireframes for all key pages, built component trees with Server/Client boundary decisions, planned route architecture with auth requirements and caching strategies, wrote the architecture document, created the Prisma schema
- **Lesson 2:** Work estimation and sprint planning — T-shirt sizing estimation, wrote Jira-style tickets with acceptance criteria, prioritized into Sprint 1 (core user flow) and Sprint 2 (admin + polish), scaffolded the Next.js project, ran Prisma migration, seeded the database with realistic embroidery store data
- **Lesson 3:** Core pages — homepage with hero and featured products, product catalog with server-side filtering/sorting/pagination using searchParams, product detail page with image gallery, reviews, and SEO metadata
- **Lesson 4:** Cart and checkout — cart state with Context + useReducer and localStorage persistence, cart page with quantity controls, multi-step checkout form with Zod validation, order creation Server Action, order confirmation page
- **Lesson 5:** Build day polish — audited all user flows, added breadcrumbs, built About/Contact/FAQ pages, loading skeletons, error boundaries, 404 pages, empty states, Sprint 1 retrospective

## This Week's Build: Embroidery E-Commerce Store (Sprint 1)
The complete customer purchase flow for the embroidery store:
- Homepage with featured products and category showcase
- Product catalog with filtering, sorting, and pagination
- Product detail with image gallery, reviews, and "Add to Cart"
- Cart with Context + useReducer state management and localStorage persistence
- Multi-step checkout with Zod-validated shipping form
- Order creation via Server Action with Prisma
- Order confirmation page
- Auxiliary pages: About, Contact, FAQ
- Loading states, error boundaries, and 404 handling throughout

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

**Note:** This interview will focus on architectural decisions, sprint planning, and full-stack implementation. Expect questions about: data modeling choices, Server vs Client Component decisions, cart state management approach, form validation strategy, Server Action patterns, and the tradeoffs made during Sprint 1.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

**Note:** This quiz covers both the planning/architecture skills from Lessons 1-2 and the implementation skills from Lessons 3-5. Expect questions that combine data modeling, React state management, Next.js Server Components, form validation, and Server Actions in the context of a real e-commerce application.

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
Checkpoint: the Next.js store should now support real full-stack product, cart, checkout, auth, data, and deployment workflows.

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
- [ ] All week's code organized in `workspace/nextjs-store`
- [ ] Sprint 1 of the embroidery store is complete and runnable
