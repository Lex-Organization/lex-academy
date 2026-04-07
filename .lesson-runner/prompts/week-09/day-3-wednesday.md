# Lesson 3 (Module 9) — State Management at Scale — Context + useReducer Patterns

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
- Module 8: React patterns & architecture — Context API, useReducer, error boundaries, Suspense, lazy loading, React Router, compound components. Built theme/auth/notification contexts, shopping cart, app shell, multi-page store routing, compound components, e-commerce storefront.
- Module 9, Lesson 1: React 19 — use() hook, useTransition, Suspense-integrated data fetching. Built async data explorer.
- Module 9, Lesson 2: Native form handling — controlled vs uncontrolled inputs, FormData, useActionState, Zod validation. Built multi-step checkout form.

**This lesson's focus:** Scaling state management with Context + useReducer — multiple contexts, context composition, avoiding the "god context" anti-pattern
**This lesson's build:** Multi-slice state architecture for the embroidery store: CartContext, FilterContext, UIContext, OrderContext

**Story so far:** The store has CartContext, but what about filter state? UI state like drawer open/close? Notification state? Stuffing everything into one giant context causes unnecessary re-renders across the entire app. This lesson you learn to compose multiple focused contexts and reducers into a scalable state architecture where changing the theme does not re-render the product grid.

## Hour 1: When State Management Gets Complex (60 min)

### 1.1 — The "god context" anti-pattern (15 min)
Start by showing what happens when all state lives in a single context:
```typescript
// THE ANTI-PATTERN: one context to rule them all
interface AppState {
  user: User | null;
  cart: CartItem[];
  wishlist: Product[];
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  notifications: Notification[];
  // ... 20 more fields
}
```

Problems:
- Changing the theme re-renders every component consuming this context — including the product grid, cart drawer, and notification panel
- The reducer has 30+ action types in one giant switch statement
- Every component pulls in the entire store even if it only needs `theme`
- Testing requires mocking the entire app state for every component test

Ask: "In Module 8, Lesson 1, you split state into CartContext, ThemeContext, and WishlistContext. Why was that better than one giant AppContext? What if you had 10 contexts?"

### 1.2 — Multiple contexts: the slice pattern (15 min)
Teach the architecture of splitting state into focused, independent contexts:
```typescript
// Each context owns ONE domain
const CartContext = createContext<CartContextValue | null>(null);
const FilterContext = createContext<FilterContextValue | null>(null);
const UIContext = createContext<UIContextValue | null>(null);
```

Rules for splitting:
1. **Group by domain**, not by component — cart items + cart actions = one context
2. **Minimize cross-context dependencies** — if two pieces of state always change together, they belong in the same context
3. **Separate data from UI state** — cart items (data) and sidebar-open (UI) change independently and should be separate contexts
4. **Actions live with their state** — `addToCart` lives in `CartContext`, not in a separate "actions context"

**Exercise:** Take the Module 8 shopping cart and identify which state should be in which context. Draw the separation on paper. Ask: "Does `searchQuery` belong in CartContext? Why not? What about `selectedCategory` — is that cart state or filter state?"

### 1.3 — Context composition: provider trees (10 min)
Show how to compose multiple context providers cleanly:
```typescript
// Avoid: deeply nested provider tree
function App() {
  return (
    <CartProvider>
      <FilterProvider>
        <UIProvider>
          <NotificationProvider>
            <Router />
          </NotificationProvider>
        </UIProvider>
      </FilterProvider>
    </CartProvider>
  );
}

// Better: compose into a single wrapper
function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FilterProvider>
        <UIProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </UIProvider>
      </FilterProvider>
    </CartProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Router />
    </AppProviders>
  );
}
```

Cover:
- Provider order matters when one context depends on another (rare, but possible)
- The `AppProviders` wrapper keeps `App` clean
- Each provider manages its own reducer — no single mega-reducer

**Exercise:** Build an `AppProviders` component that wraps CartProvider, FilterProvider, and UIProvider. Verify all three work independently.

### 1.4 — Optimizing context renders (10 min)
The main performance concern with Context: every consumer re-renders when the provider value changes.

Mitigation strategies:
1. **Split value and dispatch** — create two contexts per domain:
   ```typescript
   const CartStateContext = createContext<CartState | null>(null);
   const CartDispatchContext = createContext<CartDispatch | null>(null);
   ```
   Components that only dispatch (e.g., "Add to Cart" button) don't re-render when cart items change.

2. **Memoize the provider value:**
   ```typescript
   const value = useMemo(() => ({ items, totalItems, totalPrice }), [items]);
   ```

3. **Keep contexts focused** — the more focused, the fewer unnecessary re-renders

**Exercise:** Split CartContext into CartStateContext and CartDispatchContext. Build an "Add to Cart" button that uses only the dispatch context. Add render counters to verify: adding an item doesn't re-render the button itself.

### 1.5 — Custom hooks as the public API (10 min)
Every context should have a custom hook that enforces correct usage:
```typescript
function useCart() {
  const state = useContext(CartStateContext);
  if (!state) throw new Error('useCart must be used within a CartProvider');
  return state;
}

function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (!dispatch) throw new Error('useCartDispatch must be used within a CartProvider');
  return dispatch;
}

// Convenience hooks for common derived values
function useCartTotal() {
  const { items } = useCart();
  return useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
}
```

Cover:
- The custom hook is the public API — components never call `useContext` directly
- The error message catches missing providers immediately (developer experience)
- Derived values (totals, counts, filtered lists) live as convenience hooks
- This pattern scales: `useCart()`, `useFilters()`, `useUI()`, `useNotifications()`

**Exercise:** Build `useCart`, `useCartDispatch`, `useCartTotal`, `useCartItemCount` hooks. Refactor all cart consumers to use these hooks instead of `useContext` directly.

## Hour 2: Guided Building — Multi-Slice Store Architecture (60 min)

Walk the student through building a complete multi-slice state architecture for the embroidery store.

### Step 1 — CartContext with useReducer (15 min)
Build the cart domain:
```typescript
type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'APPLY_DISCOUNT'; code: string; percentage: number }
  | { type: 'CLEAR_CART' };

interface CartState {
  items: CartItem[];
  discount: { code: string; percentage: number } | null;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': { /* ... */ }
    case 'REMOVE_ITEM': { /* ... */ }
    case 'UPDATE_QUANTITY': { /* ... */ }
    case 'APPLY_DISCOUNT': { /* ... */ }
    case 'CLEAR_CART': return { items: [], discount: null };
  }
}
```

- Split into `CartStateContext` and `CartDispatchContext`
- Add localStorage persistence via useEffect
- Build hooks: `useCart`, `useCartDispatch`, `useCartTotal`, `useCartItemCount`

### Step 2 — FilterContext with useReducer (15 min)
Build the filter/search domain:
```typescript
type FilterAction =
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_CATEGORY'; category: string }
  | { type: 'SET_SORT'; sortBy: SortOption }
  | { type: 'SET_PRICE_RANGE'; min: number; max: number }
  | { type: 'RESET_FILTERS' };

interface FilterState {
  searchQuery: string;
  category: string;
  sortBy: SortOption;
  priceRange: { min: number; max: number };
}
```

- Hooks: `useFilters`, `useFilterDispatch`
- Derived hook: `useFilteredProducts(products: Product[])` that applies all active filters and sort
- Connect to `useSearchParams` from React Router — filters persist in the URL

### Step 3 — UIContext with useReducer (15 min)
Build the UI state domain:
```typescript
type UIAction =
  | { type: 'TOGGLE_CART_DRAWER' }
  | { type: 'OPEN_MODAL'; modalId: string }
  | { type: 'CLOSE_MODAL' }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'DISMISS_NOTIFICATION'; id: string }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' | 'system' };

interface UIState {
  cartDrawerOpen: boolean;
  activeModal: string | null;
  notifications: Notification[];
  theme: 'light' | 'dark' | 'system';
}
```

- Hooks: `useUI`, `useUIDispatch`, `useTheme`, `useNotifications`
- Theme persisted to localStorage
- Notifications auto-dismiss after 5 seconds (useEffect in the provider)

### Step 4 — Wiring it all together (15 min)
Build `AppProviders` composing all three contexts. Wire the embroidery store:
- Product catalog uses `useFilters` for search/category/sort and `useCartDispatch` for "Add to Cart"
- Cart drawer uses `useCart` for items and `useUI` for open/close state
- Header uses `useCartItemCount` for the badge, `useTheme` for the toggle, `useUI` for cart drawer toggle
- Show render counters: changing the theme does NOT re-render the product grid. Adding to cart does NOT re-render the filter bar.

## Hour 3: Independent Challenge (60 min)

**Challenge: Add an OrderContext that manages checkout state across the multi-step form from in the previous lesson.**

### Requirements:

**OrderContext state:**
```typescript
type OrderAction =
  | { type: 'SET_SHIPPING'; data: ShippingData }
  | { type: 'SET_PAYMENT'; data: PaymentData }
  | { type: 'SET_NOTES'; notes: string }
  | { type: 'ACCEPT_TERMS' }
  | { type: 'SUBMIT_ORDER' }
  | { type: 'ORDER_SUCCESS'; orderId: string }
  | { type: 'ORDER_FAILURE'; error: string }
  | { type: 'RESET_ORDER' };

interface OrderState {
  shipping: ShippingData | null;
  payment: PaymentData | null;
  notes: string;
  termsAccepted: boolean;
  status: 'idle' | 'submitting' | 'success' | 'error';
  orderId: string | null;
  error: string | null;
}
```

**Integration with the previous lesson's checkout form:**
- Replace the parent-level `useState` from the multi-step form with `OrderContext` + `useReducer`
- Each step dispatches its data to the OrderContext on "Next"
- The review step reads all data from `useOrder()`
- "Place Order" dispatches `SUBMIT_ORDER`, then `ORDER_SUCCESS` or `ORDER_FAILURE`
- On success, dispatch `CLEAR_CART` to CartContext (cross-context interaction)

**Cross-context interaction pattern:**
- When an order is placed successfully, the cart should be cleared
- Show this by dispatching to both OrderContext and CartContext from the checkout component
- This is the main pattern for cross-context communication: the component that triggers the action dispatches to both contexts

**Hooks to build:**
- `useOrder()` — full order state
- `useOrderDispatch()` — dispatch function
- `useOrderStatus()` — just the status for the submit button
- `useIsOrderComplete()` — derived: all steps filled, terms accepted

### Acceptance criteria:
- OrderContext manages all checkout state with a reducer
- All order types are derived from Zod schemas (from in the previous lesson)
- The multi-step form uses `useOrder` and `useOrderDispatch` instead of local state
- Cross-context interaction: successful order clears the cart
- Order status transitions are correct: idle -> submitting -> success/error
- Render counters show: updating shipping info doesn't re-render the cart
- The order can be reset and started over
- TypeScript types are complete — no `any`

## Hour 4: Review & Stretch Goals (60 min)

### Code Review (20 min)
Review the full multi-slice architecture. Check for:
- Is each context focused on one domain? (no leaking concerns)
- Are state and dispatch split into separate contexts where beneficial?
- Are custom hooks used consistently? (no raw `useContext` calls in components)
- Are reducers handling all action types exhaustively?
- Is cross-context communication clean? (dispatching from components, not importing contexts into each other)
- Are render counters showing proper isolation? (changing one context doesn't re-render consumers of another)

### Discussion: When would you reach for a library? (15 min)
Discuss when Context + useReducer hits its limits:
- **Context + useReducer:** When you need truly global state shared across deeply nested trees with frequent updates and want minimal boilerplate. Context + useReducer stores live outside React and have built-in selectors for render optimization.
- **Redux Toolkit:** When you have a large team that benefits from strict patterns, middleware (thunks, sagas), and time-travel debugging.
- **Jotai/Recoil:** When you have many independent atoms of state that compose together.

The key point: "For most apps — including this store — Context + useReducer is enough. You now know the fundamentals that ALL state management libraries build on. When you encounter Context + useReducer or Redux at a job, you'll understand what they're doing under the hood."

Ask: "Which parts of our store would benefit most from a library? Which parts are perfectly fine with Context?"

### Stretch Goal (20 min)
If time remains: Add optimistic updates to the cart. When the customer updates a quantity, immediately update the UI (optimistic), then "confirm" with a simulated API call. If the API fails, roll back to the previous state. This requires the reducer to support a `ROLLBACK` action type and a snapshot pattern. Connect to the `useOptimistic` hook from React 19 in Lesson 1.

### Wrap-up (5 min)
**Three key takeaways:**
1. Split state by domain, not by component — CartContext, FilterContext, UIContext, OrderContext each own one concern
2. Context + useReducer scales well when you follow the patterns: split state/dispatch, use custom hooks, keep contexts focused, memoize provider values
3. You now understand the state management fundamentals that underpin every library — when you see Context + useReducer or Redux at work, you'll know exactly what problem they solve and what they're doing underneath

**Preview of in the next lesson:** Testing React components with Vitest and React Testing Library. We'll write tests for the components and contexts built this module — reducers, custom hooks, and state-dependent UIs.

**Coming up next:** State is organized, forms validate, React 19 features are in place. But how do you know it all actually works? Manually clicking through the store after every change does not scale. Next up: automated testing with Vitest and React Testing Library — the safety net that catches bugs before users do.

## Checklist

Before moving to the next day, ALL items must be checked:

- [ ] Can explain the "god context" anti-pattern and why splitting contexts by domain is better
- [ ] Built CartContext with useReducer, split state/dispatch contexts, and custom hooks
- [ ] Built FilterContext with useReducer, connected to URL search params via React Router
- [ ] Built UIContext managing cart drawer, modals, notifications, and theme
- [ ] Composed all providers into an AppProviders wrapper
- [ ] Built OrderContext managing multi-step checkout state with a reducer
- [ ] Implemented cross-context interaction (successful order clears cart)
- [ ] Render counters verify proper context isolation (theme change doesn't re-render product grid)
- [ ] Custom hooks (`useCart`, `useFilters`, `useUI`, `useOrder`) used as public API — no raw `useContext`
- [ ] Can explain when you would reach for a state management library vs Context + useReducer, in own words
- [ ] All exercise code saved in `workspace/week-09/day-3/`

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
- Use embroidery analogies: "Each context is like a separate thread spool — the cart thread, the filter thread, the UI thread. They run in parallel without tangling."
- If the student is flying through material, skip ahead; if struggling, add more examples
- Production-quality code always — no toy examples
