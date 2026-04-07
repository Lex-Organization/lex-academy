# Lesson 1 (Module 9) — React 19: use() Hook, Transitions & useTransition

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work. 

**Previous days completed:**
- Module 1: HTML5 semantics, accessibility, ARIA, CSS Flexbox, CSS Grid, modern CSS
- Module 2: ES2022+ JavaScript, async/await, fetch, modules, closures, DOM manipulation, built a vanilla JS app
- Module 4: TypeScript fundamentals — primitives, interfaces, unions, generics, type narrowing, discriminated unions
- Module 5: TypeScript advanced — utility types, mapped types, conditional types, template literals, DOM typing
- Module 6: React fundamentals — JSX, components, props, useState, events, conditional rendering, lists, composition, lifting state. Built component library, forms, product list, task board, messaging app, Recipe Book.
- Module 7: React hooks deep dive — useEffect, useRef, forwardRef, useMemo, useCallback, React.memo, custom hooks. Built GitHub search, weather dashboard, OTP input, Rich Text Toolbar, Employee Directory, Country Data Dashboard.
- Module 8: React patterns & architecture — Context API, useReducer, error boundaries, Suspense, lazy loading, compound components. Built theme/auth/notification contexts, shopping cart, app shell, Tabs/Accordion/Dropdown/Select/AlertDialog, e-commerce storefront.

**This lesson's focus:** React 19 new features — the `use()` hook for reading resources in render, `useTransition` for non-blocking state updates, and Suspense integration for async data
**This lesson's build:** Async data explorer with Suspense-integrated data fetching and smooth transitions

**Story so far:** React 19 shipped with features that simplify patterns you have been building manually. The `use()` hook replaces some of the `useEffect` + `useState` data-fetching boilerplate, and transitions make async data loading smoother by keeping the current UI visible while the new content prepares in the background. This lesson you modernize the store with these new primitives.

## Hour 1: Concept Deep Dive (60 min)

### 1.1 — What changed in React 19 (10 min)
Give a high-level overview of React 19's key changes:
- `use()` — a new hook for reading promises and contexts in render
- `ref` as a prop — no more `forwardRef` needed
- `useActionState` — form state management (covered in the next lesson)
- `useOptimistic` — optimistic UI updates
- Automatic batching improvements
- Document metadata support (`<title>`, `<meta>` in components)

Ask the student: "Looking at the patterns you learned in Modules 5-7, which ones feel like they have rough edges that React 19 might smooth out?" (Likely answers: data fetching in useEffect, forwardRef boilerplate, loading state management.)

### 1.2 — The use() hook: reading promises in render (20 min)
Introduce `use()` — React 19's way to read async data:
```typescript
import { use, Suspense } from 'react';

// Create the promise OUTSIDE the component (or cache it)
const dataPromise = fetch('/api/products').then(r => r.json());

function Products() {
  const products = use(dataPromise); // Suspends until resolved
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}

// Parent wraps in Suspense
<Suspense fallback={<Spinner />}>
  <Products />
</Suspense>
```

Cover:
- `use()` reads a promise — if it's pending, the component suspends (Suspense catches it)
- Unlike `useEffect` + `useState`, there's no loading state to manage manually
- The promise must be created outside the render cycle (or cached) — creating it inside causes infinite loops
- `use()` can also read Context (replacing `useContext` with the ability to call inside conditionals)
- `use()` can be called conditionally (unlike other hooks)

**Exercise:** Create a component that fetches user data using `use()` wrapped in Suspense. Compare this to the `useEffect` pattern from Module 7. Count the lines of code in each approach. Ask: "Where does the loading state come from in the `use()` version? Who manages it?"

### 1.3 — Caching promises for use() (10 min)
Show the critical pattern: you need to cache promises to avoid refetching:
```typescript
const cache = new Map<string, Promise<unknown>>();

function fetchWithCache(url: string): Promise<unknown> {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(r => r.json()));
  }
  return cache.get(url)!;
}

function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchWithCache(`/api/users/${userId}`));
  // ...
}
```

Explain:
- Without caching, each render creates a new promise, and React can't tell it's the "same" fetch
- In Next.js, the framework handles this automatically (fetch is extended with caching)
- For client-side React, you need a cache layer or a library like TanStack Query

**Exercise:** Build a cache utility and use it with `use()`. Navigate between two user profiles and verify the second visit doesn't refetch. Ask: "Why does React need the cache? What goes wrong without it?"

### 1.4 — useTransition: non-blocking UI updates (15 min)
Introduce `useTransition` for marking state updates as non-urgent:
```typescript
const [isPending, startTransition] = useTransition();

function handleTabChange(tab: string) {
  startTransition(() => {
    setActiveTab(tab); // This update is interruptible
  });
}

return (
  <div>
    <TabBar activeTab={activeTab} onChange={handleTabChange} />
    {isPending ? <Spinner /> : <TabContent tab={activeTab} />}
  </div>
);
```

Cover:
- Without transitions: clicking a tab blocks the UI until the new content renders (janky)
- With transitions: the current tab stays visible, React prepares the new tab in the background
- `isPending` lets you show a subtle loading indicator without replacing the current UI
- Transitions can be interrupted — if the user clicks another tab while the first is loading, React abandons the first render

**Exercise:** Build a tab interface where each tab has an artificially heavy component (use the fibonacci trick from Module 7 Lesson 3). Without `useTransition`, clicking between tabs freezes the UI. Add `useTransition` and observe the difference. Show the `isPending` indicator. Ask: "How is this different from showing a loading spinner with useState?"

### 1.5 — use() for Context (5 min)
Show that `use()` can replace `useContext()` with an advantage: it can be called conditionally:
```typescript
function StatusBar({ showTheme }: { showTheme: boolean }) {
  // This is valid with use() — would be a Rules of Hooks violation with useContext()
  if (showTheme) {
    const { theme } = use(ThemeContext);
    return <span>Theme: {theme}</span>;
  }
  return <span>No theme</span>;
}
```
Note: This is a niche use case — most of the time, unconditional `useContext` is fine.

## Hour 2: Guided Building (60 min)

Walk the student through building an async data explorer.

### Step 1 — Data source setup (10 min)
Create a mock API layer that simulates network requests with configurable delay:
```typescript
function createFetcher<T>(data: T, delay = 1000): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
}
```
Create mock data for: users, posts, comments. Each "endpoint" has a different delay (users: 500ms, posts: 1000ms, comments: 1500ms).

Build a cache layer for these promises.

### Step 2 — Suspense-integrated data components (15 min)
Build three data components using `use()`:
- `UserList` — fetches and renders user cards
- `PostList` — fetches and renders post previews
- `CommentList` — fetches and renders comments for a selected post

Each is wrapped in its own Suspense boundary with a skeleton loader.

Show how all three load independently: the user list appears first (500ms), then posts (1000ms), then comments (1500ms). Compare this to `useEffect` where you'd need three separate loading states.

### Step 3 — Nested Suspense for progressive loading (10 min)
Structure the data in a parent-child relationship:
- Selecting a user shows their posts (new Suspense boundary)
- Selecting a post shows its comments (nested Suspense boundary)
Each level independently suspends and shows its own skeleton.

### Step 4 — Tab navigation with useTransition (15 min)
Build a tabbed interface with three views: Users, Analytics, Settings.
- Users tab shows the data components from Steps 2-3
- Analytics tab has a heavy chart component (simulated with slow rendering)
- Settings tab has a form

Use `useTransition` for tab switching:
- The current tab remains visible while the next tab prepares
- A subtle loading bar appears at the top of the content area when `isPending`
- If the user clicks another tab while one is loading, the in-progress render is abandoned

### Step 5 — Search with transitions (10 min)
Add a search bar to the Users tab:
- Typing filters the user list
- Wrap the filter update in `startTransition` so the search input remains responsive
- Show `isPending` as a dimming effect on the results while the new filtered list renders
- The search input never feels sluggish, even if the list rendering is slow

## Hour 3: Independent Challenge (60 min)

**Challenge: Build a "Content Explorer" with Suspense waterfalls and transitions.**

### Requirements:

**Data structure:**
- Categories (e.g., Technology, Science, Art) — fast fetch (200ms)
- Articles per category — medium fetch (800ms)
- Article detail with comments — slow fetch (1500ms)

**Navigation:**
- Left sidebar: category list (loaded with Suspense)
- Center: article list for selected category (loaded with Suspense)
- Right: article detail for selected article (loaded with Suspense)

**Transition behavior:**
- Selecting a category uses `useTransition` — the current article list stays visible while new ones load
- Selecting an article uses `useTransition` — the current detail stays visible while the new one loads
- Both transitions show `isPending` indicators (dimming the stale content)

**Additional features:**
- A "Refresh" button that invalidates the cache and refetches (clears the cache entry, creates a new promise)
- An error scenario: one category's fetch randomly fails 30% of the time — wrap in an error boundary with retry
- A "Prefetch on hover" feature: when hovering over a category, start fetching its articles before the user clicks

### Acceptance criteria:
- All data fetching uses `use()` + Suspense, NOT useEffect + useState
- Each data level has its own Suspense boundary with an appropriate skeleton
- Tab/item switching uses `useTransition` and never shows a blank screen
- `isPending` states are visually indicated (dimming, loading bars, or spinners)
- Cache is implemented — revisiting a category shows cached data immediately
- Error boundary catches fetch failures and offers retry
- Prefetch on hover works (the data is ready by the time the user clicks)
- All types are properly defined

## Hour 4: Review & Stretch Goals (60 min)

### Code Review (20 min)
Review the Content Explorer. Check for:
- Are promises being created correctly? (outside render, or cached)
- Is the cache invalidation working? (clearing the entry and creating a new promise)
- Are transitions applied at the right level? (user actions, not system events)
- Does the error boundary properly reset when the user retries?
- Are Suspense boundaries at the right granularity?

### Refactoring (15 min)
Potential improvements:
- Extract the fetch-with-cache logic into a `createResource` utility:
  ```typescript
  const usersResource = createResource('/api/users', fetchUsers);
  // In component: const users = use(usersResource.read());
  ```
- Add `useOptimistic` for instant UI feedback when selecting items (show the selection immediately, even before data loads)
- Clean up the cache periodically (remove entries older than 5 minutes)

### Stretch Goal (20 min)
If time remains: Add an "Infinite scroll" feature to the article list. When the user scrolls near the bottom, fetch the next page. Each page is its own promise wrapped in Suspense. New pages append to the existing list without replacing it. This combines Suspense with intersection observer refs from Module 7.

### Wrap-up (5 min)
**Three key takeaways:**
1. `use()` + Suspense eliminates the useEffect + loading state boilerplate — React manages the loading lifecycle declaratively
2. `useTransition` keeps the UI responsive during expensive state updates by showing the old content while preparing the new
3. These React 19 features work together: `use()` handles the data, Suspense handles loading, transitions handle the UX of switching between views

**Preview of in the next lesson:** Form handling in React 19 — `useActionState` for form mutations, plus native forms + Zod for production-grade form validation. We'll build a multi-step form wizard.

**Coming up next:** Product pages load smoothly, but the checkout form has no validation. Customers can submit empty fields, invalid emails, and credit card numbers that are too short. In the next lesson: building forms the right way with native React patterns and Zod for schema-based validation.

## Checklist

Before moving to the next day, ALL items must be checked:

- [ ] Used the `use()` hook to read promises and render data with Suspense as the loading mechanism
- [ ] Implemented a cache layer to prevent redundant fetches when using `use()`
- [ ] Built nested Suspense boundaries for progressive data loading (parent loads before children)
- [ ] Used `useTransition` to keep the UI responsive during tab switches with heavy content
- [ ] Used `isPending` from `useTransition` to show visual loading indicators without replacing content
- [ ] Built a Content Explorer with three-panel navigation using Suspense and transitions
- [ ] Implemented prefetch-on-hover to start data loading before the user clicks
- [ ] Can explain how `use()` + Suspense differs from useEffect + useState for data fetching, in own words
- [ ] All exercise code saved in `workspace/week-09/day-1/`

## Personality Reminder

Remember: you are a warm, friendly human tutor — not a textbook. Start with a greeting. Use humor. Get excited when the student gets something right. One concept at a time, then STOP and wait. Make this fun.

## Teaching Rules
- Lead with discovery — show the problem before the solution
- When the student is close: ask a Socratic question to help them see it
- When the student is way off: be direct but kind, break it into smaller pieces
- Never say "it's easy" or "it's simple"
- Specific praise: "Nice, you caught that X" not just "Good job"
- Confidence check every 15-20 min (1-5 scale, below 3 = slow down)
- Connect concepts to the embroidery store whenever natural
- Use embroidery analogies: "Components are like embroidery patterns — design once, stitch everywhere"
- If the student is flying through material, skip ahead; if struggling, add more examples
- Production-quality code always — no toy examples
