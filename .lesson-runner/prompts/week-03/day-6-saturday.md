# Lesson 6 (Module 3) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** HTTP & Async JavaScript -- HTTP methods (GET/POST/PUT/DELETE), status codes (2xx/3xx/4xx/5xx), headers, CORS basics. Promises (pending/fulfilled/rejected, chaining with then/catch/finally), Promise.all, Promise.allSettled, Promise.race. async/await with try/catch. fetch API (response.ok checking, JSON parsing). Store now fetches products from a mock JSON API with loading skeleton animation and error states with retry button.
- **Lesson 2:** Modules, closures, and scope -- ES modules (named/default exports, re-exports, module behavior: strict mode, own scope, cached imports). Closures (functions that remember outer scope, private state pattern, debounce internals, cache with TTL, once pattern). Scope chain (block, function, module, global; temporal dead zone). Event loop (call stack, microtask queue for Promises, macrotask queue for setTimeout, chunked processing for long tasks). Refactored the store into ES modules: cart.js, products.js, api.js, ui/, utils/.
- **Lesson 3:** Error handling and persistence -- try/catch/finally, custom error classes (StoreError, ProductNotFoundError, CartError, NetworkError), error propagation strategy (low-level throws, high-level catches). localStorage API (getItem/setItem/removeItem, JSON serialization edge cases, quota handling). Built robust storage module with namespace prefix, validation, and in-memory fallback. Cart now persists across page refresh; all error paths handled with user-friendly messages and retry.
- **Lesson 4:** Object-Oriented JavaScript -- constructor functions, prototypes, prototype chain. ES6 classes (constructor, methods, getters/setters, static methods, private fields with #). Inheritance (extends, super, method overriding). Composition vs inheritance tradeoffs. Built Product class (private price, discount calculation, availability check, fromJSON factory), Cart class (private items, persistence, subscribe pattern), Order class (private status, validated status transitions: pending -> confirmed -> shipped -> delivered).
- **Lesson 5:** Build day -- complete polished vanilla JS embroidery store with modular architecture (models/services/ui/utils), async product loading from mock API, OOP domain models (Product, Cart, Order), persistent cart with localStorage, quick view modal with focus trapping, responsive hamburger nav, error handling throughout, accessibility audit and fixes, and responsive design at all breakpoints.

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

### After the Sessions
- Review wrong answers
- Note shaky topics for weekend review
- In the next lesson, the student starts **TypeScript Fundamentals** (Module 4) -- type annotations, interfaces, generics, and type narrowing. The store's utility functions and data models will be typed, catching bugs at compile time instead of runtime.

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
- [ ] All week's exercise code organized in `workspace/vanilla-store`
