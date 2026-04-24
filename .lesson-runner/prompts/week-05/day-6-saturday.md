# Lesson 6 (Module 5) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** Utility types in action — `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `Readonly<T>`, `ReturnType<typeof fn>`, `Parameters<typeof fn>`. Derived `CreateProduct`, `UpdateProduct`, `ProductCard`, `OrderSummary`, and `CheckoutFormData` from base interfaces using utility type composition. Built typed form state, API response types, and store configuration.
- **Lesson 2:** TypeScript with the browser — typed `querySelector` with generics (`querySelector<HTMLInputElement>`), handling null returns, typed event handlers (`MouseEvent`, `KeyboardEvent`, `SubmitEvent`), `e.target` vs `e.currentTarget`, generic `typedFetch<T>` wrapper for API calls, typed `JSON.parse` and `localStorage` helpers with schema interfaces. Built `getElement<T>`, `addClickHandler`, `onFormSubmit`, and `typedFetch` DOM helpers for the store.
- **Lesson 3:** tsconfig.json deep dive — `strict: true` and its component flags (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`), `noUncheckedIndexedAccess`, `target`, `lib`, `module`, `moduleResolution`, `paths` aliases. Reading TypeScript error messages (file/line, error code, expected vs actual type). Finding types for libraries (built-in, `@types/` packages, `.d.ts` declarations). `unknown` vs `any` for external data. Enabled strict mode and fixed all errors.
- **Lesson 4:** Began TypeScript migration — created `types.ts` with all domain interfaces and utility-type derived types, migrated leaf modules (utilities, constants), data layer (products, cart, API client), and DOM layer (event handlers, querySelector calls, form handling).
- **Lesson 5:** Build day — completed the migration. Migrated rendering functions, form validation, localStorage persistence, and UI state. Enforced strict null checks everywhere, eliminated all `any` types, validated external data boundaries. Final audit: `npx tsc --noEmit --strict` with zero errors, store works identically in the browser.

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

### After the Sessions
- Review any questions you got wrong
- Note topics that felt shaky — revisit them over the weekend
- Check your quiz score trend — are you improving week over week?
- The first five weeks covered the foundations: HTML, CSS, JavaScript, and TypeScript. Starting the next module, React begins. The embroidery store gets rebuilt with components, props, state, and hooks — and all the TypeScript skills from this module transfer directly into typed React code.

## Student Support

### Before You Start
Open `workspace/vanilla-store` and start from the last committed version of the store. This is a review day, so gather the week's code, notes, and questions before starting.

**Folder:** `workspace/vanilla-store`

### Where This Fits
You are growing the vanilla JavaScript version of the embroidery store. The goal is to understand the platform before frameworks enter the picture.

### Expected Outcome
By the end of this lesson, the student should have: **Interview & Quiz**.

### Acceptance Criteria
- You can explain today's focus in your own words: the lesson topic.
- The expected outcome is present and reviewable: the lesson deliverable.
- Any code or project notes are saved under `workspace/vanilla-store`.
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
Checkpoint: the vanilla store should feel increasingly real, from semantic HTML through typed, modular JavaScript.

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
- [ ] All week's code organized and committed in `workspace/vanilla-store`
