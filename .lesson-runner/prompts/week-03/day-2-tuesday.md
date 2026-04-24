# Lesson 2 (Module 3) — Modules, Closures & Scope

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work.

**Previous days completed:**
- Module 1: HTML5 semantics, accessibility, CSS flexbox/grid/responsive, JavaScript basics (variables, types, functions, arrays, objects, array methods), ES2024+ features (destructuring, spread, optional chaining). Built static embroidery store landing page with product data and filtering/sorting functions.
- Module 2: DOM manipulation (querySelector, createElement, DocumentFragment), events (addEventListener, bubbling, event delegation with closest()), forms (FormData, custom validation), modern JS (destructuring, spread, optional chaining, nullish coalescing, template literals, Map/Set). Built interactive store v1 with filtering, sorting, search, cart drawer, contact form.
- Module 3, Lesson 1: HTTP fundamentals (methods, status codes, headers, CORS), Promises (states, chaining, all/race/allSettled), async/await, fetch API. Store now fetches products from mock API with loading skeleton and error states.

**Today's focus:** ES Modules, closures, scope chain, and the event loop
**Today's build:** Refactor the store into clean ES modules (products.js, cart.js, ui.js, api.js)

**Story so far:** The store fetches data from an API -- that is a major step. But open the main JavaScript file: cart logic, product rendering, API calls, event handlers, utility functions -- all mixed together in one file. As the code grows, this becomes unmaintainable. Today the student learns ES modules to split the code into focused files, closures to keep state private, and the event loop to understand how JavaScript actually runs all of this.

**Work folder:** `workspace/vanilla-store`

## Hour 1: ES Modules (60 min)

### Why Modules?

Open the store's main JavaScript file. Ask: "How many lines is this? How many different concerns does it handle?" (Probably 300-500+ lines handling API, cart, rendering, events, utilities.)

"Imagine three developers need to work on this file at the same time -- one on the cart, one on the UI, one on the API. They would constantly conflict. Modules solve this by giving each concern its own file with a clear boundary."

### import and export

```javascript
// products.js -- named exports
export function filterByCategory(products, category) {
  if (category === "all") return products;
  return products.filter(p => p.category === category);
}

export function sortProducts(products, sortBy) {
  const sorted = [...products];
  switch (sortBy) {
    case "price-asc": return sorted.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc": return sorted.sort((a, b) => b.priceCents - a.priceCents);
    case "name": return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating": return sorted.sort((a, b) => b.rating - a.rating);
    default: return sorted;
  }
}

export function searchProducts(products, query) {
  if (!query) return products;
  const lower = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower)
  );
}
```

```javascript
// app.js -- importing
import { filterByCategory, sortProducts, searchProducts } from "./products.js";
```

### Named vs Default Exports

```javascript
// Named exports (preferred -- explicit, refactor-friendly)
export function formatPrice(cents) { return `$${(cents / 100).toFixed(2)}`; }
export function formatDate(date) { /* ... */ }

// Import named:
import { formatPrice, formatDate } from "./utils/format.js";

// Default export (one per module -- used for "the main thing")
// cart.js
export default function createCart() {
  // ...
}

// Import default:
import createCart from "./cart.js";
// Note: you can name it anything: import makeCart from "./cart.js"

// Mixing named and default:
import createCart, { CART_STORAGE_KEY } from "./cart.js";
```

Ask: "When should you use default vs named exports?" (Use named exports by default -- they are explicit and auto-import-friendly. Use default when a module has one obvious main export, like a class or a factory function.)

### Re-exports and Barrel Files

```javascript
// utils/index.js -- re-export from multiple modules
export { formatPrice, formatDate } from "./format.js";
export { debounce } from "./debounce.js";
export { createElement, qs, qsa } from "./dom.js";

// Now consumers import from one place:
import { formatPrice, debounce, qs } from "./utils/index.js";
```

Ask: "When are barrel files helpful? When do they cause problems?" (Helpful for organizing a public API. Problematic when they cause circular dependencies or bundle unnecessary code.)

### Module Behavior

Important facts about ES modules:
1. Modules run in strict mode automatically
2. Each module has its own scope (variables don't leak to global)
3. Modules are loaded once and cached -- importing the same module twice gives the same instance
4. `import` statements are hoisted (they run before any module code)
5. Imports are live bindings (not copies)

```html
<!-- Using modules in HTML -->
<script type="module" src="./scripts/app.js"></script>
<!-- type="module" enables import/export syntax -->
<!-- Modules are deferred by default (run after DOM is parsed) -->
```

**Exercise:** Plan the module structure for the embroidery store. The student should list every function in the current codebase and decide which module it belongs to:

```
scripts/
  app.js           -- entry point, wires everything together
  products.js      -- filterByCategory, sortProducts, searchProducts, getCategories
  cart.js          -- addToCart, removeFromCart, updateQuantity, getCartSubtotal, clearCart
  api.js           -- fetchProducts, fetchJSON
  ui/
    product-grid.js -- renderProducts, createProductCard, renderLoadingSkeleton
    cart-drawer.js  -- renderCart, openCartDrawer, closeCartDrawer
    filters.js      -- setupFilters (category buttons, sort dropdown, search input)
  utils/
    format.js       -- formatPrice
    debounce.js     -- debounce
    dom.js          -- qs, qsa (querySelector shortcuts)
```

**Confidence check.** Can the student explain named vs default exports and plan a module structure? (1-5)

## Hour 2: Closures and Scope (60 min)

### Scope: Where Variables Live

```javascript
// Global scope -- accessible everywhere (avoid!)
const STORE_NAME = "Embroidery Studio";

function renderStore() {
  // Function scope
  const products = [];

  if (true) {
    // Block scope (let/const)
    const message = "Loading...";
    var legacyFlag = true; // var ignores block scope! (function-scoped)
  }

  console.log(legacyFlag);  // true -- var leaked out of the block
  // console.log(message);  // ReferenceError -- const stays in the block
}
```

### The Temporal Dead Zone

```javascript
// let/const are hoisted but NOT initialized
console.log(price); // ReferenceError: Cannot access 'price' before initialization
let price = 3499;

// var is hoisted AND initialized (to undefined)
console.log(name); // undefined (no error, just undefined)
var name = "Floral Tee";
```

Ask: "Why is `var`'s behavior worse? Which would you rather have -- an error or a silent `undefined`?"

### Closures: Functions That Remember

A closure is a function that has access to variables from its outer scope, even after the outer function has returned.

```javascript
function createCartCounter() {
  let count = 0; // private -- only accessible through the returned functions

  return {
    add(n = 1) {
      count += n;
      return count;
    },
    remove(n = 1) {
      count = Math.max(0, count - n);
      return count;
    },
    getCount() {
      return count;
    },
    reset() {
      count = 0;
      return count;
    }
  };
}

const counter = createCartCounter();
console.log(counter.add(3));     // 3
console.log(counter.remove(1));  // 2
console.log(counter.getCount()); // 2
// console.log(counter.count);   // undefined! count is private
```

Ask: "Can anyone access `count` directly from outside? Why not?" (No -- `count` exists only inside `createCartCounter`'s scope. The returned methods can access it because they close over that scope.)

### The Classic Loop Bug

```javascript
// Bug with var:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("Product", i), 100);
}
// Prints: "Product 3", "Product 3", "Product 3"
// Why? var is function-scoped. By the time setTimeout fires, the loop is done and i === 3.

// Fix 1: use let (block-scoped -- each iteration gets its own i)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log("Product", i), 100);
}
// Prints: "Product 0", "Product 1", "Product 2"

// Fix 2: IIFE (creates a closure for each iteration -- the old way)
for (var i = 0; i < 3; i++) {
  ((index) => {
    setTimeout(() => console.log("Product", index), 100);
  })(i);
}
```

**Exercise:** Predict the output of each and explain why:
```javascript
// 1.
function createDiscountCalculator(percent) {
  return (priceCents) => Math.round(priceCents * (1 - percent / 100));
}
const tenOff = createDiscountCalculator(10);
const twentyOff = createDiscountCalculator(20);
console.log(tenOff(3499));    // ?
console.log(twentyOff(3499)); // ?
// Each function closes over a different `percent` value

// 2.
function createProductTracker() {
  const viewed = [];
  return {
    view(productId) { viewed.push(productId); },
    getViewed() { return [...viewed]; }, // return copy, not reference
    getCount() { return viewed.length; }
  };
}
const tracker = createProductTracker();
tracker.view(1);
tracker.view(5);
tracker.view(1);
console.log(tracker.getViewed()); // ?
console.log(tracker.getCount());   // ?
```

### Practical Closure Patterns

Show closures in use for the store:

```javascript
// 1. Debounce (student built this before -- now they understand WHY it works)
function debounce(fn, delay) {
  let timerId = null; // persists between calls via closure
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

// 2. Cache with TTL
function createCache(ttlMs = 60000) {
  const entries = new Map(); // private via closure

  return {
    get(key) {
      const entry = entries.get(key);
      if (!entry) return undefined;
      if (Date.now() > entry.expiresAt) {
        entries.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value) {
      entries.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
    clear() {
      entries.clear();
    }
  };
}

// 3. Once -- run a function only once
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
const initStore = once(async () => {
  const products = await fetchProducts();
  renderProducts(products);
});
// Calling initStore() multiple times only runs the function once
```

**Exercise:** Implement `createCache` and `once` for the store. Use the cache to avoid re-fetching products.json within 5 minutes.

**Confidence check.** Can the student explain what a closure is, identify private state in closure patterns, and predict output in closure exercises? (1-5)

## Hour 3: The Event Loop (60 min)

### The JavaScript Runtime Model

JavaScript is single-threaded. It can only do one thing at a time. But it needs to handle fetch responses, setTimeout callbacks, user clicks, and DOM updates. The event loop makes this work.

Draw the mental model:
```
┌─────────────────────────────────────────┐
│              Call Stack                  │
│  (currently executing code)             │
│  Only one thing at a time               │
└─────────────┬───────────────────────────┘
              │
              │  When stack is empty, check queues:
              │
┌─────────────▼───────────────────────────┐
│           Microtask Queue               │
│  (Promise.then, queueMicrotask)         │
│  ALWAYS drained first, before           │
│  any macrotask                          │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│           Macrotask Queue               │
│  (setTimeout, setInterval, DOM events)  │
│  One at a time, between microtask       │
│  drains and render cycles               │
└─────────────────────────────────────────┘
```

### Predict the Output

```javascript
console.log("1: Page loading");

setTimeout(() => console.log("2: Analytics loaded"), 0);

Promise.resolve().then(() => console.log("3: Products data ready"));

queueMicrotask(() => console.log("4: Cart state restored"));

Promise.resolve()
  .then(() => {
    console.log("5: Rendering products");
    return Promise.resolve();
  })
  .then(() => console.log("6: Products on screen"));

setTimeout(() => console.log("7: Track page view"), 0);

console.log("8: Store initialized");
```

Walk through this step by step:
1. Synchronous code runs first: "1: Page loading", "8: Store initialized"
2. Microtask queue drains completely: "3", "4", "5", then "6" (the chained .then)
3. First macrotask: "2: Analytics loaded"
4. Second macrotask: "7: Track page view"

Final order: 1, 8, 3, 4, 5, 6, 2, 7

**Exercise:** Have the student predict the order before revealing the answer. Then modify the example (swap some lines, add more .then chains) and predict again.

### Why This Matters for the Store

```javascript
// Problem: processing 1000 products freezes the UI
function processAllProducts(products) {
  products.forEach(product => {
    // Heavy computation: calculate discounts, apply filters, generate HTML
    heavyComputation(product);
  });
  // While this runs, the UI is completely frozen -- no clicks, no scrolling
}

// Solution: process in chunks, yielding to the browser between chunks
async function processInChunks(products, chunkSize = 50) {
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    chunk.forEach(product => heavyComputation(product));

    // Yield to the browser -- lets it handle clicks, render frames
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
```

Ask: "Why does `setTimeout(resolve, 0)` yield to the browser even though the delay is 0?" (Because setTimeout creates a macrotask. The browser can handle pending events and render a frame before running the next macrotask.)

### requestAnimationFrame

```javascript
// For visual updates, use requestAnimationFrame instead of setTimeout
function animateCartBadge(badge) {
  badge.classList.add("bump");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      badge.classList.remove("bump");
    });
  });
  // Two rAF calls: one to apply the change, one to remove it on the next frame
}
```

**Exercise:** Explain why this double-rAF pattern works for animations.

## Hour 4: Build -- Refactor the Store into Modules (60 min)

### The Goal
Split the store's monolithic JavaScript into focused ES modules. Use closures for encapsulation in the cart module.

### Step 1: Set Up Module Structure

Create the file structure:

```
scripts/
  app.js           -- entry point
  products.js      -- filter, sort, search functions
  cart.js          -- cart state + operations (using closures)
  api.js           -- fetch functions
  ui/
    product-grid.js -- product rendering
    cart-drawer.js  -- cart drawer rendering + open/close
    filters.js      -- filter UI setup
  utils/
    format.js       -- formatPrice
    debounce.js     -- debounce function
```

Update the HTML to use `type="module"`:
```html
<script type="module" src="./scripts/app.js"></script>
```

### Step 2: Extract cart.js with Closures

```javascript
// cart.js
import { formatPrice } from "./utils/format.js";

export function createCart() {
  let items = []; // private via closure
  const listeners = new Set();

  function notify() {
    const state = getState();
    listeners.forEach(fn => fn(state));
  }

  function getState() {
    return {
      items: items.map(item => ({ ...item })), // return copies
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotalCents: items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    };
  }

  return {
    addItem(product, quantity = 1) {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({
          productId: product.id,
          name: product.name,
          priceCents: product.priceCents,
          quantity
        });
      }
      notify();
    },

    removeItem(productId) {
      items = items.filter(i => i.productId !== productId);
      notify();
    },

    updateQuantity(productId, quantity) {
      if (quantity < 1) return this.removeItem(productId);
      const item = items.find(i => i.productId === productId);
      if (item) item.quantity = quantity;
      notify();
    },

    clear() { items = []; notify(); },
    getState,

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn); // return unsubscribe function
    }
  };
}
```

### Step 3: Extract Remaining Modules

The student extracts each module, testing after each extraction:
1. `products.js` -- pure functions, no state
2. `api.js` -- fetch functions with caching via closure
3. `utils/format.js` -- formatPrice
4. `utils/debounce.js` -- debounce
5. `ui/product-grid.js` -- renderProducts, createProductCard, renderLoadingSkeleton
6. `ui/cart-drawer.js` -- renderCart, openCartDrawer, closeCartDrawer
7. `ui/filters.js` -- filter/sort/search UI setup

### Step 4: Wire Everything in app.js

```javascript
// app.js
import { createCart } from "./cart.js";
import { fetchProducts } from "./api.js";
import { filterByCategory, sortProducts, searchProducts } from "./products.js";
import { renderProducts, renderLoadingSkeleton } from "./ui/product-grid.js";
import { renderCart, openCartDrawer, closeCartDrawer } from "./ui/cart-drawer.js";
import { setupFilters } from "./ui/filters.js";
import { formatPrice } from "./utils/format.js";

const cart = createCart();
let allProducts = [];

async function init() {
  renderLoadingSkeleton();

  try {
    allProducts = await fetchProducts();
    renderProducts(allProducts);
    setupFilters(allProducts, (filtered) => renderProducts(filtered));

    cart.subscribe((state) => {
      renderCart(state);
      updateCartBadge(state.count);
    });
  } catch (error) {
    renderError(error.message);
  }
}

init();
```

Demonstrate that closures for cart state encapsulation mean no external code can directly mutate the items array.

### Key Takeaways
1. ES modules create clear boundaries between concerns. Each file has one job, one set of exports, and explicit dependencies via import statements. This is how every React project is organized.
2. Closures give you real privacy in JavaScript. The cart module's `items` array cannot be accessed or mutated from outside -- only through the exported methods. This is exactly how React hooks (useState, useReducer) store state internally.
3. The event loop explains why Promise.then runs before setTimeout, why long computations freeze the UI, and why `await` yields to the browser. Understanding this is essential for debugging async issues in any framework.

### Coming Up Next
The store is modular and the cart uses closures for encapsulation. But try turning off the internet and refreshing -- the store crashes. Or close the tab and reopen it -- the cart is empty. In the next lesson, the student learns error handling (try/catch patterns, custom errors) and persistence (localStorage), making the store resilient to failures and preserving state across sessions.

## Student Support

### Before You Start
Open `workspace/vanilla-store` and start from the last committed version of the store. Run the project if this is a build lesson, then make sure the previous lesson's checklist is complete.

**Folder:** `workspace/vanilla-store`

### Where This Fits
You are growing the vanilla JavaScript version of the embroidery store. The goal is to understand the platform before frameworks enter the picture.

### Expected Outcome
By the end of this lesson, the student should have: **Refactor the store into clean ES modules (products.js, cart.js, ui.js, api.js)**.

### Acceptance Criteria
- You can explain today's focus in your own words: ES Modules, closures, scope chain, and the event loop.
- The expected outcome is present and reviewable: Refactor the store into clean ES modules (products.js, cart.js, ui.js, api.js).
- Any code or project notes are saved under `workspace/vanilla-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: ES Modules, closures, scope chain, and the event loop. Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
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
- [ ] Can explain named exports, default exports, and re-exports
- [ ] Understands module behavior: strict mode, own scope, cached imports, live bindings
- [ ] Set up `type="module"` on the script tag
- [ ] Can explain scope levels: block, function, module, global
- [ ] Can explain the temporal dead zone for let/const vs var hoisting
- [ ] Can define a closure and explain why the inner function can access outer variables
- [ ] Predicted output for closure exercises: cart counter, discount calculator, loop bug
- [ ] Built closure patterns: debounce (understanding why it works), cache with TTL, once
- [ ] Predicted exact event loop output order and can explain microtask vs macrotask priority
- [ ] Refactored the store into ES modules: cart.js, products.js, api.js, ui/, utils/
- [ ] Cart module uses closures for private state (items array not directly accessible)
- [ ] All modules have clean import/export boundaries
- [ ] All code saved in `workspace/vanilla-store`

## Personality Reminder

Remember: you are a warm, friendly human tutor — not a textbook. Start with a greeting. Use humor. Get excited when the student gets something right. One concept at a time, then STOP and wait. Make this fun.

## Teaching Rules
- Lead with discovery -- show the problem before the solution
- When the student is close: ask a Socratic question to help them see it
- When the student is way off: be direct but kind, break it into smaller pieces
- Never say "it's easy" or "it's simple"
- Specific praise: "Nice, you caught that X" not just "Good job"
- Confidence check every 15-20 min (1-5 scale, below 3 = slow down)
- Connect concepts to the embroidery store whenever natural
- Use embroidery analogies when they fit
- If the student is flying through material, skip ahead; if struggling, add more examples
- Production-quality code always -- no toy examples
