# Lex: Academy

**Learn frontend engineering by building a real project, guided by AI.**

Lex: Academy is a VS Code extension that delivers an 18-module interactive frontend engineering course. Each lesson is a prompt you copy into any AI assistant: ChatGPT, Claude, Gemini, or whatever you prefer. The AI becomes your personal tutor: warm, patient, conversational, and focused on helping you build.

Throughout the course, you build one real **embroidery e-commerce store** from scratch. It grows from a static HTML page to a full-stack deployed Next.js app with auth, database-backed data, admin workflows, testing, accessibility, CI/CD, deployment polish, AI-assisted engineering practice, and interview preparation.

## Install

Once published, install **Lex: Academy** from the VS Code Marketplace for normal extension auto-updates.

For manual installation, download the latest `.vsix` from [Releases](https://github.com/Lex-Organization/lex-academy/releases), then:

```bash
code --install-extension lex-academy-1.0.2.vsix
```

Or in VS Code: `Ctrl+Shift+P` -> **Extensions: Install from VSIX...** -> select the file.

## How It Works

1. Open the **Lex: Academy** panel in the sidebar.
2. Pick a lesson and click **Copy prompt**.
3. Paste into any AI assistant.
4. Learn by doing: the AI teaches one concept at a time, interactively.
5. Check off items as you complete them. Progress is saved across VS Code sessions and is not tied to the current workspace.

## The Curriculum

| Phase | Modules | What You Learn |
| --- | --- | --- |
| Web Foundations | 1-3 | HTML, CSS, JavaScript from scratch |
| TypeScript | 4-5 | Types, generics, real-world migration |
| React | 6-9 | Components, hooks, state, routing, testing |
| Next.js | 10-14 | App Router, Server Components, auth, DB, full-stack project |
| Tailwind & UI | 15-16 | Tailwind CSS, shadcn/ui, Playwright, accessibility |
| AI-Assisted Engineering | 17 | AI pairing, coding agents, debugging, review workflows |
| Portfolio | 18 | Deploy, polish, system design, mock interviews |

**108 lessons. 5 lessons plus 1 review per module. About 4 hours each.**

## Features

- **LLM-agnostic:** works with any AI assistant, no vendor lock-in.
- **Progress tracking:** checkboxes persist across VS Code sessions and workspace changes.
- **Go deeper mode:** optional deep dives for curious learners.
- **One continuous project:** every lesson builds on the embroidery store.
- **Real-world practices:** git, tickets, code review, sprint planning, testing, accessibility, CI/CD.
- **Student support rails:** each lesson includes starting state, expected outcome, acceptance criteria, stuck prompts, glossary practice, and portfolio evidence.
- **Privacy-friendly by design:** the extension does not collect telemetry or call AI APIs.

## Philosophy

- **Fundamentals over libraries.** You learn `useReducer` before Redux. You write `fetch` before reaching for a data library.
- **One real project.** Every concept connects to the embroidery store.
- **Conversational, not lecture.** One concept at a time, then stop and wait.
- **AI as a pair, not an owner.** Students learn to frame tasks, review diffs, verify behavior, and keep engineering judgment.

## Development

```bash
git clone https://github.com/Lex-Organization/lex-academy.git
cd lex-academy

cd extension && pnpm install && cd ..

pnpm test
pnpm build
pnpm package
```

Course content lives in `.lesson-runner/prompts/`: 108 markdown files, one per lesson.

## Publishing

The extension package lives in `extension/`. Release builds are produced by:

```bash
pnpm package
```

Publishing to the VS Code Marketplace is done with `@vscode/vsce` from the extension folder after authenticating the `lex-code` publisher.

## License

MIT
