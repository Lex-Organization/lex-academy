# Lesson 6 (Module 4) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** TypeScript project setup (`tsconfig.json`, `strict: true`), primitive types (`string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`), type annotations vs. inference, `const` vs. `let` inference, typed functions (parameters, return types, optional/default/rest params), arrays and tuples, special types (`any`, `unknown`, `never`, `void`). Built typed utility functions library and configuration system with `DeepPartial`.
- **Lesson 2:** Interfaces (extending, optional/readonly properties), type aliases (unions, tuples, functions), union types (discriminated/tagged unions, narrowing), intersection types (combining types), literal types (string/number/boolean literals, `as const`, `typeof` + `keyof`). Built Product, CartItem, Order types and complete e-commerce type system for the embroidery store.
- **Lesson 3:** Generics — generic functions, generic interfaces/type aliases, multiple type parameters, generic constraints (`extends`), default type parameters, generic utility patterns (builder, pipe, event registry). Built generic data structures (Stack, Queue, PriorityQueue, ObservableMap, LRU Cache, Pipeline) and a LINQ-style Collection library.
- **Lesson 4:** Type narrowing (typeof, instanceof, `in`, truthiness, equality), custom type guards (`value is Type`), assertion functions (`asserts value is Type`), discriminated union narrowing, exhaustive checking with `never`, control flow analysis, narrowing pitfalls. Built type-safe event handler system and message processing pipeline.
- **Lesson 5:** Build day — typed REST API client library with: error hierarchy with type guards, generic request/response lifecycle, interceptors (auth, logging, date transform), response validators with type predicates, typed cache, and type-safe endpoint builder.

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

### After the Sessions
- Review any questions you got wrong
- Note topics that felt shaky — revisit them over the weekend
- Check your quiz score trend — are you improving week over week?
- Next week we move to **Advanced TypeScript** — utility types (Partial, Pick, Omit, Record, ReturnType), mapped types, conditional types with `infer`, template literal types, declaration files, module augmentation, and TypeScript with DOM APIs

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
