# Lesson 3 (Module 16) — Complex shadcn/ui Components

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
- Module 15: Tailwind CSS — utility-first, layout, components, v4 design tokens, redesigned the embroidery store with rose brand theme
- Module 16, Lesson 1: shadcn/ui — installation, CLI, anatomy, customization, rebuilt store nav/cards/account with shadcn
- Module 16, Lesson 2: shadcn Form + native forms + Zod — checkout form, account settings, multi-step "Design Your Own" custom order form

**This lesson's focus:** Complex shadcn/ui components — DataTable for product inventory, Command palette (Cmd+K), Sheet, Dialog for the store admin
**This lesson's build:** Admin dashboard with product inventory table, order management, and store-wide search

**Story so far:** The store's customer-facing forms are polished with shadcn + native forms + Zod. But the admin side needs power tools: a sortable, filterable data table for managing the product inventory, a Command palette (Cmd+K) for instant store-wide search, and slide-out panels for editing products and managing orders. This lesson you build the admin interface using shadcn's most complex components, backed by TanStack Table for the data grid.

## Hour 1: Concept Deep Dive (60 min)

### 1.1 — DataTable Foundation with TanStack Table (15 min)
Explain shadcn's DataTable pattern using TanStack Table:
- shadcn provides the UI shell (`Table`, `TableHeader`, `TableRow`, `TableCell`)
- TanStack Table provides headless table logic
- Install: `npx shadcn@latest add table` + `npm install @tanstack/react-table`
- Core concepts: column definitions, `useReactTable`, `getCoreRowModel`
- Column definition pattern for the store's products:
  ```typescript
  const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: "Product" },
    { accessorKey: "category", header: "Category", cell: ({ row }) => <Badge>{row.getValue("category")}</Badge> },
    { accessorKey: "price", header: "Price", cell: ({ row }) => `$${row.getValue<number>("price").toFixed(2)}` },
    { accessorKey: "stock", header: "Stock" },
  ];
  ```

**Exercise:** Install Table and TanStack Table. Define a `Product` type with id, name, category (Floral/Animals/Custom Text/Seasonal), price, stock, status, threadColors, and createdAt. Create column definitions and render a basic product inventory table with 15 mock embroidery products.

### 1.2 — DataTable Features: Sorting, Filtering, Pagination (15 min)
Add interactive features to the product table:
- **Sorting:** `getSortedRowModel`, clickable column headers for sorting by name, price, stock
- **Filtering:** `getFilteredRowModel`, search input to find products by name
- **Pagination:** `getPaginationRowModel`, 10 products per page with prev/next
- **Row selection:** Checkbox column for bulk operations (bulk price update, bulk archive)
- Using `flexRender` for custom cell content (product thumbnails, color swatches)

**Exercise:** Add sorting on name/price/stock columns, a search filter, pagination with 10 per page, and a checkbox column. Verify sorting, searching, and pagination all work together.

### 1.3 — Command Palette (Cmd+K) for Store Navigation (15 min)
Teach the Command component — shadcn's wrapper around `cmdk`:
- Install: `npx shadcn@latest add command dialog`
- The `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandSeparator` composition
- Opening with Ctrl+K / Cmd+K using a keyboard listener
- Groups for the store: "Products" (search products by name), "Orders" (recent orders), "Navigation" (pages), "Actions" (create product, export)
- Custom rendering: product thumbnails, order numbers, keyboard shortcuts

**Exercise:** Build a command palette for the store admin. Include: "Products" group (search products with thumbnail preview), "Navigation" (Dashboard, Products, Orders, Customers, Settings), "Actions" (Add Product, Export Inventory, Toggle Dark Mode). Each item should have an icon and execute an action.

### 1.4 — Sheet (Slide-out Panel) for Product Details (10 min)
Teach the Sheet component:
- Install: `npx shadcn@latest add sheet`
- Anatomy: `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`
- Side variants: right side for product details, left side for filters
- Pattern: clicking a product row opens a detail Sheet showing full product info, stock history, and edit form

**Exercise:** Build a product detail Sheet that opens from the right. Clicking a row in the inventory table shows: product image, full description, all thread colors, stock level, pricing, and "Edit Product" / "Delete Product" buttons.

### 1.5 — Dialog Patterns for CRUD (5 min)
Expand on Dialog usage for the admin:
- "Add Product" dialog with a validated form
- Delete confirmation with AlertDialog: "Are you sure you want to remove 'Wildflower Bouquet Tee'?"
- Controlled dialogs with `open` and `onOpenChange`

**Exercise:** Add a delete confirmation using `AlertDialog` when clicking "Delete Product" in the Sheet. Show the product name in the dialog text and require explicit "Delete" button click.

## Hour 2: Guided Building (60 min)

Walk the student through building the embroidery store's admin interface.

### Step 1 — Admin layout shell (10 min)
Set up the admin page layout:
- Left sidebar: "ThreadCraft Admin" branding, nav links (Dashboard, Products, Orders, Customers, Settings) using Button variant="ghost"
- Top bar: breadcrumbs, Cmd+K search trigger, and user menu
- Main content area with padding
- Install: `npx shadcn@latest add breadcrumb dropdown-menu`

### Step 2 — Product inventory DataTable (15 min)
Build the complete product inventory table:
- Columns: checkbox, thumbnail+name, category (Badge), price (formatted), stock (color-coded: green >20, amber 1-20, red 0), status (Active/Draft/Archived Badge), actions dropdown
- Sorting on name, price, stock
- Search filter by product name
- Category filter dropdown (Floral, Animals, Custom Text, Seasonal, All)
- Pagination with 10/25/50 per page
- Row actions dropdown: View Details, Edit, Duplicate, Archive, Delete

### Step 3 — Product detail Sheet (10 min)
Wire up the detail panel:
- Clicking a product row opens a Sheet on the right
- Shows full product info: large image, description, thread colors as color swatches, pricing, stock level, creation date
- "Edit" button switches to edit mode with form fields
- "Close" and "Save" buttons in the Sheet footer

### Step 4 — Add Product dialog (10 min)
Build the create product dialog:
- "Add Product" button opens a Dialog
- Form: product name, category (select), price, stock quantity, description (textarea), status (select: Active/Draft)
- Validation with Zod
- Success toast and table refresh on submission

### Step 5 — Bulk actions and Command palette (15 min)
Wire up advanced interactions:
- When products are selected, show a bulk actions bar: "Archive Selected", "Update Category", "Export"
- Command palette (Cmd+K) with:
  - Search products by name (shows thumbnail and price in results)
  - Quick actions: "Add Product", "View Orders", "Export Inventory"
  - Navigation: "Go to Orders", "Go to Customers", "Go to Settings"
- Selecting "Add Product" in the palette opens the create dialog

## Hour 3: Independent Challenge (60 min)

**Challenge: Build the embroidery store's order management interface.**

### Orders DataTable requirements:
- Columns: checkbox, order number (formatted #ORD-1234), customer name + email, items count, total (currency), status (Badge: Pending/Embroidering/Quality Check/Shipped/Delivered), order date, actions
- Status badges color-coded: amber (Pending), rose (Embroidering), blue (Quality Check), indigo (Shipped), green (Delivered)
- Sorting on order number, total, date, and status
- Filter by status (dropdown with all statuses)
- Search by customer name or order number
- Pagination with 15 orders per page
- Use at least 25 mock orders with varied statuses and dates

### Order detail Sheet:
- Opens when clicking an order row
- Shows: order number, customer info (name, email, phone, shipping address), order date
- Items list: product thumbnail, name, selected options (size, thread color), quantity, item price
- Order timeline: Placed -> Embroidering -> Quality Check -> Shipped -> Delivered (with dates for completed steps)
- "Update Status" button that opens a Dialog with a status select to advance the order
- "Print Invoice" and "Send Tracking" action buttons

### Bulk operations:
- Select multiple orders and:
  - "Update Status" — Dialog with status select, applies to all selected
  - "Export Selected" — logs the selected order data (simulated export)
  - "Print Labels" — count of selected orders shown in confirmation

### Command palette integration:
- Cmd+K on the orders page includes:
  - Search orders by number or customer name
  - Quick filters: "Show Pending Orders", "Show Embroidering", "Show Shipped"
  - Actions: "Export All Orders", "View Analytics"

### Acceptance criteria:
- DataTable renders with all columns properly formatted
- Sorting, status filtering, search, and pagination all work
- Order detail Sheet shows comprehensive order information with timeline
- Status update Dialog works and updates the order's badge
- Bulk actions work for selected rows
- Command palette is functional with keyboard shortcut
- Responsive and dark mode compatible

## Hour 4: Review & Stretch Goals (60 min)

### Code Review (20 min)
Review the order management interface. Check for:
- **Table performance:** Are column definitions outside the component? Is the data typed?
- **State management:** Is selection, filter, and dialog state managed cleanly?
- **UX flow:** Does the interaction feel natural — table -> detail -> update status -> table refreshes?
- **Store domain:** Do status values and workflow match what an embroidery store needs?

### Refactoring (15 min)
Guide improvements:
- Extract the DataTable into a reusable generic `DataTable<TData, TValue>` component
- Create reusable `DataTablePagination` and `DataTableToolbar` components
- Extract the order timeline into a reusable `OrderTimeline` component
- Memoize column definitions

### Stretch Goal (20 min)
If time remains: Add column visibility toggle — a dropdown in the toolbar that lets the admin show/hide columns. TanStack Table supports `column.toggleVisibility()`. Build it as a `DropdownMenu` with checkboxes. This is a common admin table feature for managing information density.

### Wrap-up (5 min)
**Three key takeaways:**
1. TanStack Table + shadcn Table gives the store admin a professional data table with sorting, filtering, and pagination out of the box
2. The Command palette (Cmd+K) makes the admin feel like a power tool — store owners can search products, navigate, and take actions with the keyboard
3. Sheet vs. Dialog vs. AlertDialog serve different purposes: Sheet for contextual details (order info), Dialog for focused actions (add product), AlertDialog for destructive confirmations (delete)

**Preview of in the next lesson:** We'll dive into accessibility — making sure the entire embroidery store is usable by everyone, with keyboard navigation, screen reader support, and WCAG compliance.

**Coming up next:** The store looks professional, but does it work for everyone? Can a keyboard-only user complete a purchase? Can a screen reader describe the product to a visually impaired customer? Next up: a full accessibility deep dive — ARIA roles, keyboard navigation, focus management, and screen reader testing.

## Student Support

### Before You Start
Open `workspace/nextjs-store` and start from the last committed version of the store. Run the project if this is a build lesson, then make sure the previous lesson's checklist is complete.

**Folder:** `workspace/nextjs-store`

### Where This Fits
You are evolving the store into the production Next.js version: full-stack data, auth, admin flows, design systems, accessibility, testing, and deployment quality.

### Expected Outcome
By the end of this lesson, the student should have: **Admin dashboard with product inventory table, order management, and store-wide search**.

### Acceptance Criteria
- You can explain today's focus in your own words: Complex shadcn/ui components — DataTable for product inventory, Command palette (Cmd+K), Sheet, Dialog for the store admin.
- The expected outcome is present and reviewable: Admin dashboard with product inventory table, order management, and store-wide search.
- Any code or project notes are saved under `workspace/nextjs-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: Complex shadcn/ui components — DataTable for product inventory, Command palette (Cmd+K), Sheet, Dialog for the store admin. Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
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

- [ ] Built a product inventory DataTable with sorting, filtering, search, and pagination
- [ ] DataTable has row selection with checkboxes and bulk action support
- [ ] Built a Command palette (Cmd+K) with product search, navigation, and quick actions
- [ ] Built a product detail Sheet with full info and edit capability
- [ ] Built "Add Product" Dialog with validated form
- [ ] Built an order management interface with status badges, order detail Sheet, and status update
- [ ] Order timeline component shows the embroidery workflow stages
- [ ] Bulk operations work for selected orders
- [ ] Can explain the difference between Sheet, Dialog, and AlertDialog and when to use each in own words
- [ ] All exercise code saved in `workspace/nextjs-store`

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
