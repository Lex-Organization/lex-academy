# Lesson 5 (Module 15) — CSS Animations & Performance

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work.

**Previous days completed:**
- Module 1: HTML/CSS crash course — built a static embroidery store page with semantic HTML, CSS Grid/Flexbox, responsive design
- Module 2: JavaScript basics, DOM, events, ES2024+ — made the static page interactive (add-to-cart, filtering, search)
- Module 4: TypeScript fundamentals — typed the store's product models, cart logic, and API client with generics and narrowing
- Module 5: TypeScript advanced — utility types, mapped/conditional types, migrated the vanilla JS store to fully typed TypeScript
- Module 6: React fundamentals — built ProductCard, ProductGrid, useState for cart, component composition for the store catalog
- Module 7: React hooks — useEffect for data fetching, useRef for scroll, custom hooks (useCart, useProducts, useSearch)
- Module 8: React patterns — CartContext with useReducer, error boundaries, compound ProductVariantSelector (size/color/thread)
- Module 9: React 19 features, native forms + Zod checkout form, Context + useReducer state management, Vitest+RTL testing — 20+ tests for the store
- Module 10: Next.js fundamentals — App Router, Server/Client Components, loading/error UI, dynamic routes for `/products/[slug]`
- Module 11: Server Components data fetching, Server Actions (add-to-cart, checkout), caching/ISR, Route Handlers for the store API
- Module 12: Middleware (geo-redirect, auth guards), Auth.js login, Prisma + Neon Postgres for products/orders/users, SEO/OG images
- Module 13: Full-stack project — architecture, checkout flow, order management, admin polish — production-ready embroidery store
- Module 15, Lesson 1: Figma-to-code workflow + Tailwind fundamentals — utility-first, responsive, hover/focus/dark mode, restyled ProductCard and product grid
- Module 15, Lesson 2: Tailwind layout (flex, grid, spacing, containers) + component patterns — built Button/Input/Badge/Modal/CartDrawer with cn()
- Module 15, Lesson 3: Store redesign build day — converted all pages to Tailwind, dark mode toggle, design tokens, responsive verification, skeleton loading states
- Module 15, Lesson 4: E2E testing with Playwright — testing pyramid, 5 E2E tests (navigation, product detail, add to cart, checkout, protected routes), CI integration

**This lesson's focus:** CSS transitions and `@keyframes` animations + web performance profiling (DevTools, Lighthouse, Web Vitals)
**This lesson's build:** Animated product card hover effects, smooth cart drawer slide-in, skeleton pulse animation, then optimize the store to all Lighthouse scores above 90

**Story so far:** The store is redesigned with Tailwind and verified by Playwright E2E tests. But the UI still feels flat — product cards do not respond to hover, the cart drawer appears without transition, and skeleton loaders just pop in. This lesson you add the micro-interactions that make a store feel premium: smooth CSS transitions on hover, animated slide-ins for drawers and modals, and polished skeleton pulse animations. Then you run a Lighthouse audit and optimize until every score is above 90.

## Hour 1: CSS Transitions & Animations (60 min)

### 1.1 — CSS Transitions: The Basics (15 min)
Teach CSS transitions — the simplest way to animate between states:
- The `transition` shorthand: `transition: property duration timing-function delay`
- Example: `transition: transform 200ms ease-out` — "When the `transform` property changes, animate the change over 200ms"
- **Timing functions:** `ease` (default), `ease-in`, `ease-out`, `ease-in-out`, `linear`, and custom `cubic-bezier()`
- `ease-out` is the most natural for UI — fast start, gentle stop (like a ball rolling to a stop)
- `ease-in` feels sluggish for UI — slow start, fast stop (use for exits/removals)

**What to transition (and what NOT to):**
- **Cheap to animate (compositor thread):** `transform` (translate, scale, rotate) and `opacity` — the browser can animate these without recalculating layout
- **Expensive to animate (triggers layout/paint):** `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size` — these force the browser to recalculate the layout of every element on the page
- **The rule:** If you can achieve the effect with `transform` or `opacity`, always prefer that. Instead of animating `width`, use `transform: scaleX()`. Instead of animating `top`, use `transform: translateY()`.

**Exercise:** Build an animated product card hover effect for the embroidery store:
- On hover: card lifts up (`transform: translateY(-4px)`) and shadow deepens (`box-shadow` change)
- Transition: `transition: transform 200ms ease-out, box-shadow 200ms ease-out`
- Show the Tailwind equivalent: `hover:-translate-y-1 hover:shadow-lg transition-all duration-200`
- Also demonstrate: animate the "Add to Cart" button with `active:scale-95` for tactile press feedback with `transition: transform 100ms ease-out`

### 1.2 — `prefers-reduced-motion` (5 min)
Teach the accessibility media query for users who are sensitive to motion:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- Why it matters: some users experience motion sickness, vestibular disorders, or seizures from animations
- In Tailwind: `motion-reduce:transition-none` or `motion-reduce:animate-none`
- The store should respect this preference — animations enhance UX but must never harm it

**Exercise:** Add `motion-reduce:` variants to the product card hover effect. When the user has reduced motion enabled, the card should still change shadow (visual feedback) but skip the translateY lift animation.

### 1.3 — CSS `@keyframes` Animations (20 min)
Teach `@keyframes` for multi-step animations that go beyond simple A→B transitions:

**The syntax:**
```css
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.cart-drawer {
  animation: slideIn 300ms ease-out forwards;
}
```

**Key properties:**
- `animation-name`: which `@keyframes` to use
- `animation-duration`: how long the animation takes
- `animation-timing-function`: the easing curve
- `animation-fill-mode`: `forwards` (stay at end state), `backwards` (start at first keyframe), `both`
- `animation-iteration-count`: `1` (default), `infinite` for looping animations
- `animation-delay`: wait before starting

**Multi-step keyframes:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

**Exercise:** Build three animations for the embroidery store:

1. **Cart drawer slide-in:** The cart drawer from Lesson 2 slides in from the right with `translateX(100%)` → `translateX(0)` over 300ms ease-out. When closing, it slides out with a reverse animation.

2. **Skeleton pulse animation:** Build a custom skeleton loading animation using `@keyframes`. The skeleton cards (from Lesson 3) should pulse with a subtle shimmer effect — a gradient that sweeps left to right across the gray placeholder, simulating content loading:
   ```css
   @keyframes shimmer {
     0% { background-position: -200% 0; }
     100% { background-position: 200% 0; }
   }
   ```
   Compare this with Tailwind's built-in `animate-pulse` (opacity-based) — the shimmer feels more polished.

3. **Product card entrance:** When the product grid loads, cards fade in with a staggered delay — the first card appears immediately, the second after 50ms, the third after 100ms, etc. Use `animation-delay` with CSS custom properties:
   ```css
   .product-card { animation: fadeInUp 400ms ease-out backwards; }
   .product-card:nth-child(1) { animation-delay: 0ms; }
   .product-card:nth-child(2) { animation-delay: 50ms; }
   .product-card:nth-child(3) { animation-delay: 100ms; }
   ```

### 1.4 — Bringing It Together: Store Animations (20 min)
Apply transitions and animations across the embroidery store. Guide the student through implementing:

- **Product card hover:** `translateY(-4px)` lift + shadow deepen + image slight zoom (`scale(1.02)`) — all on `transition: all 200ms ease-out`
- **Cart drawer:** Slide in from right on open, slide out on close, backdrop fades in/out
- **Modal:** Fade in with slight scale up (`scale(0.95)` → `scale(1)` + opacity 0 → 1)
- **Button states:** `active:scale-95` with `transition: transform 100ms`
- **Navigation links:** Underline slides in from left on hover using `::after` pseudo-element with `transform: scaleX(0)` → `scaleX(1)`
- **Toast notifications:** Slide in from top-right, auto-dismiss with slide out after 3 seconds

For each animation, ask: "Is this using `transform`/`opacity` or something expensive? If expensive, can we rewrite it?"

## Hour 2: Performance Profiling (60 min)

### 2.1 — Chrome DevTools Performance Tab (20 min)
Teach the student to use Chrome DevTools for performance profiling:

**Open DevTools → Performance tab:**
1. Click the Record button (circle icon)
2. Interact with the store — scroll through products, open a product detail, add to cart, open the cart drawer
3. Click Stop
4. Read the results

**Understanding the flame chart:**
- **Main thread (yellow):** JavaScript execution — React rendering, event handlers, data fetching
- **Rendering (purple):** Style calculations, layout recalculations
- **Painting (green):** Pixel drawing
- **Long tasks:** Red triangles on bars longer than 50ms — these cause jank (stuttering)

**What to look for:**
- Long JavaScript tasks (>50ms) blocking the main thread
- Layout thrashing: rapid style recalculations caused by reading layout properties after writing them
- Excessive paint areas: elements repainting that don't need to (use the "Rendering" tab → "Paint flashing" toggle)

**Exercise:** Record a performance trace of scrolling through the embroidery store's product grid. Identify any long tasks. Check if the product card hover animations cause layout recalculations (they shouldn't if using `transform`/`opacity`). If they do, refactor the animation to use only compositor-friendly properties.

### 2.2 — Web Vitals: The Metrics That Matter (15 min)
Teach the three Core Web Vitals that Google uses for search ranking:

1. **LCP (Largest Contentful Paint):** How long until the largest visible element (usually the hero image or product image) finishes loading. Target: < 2.5 seconds.
   - Common fixes: optimize images, use `<link rel="preload">` for hero images, avoid render-blocking CSS/JS

2. **CLS (Cumulative Layout Shift):** How much the page layout shifts while loading. Target: < 0.1.
   - Common causes: images without width/height (they load and push content down), fonts loading late (text reflows), dynamic content injected above existing content
   - Common fixes: always set `width`/`height` on images (Next.js `<Image>` does this), use `font-display: swap` with size-adjusted fallback fonts

3. **INP (Interaction to Next Paint):** How long between a user interaction (click, tap, key press) and the next visual update. Target: < 200ms.
   - Common fixes: avoid heavy JavaScript on the main thread during interactions, use `startTransition` for non-urgent updates

**Exercise:** Open the store in Chrome, go to DevTools → Lighthouse tab. Run a Lighthouse audit in "Performance" mode for mobile. Read the results together:
- What is the LCP element? (Probably the hero image or first product image)
- Is there any CLS? (Check for images without dimensions or late-loading fonts)
- What is the Performance score?
- Read the "Opportunities" and "Diagnostics" sections — these tell you exactly what to fix

### 2.3 — Image Optimization with `next/image` (10 min)
Review Next.js image optimization, which the student used in earlier weeks:
- `<Image>` component automatically: serves WebP/AVIF, resizes to the correct dimensions, lazy loads below-the-fold images, sets `width`/`height` to prevent CLS
- **`priority` prop:** Add to the hero image and first few product images (above the fold) — this tells Next.js to preload them, improving LCP
- **`sizes` prop:** Tell the browser how wide the image will be at each breakpoint, so it downloads the right size:
  ```tsx
  <Image
    src="/products/wildflower.jpg"
    alt="Wildflower Bouquet Tee"
    width={800}
    height={600}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    priority // only for above-the-fold images
  />
  ```
- **`loading="lazy"`:** Default for non-priority images — browser only loads them as they approach the viewport

### 2.4 — Font Loading Strategies (10 min)
Teach font loading optimization:
- **The problem:** Custom fonts (like the store's "Playfair Display" heading font) can cause a flash of unstyled text (FOUT) or invisible text (FOIT), and late loading causes CLS
- **`font-display: swap`:** Show fallback font immediately, swap to custom font when it loads — prevents invisible text
- **Next.js `next/font`:** Automatically optimizes fonts, inlines `@font-face`, sets `font-display: swap`, and creates a size-adjusted fallback that minimizes CLS:
  ```typescript
  import { Playfair_Display, Inter } from 'next/font/google';
  const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });
  const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
  ```
- **Self-hosting vs. Google Fonts:** `next/font` self-hosts Google Fonts automatically — no external network requests

**Exercise:** Check if the store's fonts are loaded optimally. If using Google Fonts CDN directly, migrate to `next/font`. Verify in DevTools Network tab that no external font requests go to `fonts.googleapis.com`.

### 2.5 — Bundle Analysis (5 min)
Introduce bundle size awareness:
- Install `@next/bundle-analyzer`:
  ```bash
  pnpm add -D @next/bundle-analyzer
  ```
- Configure in `next.config.ts`:
  ```typescript
  const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });
  module.exports = withBundleAnalyzer(nextConfig);
  ```
- Run: `ANALYZE=true pnpm build` — opens a visual treemap of every module in the bundle
- Look for: unexpectedly large dependencies, duplicated packages, client-side code that should be server-only

**Exercise:** Run the bundle analyzer on the store. Identify the 3 largest dependencies. Are any of them unnecessary or replaceable with smaller alternatives?

## Hour 3: Performance Challenge (60 min)

**Challenge: Get ALL Lighthouse scores above 90 on the embroidery store.**

Run Lighthouse on the store's home page (mobile mode). The student's mission: fix every issue until Performance, Accessibility, Best Practices, and SEO all score 90 or above.

### Common issues to fix:

**Performance (< 90):**
- Hero image not optimized → add `priority` to `<Image>`, set correct `sizes`
- Product images loading eagerly below the fold → ensure `loading="lazy"` (default in `<Image>`)
- Large JavaScript bundles → check for client-side imports that could be server components
- Render-blocking resources → check for external CSS/JS in `<head>`
- Missing image dimensions → ensure all `<Image>` components have `width`/`height`

**Accessibility (< 90):**
- Missing `alt` text on images → add descriptive alt text to every product image
- Low contrast text → check gray text on white backgrounds (especially in light mode)
- Missing form labels → ensure every `<input>` has an associated `<label>`
- Missing heading hierarchy → `<h1>` → `<h2>` → `<h3>`, no skipped levels
- Missing landmark regions → `<nav>`, `<main>`, `<footer>` present

**Best Practices (< 90):**
- Images not using modern formats → `<Image>` handles this automatically
- `document.write()` used → should not be present in a Next.js app
- Missing `rel="noopener"` on external links → add to `<a target="_blank">` links

**SEO (< 90):**
- Missing meta description → add in the page's `metadata` export
- Missing `<title>` → set in `metadata`
- Images missing `alt` text → same fix as accessibility
- Non-crawlable links → ensure navigation links use `<a>` tags, not buttons

### Process:
1. Run Lighthouse, note the score and top 3 issues
2. Fix the top issue
3. Re-run Lighthouse, verify the score improved
4. Repeat until all scores are 90+
5. Record the final scores and one sentence about the biggest improvement

### Acceptance criteria:
- Performance score >= 90
- Accessibility score >= 90
- Best Practices score >= 90
- SEO score >= 90
- All fixes are in the production code, not hacks
- The student can explain what each fix improved and why

## Hour 4: Review + Advanced Animation Concepts (60 min)

### Performance Review (15 min)
Review the student's Lighthouse improvements:
- Walk through each fix and explain the underlying browser behavior
- Check that fixes didn't break the visual design or functionality
- Verify scores in both mobile and desktop modes
- Celebrate the achievement — getting all 90+ on a real Next.js e-commerce app is meaningful

### Animation Performance Deep Dive (15 min)
Teach the "why" behind animation performance:

**The browser's rendering pipeline:**
1. **JavaScript** → 2. **Style** → 3. **Layout** → 4. **Paint** → 5. **Composite**

- `transform` and `opacity` only trigger step 5 (Composite) — the GPU handles this on a separate thread, so the main thread stays free
- `width`, `height`, `margin` trigger steps 3-5 (Layout + Paint + Composite) — the browser recalculates the position of every element
- `background-color`, `box-shadow` trigger steps 4-5 (Paint + Composite) — better than layout, but still more work than composite-only

**`will-change` property:**
- `will-change: transform` tells the browser to create a separate GPU layer for this element in advance
- Use sparingly — each layer uses GPU memory. Only apply to elements that will definitely animate
- Remove after animation completes if using dynamically
- Tailwind: apply as an arbitrary property `[will-change:transform]` or in custom CSS

**Hardware-accelerated properties:**
- `transform: translateZ(0)` or `transform: translate3d(0, 0, 0)` — forces GPU acceleration (older hack, `will-change` is the modern approach)

**Exercise:** Open DevTools → Rendering → check "Layer borders" and "Paint flashing". Hover over product cards and open the cart drawer. Verify:
- Product card hover uses compositor-only properties (green border = own layer)
- Cart drawer slide-in uses `transform`, not `left`/`right`
- No unexpected green paint flashing (repainting) during animations

### Progressive Enhancement (10 min)
Teach the philosophy: the store should work without animations, and animations enhance the experience for users who can benefit:
- Base experience: all functionality works without any CSS transitions or animations
- Enhanced experience: transitions and animations added for users whose browsers and preferences support them
- `@supports` for checking CSS feature support
- `prefers-reduced-motion` as the accessibility gate
- Avoid animation as the only feedback mechanism — always pair with a visual state change (color, icon, text)

### Animation Gotchas (15 min)
Common mistakes to avoid:
- **Animating `height: auto`:** CSS cannot transition to/from `auto`. Use `max-height` with a large value, or use the `grid-template-rows: 0fr → 1fr` trick for collapsing sections
- **Jank from layout triggers:** Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` — use `transform` equivalents
- **Too many animated elements:** 100 product cards all animating simultaneously will tank performance. Use `IntersectionObserver` to only animate elements as they enter the viewport.
- **Animation without purpose:** Every animation should communicate something — a state change, a spatial relationship, or feedback. Decorative animation with no meaning is noise.

**Exercise:** Review all the animations in the embroidery store. For each one, ask: "What does this animation communicate?" Remove any that don't have a clear answer. Ensure remaining animations all use compositor-friendly properties.

### Wrap-up (5 min)
**Three key takeaways:**
1. `transform` and `opacity` are the only properties cheap enough to animate at 60fps — they run on the GPU's compositor thread, leaving the main thread free for JavaScript
2. Lighthouse and Chrome DevTools Performance tab are your diagnostic tools — they tell you exactly what to fix, not just that something is slow
3. Every animation needs a purpose (feedback, spatial relationship, state change) and a `prefers-reduced-motion` fallback — animations that harm accessibility or serve no purpose must be removed

**Preview of in the next lesson:** Interview and quiz to review everything from this module — Figma-to-code, Tailwind utility-first styling, E2E testing with Playwright, and CSS animation performance.

**Coming up next:** The store looks and performs well with custom Tailwind components. Next week: shadcn/ui — a professional component library that gives you pre-built, accessible, customizable components. You will migrate the store to shadcn, build polished forms, a data table for the admin dashboard, and do a full accessibility audit.

## Student Support

### Before You Start
Open `workspace/nextjs-store` and start from the last committed version of the store. Run the project if this is a build lesson, then make sure the previous lesson's checklist is complete.

**Folder:** `workspace/nextjs-store`

### Where This Fits
You are evolving the store into the production Next.js version: full-stack data, auth, admin flows, design systems, accessibility, testing, and deployment quality.

### Expected Outcome
By the end of this lesson, the student should have: **Animated product card hover effects, smooth cart drawer slide-in, skeleton pulse animation, then optimize the store to all Lighthouse scores above 90**.

### Acceptance Criteria
- You can explain today's focus in your own words: CSS transitions and `@keyframes` animations + web performance profiling (DevTools, Lighthouse, Web Vitals).
- The expected outcome is present and reviewable: Animated product card hover effects, smooth cart drawer slide-in, skeleton pulse animation, then optimize the store to all Lighthouse scores above 90.
- Any code or project notes are saved under `workspace/nextjs-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: CSS transitions and `@keyframes` animations + web performance profiling (DevTools, Lighthouse, Web Vitals). Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
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
- Make a small, descriptive git commit for today's finished work.
- Add or update one README/dev-note sentence explaining what changed and why.
- Record one decision you made today: the tradeoff, the alternative, and why this choice fits the store.

### AI Pairing Guardrails
- The assistant may explain, review, and suggest; the student still owns the final decision.
- Prefer hints and small steps before full solutions.
- Keep changes bounded to today's goal and acceptance criteria.
- Never paste secrets, API keys, private customer data, or proprietary code into an AI tool.

## Checklist

Before moving to the next day, ALL items must be checked:

- [ ] Built CSS transition animations for product cards and cart drawer
- [ ] Created a `@keyframes` animation for the loading skeleton
- [ ] Ran Chrome DevTools Performance profiler and identified bottlenecks
- [ ] All Lighthouse scores above 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Can explain which CSS properties are cheap to animate and why
- [ ] All code saved in `workspace/nextjs-store`

## Personality Reminder

Remember: you are a warm, friendly human tutor — not a textbook. Start with a greeting. Use humor. Get excited when the student gets something right. One concept at a time, then STOP and wait. Make this fun.

## Teaching Rules
- Lead with discovery — show the problem before the solution
- When the student is close: Socratic question. When way off: direct but kind
- Never say "it's easy" or "it's simple"
- Specific praise, not generic
- Confidence check every 15-20 min (1-5)
- Connect to the store, embroidery analogies welcome
- Skip ahead if flying; slow down if struggling
- Production-quality code always
