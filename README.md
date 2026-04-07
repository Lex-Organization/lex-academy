# Lex: Academy

An 18-module interactive frontend engineering course delivered as a VS Code extension.

Each lesson is a carefully crafted prompt that you copy and paste into **any AI assistant** (ChatGPT, Claude, Gemini, etc). The AI becomes your personal tutor for a ~4 hour hands-on session — warm, patient, and conversational.

Throughout the course, you build a real **embroidery e-commerce store** from scratch. It grows from static HTML all the way to a full-stack deployed Next.js app.

## The Curriculum

| Phase | Modules | What You Learn |
|-------|---------|----------------|
| Web Foundations | 1–3 | HTML, CSS, JavaScript from scratch |
| TypeScript | 4–5 | Types, generics, migration |
| React | 6–9 | Components, hooks, state, routing, testing |
| Next.js | 10–14 | App Router, Server Components, auth, DB, full-stack project |
| Tailwind & UI | 15–16 | Tailwind CSS, shadcn/ui, Playwright, accessibility |
| AI | 17 | Vercel AI SDK, chatbots, tool calling |
| Portfolio | 18 | Deploy, polish, interview prep |

**108 lessons. 5 lessons + 1 review per module. ~4 hours each.**

## How It Works

1. Install the extension in VS Code
2. Open the **Lex: Academy** panel in the sidebar
3. Pick a lesson and click **Copy prompt**
4. Paste into your favorite AI assistant
5. Learn by doing — the AI teaches interactively, one concept at a time
6. Check off items as you complete them — progress is saved

## Install

```bash
cd extension
pnpm install
pnpm package
```

Then install the `.vsix` file: `code --install-extension lex-academy-*.vsix`

## Development

```bash
# Regenerate course data and build extension
pnpm build

# Or just rebuild the extension
pnpm build:ext
```

Press **F5** in VS Code to launch the Extension Development Host.

## Project Structure

```
extension/           VS Code extension (webview panel, progress tracking)
.lesson-runner/
  prompts/           108 lesson prompts (18 modules x 6 lessons)
  teacher-preamble.md   Personality and teaching style (prepended to every prompt)
  deep-dive-preamble.md Optional "go deeper" prompt
  syllabus.md        Full course outline
  export-prompts.js  Builds course-data.json from markdown files
```

## Philosophy

- **Fundamentals over libraries.** Learn the platform, not the wrapper.
- **One real project.** Every concept connects to the embroidery store.
- **LLM-agnostic.** Works with any AI assistant — no vendor lock-in.
- **Conversational, not lecture.** One concept at a time, then stop and wait.

## License

MIT
