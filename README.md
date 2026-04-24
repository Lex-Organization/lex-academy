# Lex: Academy

**Learn frontend engineering by building a real project — guided by AI.**

Lex: Academy is a VS Code extension that delivers an 18-module interactive frontend engineering course. Each lesson is a prompt you copy into any AI assistant (ChatGPT, Claude, Gemini — your choice). The AI becomes your personal tutor: warm, patient, and conversational.

Throughout the course, you build a real **embroidery e-commerce store** from scratch — it grows from a static HTML page to a full-stack deployed Next.js app.

## Install

Download the latest `.vsix` from [Releases](https://github.com/Lex-Organization/lex-academy/releases), then:

```bash
code --install-extension lex-academy-1.0.0.vsix
```

Or in VS Code: `Ctrl+Shift+P` → **Extensions: Install from VSIX...** → select the file.

## How It Works

1. Open the **Lex: Academy** panel in the sidebar (graduation cap icon)
2. Pick a lesson and click **Copy prompt**
3. Paste into any AI assistant
4. Learn by doing — the AI teaches one concept at a time, interactively
5. Check off items as you complete them — progress is saved across sessions

## The Curriculum

| Phase | Modules | What You Learn |
|-------|---------|----------------|
| Web Foundations | 1–3 | HTML, CSS, JavaScript from scratch |
| TypeScript | 4–5 | Types, generics, real-world migration |
| React | 6–9 | Components, hooks, state, routing, testing |
| Next.js | 10–14 | App Router, Server Components, auth, DB, full-stack project |
| Tailwind & UI | 15–16 | Tailwind CSS, shadcn/ui, Playwright, accessibility |
| AI | 17 | AI pairing, coding agents, debugging, review workflows |
| Portfolio | 18 | Deploy, polish, interview prep |

**108 lessons. 5 lessons + 1 review per module. ~4 hours each.**

## Features

- **LLM-agnostic** — works with any AI assistant, no vendor lock-in
- **Progress tracking** — checkboxes persist across VS Code sessions
- **"Go deeper" mode** — optional deep dives for curious learners
- **One continuous project** — every lesson builds on the last
- **Real-world practices** — git, tickets, code review, sprint planning, CI/CD

## Philosophy

- **Fundamentals over libraries.** You learn `useReducer` before you hear about Redux. You write `fetch` before you touch a data library.
- **One real project.** Every concept connects to the embroidery store.
- **Conversational, not lecture.** One concept at a time, then stop and wait.

## Contributing

```bash
git clone https://github.com/Lex-Organization/lex-academy.git
cd lex-academy

# Install extension dependencies
cd extension && pnpm install && cd ..

# Regenerate course data from prompts and build
pnpm build

# Launch in VS Code debug mode
# Press F5 in VS Code with the repo open
```

Course content lives in `.lesson-runner/prompts/` — 108 markdown files, one per lesson.

## License

MIT
