# Lesson 6 (Module 14) — Interview & Quiz (Mid-Course Comprehensive Review)

## What You Covered This Week
- **Lesson 1:** Customer accounts and order history — account layout with sidebar, profile editing with Server Action, order history page, order detail with status timeline, protected routes via middleware, login/register pages, auth flow end-to-end testing
- **Lesson 2:** Admin dashboard — admin layout with role check, dashboard stats, product management (list/create/edit/delete with Zod validation), order management with status filter and status update Server Action, soft-delete for products with orders
- **Lesson 3:** Search, filtering, and performance — full-text search with debounced input, advanced URL-based filtering (category, price range, in-stock, sort), active filter tags, Lighthouse audit and optimization (images, fonts, client JS, caching, database queries), performance budget
- **Lesson 4:** GitHub Actions CI/CD — branching strategy, conventional commits, pull request workflow, CI pipeline with lint/typecheck/test, Vitest cart reducer tests, Vercel preview deploys, environment variable management, practiced the full dev loop
- **Lesson 5:** Production polish — edge case audit (empty cart checkout, out-of-stock, invalid URLs, session expiration), responsive QA at 320px/768px/1024px/1440px, consistent error messages, loading states, meta tags, accessibility check, complete store demo

## This Week's Build: Embroidery E-Commerce Store (Sprint 2 — Complete)
The production-ready embroidery e-commerce store with:
- Customer accounts with order history and profile management
- Admin panel with product CRUD and order status management
- Full-text search with debounced input and URL-based advanced filtering
- CI pipeline running lint, typecheck, and tests on every push
- Edge cases handled, responsive at every breakpoint, accessible
- Complete purchase flow: browse, search, filter, cart, checkout, order confirmation
- Complete admin flow: add/edit/delete products, manage order statuses

## Today's Sessions

### Mid-Course Comprehensive Review

This is the halfway point of the 18-week course. Today's interview and quiz cover **everything from Modules 1 through 14**. Use this as a diagnostic to identify strengths and areas that need reinforcement in the second half of the course.

**Topics covered in Modules 1-14:**
- Module 1: HTML5 semantics, accessibility, ARIA, CSS Flexbox, Grid, modern CSS, responsive design
- Module 2: ES2024+ JavaScript, async/await, fetch, modules, closures, event loop, DOM manipulation
- Module 3: TypeScript fundamentals — interfaces, unions, generics, type narrowing, discriminated unions
- Module 4: TypeScript advanced — utility types, mapped types, conditional types, DOM typing
- Module 5: React fundamentals — JSX, components, props, useState, events, conditional rendering, lists
- Module 6: React hooks — useEffect, useRef, useMemo, useCallback, custom hooks
- Module 7: React state & routing — Context, useReducer, React Router, route-based navigation
- Module 8: React forms & testing — native forms + Zod validation, Vitest + Testing Library, React 19 features
- Module 9: Next.js App Router — routing, layouts, Server/Client Components, loading/error/not-found, dynamic routes
- Module 10: Next.js data — Server Component fetching, Server Actions, caching (memoization, data cache, route cache, ISR), Route Handlers
- Module 11: Next.js advanced — middleware, Auth.js, Prisma + Postgres, next/image, next/font, metadata/SEO
- Module 12: Full-stack bookmarks manager integrating auth, middleware, Prisma, images, fonts, metadata
- Module 13: Full-stack store (Sprint 1) — architecture, sprint planning, homepage, catalog, product detail, cart, checkout, order creation
- Module 14: Full-stack store (Sprint 2) — accounts, admin, search, CI/CD, performance, production polish

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

**Note:** This interview will draw from ALL 14 weeks of material. Expect questions spanning HTML/CSS, JavaScript, TypeScript, React, and Next.js. The interviewer will also ask about the embroidery store: architecture decisions, trade-offs, how Server vs Client Component boundaries were chosen, why Context + useReducer for cart state, how the checkout Server Action works, what the CI pipeline checks and why, and how to extend the store with new features.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

**Note:** This quiz is the mid-course comprehensive assessment — covering Modules 1-14. It will be longer and more challenging than weekly quizzes. Expect questions that combine multiple topics (e.g., "Write a Server Component that fetches typed data with Prisma and renders it with proper loading/error handling" or "Explain how a Server Action validates input with Zod, creates a database record, and revalidates the cache").

### Post-Assessment Reflection
After completing the interview and quiz, review your performance across all 14 weeks:
- Which weeks had the strongest results?
- Which topics felt most uncertain during the interview?
- What concepts need reinforcement before starting the second half of the course?
- How has your confidence grown since Module 1?
- What would you do differently if you started the embroidery store project again?

## Checklist
- [ ] Completed mock interview (comprehensive, Modules 1-14)
- [ ] Reviewed interview feedback and noted areas for improvement
- [ ] Completed comprehensive quiz (Modules 1-14)
- [ ] Quiz score recorded: ___/100
- [ ] Reviewed wrong answers and understood corrections
- [ ] Identified the 3 weakest topics across all 14 weeks
- [ ] Created a personal study plan for reinforcing weak areas
- [ ] Compared Module 14 quiz score to earlier weekly scores to track progress
- [ ] All code organized in `workspace/nextjs-store`
- [ ] Embroidery store is complete, runnable, and production-ready
