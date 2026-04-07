# Lesson 6 (Module 3) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** HTTP & Async JavaScript -- HTTP methods (GET/POST/PUT/DELETE), status codes (2xx/3xx/4xx/5xx), headers, CORS basics. Promises (pending/fulfilled/rejected, chaining with then/catch/finally), Promise.all, Promise.allSettled, Promise.race. async/await with try/catch. fetch API (response.ok checking, JSON parsing). Store now fetches products from a mock JSON API with loading skeleton animation and error states with retry button.
- **Lesson 2:** Modules, closures, and scope -- ES modules (named/default exports, re-exports, module behavior: strict mode, own scope, cached imports). Closures (functions that remember outer scope, private state pattern, debounce internals, cache with TTL, once pattern). Scope chain (block, function, module, global; temporal dead zone). Event loop (call stack, microtask queue for Promises, macrotask queue for setTimeout, chunked processing for long tasks). Refactored the store into ES modules: cart.js, products.js, api.js, ui/, utils/.
- **Lesson 3:** Error handling and persistence -- try/catch/finally, custom error classes (StoreError, ProductNotFoundError, CartError, NetworkError), error propagation strategy (low-level throws, high-level catches). localStorage API (getItem/setItem/removeItem, JSON serialization edge cases, quota handling). Built robust storage module with namespace prefix, validation, and in-memory fallback. Cart now persists across page refresh; all error paths handled with user-friendly messages and retry.
- **Lesson 4:** Object-Oriented JavaScript -- constructor functions, prototypes, prototype chain. ES6 classes (constructor, methods, getters/setters, static methods, private fields with #). Inheritance (extends, super, method overriding). Composition vs inheritance tradeoffs. Built Product class (private price, discount calculation, availability check, fromJSON factory), Cart class (private items, persistence, subscribe pattern), Order class (private status, validated status transitions: pending -> confirmed -> shipped -> delivered).
- **Lesson 5:** Build day -- complete polished vanilla JS embroidery store with modular architecture (models/services/ui/utils), async product loading from mock API, OOP domain models (Product, Cart, Order), persistent cart with localStorage, quick view modal with focus trapping, responsive hamburger nav, error handling throughout, accessibility audit and fixes, and responsive design at all breakpoints.

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

### After the Sessions
- Review wrong answers
- Note shaky topics for weekend review
- In the next lesson, the student starts **TypeScript Fundamentals** (Module 4) -- type annotations, interfaces, generics, and type narrowing. The store's utility functions and data models will be typed, catching bugs at compile time instead of runtime.

## Checklist
- [ ] Completed mock interview
- [ ] Reviewed interview feedback and noted areas for improvement
- [ ] Completed weekly quiz
- [ ] Quiz score recorded: ___/100
- [ ] Reviewed wrong answers and understood corrections
- [ ] Identified weakest topic of the week for weekend review
- [ ] All week's exercise code organized in `workspace/vanilla-store`
