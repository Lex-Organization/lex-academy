# Student Support Reference

This file supports the lesson prompts. It is not a replacement for the curriculum; it gives students repeatable tools for getting unstuck, tracking vocabulary, and turning course work into portfolio evidence.

## Living Glossary

Students should keep `docs/glossary.md` inside their store project and add 2-3 terms per lesson.

Each entry should use this shape:

```md
## Term

Plain-English definition:

Where it appeared in the embroidery store:

One thing I still confuse it with:
```

Starter terms by phase:

- Foundations: DOM, semantic HTML, accessibility tree, event listener, fetch, localStorage, module, closure.
- TypeScript: interface, type alias, union, generic, type guard, utility type, declaration file.
- React: component, prop, state, effect, ref, custom hook, context, reducer, suspense.
- Next.js: route segment, layout, Server Component, Client Component, Server Action, cache, middleware, revalidation.
- Full-stack: schema, migration, session, authentication, authorization, webhook, CI, preview deployment.
- UI and testing: design token, component library, keyboard navigation, E2E test, fixture, regression.
- AI-assisted engineering: context packet, acceptance criteria, diff review, hallucination, verification, bounded task.
- Job readiness: portfolio narrative, STAR answer, system design, tradeoff, talking point.

## Rescue Prompts

Use these when a lesson starts to feel fuzzy. The goal is not to outsource the work; the goal is to recover momentum.

```text
I am stuck. Ask me one question at a time until we identify whether the problem is concept, syntax, project setup, or debugging.
```

```text
Give me the smallest next step only. Do not write the full solution unless I ask for it.
```

```text
Compare my current work to the lesson acceptance criteria. Tell me what is complete, what is missing, and what to do next.
```

```text
Explain this error message in plain English, then help me create a minimal reproduction before we fix it.
```

```text
I want an interview-quality explanation of this concept. Start with my current understanding, then help me tighten it.
```

## Portfolio Evidence

Evidence should be lightweight and useful later.

- A clear git commit for each completed lesson.
- A README or dev-note sentence explaining what changed and why.
- A decision log entry when the student chooses between two approaches.
- A short reflection after review days: what is strong, what is shaky, and what to practice next.
- Interview talking points that connect technical choices back to the embroidery store.

## AI Pairing Rules

- The assistant can teach, suggest, review, and debug with the student.
- The student owns the final decision and must understand the shipped code.
- Every AI-assisted change needs a bounded goal, acceptance criteria, and verification step.
- The assistant should offer hints before full solutions.
- Secrets, API keys, private logs, customer data, and proprietary code do not go into AI tools.
