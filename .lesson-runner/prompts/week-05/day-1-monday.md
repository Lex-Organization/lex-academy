# Lesson 1 (Module 5) — Utility Types in Action

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work.

**Previous days completed:**
- Module 1: HTML & CSS Fundamentals — semantic HTML, accessibility, Flexbox, CSS Grid, responsive design, JS basics (variables, functions, arrays, objects, array methods). Built a static product page.
- Module 2: JavaScript & the DOM — DOM manipulation, events, event delegation, forms, modern JS (destructuring, spread, optional chaining). Built an interactive store with cart drawer.
- Module 3: JavaScript Deep Dive — HTTP/async/fetch, modules, closures, event loop, error handling, localStorage, OOP. Built a complete modular vanilla store.
- Module 4: TypeScript Fundamentals — npm/ESLint/Prettier/TS setup, interfaces, type aliases, unions, intersections, literal types, generics, type narrowing, type guards, discriminated unions. Built a typed API client.

**Today's focus:** TypeScript utility types — derive new types from existing ones instead of repeating yourself
**Today's build:** Typed form state, API response types, and configuration types for the embroidery store

**Story so far:** The student has a `Product` interface, a `CartItem` type, and an `Order` type from Module 4. But look at the checkout form: they manually wrote `CreateProduct` (same as Product but without `id`), `UpdateProduct` (same but everything optional), and `ProductFormData` (same but only certain fields). That is three near-identical types that will drift apart. TypeScript has utility types that derive these automatically from a single source of truth.

**Work folder:** `workspace/vanilla-store`

## Hour 1: Partial, Required, Pick, Omit (60 min)

### The Repetition Problem
Start by showing the student their own types from Module 4. They likely have something like:

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "tshirt" | "hoodie" | "hat" | "custom";
  sizes: string[];
  inStock: boolean;
  imageUrl: string;
  createdAt: string;
}

// They probably wrote these separately:
interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: "tshirt" | "hoodie" | "hat" | "custom";
  sizes: string[];
  inStock: boolean;
  imageUrl: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  // ...every field again, but optional
}
```

Ask: "What happens if you add a `color` field to `Product`? How many places do you need to update?" This is the problem utility types solve.

### Omit<T, Keys> — Remove Fields
```typescript
// CreateProductData is Product without id and createdAt
type CreateProductData = Omit<Product, "id" | "createdAt">;

// Now if Product gets a new field, CreateProductData gets it automatically
```

**Exercise:** The student defines `PublicProduct` that hides internal fields:
```typescript
// Remove fields that customers should not see
type PublicProduct = Omit<Product, "createdAt">;
```

### Pick<T, Keys> — Select Only Certain Fields
```typescript
// A product card in the listing only needs a few fields
type ProductCardData = Pick<Product, "id" | "name" | "price" | "imageUrl" | "category">;

// A search result is even slimmer
type SearchResult = Pick<Product, "id" | "name" | "price">;
```

**Exercise:** The student creates a `CartItemSummary` type using `Pick` from their existing `CartItem`.

### Partial<T> — Make Everything Optional
```typescript
// For updating a product, every field is optional (you only send what changed)
type UpdateProductData = Partial<Omit<Product, "id" | "createdAt">>;

// updateProduct(id, { price: 29.99 }) — only sends price
// updateProduct(id, { name: "New Name", inStock: false }) — sends two fields
```

**Exercise:** Create an `UpdateOrderData` type that is a partial version of `Order` (without `id` and `createdAt`).

### Required<T> — Make Everything Required
```typescript
interface EmbroideryOptions {
  text?: string;
  font?: string;
  color?: string;
  position?: "chest" | "back" | "sleeve";
  size?: "small" | "medium" | "large";
}

// When submitting the order, all options must be filled in
type FinalEmbroideryOptions = Required<EmbroideryOptions>;
```

**Exercise:** The student has a `UserPreferences` type with optional fields. Create a `CompletePreferences` type where everything is required.

### Combining Utility Types
Show that utility types compose:
```typescript
// Product creation: everything except id and createdAt
type CreateProduct = Omit<Product, "id" | "createdAt">;

// Product update: same as creation, but all optional
type UpdateProduct = Partial<CreateProduct>;

// Product card: pick display fields, all required
type ProductCard = Required<Pick<Product, "id" | "name" | "price" | "imageUrl">>;
```

**Exercise:** Create these types for the `Order` interface:
1. `CreateOrder` — Order without `id`, `createdAt`, `status` (server sets these)
2. `OrderSummary` — just `id`, `total`, `status`, `createdAt`
3. `UpdateOrder` — partial version of the editable fields only

## Hour 2: Record, Readonly, ReturnType, Parameters (60 min)

### Record<Keys, ValueType> — Typed Dictionaries
```typescript
// Map category names to display labels
type CategoryLabels = Record<Product["category"], string>;

const categoryLabels: CategoryLabels = {
  tshirt: "T-Shirts",
  hoodie: "Hoodies",
  hat: "Hats",
  custom: "Custom Orders",
};
// Try removing one — TypeScript will complain that the Record is incomplete

// Inventory count per product ID
type Inventory = Record<string, number>;
const inventory: Inventory = {
  "prod-001": 42,
  "prod-002": 7,
};
```

Explain the difference: `Record<string, number>` is open-ended (any string key), while `Record<"tshirt" | "hoodie", number>` requires exactly those keys.

**Exercise:** Create a `Record` type that maps each order status to a CSS color string:
```typescript
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type StatusColors = Record<OrderStatus, string>;
```

### Readonly<T> — Prevent Mutation
```typescript
// A product from the API should not be mutated directly
type ReadonlyProduct = Readonly<Product>;

function displayProduct(product: Readonly<Product>) {
  // product.price = 0; // ERROR — cannot assign to readonly property
  console.log(`${product.name}: $${product.price}`);
}

// Readonly arrays
function calculateTotal(items: readonly CartItem[]): number {
  // items.push(newItem); // ERROR — cannot mutate
  // items.sort();        // ERROR — sort mutates in place
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

**Exercise:** Write a `getCartTotal` function that takes `readonly CartItem[]` and returns a number. Show that `[...items].sort()` works (creates a copy) while `items.sort()` does not.

### ReturnType and Parameters — Extract Types from Functions
```typescript
// You have an existing function and want its return type
function createOrder(items: CartItem[], customer: CustomerInfo) {
  return {
    id: crypto.randomUUID(),
    items,
    customer,
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };
}

// Extract the return type without writing it manually
type Order = ReturnType<typeof createOrder>;
// { id: string; items: CartItem[]; customer: CustomerInfo; total: number; status: "pending"; createdAt: string }

// Extract the parameter types
type CreateOrderParams = Parameters<typeof createOrder>;
// [CartItem[], CustomerInfo]
```

**Exercise:** The student has a `formatPrice` function. Use `ReturnType<typeof formatPrice>` to type a variable that stores its result. Use `Parameters<typeof formatPrice>` to see what it accepts.

### Practical Combination
```typescript
// API response wrapper — reusable for any endpoint
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type ProductResponse = ApiResponse<Product>;
type ProductListResponse = ApiResponse<Product[]>;
type OrderResponse = ApiResponse<Order>;

// Config object for the store
type StoreConfig = Readonly<{
  apiBaseUrl: string;
  currency: string;
  taxRate: number;
  maxCartItems: number;
  categories: readonly Product["category"][];
}>;
```

## Hour 3: Build — Typed Store Foundations (60 min)

Apply utility types to the embroidery store. Create or update files in `workspace/vanilla-store/src/`.

### Step 1: Base Types (`types.ts`)
Define the canonical types that everything else derives from:
```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "tshirt" | "hoodie" | "hat" | "custom";
  sizes: string[];
  inStock: boolean;
  imageUrl: string;
  embroideryAvailable: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  embroidery?: EmbroideryOptions;
}

export interface EmbroideryOptions {
  text: string;
  font: string;
  color: string;
  position: "chest" | "back" | "sleeve";
}

export interface Order {
  id: string;
  items: CartItem[];
  customerEmail: string;
  shippingAddress: Address;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
```

### Step 2: Derived Types (`types.ts` continued)
Use utility types to derive every variation:
```typescript
// Product operations
export type CreateProduct = Omit<Product, "id" | "createdAt">;
export type UpdateProduct = Partial<CreateProduct>;
export type ProductCard = Pick<Product, "id" | "name" | "price" | "imageUrl" | "category">;

// Order operations
export type CreateOrder = Omit<Order, "id" | "status" | "createdAt">;
export type OrderSummary = Pick<Order, "id" | "total" | "status" | "createdAt">;

// Form state for checkout
export type CheckoutFormData = {
  email: string;
  shippingAddress: Partial<Address>;
};

// API response types
export type ApiResponse<T> = {
  data: T;
  error: string | null;
  status: number;
};

export type ProductListResponse = ApiResponse<ProductCard[]>;
export type ProductDetailResponse = ApiResponse<Product>;
export type OrderCreateResponse = ApiResponse<{ orderId: string }>;

// Configuration
export type StoreConfig = Readonly<{
  apiUrl: string;
  currency: string;
  taxRate: number;
  maxCartItems: number;
}>;

// Category metadata
export type CategoryInfo = Record<Product["category"], {
  label: string;
  description: string;
  icon: string;
}>;
```

### Step 3: Form State Types
```typescript
// Generic form field state
interface FieldState<T> {
  value: T;
  error: string | null;
  touched: boolean;
}

// Checkout form using Record
type CheckoutFields = "email" | "street" | "city" | "state" | "zip" | "country";
type CheckoutFormState = Record<CheckoutFields, FieldState<string>>;

// Embroidery customizer form
type EmbroideryFormState = {
  text: FieldState<string>;
  font: FieldState<string>;
  color: FieldState<string>;
  position: FieldState<EmbroideryOptions["position"]>;
};
```

### Step 4: Wire It Up
Update at least one existing module (e.g., the cart or API client) to use the derived types instead of hand-written ones.

## Hour 4: Review + Practice (60 min)

### Code Review
Review the student's derived types. Check for:
- Types that could be derived but were written by hand
- Overly complex combinations (keep it readable)
- Whether changing the base `Product` type would correctly update all derived types
- Whether `Record` is used with a union key (exhaustive) vs `string` key (open-ended) appropriately

### Practice: Derive These Types
Give the student a `User` interface and ask them to create derived types:
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer" | "staff";
  passwordHash: string;
  lastLogin: string;
  createdAt: string;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
    language: string;
  };
}

// 1. PublicUser — no passwordHash, no lastLogin
// 2. CreateUser — no id, createdAt, lastLogin, passwordHash. Add a `password: string` field.
// 3. UpdateUser — partial, only editable fields (name, email, preferences)
// 4. UserListItem — just id, name, email, role
// 5. RolePermissions — Record mapping each role to a string[] of permissions
```

### Go Deeper (Optional)
Mention that utility types like `Partial` are built using **mapped types** under the hood: `{ [K in keyof T]?: T[K] }`. The student does not need to write these, but knowing they exist helps when reading library code. If the student is curious, show the implementation of `Partial` and `Pick` briefly. This is a "go deeper" topic, not mandatory.

### Coming Up Next
In the next lesson, TypeScript meets the browser. The student will learn to type DOM elements, event handlers, fetch responses, and localStorage. The same APIs they have been using since Module 2, now with full type safety and autocomplete.

## Student Support

### Before You Start
Open `workspace/vanilla-store` and start from the last committed version of the store. Skim the previous module recap before changing code.

**Folder:** `workspace/vanilla-store`

### Where This Fits
You are growing the vanilla JavaScript version of the embroidery store. The goal is to understand the platform before frameworks enter the picture.

### Expected Outcome
By the end of this lesson, the student should have: **Typed form state, API response types, and configuration types for the embroidery store**.

### Acceptance Criteria
- You can explain today's focus in your own words: TypeScript utility types — derive new types from existing ones instead of repeating yourself.
- The expected outcome is present and reviewable: Typed form state, API response types, and configuration types for the embroidery store.
- Any code or project notes are saved under `workspace/vanilla-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: TypeScript utility types — derive new types from existing ones instead of repeating yourself. Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
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
- [ ] Can explain why utility types exist: derive types from a single source of truth, so changes propagate automatically
- [ ] Used `Omit<T, Keys>` to create `CreateProduct` (Product without id and createdAt) and `PublicProduct` (Product without internal fields)
- [ ] Used `Pick<T, Keys>` to create `ProductCard` (only display fields) and `SearchResult` (only id, name, price)
- [ ] Used `Partial<T>` to create `UpdateProduct` (all fields optional for patch requests) and combined it with `Omit`
- [ ] Used `Required<T>` to create `FinalEmbroideryOptions` from an interface with optional fields
- [ ] Used `Record<Keys, Value>` with a union key for `CategoryLabels` (exhaustive) and with `string` key for `Inventory` (open-ended)
- [ ] Used `Readonly<T>` and `readonly` arrays in function parameters to prevent accidental mutation
- [ ] Used `ReturnType<typeof fn>` to extract a return type from an existing function without writing it manually
- [ ] Built typed form state, API response types, and configuration types for the embroidery store using utility type composition
- [ ] Updated at least one existing store module to use derived types instead of hand-written duplicates
- [ ] All code saved in `workspace/vanilla-store`

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
- Use embroidery analogies when they fit
- If the student is flying through material, skip ahead; if struggling, add more examples
- Production-quality code always — no toy examples
