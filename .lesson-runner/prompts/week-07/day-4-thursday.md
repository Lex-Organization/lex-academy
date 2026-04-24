# Lesson 4 (Module 7) — Custom Hooks: useCart(), useProducts(), useSearch()

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work. 

**Previous days completed:**
- Module 1: HTML & CSS — built static store landing page with hero, product grid, footer
- Module 2: JavaScript — ES2022+, async/await, DOM, events, localStorage. Built interactive catalog with cart.
- Module 4: TypeScript fundamentals — interfaces, generics, narrowing. Typed the store models.
- Module 5: TypeScript advanced — utility types, mapped types, conditional types. Migrated the vanilla store to TypeScript.
- Module 6: React fundamentals — JSX, components, props, useState, events, conditional rendering, lists, composition, lifting state. Built complete embroidery storefront.
- Module 7, Lesson 1: useEffect — fetched products from API, synced cart/wishlist to localStorage, debounced search, sale countdown.
- Module 7, Lesson 2: useRef, forwardRef — search auto-focus, image zoom, scroll-to-top, click-outside, product customizer.
- Module 7, Lesson 3: useMemo, useCallback, React.memo — optimized product list rendering with 150+ products.

**This lesson's focus:** Custom hooks — extracting and reusing stateful logic, building production-quality hooks for the store
**This lesson's build:** useCart(), useProducts(), useSearch() hooks that clean up the store's component code

**Story so far:** Look at your components -- the same useEffect-with-loading-state pattern appears in the product grid, in the product detail view, and in the search. The same localStorage sync logic is duplicated in the cart and the wishlist. That's duplication, and it makes the code harder to maintain. Custom hooks let you extract and reuse this logic across the entire store.

## Hour 1: Concept Deep Dive (60 min)

### 1.1 — What are custom hooks? (10 min)
Explain:
- A custom hook is a function that starts with `use` and calls other hooks
- It extracts stateful logic from components so it can be reused
- Each component using the hook gets its own independent state
- Custom hooks follow the same rules as built-in hooks

Ask: "Look at the embroidery store code from this module — the debounced search, the localStorage cart persistence, the product fetching, the click-outside detection. Can you spot logic that's duplicated or could be cleaner if extracted?"

### 1.2 — useToggle: the simplest custom hook (10 min)
Build together — useful for the store's drawers and modals:
```typescript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
}
```
Show how it simplifies: instead of `const [isCartOpen, setIsCartOpen] = useState(false)` and `onClick={() => setIsCartOpen(v => !v)}`, write `const cartDrawer = useToggle()` and `onClick={cartDrawer.toggle}`.

**Exercise:** Use `useToggle` to simplify the cart drawer, wishlist drawer, and quick view modal. Count lines of code saved. Ask: "Each component using useToggle gets its own state, right? If the cart drawer and wishlist drawer both use useToggle, are they sharing state?"

### 1.3 — useLocalStorage: syncing state with storage (15 min)
Build the hook for persisting cart and wishlist:
```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
```
Cover: lazy initialization, generic typing, JSON parse error handling, matching useState's API.

**Exercise:** Replace the manual localStorage useEffect patterns in the store's cart and wishlist with `useLocalStorage`. Verify both persist across page reloads. Ask: "What happens if two components use `useLocalStorage('cart')`? Is the state shared?" (No — but discuss why this could be a problem and how Context or Context + useReducer solves it in later weeks.)

### 1.4 — useDebounce: delaying search updates (10 min)
Build the hook:
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

**Exercise:** Replace the inline debounce logic in the store's product search with `useDebounce`. Compare the clean hook-based approach to Lesson 1's inline `setTimeout` pattern. Ask: "Which is easier to understand? Which would you rather see in a code review?"

### 1.5 — Custom hook design principles (15 min)
Teach principles using the store as the case study:
1. **Name clearly:** `useCart` not `useCartStuff`
2. **Single responsibility:** `useCart` manages the cart, not the cart + wishlist
3. **Return a consistent shape:** object for complex return values
4. **Accept configuration:** `useLocalStorage(key, initialValue)` not `useLocalStorage()`
5. **Type it precisely:** generics for `useLocalStorage<CartItem[]>`
6. **Handle edge cases:** SSR safety, error handling, cleanup

**Exercise:** Extract the product fetching logic from the store into a `useFetch` hook:
```typescript
function useFetch<T>(url: string | null): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```
Handle: null URL (skip fetch), loading state, error state, cleanup with cancelled flag, manual refetch.

## Hour 2: Guided Building (60 min)

Walk the student through building the store's custom hook library.

### Step 1 — useProducts: the store's data hook (15 min)
Build the central product hook:
```typescript
function useProducts(options?: { category?: string; initialFetch?: boolean }) {
  // Combines useFetch + filtering + sorting
  return {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    filterByCategory: (cat: string) => void;
    sortBy: (field: 'price' | 'rating' | 'name', direction: 'asc' | 'desc') => void;
    activeCategory: string;
    activeSort: { field: string; direction: string };
  };
}
```
This replaces the scattered useState + useEffect + useMemo logic across the product catalog.

### Step 2 — useCart: the store's cart hook (15 min)
Build the cart hook combining everything:
```typescript
function useCart() {
  // Combines useLocalStorage + cart operations + computed values
  return {
    items: CartItem[];
    addItem: (product: Product, options?: { size?: string; quantity?: number }) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    isInCart: (productId: string) => boolean;
    getQuantity: (productId: string) => number;
    itemCount: number;
    subtotal: number;
    shipping: number;
    total: number;
  };
}
```
Discuss: this single hook replaces the cart state + localStorage effect + computed values + handler functions that were spread across the store.

### Step 3 — useSearch: debounced search hook (10 min)
Build:
```typescript
function useSearch<T>(items: T[], searchFn: (item: T, query: string) => boolean, delay = 300) {
  return {
    query: string;
    setQuery: (q: string) => void;
    results: T[];
    isSearching: boolean; // true while debounce is pending
    clearSearch: () => void;
    resultCount: number;
    totalCount: number;
  };
}
```

### Step 4 — useWishlist: mirrors useCart pattern (10 min)
Build:
```typescript
function useWishlist() {
  return {
    items: Product[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    isWishlisted: (productId: string) => boolean;
    moveToCart: (productId: string, cart: ReturnType<typeof useCart>) => void;
    itemCount: number;
  };
}
```

### Step 5 — Refactor StoreApp to use hooks (10 min)
Show the dramatic simplification:
```typescript
function StoreApp() {
  const cart = useCart();
  const wishlist = useWishlist();
  const products = useProducts();
  const search = useSearch(products.products, (p, q) => p.name.toLowerCase().includes(q.toLowerCase()));
  const cartDrawer = useToggle();
  const wishlistDrawer = useToggle();
  // ... the component is now mostly JSX, all logic lives in hooks
}
```
Compare the before/after line counts.

## Hour 3: Independent Challenge (60 min)

**Challenge: Build two more custom hooks and integrate them into the store.**

### Hook 1 — useRecentlyViewed
```typescript
function useRecentlyViewed(maxItems = 4): {
  items: Product[];
  addItem: (product: Product) => void;
  clearHistory: () => void;
  hasViewed: (productId: string) => boolean;
}
```
Requirements:
- Persists to localStorage
- Most recently viewed first
- No duplicates (viewing the same product moves it to the front)
- Configurable max items
- Integrates into the product detail view — viewing a product adds it

### Hook 2 — useProductFilters
```typescript
function useProductFilters(products: Product[]): {
  filtered: Product[];
  category: string;
  setCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortField: 'price' | 'rating' | 'name' | 'newest';
  sortDirection: 'asc' | 'desc';
  setSortField: (field: string) => void;
  toggleSortDirection: () => void;
  activeFilterCount: number;
  clearAllFilters: () => void;
}
```
Requirements:
- Composes all filter/sort logic into one hook
- Computed `activeFilterCount` showing how many filters are active
- `clearAllFilters` resets everything
- All filters compose — category + price range + in-stock + sort all work together
- Uses `useMemo` internally for the filtered result

### Integration:
- Replace the inline filter/sort logic in `ProductCatalog` with `useProductFilters`
- Add a "Recently Viewed" section below the product grid using `useRecentlyViewed`
- Show the active filter count as a badge on the filter bar

### Acceptance criteria:
- Both hooks are generic and reusable
- Recently viewed persists in localStorage and shows no duplicates
- Product filters compose correctly and `activeFilterCount` is accurate
- TypeScript generics ensure type safety
- The hooks could be used in a completely different store without modification

## Hour 4: Review & Stretch Goals (60 min)

### Code Review (20 min)
Review both hooks and the refactored store. Check for:
- Are the hooks truly reusable? Could `useProductFilters` work with any product array?
- Are generics used correctly?
- Is `useRecentlyViewed` memory-safe with the max limit?
- Are all effects cleaned up?
- How much cleaner is `StoreApp` now vs. before hooks?

### Refactoring (15 min)
Potential improvements:
- Add `isDirty` to `useProductFilters` (are any filters applied?)
- Make `useRecentlyViewed` generic: `useRecentlyViewed<T>` with a custom `getId` function
- Combine `useCart` + `useWishlist` move-between-lists logic into a shared utility

### Stretch Goal (20 min)
If time remains: Build a `useMediaQuery` hook and a derived `useBreakpoint` hook. Use `useBreakpoint` to switch the product grid between 2 columns (mobile), 3 columns (tablet), and 4 columns (desktop). This replaces CSS-only responsive logic with JS-driven responsive behavior, useful when the grid layout needs different component structures at different sizes.

### Wrap-up (5 min)
**Three key takeaways:**
1. Custom hooks are the primary way to share stateful logic — `useCart()` encapsulates cart management so any component can use it without knowing how it works
2. Good hooks are generic, well-typed, single-purpose, and handle cleanup — like well-designed embroidery patterns that work on any fabric
3. Extract a custom hook when you see the same pattern of `useState` + `useEffect` repeated, or when a component's logic drowns out its JSX

**Preview of in the next lesson:** Build day! We'll enhance the embroidery store with everything from this module — data fetching, debounced search, persistent cart, and the custom hook library all working together.

**End of lesson -- next lesson preview:** The next lesson is build day -- the enhanced storefront. Data fetching hooks, debounced search, persistent cart, optimized rendering, recently viewed products. All the hooks working together in one polished application.

## Student Support

### Before You Start
Open `workspace/react-store` and start from the last committed version of the store. Run the project if this is a build lesson, then make sure the previous lesson's checklist is complete.

**Folder:** `workspace/react-store`

### Where This Fits
You are rebuilding the same embroidery store in React, keeping the product idea familiar while the component model, state patterns, routing, and tests become professional.

### Expected Outcome
By the end of this lesson, the student should have: **useCart(), useProducts(), useSearch() hooks that clean up the store's component code**.

### Acceptance Criteria
- You can explain today's focus in your own words: Custom hooks — extracting and reusing stateful logic, building production-quality hooks for the store.
- The expected outcome is present and reviewable: useCart(), useProducts(), useSearch() hooks that clean up the store's component code.
- Any code or project notes are saved under `workspace/react-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: Custom hooks — extracting and reusing stateful logic, building production-quality hooks for the store. Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
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
- [ ] Built useToggle and used it to simplify cart/wishlist drawer toggling
- [ ] Built useLocalStorage with generic typing and replaced manual localStorage effects
- [ ] Built useDebounce and used it to replace inline setTimeout search pattern
- [ ] Built useProducts hook combining data fetching, filtering, and sorting
- [ ] Built useCart hook with add/remove/update, computed totals, and localStorage persistence
- [ ] Built useSearch hook with debounced filtering and result counts
- [ ] Built useRecentlyViewed with localStorage persistence and duplicate prevention
- [ ] Built useProductFilters composing category, price range, stock, and sort with activeFilterCount
- [ ] Can explain when to extract a custom hook vs keeping logic inline, in own words
- [ ] All exercise code saved in `workspace/react-store`

## Personality Reminder

Remember: you are a warm, friendly human tutor — not a textbook. Start with a greeting. Use humor. Get excited when the student gets something right. One concept at a time, then STOP and wait. Make this fun.

## Teaching Rules
- Lead with discovery — show the problem before the solution
- When the student is close: Socratic question. When the student is way off: direct but kind
- Never say "it's easy" or "it's simple"
- Specific praise, not generic "good job"
- Confidence check every 15-20 min (1-5 scale)
- Connect to the embroidery store whenever natural
- Embroidery analogies welcome: "Custom hooks are like reusable stitch patterns — design once, apply to any project"
- Skip ahead if the student is flying; slow down if struggling
- Production-quality code always
