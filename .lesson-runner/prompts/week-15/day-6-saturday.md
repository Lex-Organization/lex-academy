# Lesson 6 (Module 15) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** Figma-to-code workflow (inspecting designs, extracting spacing/colors/fonts) + Tailwind CSS fundamentals — utility-first philosophy, responsive breakpoints (`sm:`, `md:`, `lg:`), state variants (`hover:`, `focus:`, `dark:`), restyled ProductCard and product grid page, Tailwind config customization
- **Lesson 2:** Tailwind layout & components — Flexbox and Grid utilities for store layouts, spacing/sizing system, container patterns, built the store layout shell (sticky nav, sidebar, footer). Component patterns with `cn()` (clsx + tailwind-merge): Button (5 variants), Input, Select, Badge, Modal, CartDrawer
- **Lesson 3:** Store redesign build day — converted all pages to Tailwind (home, products, product detail, cart, checkout, account), design tokens via CSS variables, dark mode toggle with localStorage persistence, responsive verification at all breakpoints, skeleton loading states with `animate-pulse`, micro-interactions
- **Lesson 4:** E2E testing with Playwright — testing pyramid (unit vs. integration vs. E2E), Playwright setup and API (`getByRole`, `getByText`, `getByLabel`), wrote 5 E2E tests (navigation, product detail, add to cart, checkout flow, protected route redirect), Playwright CI integration with GitHub Actions, headed/headless/UI modes
- **Lesson 5:** CSS animations & performance — CSS transitions (`transform`, `opacity` as cheap properties), `@keyframes` animations (cart drawer slide-in, skeleton shimmer, staggered card entrance), `prefers-reduced-motion`, Chrome DevTools Performance profiler (flame chart, long tasks), Web Vitals (LCP, CLS, INP), `next/image` optimization, font loading with `next/font`, bundle analysis, Lighthouse audit — all scores above 90

## This Week's Store Milestone
The embroidery store leveled up in three areas:
- **Visual polish:** Cohesive Tailwind design system with rose brand tokens, dark mode, responsive layouts, smooth animations (card hover, cart drawer slide-in, skeleton loading)
- **Quality assurance:** 5 automated E2E tests with Playwright verifying real user flows (browse → detail → cart → checkout), integrated into CI pipeline
- **Performance:** All Lighthouse scores above 90, optimized images with `next/image`, proper font loading, compositor-friendly animations

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

## Checklist
- [ ] Completed mock interview
- [ ] Reviewed interview feedback and noted areas for improvement
- [ ] Completed weekly quiz
- [ ] Quiz score recorded: ___/100
- [ ] Reviewed wrong answers and understood corrections
- [ ] Identified weakest topic of the week for weekend review
- [ ] All week's code organized and committed in `workspace/nextjs-store`
