# Lesson 4 (Module 2) — Modern JavaScript + Cart Drawer

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work.

**Previous days completed:**
- Module 1: HTML5 semantics, accessibility, CSS flexbox/grid/responsive, JavaScript basics (variables, types, functions, arrays, objects, array methods), ES2024+ features (destructuring, spread, optional chaining). Built static embroidery store landing page with product data and filtering/sorting functions.
- Module 2, Lesson 1: DOM manipulation -- querySelector, createElement, DocumentFragment, textContent vs innerHTML. Built dynamic product catalog rendered from JS data array.
- Module 2, Lesson 2: Events -- addEventListener, event object, bubbling, capturing, stopPropagation. Event delegation with closest(). Built "Add to Cart" with event delegation and cart count display.
- Module 2, Lesson 3: Forms -- HTML form elements, FormData API, custom validation, real-time validation. Built contact form with conditional fields and newsletter signup.

**Today's focus:** Modern JavaScript features in depth + building a sliding cart drawer
**Today's build:** Store refactored with modern JS + working cart drawer with add/remove/update quantity

**Story so far:** The store renders products, handles clicks, and has forms. But the cart is just a number in the header -- there is no way to see what is in it, change quantities, or remove items. The student also has not practiced modern JavaScript deeply enough to use it fluently. Today covers both: modern JS patterns that make code cleaner, and a real cart drawer UI.

**Work folder:** `workspace/vanilla-store`

## Hour 1: Destructuring, Spread, and Modern Patterns (60 min)

### Destructuring -- Arrays

Array destructuring pulls values out by position:

```javascript
// Basic
const [first, second, third] = ["t-shirts", "hoodies", "accessories"];
console.log(first);  // "t-shirts"
console.log(second); // "hoodies"

// Skip values
const [, , thirdCategory] = ["t-shirts", "hoodies", "accessories"];
console.log(thirdCategory); // "accessories"

// Rest pattern: collect remaining items
const [featured, ...rest] = products;
console.log(featured);  // first product
console.log(rest);      // array of remaining products

// Default values
const [primary = "none", secondary = "none"] = ["gold"];
console.log(primary);   // "gold"
console.log(secondary);  // "none" (default because no second element)

// Swap values
let sortBy = "price";
let sortDirection = "asc";
[sortBy, sortDirection] = [sortDirection, sortBy];
// sortBy = "asc", sortDirection = "price"
```

**Exercise:** Using the store's product data:
```javascript
const topProducts = [
  { name: "Floral Tee", priceCents: 3499 },
  { name: "Mountain Hoodie", priceCents: 5999 },
  { name: "Canvas Tote", priceCents: 2499 }
];

// 1. Destructure the first product into `bestSeller` and the rest into `otherTop`
// 2. Swap the first and second elements without a temp variable
// 3. Get only the third product, ignoring the first two
```

### Destructuring -- Objects

Object destructuring pulls values out by name:

```javascript
const product = {
  id: 1,
  name: "Embroidered Floral Tee",
  priceCents: 3499,
  category: "t-shirts",
  details: {
    material: "100% cotton",
    embroideryType: "satin stitch",
    careInstructions: "Machine wash cold"
  }
};

// Basic
const { name, priceCents, category } = product;

// Renaming (when the property name conflicts or is unclear)
const { name: productName, priceCents: rawPrice } = product;

// Default values
const { rating = 0, reviewCount = 0 } = product;

// Nested destructuring
const { details: { material, embroideryType } } = product;
console.log(material); // "100% cotton"

// Combined: nested + rename + default
const { details: { careInstructions: care = "See label" } } = product;
```

**Exercise:** Destructure this cart item in multiple ways:
```javascript
const cartItem = {
  productId: 1,
  name: "Floral Tee",
  priceCents: 3499,
  quantity: 2,
  options: { size: "M", color: "white", embroideryText: "Hello" }
};

// 1. Pull out name, quantity, and priceCents
// 2. Pull out size and color from options (nested destructuring)
// 3. Pull out embroideryText with a default of "" (empty string) in case it's missing
// 4. Rename productId to just id
```

### Destructuring in Function Parameters

This is extremely common in real code:

```javascript
// Instead of:
function renderProduct(product) {
  const name = product.name;
  const priceCents = product.priceCents;
  // ...
}

// Destructure in the parameter:
function renderProduct({ name, priceCents, category, inStock = true }) {
  console.log(`${name}: $${(priceCents / 100).toFixed(2)}`);
}

// Works with arrays too:
function getFirstAndLast([first, ...middle]) {
  const last = middle.pop();
  return { first, last };
}
```

### Spread Operator

```javascript
// Spread arrays: expand elements
const tShirts = products.filter(p => p.category === "t-shirts");
const hoodies = products.filter(p => p.category === "hoodies");
const allClothing = [...tShirts, ...hoodies];

// Clone an array (shallow)
const productsCopy = [...products];

// Spread objects: merge/override properties
const defaultOptions = { size: "M", color: "white", quantity: 1 };
const userOptions = { color: "navy", quantity: 2 };
const finalOptions = { ...defaultOptions, ...userOptions };
// { size: "M", color: "navy", quantity: 2 }

// Update a specific property immutably
const updatedProduct = { ...product, priceCents: 2999 };

// Update nested property immutably
const updatedProduct2 = {
  ...product,
  details: { ...product.details, material: "organic cotton" }
};
```

**Exercise:** Use spread to:
1. Combine two category arrays into one
2. Clone the cart array and add a new item without mutating the original
3. Update a product's price without changing the original object
4. Merge default cart settings with user preferences

### Rest Parameters

```javascript
// Collect remaining arguments
function logCartAction(action, ...productIds) {
  console.log(`Action: ${action}`);
  console.log(`Products: ${productIds.join(", ")}`);
}
logCartAction("add", 1, 5, 12);

// Collect remaining object properties
const { id, name, ...productDetails } = product;
console.log(productDetails); // everything except id and name
```

**Confidence check.** Can the student destructure arrays and objects, use spread for immutable updates, and use rest for collecting values? (1-5)

## Hour 2: Optional Chaining, Nullish Coalescing, and Modern Methods (60 min)

### Optional Chaining (?.)

Safely access deeply nested properties without checking every level:

```javascript
const product = {
  id: 1,
  name: "Floral Tee",
  reviews: null, // reviews haven't loaded yet
  customization: {
    embroideryText: "Hello World"
  }
};

// Without optional chaining:
const firstReview = product.reviews && product.reviews[0] && product.reviews[0].text;

// With optional chaining:
const firstReview2 = product.reviews?.[0]?.text;
// Returns undefined instead of throwing an error

// Works with method calls too:
const upperName = product.getName?.(); // undefined if getName doesn't exist

// Real store scenarios:
const reviewCount = product.reviews?.length ?? 0;
const embText = product.customization?.embroideryText;
const firstColor = product.colors?.[0] ?? "default";
```

### Nullish Coalescing (??)

Provide a default value only for `null` or `undefined` (not for `0`, `""`, or `false`):

```javascript
// The problem with ||:
const quantity = 0;
const displayQuantity = quantity || 1; // 1 -- WRONG! 0 is a valid quantity

// ?? only falls back for null/undefined:
const displayQuantity2 = quantity ?? 1; // 0 -- CORRECT!

// Real store examples:
const rating = product.rating ?? 0;          // 0 rating is valid, don't replace it
const stock = product.stockCount ?? "N/A";   // 0 stock is valid info
const discount = product.discountPercent ?? 0; // 0% discount is valid
const searchQuery = params.get("q") ?? "";    // empty string is a valid search

// Combine with optional chaining:
const reviewText = product.reviews?.[0]?.text ?? "No reviews yet";
const shippingCost = order.shipping?.cost ?? "Free";
```

Ask: "What is the difference between `product.rating || 5` and `product.rating ?? 5` when `product.rating` is `0`?" (With `||`, you get `5` because `0` is falsy. With `??`, you get `0` because it is not `null` or `undefined`.)

### Template Literals (Advanced)

Beyond basic string interpolation:

```javascript
// Multi-line strings for HTML templates
const cartItemHTML = `
  <div class="cart-item" data-product-id="${item.productId}">
    <div class="cart-item-info">
      <h4 class="cart-item-name">${item.name}</h4>
      <p class="cart-item-price">$${(item.priceCents / 100).toFixed(2)}</p>
    </div>
    <div class="cart-item-quantity">
      <button class="qty-decrease" aria-label="Decrease quantity">-</button>
      <span class="qty-value">${item.quantity}</span>
      <button class="qty-increase" aria-label="Increase quantity">+</button>
    </div>
    <p class="cart-item-total">$${((item.priceCents * item.quantity) / 100).toFixed(2)}</p>
    <button class="cart-item-remove" aria-label="Remove ${item.name} from cart">&times;</button>
  </div>
`;

// Conditional content in templates
const stockBadge = `
  <span class="stock-badge ${product.inStock ? "in-stock" : "out-of-stock"}">
    ${product.inStock ? "In Stock" : "Out of Stock"}
  </span>
`;

// Expression evaluation
const priceDisplay = `$${(priceCents / 100).toFixed(2)} ${discountPercent > 0 ? `(${discountPercent}% off)` : ""}`.trim();
```

### Map and Set

```javascript
// Map: like an object but keys can be anything, and it preserves insertion order
const cartMap = new Map();
cartMap.set(1, { name: "Floral Tee", quantity: 2 });
cartMap.set(5, { name: "Canvas Tote", quantity: 1 });

console.log(cartMap.get(1));    // { name: "Floral Tee", quantity: 2 }
console.log(cartMap.has(1));    // true
console.log(cartMap.size);      // 2
cartMap.delete(5);

// Iteration
for (const [productId, item] of cartMap) {
  console.log(`Product ${productId}: ${item.quantity}x ${item.name}`);
}

// Set: unique values only
const viewedProducts = new Set();
viewedProducts.add(1);
viewedProducts.add(5);
viewedProducts.add(1); // ignored -- already in set
console.log(viewedProducts.size); // 2

// Get unique categories from products
const categories = [...new Set(products.map(p => p.category))];
```

### Modern Array Methods

```javascript
// at() -- negative indexing
const lastProduct = products.at(-1);
const secondToLast = products.at(-2);

// findLast() / findLastIndex() -- search from the end
const lastExpensive = products.findLast(p => p.priceCents > 5000);
const lastExpensiveIndex = products.findLastIndex(p => p.priceCents > 5000);

// Object.groupBy() -- group products by category
const grouped = Object.groupBy(products, p => p.category);
// { "t-shirts": [...], "hoodies": [...], "accessories": [...] }

// structuredClone() -- deep clone (handles nested objects, dates, maps)
const cartBackup = structuredClone(cart);
// Unlike {...cart} or [...cart], this clones nested objects too
```

**Exercise:** Use these modern methods on the store's product data:
1. Get the last product in the array with `at(-1)`
2. Find the last in-stock product with `findLast()`
3. Group all products by category with `Object.groupBy()`
4. Deep clone the cart with `structuredClone()`, modify the clone, verify the original is unchanged

**Confidence check.** Does the student feel comfortable using optional chaining, nullish coalescing, and the modern array methods? (1-5)

## Hour 3: Build -- Sliding Cart Drawer (60 min)

### The Goal
Build a sliding cart drawer that opens from the right side of the page, showing all cart items with the ability to update quantities and remove items. Use modern JS throughout.

### Step 1: Cart Drawer HTML

Add the drawer markup to the page:

```html
<aside class="cart-drawer" id="cart-drawer" aria-label="Shopping Cart" aria-hidden="true">
  <div class="cart-drawer-header">
    <h2>Your Cart</h2>
    <button class="cart-drawer-close" aria-label="Close cart">&times;</button>
  </div>
  <div class="cart-drawer-items" id="cart-items">
    <!-- Cart items rendered by JS -->
  </div>
  <div class="cart-drawer-footer">
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <span class="subtotal-amount" id="cart-subtotal">$0.00</span>
    </div>
    <button class="checkout-btn" id="checkout-btn" disabled>Checkout</button>
    <button class="clear-cart-btn" id="clear-cart-btn">Clear Cart</button>
  </div>
</aside>
<div class="cart-overlay" id="cart-overlay" aria-hidden="true"></div>
```

### Step 2: Cart Drawer CSS

```css
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(400px, 90vw);
  height: 100vh;
  background: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.cart-drawer.open {
  transform: translateX(0);
}

.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 999;
}

.cart-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}
```

### Step 3: Cart Data Management

Refactor the cart from Lesson 2 with modern JS:

```javascript
let cart = [];

function addToCart(productId) {
  const product = products.find(p => p.id === Number(productId));
  if (!product) return;

  const existing = cart.find(item => item.productId === product.id);
  if (existing) {
    cart = cart.map(item =>
      item.productId === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    cart = [...cart, {
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents,
      quantity: 1
    }];
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== Number(productId));
  renderCart();
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(productId);
    return;
  }
  cart = cart.map(item =>
    item.productId === Number(productId)
      ? { ...item, quantity: newQuantity }
      : item
  );
  renderCart();
}

function getCartSubtotal() {
  return cart.reduce((sum, { priceCents, quantity }) => sum + priceCents * quantity, 0);
}

function clearCart() {
  cart = [];
  renderCart();
}
```

### Step 4: Render Cart Items

Use template literals and modern JS to render cart contents:

```javascript
function renderCart() {
  const container = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty</p>
        <button class="continue-shopping-btn">Continue Shopping</button>
      </div>
    `;
    subtotalEl.textContent = "$0.00";
    checkoutBtn.disabled = true;
    updateCartCount();
    return;
  }

  container.innerHTML = cart.map(({ productId, name, priceCents, quantity }) => `
    <div class="cart-item" data-product-id="${productId}">
      <div class="cart-item-info">
        <h4>${name}</h4>
        <p>$${(priceCents / 100).toFixed(2)} each</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn qty-decrease" data-action="decrease" aria-label="Decrease quantity of ${name}">-</button>
        <span class="qty-value" aria-label="Quantity: ${quantity}">${quantity}</span>
        <button class="qty-btn qty-increase" data-action="increase" aria-label="Increase quantity of ${name}">+</button>
      </div>
      <p class="cart-item-total">$${((priceCents * quantity) / 100).toFixed(2)}</p>
      <button class="cart-item-remove" data-action="remove" aria-label="Remove ${name} from cart">&times;</button>
    </div>
  `).join("");

  const subtotal = getCartSubtotal();
  subtotalEl.textContent = `$${(subtotal / 100).toFixed(2)}`;
  checkoutBtn.disabled = false;
  updateCartCount();
}
```

### Step 5: Cart Drawer Events (Event Delegation)

Wire up all cart interactions with a single delegated listener:

```javascript
document.getElementById("cart-drawer").addEventListener("click", (e) => {
  // Close button
  if (e.target.closest(".cart-drawer-close")) {
    closeCartDrawer();
    return;
  }

  // Continue shopping (from empty cart)
  if (e.target.closest(".continue-shopping-btn")) {
    closeCartDrawer();
    return;
  }

  // Quantity decrease
  if (e.target.closest("[data-action='decrease']")) {
    const item = e.target.closest(".cart-item");
    const { productId } = item.dataset;
    const currentQty = cart.find(i => i.productId === Number(productId))?.quantity ?? 0;
    updateQuantity(productId, currentQty - 1);
    return;
  }

  // Quantity increase
  if (e.target.closest("[data-action='increase']")) {
    const item = e.target.closest(".cart-item");
    const { productId } = item.dataset;
    const currentQty = cart.find(i => i.productId === Number(productId))?.quantity ?? 0;
    updateQuantity(productId, currentQty + 1);
    return;
  }

  // Remove item
  if (e.target.closest("[data-action='remove']")) {
    const item = e.target.closest(".cart-item");
    removeFromCart(item.dataset.productId);
    return;
  }

  // Clear cart
  if (e.target.closest(".clear-cart-btn")) {
    clearCart();
    return;
  }
});

// Open/close functions
function openCartDrawer() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-drawer").setAttribute("aria-hidden", "false");
  document.getElementById("cart-overlay").classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-drawer").setAttribute("aria-hidden", "true");
  document.getElementById("cart-overlay").classList.remove("visible");
  document.body.style.overflow = "";
}

// Close on overlay click
document.getElementById("cart-overlay").addEventListener("click", closeCartDrawer);

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCartDrawer();
});

// Open cart when header cart button is clicked
document.querySelector(".cart-toggle").addEventListener("click", openCartDrawer);
```

The student should implement this step by step, testing each interaction as they go.

**Acceptance criteria:**
- Cart drawer slides in from the right with smooth transition
- Overlay dims the background and clicking it closes the drawer
- Each item shows name, unit price, quantity controls, line total, remove button
- Decrease button reduces quantity; at quantity 1, it removes the item
- Increase button adds to quantity
- Subtotal recalculates on every change
- Empty cart shows a message and "Continue Shopping" button
- Checkout button is disabled when cart is empty
- Escape key closes the drawer

## Hour 4: Review + Polish (60 min)

### Code Review
Review the student's cart drawer and modern JS usage. Look for:
- Is destructuring used where it makes code cleaner?
- Are immutable updates used (spread) instead of mutating arrays/objects?
- Is optional chaining used where properties might not exist?
- Is `??` used correctly (not `||`) for default values where 0 or "" is valid?
- Is event delegation used inside the cart drawer?
- Is the drawer accessible (aria-hidden, aria-label, keyboard close)?

### Polish: Accessibility and Keyboard Interaction

```javascript
// Focus trapping inside the cart drawer
function trapFocus(drawerEl) {
  const focusable = drawerEl.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  drawerEl.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}
```

Walk through the focus management:
1. When the drawer opens, focus moves to the close button
2. Tab cycles through items inside the drawer only
3. When the drawer closes, focus returns to the cart toggle button

### Polish: Cart Badge Animation

```css
.cart-count {
  transition: transform 0.2s ease;
}

.cart-count.bump {
  transform: scale(1.3);
}
```

```javascript
function updateCartCount() {
  const badge = document.querySelector(".cart-count");
  const count = getCartCount();
  badge.textContent = count;
  badge.hidden = count === 0;

  // Bump animation
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 200);
}
```

### Key Takeaways
1. Destructuring and spread make immutable data updates readable. Instead of mutating `cart[index].quantity += 1`, use `cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)`. This pattern is exactly how React state updates work.
2. Optional chaining (`?.`) and nullish coalescing (`??`) eliminate defensive coding chains. `product.reviews?.[0]?.text ?? "No reviews"` replaces five lines of null checks.
3. The cart drawer combines everything learned so far: DOM manipulation (rendering items), event delegation (handling clicks inside the drawer), modern JS (destructuring, spread, template literals), and accessibility (focus trapping, aria attributes, keyboard support).

### Coming Up Next
The store has a working cart drawer with modern JavaScript. In the next lesson, the student brings everything together: filtering, sorting, search, the cart drawer, and responsive behavior for a complete interactive store.

## Checklist
- [ ] Destructured arrays with skip, rest, defaults, and swap patterns
- [ ] Destructured objects with rename, nested, and default patterns
- [ ] Destructured function parameters for cleaner function signatures
- [ ] Used spread to clone and merge arrays and objects immutably
- [ ] Used rest parameters to collect remaining arguments
- [ ] Used optional chaining (?.) to safely access nested properties
- [ ] Used nullish coalescing (??) correctly (not || where 0 or "" is valid)
- [ ] Used template literals for cart item HTML generation
- [ ] Used Map or Set for at least one store scenario (unique categories or cart lookup)
- [ ] Built a sliding cart drawer with open/close transition and overlay
- [ ] Cart items render with quantity controls (increase, decrease, remove)
- [ ] Subtotal recalculates dynamically on every cart change
- [ ] Cart drawer uses event delegation for all item interactions
- [ ] Focus trapping works inside the open cart drawer
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
