# Frontend Engineering Course — 18-Module Syllabus

> 4 hours/lesson, 5 lessons + review per module.
> Running project: **Embroidery e-commerce store** — grows from static HTML to full-stack deployed app.
> Philosophy: **Fundamentals over libraries.** Learn the platform, not the wrapper.
> Student support: each lesson includes a starting-state check, expected outcome, acceptance criteria, stuck prompts, glossary practice, and portfolio evidence.

---

## Phase 1: Web Foundations (Modules 1–3)

### Module 1 — HTML, CSS & Web Fundamentals

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | How the Web Works (HTTP, DNS, browser rendering) + HTML5 semantic structure | Static product page skeleton |
| Lesson 2 | CSS layout (flexbox, grid, responsive, mobile-first) + Chrome DevTools Elements | Styled responsive product page |
| Lesson 3 | JavaScript basics — variables, types, functions, control flow | Product data, price calculator |
| Lesson 4 | Arrays, objects, array methods (map, filter, find, reduce) | Product catalog data structures |
| Lesson 5 | Build day — static catalog with JS filtering and sorting | Working catalog page |
| Lesson 6 | **Interview + Quiz** |

### Module 2 — JavaScript & the DOM

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | DOM manipulation — querySelector, createElement, innerHTML vs textContent | Display products dynamically from JS data |
| Lesson 2 | Events, event delegation, event phases + Chrome DevTools Console | Add to Cart button, interactive product cards |
| Lesson 3 | Forms, FormData API, validation, user input | Contact form, newsletter signup with validation |
| Lesson 4 | ES2024+ — destructuring, spread, optional chaining, Map/Set, template literals | Refactor store with modern JS + cart drawer |
| Lesson 5 | Build day — interactive store with working cart | Vanilla store v1 with cart and filtering |
| Lesson 6 | **Interview + Quiz** |

### Module 3 — JavaScript Deep Dive

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | HTTP fundamentals (methods, status codes, headers, CORS) + async JS (promises, async/await, fetch) + DevTools Network tab | Fetch products from mock API |
| Lesson 2 | Modules (import/export), closures, scope, the event loop | Refactor to ES modules |
| Lesson 3 | Error handling (try/catch/finally), localStorage, JSON, Web APIs | Persistent cart, error states |
| Lesson 4 | OOP — classes, prototypes, this, inheritance | Product/Cart/Order classes |
| Lesson 5 | Build day — polished vanilla JS store | Complete modular store with API, persistence, classes |
| Lesson 6 | **Interview + Quiz** |

---

## Phase 2: TypeScript (Modules 4–5)

### Module 4 — TypeScript Fundamentals

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | npm/package.json deep dive + ESLint/Prettier setup + TypeScript setup (tsconfig, tsc) | Project tooling configured |
| Lesson 2 | Interfaces, type aliases, unions, intersections, literal types | Product, CartItem, Order types |
| Lesson 3 | Generics — functions, interfaces, constraints, defaults | Generic data structures |
| Lesson 4 | Type narrowing, type guards, discriminated unions | Type-safe event handlers |
| Lesson 5 | Build day — typed API client | REST API client for product catalog |
| Lesson 6 | **Interview + Quiz** |

### Module 5 — TypeScript in Practice

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | Utility types (Partial, Pick, Omit, Record, Readonly, ReturnType) | Typed form state and API responses |
| Lesson 2 | TypeScript with DOM, events, and fetch — typing real browser APIs | Typed DOM helpers for the store |
| Lesson 3 | Reading official docs + tsconfig deep dive + declaration files basics | Navigate DefinitelyTyped, configure strict mode |
| Lesson 4 | Migrate the vanilla store to TypeScript (day 1) — types + modules | Begin full TS migration |
| Lesson 5 | Build day — complete TS migration | Full TypeScript store |
| Lesson 6 | **Interview + Quiz** |

---

## Phase 3: React (Modules 6–9)

### Module 6 — React Fundamentals

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | How to ask good questions + first ticket (STORE-101) + JSX, components, props | ProductCard, ProductGrid, Badge |
| Lesson 2 | useState — state management, controlled inputs, form state | Cart state, quantity controls |
| Lesson 3 | Event handling, conditional rendering, lists & keys | Product filtering, cart item list |
| Lesson 4 | Component composition, lifting state, prop drilling | Shared cart state across components |
| Lesson 5 | Build day — React storefront | Complete React catalog with cart |
| Lesson 6 | **Interview + Quiz** |

### Module 7 — React Hooks & Effects

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | useEffect + systematic debugging methodology + React DevTools | Fetch products, sync cart to localStorage |
| Lesson 2 | useRef, forwardRef — DOM access, focus management, uncontrolled inputs | Search focus, scroll-to-top, image zoom |
| Lesson 3 | Custom hooks — useLocalStorage, useFetch, useDebounce | useCart, useProducts, useSearch |
| Lesson 4 | Error boundaries, loading patterns, data fetching strategies | Robust data loading with error/loading states |
| Lesson 5 | Build day — enhanced storefront | Store with fetching, search, persistent cart |
| Lesson 6 | **Interview + Quiz** |

### Module 8 — React State & Routing

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | Context API — createContext, Provider, useContext | CartContext, ThemeContext |
| Lesson 2 | useReducer — complex state, action patterns, dispatch | Cart reducer (ADD, REMOVE, UPDATE, CLEAR) |
| Lesson 3 | React Router — routes, nested layouts, dynamic params, navigation | Multi-page store with client routes |
| Lesson 4 | Context + useReducer composition — scaling state without libraries | Combined store state (cart + filters + UI) |
| Lesson 5 | Build day — full store architecture | E-commerce with context, reducer, routing |
| Lesson 6 | **Interview + Quiz** |

### Module 9 — React Forms, Testing & Modern Practices

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | React 19 — use() hook, transitions, useTransition, Suspense | Async product loading with transitions |
| Lesson 2 | Native forms + Zod validation (no form libraries — just React + Zod) | Multi-step checkout form |
| Lesson 3 | Testing — Vitest + React Testing Library + testing philosophy | Test suite for store components |
| Lesson 4 | Integration testing, mocking fetch, testing hooks and context | Cart flow tests, API mocking |
| Lesson 5 | Build day — modernized store with tests | React 19 store with forms and 20+ tests |
| Lesson 6 | **Interview + Quiz** |

---

## Phase 4: Next.js (Modules 10–14)

### Module 10 — Next.js Fundamentals

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | App Router, routing, layouts, route groups + environment variables (.env) | Store routes: /, /products, /cart |
| Lesson 2 | Server Components vs Client Components, "use client" | Server-rendered product pages |
| Lesson 3 | Loading UI, error handling, not-found | Store loading skeletons, error pages |
| Lesson 4 | Navigation — Link, dynamic routes, catch-all | Product detail pages with [slug] |
| Lesson 5 | Build day — Next.js store | Store ported to Next.js |
| Lesson 6 | **Interview + Quiz** |

### Module 11 — Next.js Data & Server Actions

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | Data fetching in Server Components | Server-rendered product listing |
| Lesson 2 | Server Actions — form mutations, revalidation | Cart operations via Server Actions |
| Lesson 3 | Caching — request memoization, ISR, revalidation strategies | Cached product pages |
| Lesson 4 | Route Handlers — REST API endpoints | /api/products, /api/cart endpoints |
| Lesson 5 | Build day — full-stack store | CRUD with Server Components + Actions |
| Lesson 6 | **Interview + Quiz** |

### Module 12 — Next.js Advanced Features

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | Middleware — auth guards, redirects, rewrites | Protected checkout, admin routes |
| Lesson 2 | How auth works (cookies, JWT, sessions) + Auth.js setup | Customer accounts, OAuth login |
| Lesson 3 | Prisma + Neon Postgres — schema, migrations, queries | Products, orders, customers in DB |
| Lesson 4 | Images, fonts, metadata, SEO + Lighthouse audit | Optimized images, store SEO |
| Lesson 5 | Build day — authenticated store with database | Real store with auth, DB, SEO |
| Lesson 6 | **Interview + Quiz** |

### Module 13 — Full-Stack Store Project (Week 1)

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | Architecture planning — data models, wireframes, component tree, route map | Complete architecture document |
| Lesson 2 | Work estimation + ticket writing (Jira-style) + sprint planning | Sprint board with prioritized tickets |
| Lesson 3 | Core pages — homepage, product listing, product detail | Store shell with real data |
| Lesson 4 | Checkout flow — multi-step form, cart summary, validation, order creation | Working checkout |
| Lesson 5 | Build day — complete core user flows | Browsing → cart → checkout → order confirmation |
| Lesson 6 | **Interview + Quiz** |

### Module 14 — Full-Stack Store Project (Week 2)

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | Order management — history, status tracking, confirmation emails | Order dashboard for customers |
| Lesson 2 | Admin dashboard — inventory CRUD, order management | Admin panel with data tables |
| Lesson 3 | Search, filtering, pagination at scale + performance optimization | Advanced product discovery |
| Lesson 4 | GitHub Actions CI — lint, typecheck, test on push + Vercel preview deploys | Production pipeline |
| Lesson 5 | Build day — polish, edge cases, error handling, responsive QA | Production-ready store |
| Lesson 6 | **Interview + Quiz** (mid-course comprehensive review) |

---

## Phase 5: Tailwind, Testing & Design (Modules 15–16)

### Module 15 — Tailwind CSS + E2E Testing

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | Figma-to-code workflow + Tailwind fundamentals (utility-first, responsive) | Extract design tokens, restyle product cards |
| Lesson 2 | Tailwind layout + components (flex, grid, forms, modals, responsive patterns) | Store layouts + UI components |
| Lesson 3 | Tailwind v4 features + store redesign build session | Beautiful store with design system |
| Lesson 4 | E2E testing with Playwright (5 real tests for the store) | Navigation, cart, checkout E2E tests |
| Lesson 5 | CSS animations/transitions + performance profiling (Lighthouse, Web Vitals) | Animated store, Lighthouse 90+ |
| Lesson 6 | **Interview + Quiz** |

### Module 16 — Component Libraries & Design Systems

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | shadcn/ui — installation, components, theming, customization | Store migrated to shadcn components |
| Lesson 2 | Forms — shadcn Form + Zod schemas + accessible form patterns | Polished checkout and account forms |
| Lesson 3 | Complex components — DataTable, Command palette, Sheet, Dialog | Admin: sortable inventory table, order management |
| Lesson 4 | Accessibility deep dive — ARIA, keyboard nav, screen readers, audit | Full a11y audit + fixes |
| Lesson 5 | Build day — admin dashboard | Admin with CRUD, tables, analytics charts |
| Lesson 6 | **Interview + Quiz** |

---

## Phase 6: AI-Assisted Engineering (Module 17)

### Module 17 — AI Pairing for Engineers

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | AI coding tools and agents — what they are, how they see context, and what engineers still own | AI collaboration guide + context packet |
| Lesson 2 | Pairing with AI — task framing, acceptance criteria, plan review, and bounded implementation | AI-assisted store improvement |
| Lesson 3 | Debugging with AI — repro steps, evidence, hypotheses, and root-cause fixes | AI-assisted bug fix with regression check |
| Lesson 4 | Reviewing AI-generated code — diff reading, test quality, accessibility, and architecture risks | Review checklist + improved AI-assisted change |
| Lesson 5 | Build day — ship a real store improvement with AI as a supervised pair programmer | Polished store improvement + collaboration log |
| Lesson 6 | **Interview + Quiz** |

---

## Phase 7: Portfolio & Interview Prep (Module 18)

### Module 18 — Job Readiness

| Lesson | Focus | Store milestone |
|--------|-------|-----------------|
| Lesson 1 | Portfolio strategy — polish, README, Vercel deploy, OG images | Deploy store to Vercel |
| Lesson 2 | Portfolio features — performance optimization, Lighthouse 95+, analytics | Optimized live store |
| Lesson 3 | Deploy + documentation + deployment alternatives (AWS, Railway, Fly) | Live store, comprehensive README |
| Lesson 4 | Interview prep — frontend questions, system design, day-in-the-life simulation | Practice with store as talking point |
| Lesson 5 | Mock interviews — behavioral, technical, live coding | Full interview simulation |
| Lesson 6 | **Final comprehensive interview + quiz** (all 18 modules) |
