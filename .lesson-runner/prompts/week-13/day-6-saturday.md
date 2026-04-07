# Lesson 6 (Module 13) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** Architecture and planning — designed data models (Product, Category, Customer, Order, OrderItem, Review), drew entity relationships, created wireframes for all key pages, built component trees with Server/Client boundary decisions, planned route architecture with auth requirements and caching strategies, wrote the architecture document, created the Prisma schema
- **Lesson 2:** Work estimation and sprint planning — T-shirt sizing estimation, wrote Jira-style tickets with acceptance criteria, prioritized into Sprint 1 (core user flow) and Sprint 2 (admin + polish), scaffolded the Next.js project, ran Prisma migration, seeded the database with realistic embroidery store data
- **Lesson 3:** Core pages — homepage with hero and featured products, product catalog with server-side filtering/sorting/pagination using searchParams, product detail page with image gallery, reviews, and SEO metadata
- **Lesson 4:** Cart and checkout — cart state with Context + useReducer and localStorage persistence, cart page with quantity controls, multi-step checkout form with Zod validation, order creation Server Action, order confirmation page
- **Lesson 5:** Build day polish — audited all user flows, added breadcrumbs, built About/Contact/FAQ pages, loading skeletons, error boundaries, 404 pages, empty states, Sprint 1 retrospective

## This Week's Build: Embroidery E-Commerce Store (Sprint 1)
The complete customer purchase flow for the embroidery store:
- Homepage with featured products and category showcase
- Product catalog with filtering, sorting, and pagination
- Product detail with image gallery, reviews, and "Add to Cart"
- Cart with Context + useReducer state management and localStorage persistence
- Multi-step checkout with Zod-validated shipping form
- Order creation via Server Action with Prisma
- Order confirmation page
- Auxiliary pages: About, Contact, FAQ
- Loading states, error boundaries, and 404 handling throughout

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

**Note:** This interview will focus on architectural decisions, sprint planning, and full-stack implementation. Expect questions about: data modeling choices, Server vs Client Component decisions, cart state management approach, form validation strategy, Server Action patterns, and the tradeoffs made during Sprint 1.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

**Note:** This quiz covers both the planning/architecture skills from Lessons 1-2 and the implementation skills from Lessons 3-5. Expect questions that combine data modeling, React state management, Next.js Server Components, form validation, and Server Actions in the context of a real e-commerce application.

## Checklist
- [ ] Completed mock interview
- [ ] Reviewed interview feedback and noted areas for improvement
- [ ] Completed weekly quiz
- [ ] Quiz score recorded: ___/100
- [ ] Reviewed wrong answers and understood corrections
- [ ] Identified weakest topic of the week for weekend review
- [ ] All week's code organized in `workspace/nextjs-store`
- [ ] Sprint 1 of the embroidery store is complete and runnable
