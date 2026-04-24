# Lesson 1 (Module 14) — Customer Accounts & Order History

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work.

**Previous days completed:**
- Module 1: HTML/CSS crash course, then JavaScript basics, DOM, events, ES2024+ — built static store page into interactive catalog with cart
- Module 2: Async JS, modules, closures, OOP, error handling — polished modular vanilla JS store with localStorage persistence
- Module 3: TypeScript fundamentals — typed store models (Product, CartItem, Order), interfaces, generics, narrowing
- Module 4: TypeScript advanced — utility types, mapped/conditional types, DOM typing, migrated store to full TypeScript
- Module 5: React fundamentals — ProductCard, ProductGrid, useState cart, filtering, composition
- Module 6: React hooks — useEffect fetching, useRef, performance, custom hooks (useCart, useProducts)
- Module 7: React state & routing — CartContext, cart useReducer, React Router, route-based store navigation
- Module 8: React forms & testing — native forms + Zod validation, Vitest + Testing Library, React 19 features
- Module 9: Next.js fundamentals — App Router, routing, layouts, route groups, Server/Client Components, loading/error states, dynamic routes
- Module 10: Next.js data & server actions — data fetching, Server Actions, caching, Route Handlers
- Module 11: Next.js advanced — middleware, Auth.js, Prisma + Postgres, images/fonts/metadata/SEO
- Module 12: Built an authenticated, database-backed embroidery store integrating all Next.js features
- Module 13 Lesson 1: Architecture — data models, wireframes, route map, component tree, Prisma schema
- Module 13 Lesson 2: Sprint planning — tickets, estimation, project scaffold, database seed
- Module 13 Lesson 3: Homepage, product catalog with filtering/pagination, product detail with reviews
- Module 13 Lesson 4: Cart with Context + useReducer, multi-step checkout, order creation, confirmation
- Module 13 Lesson 5: Build day — audited flows, added About/Contact/FAQ, loading states, error boundaries, 404 pages

**Today's focus:** Customer account pages, order history, and protected routes with role-based access
**Today's build:** Customer account dashboard with profile editing, order history, order detail view, and auth flow hardening

**Story so far:** Sprint 1 is complete — customers can browse, add to cart, check out, and receive an order confirmation. But after placing an order, there is no way for a customer to check its status. There is no profile page to update their information. And anyone who guesses a URL can access pages they should not see. Sprint 2 starts now. Today: give customers a proper account with order tracking, and lock down every protected route.

**Work folder:** `workspace/nextjs-store`

## Hour 1: Account Dashboard & Profile (60 min)

### 1. Account Layout
Create `app/account/layout.tsx` — a layout for all account pages:

```typescript
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login?callbackUrl=/account")

  return (
    <div className="account-layout">
      <aside className="account-sidebar">
        <h2>My Account</h2>
        <nav>
          <AccountNavLink href="/account" label="Dashboard" />
          <AccountNavLink href="/account/orders" label="Order History" />
          <AccountNavLink href="/account/profile" label="Profile" />
        </nav>
      </aside>
      <main className="account-content">{children}</main>
    </div>
  )
}
```

**Exercise:** Have the student build the `AccountNavLink` component with active state highlighting using `usePathname()`. Ask: "This navigation link needs to know the current URL. Does that make it a Server or Client Component?" (Client — `usePathname` is a client hook.)

### 2. Account Dashboard
Build `app/account/page.tsx`:

```typescript
export default async function AccountDashboard() {
  const session = await auth()
  const customer = await prisma.customer.findUnique({
    where: { id: session!.user!.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: { include: { product: true } } },
      },
    },
  })

  return (
    <div>
      <h1>Welcome back, {customer?.name}</h1>

      <section className="recent-orders">
        <h2>Recent Orders</h2>
        {customer?.orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Browse our collection and place your first order."
            ctaLabel="Shop Now"
            ctaHref="/products"
          />
        ) : (
          <div>
            {customer?.orders.map((order) => (
              <OrderSummaryCard key={order.id} order={order} />
            ))}
            <Link href="/account/orders">View all orders</Link>
          </div>
        )}
      </section>
    </div>
  )
}
```

### 3. Order Summary Card
Build `components/order-summary-card.tsx`:
- Order date (formatted nicely)
- Order status badge with color coding (Pending=yellow, Processing=blue, Shipped=purple, Delivered=green, Cancelled=red)
- Total amount
- Number of items
- First product image as a thumbnail preview
- "View Details" link to `/account/orders/[id]`

### 4. Profile Page
Build `app/account/profile/page.tsx`:
- Display current profile: name, email
- Edit form with native `<form>` + Zod validation
- Server Action to update the customer's name

```typescript
"use server"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
})

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const result = updateProfileSchema.safeParse({
    name: formData.get("name"),
  })
  if (!result.success) return { error: result.error.flatten().fieldErrors }

  await prisma.customer.update({
    where: { id: session.user.id },
    data: { name: result.data.name },
  })

  revalidatePath("/account/profile")
  return { success: true }
}
```

**Exercise:** Have the student build the form with the `useFormStatus` hook for the submit button's pending state. The form should pre-fill with current values and show a success message after saving.

## Hour 2: Order History & Detail (60 min)

### 5. Order History Page
Build `app/account/orders/page.tsx`:

```typescript
export default async function OrderHistoryPage() {
  const session = await auth()
  const orders = await prisma.order.findMany({
    where: { customerId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
    },
  })

  return (
    <div>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your order history will appear here after your first purchase."
          ctaLabel="Browse Products"
          ctaHref="/products"
        />
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderHistoryRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### 6. Order History Row Component
Build `components/order-history-row.tsx`:
- Order number (truncated ID or formatted)
- Date placed
- Status badge
- Item count and total
- Product thumbnails (first 3 items)
- Clickable — links to `/account/orders/[id]`

### 7. Order Detail Page
Build `app/account/orders/[id]/page.tsx`:

```typescript
export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const order = await prisma.order.findUnique({
    where: { id: params.id, customerId: session!.user!.id },
    include: {
      items: { include: { product: true } },
    },
  })

  if (!order) notFound()

  return (
    <div>
      <h1>Order #{order.id.slice(-8).toUpperCase()}</h1>

      <OrderStatusTimeline status={order.status} />

      <section className="order-items">
        <h2>Items</h2>
        {order.items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </section>

      <section className="order-details">
        <div className="shipping-address">
          <h3>Shipping Address</h3>
          {/* Render the JSON shipping address */}
        </div>
        <div className="order-totals">
          <h3>Order Total</h3>
          {/* Subtotal, shipping, tax, total */}
        </div>
      </section>
    </div>
  )
}
```

### 8. Order Status Timeline
Build `components/order-status-timeline.tsx`:
- Visual timeline showing: Order Placed → Processing → Shipped → Delivered
- Highlight completed steps, show current step as active, future steps as inactive
- This is a Server Component — no interactivity needed

**Exercise:** Have the student build the timeline with proper accessibility:
```typescript
const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const

function getStepState(step: string, currentStatus: string): "complete" | "current" | "upcoming" {
  const stepIndex = steps.indexOf(step as typeof steps[number])
  const currentIndex = steps.indexOf(currentStatus as typeof steps[number])
  if (stepIndex < currentIndex) return "complete"
  if (stepIndex === currentIndex) return "current"
  return "upcoming"
}
```

Ask: "What about CANCELLED orders? Should the timeline show that differently?" (Yes — show a red "Cancelled" badge instead of the timeline progression.)

## Hour 3: Protected Routes & Auth Flow (60 min)

### 9. Middleware for Route Protection
Update `middleware.ts` to handle all protected routes:

```typescript
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Protected customer routes
  const customerRoutes = ["/account", "/checkout"]
  const isCustomerRoute = customerRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Protected admin routes
  const isAdminRoute = pathname.startsWith("/admin")

  if (isCustomerRoute && !req.auth) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (req.auth.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*"],
}
```

**Exercise:** Have the student test each scenario:
1. Visit `/account` while logged out → redirected to `/login?callbackUrl=/account`
2. Log in → redirected back to `/account`
3. Visit `/admin` as a CUSTOMER role → redirected to homepage
4. Visit `/checkout` while logged out → redirected to login, then back to checkout

### 10. Login and Register Pages
Build (or update) the auth pages:

**`app/login/page.tsx`:**
- Email + password form with Zod validation
- "Sign in with GitHub" OAuth button
- "Don't have an account? Register" link
- Read `callbackUrl` from searchParams for post-login redirect

**`app/register/page.tsx`:**
- Name, email, password, confirm password form
- Zod validation (password min 8 chars, passwords must match)
- Server Action to create the customer with hashed password
- Auto-login after registration and redirect to the callbackUrl or homepage

### 11. Auth Flow End-to-End Testing
Walk through the complete auth flow:
1. Visit the store as a guest → browse products, add to cart
2. Click "Proceed to Checkout" → redirected to login with `callbackUrl=/checkout`
3. Click "Register" → create a new account
4. After registration, redirected to `/checkout` with cart intact
5. Complete the order
6. Visit `/account` → see the order in history
7. Click the order → see full details with status timeline
8. Edit profile → name updates
9. Log out → redirected to homepage, `/account` is no longer accessible
10. Log back in → account and order history still there

## Hour 4: Review & Auth Hardening (60 min)

### 12. Security Review
Verify every protected resource:
- **Page level:** Every account page checks `auth()` at the top and redirects if null
- **Server Action level:** Every mutation (update profile, create order) verifies the session
- **Data scoping:** Orders are always filtered by `customerId: session.user.id` — User A cannot see User B's orders
- **URL guessing:** Visiting `/account/orders/[someOtherId]` returns 404 if the order does not belong to the current user

### 13. Session Expiration
Discuss what happens when a session expires:
- Server Components: `auth()` returns null on the next request → middleware redirects to login
- Client Components: `useSession()` status changes to `unauthenticated` → show a "Session expired" message
- Cart state: persisted in localStorage, survives session expiration. When the user logs back in, the cart is still there.

Ask: "Should the cart survive a session expiration? What about a different user logging in on the same browser?" (Yes to surviving expiration — frustrating to lose a cart. For different users: clear the cart on login to prevent one user seeing another's cart.)

### 14. Key Takeaways
1. Protected routes need defense at three layers: middleware (redirects unauthenticated requests), page-level (`auth()` check in Server Components), and action-level (every Server Action verifies the session). The UI hides buttons, but the server enforces access.
2. Data scoping is just as important as auth. Verifying "this user is logged in" is not enough — you must also verify "this order belongs to this user." Every database query for user-specific data must include the user ID in the where clause.
3. The callbackUrl pattern is essential for checkout flows. Interrupting a customer with a login page is annoying but necessary. Returning them exactly where they were makes it tolerable.

### Coming Up Next
Customers can manage their accounts and track orders. But who manages the products and processes the orders? In the next lesson, the student builds the admin panel: product CRUD, order management with status updates, and an admin-only layout with sidebar navigation.

## Student Support

### Before You Start
Open `workspace/nextjs-store` and start from the last committed version of the store. Skim the previous module recap before changing code.

**Folder:** `workspace/nextjs-store`

### Where This Fits
You are evolving the store into the production Next.js version: full-stack data, auth, admin flows, design systems, accessibility, testing, and deployment quality.

### Expected Outcome
By the end of this lesson, the student should have: **Customer account dashboard with profile editing, order history, order detail view, and auth flow hardening**.

### Acceptance Criteria
- You can explain today's focus in your own words: Customer account pages, order history, and protected routes with role-based access.
- The expected outcome is present and reviewable: Customer account dashboard with profile editing, order history, order detail view, and auth flow hardening.
- Any code or project notes are saved under `workspace/nextjs-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: Customer account pages, order history, and protected routes with role-based access. Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
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
- [ ] Account layout with sidebar navigation (Dashboard, Orders, Profile) and active link highlighting
- [ ] Account dashboard showing welcome message and 3 most recent orders
- [ ] Profile page with edit form, Zod validation, and Server Action to update name
- [ ] Order history page listing all orders with status badges and item previews
- [ ] Order detail page with items, shipping address, totals, and status timeline
- [ ] Order status timeline component showing progression through order states
- [ ] Empty states for accounts with no orders
- [ ] Middleware protecting /account/*, /checkout/*, and /admin/* routes
- [ ] Login page with credentials form, OAuth button, and callbackUrl redirect
- [ ] Register page with validation, password hashing, auto-login after creation
- [ ] Auth flow tested end-to-end: guest → login redirect → register → checkout → account
- [ ] Data scoping verified: users can only see their own orders
- [ ] Session expiration handling discussed and cart persistence verified

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
