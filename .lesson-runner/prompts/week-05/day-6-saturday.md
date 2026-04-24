# Lesson 6 (Module 5) — Interview & Quiz

## What You Covered This Week
- **Lesson 1:** Utility types in action — `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `Readonly<T>`, `ReturnType<typeof fn>`, `Parameters<typeof fn>`. Derived `CreateProduct`, `UpdateProduct`, `ProductCard`, `OrderSummary`, and `CheckoutFormData` from base interfaces using utility type composition. Built typed form state, API response types, and store configuration.
- **Lesson 2:** TypeScript with the browser — typed `querySelector` with generics (`querySelector<HTMLInputElement>`), handling null returns, typed event handlers (`MouseEvent`, `KeyboardEvent`, `SubmitEvent`), `e.target` vs `e.currentTarget`, generic `typedFetch<T>` wrapper for API calls, typed `JSON.parse` and `localStorage` helpers with schema interfaces. Built `getElement<T>`, `addClickHandler`, `onFormSubmit`, and `typedFetch` DOM helpers for the store.
- **Lesson 3:** tsconfig.json deep dive — `strict: true` and its component flags (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`), `noUncheckedIndexedAccess`, `target`, `lib`, `module`, `moduleResolution`, `paths` aliases. Reading TypeScript error messages (file/line, error code, expected vs actual type). Finding types for libraries (built-in, `@types/` packages, `.d.ts` declarations). `unknown` vs `any` for external data. Enabled strict mode and fixed all errors.
- **Lesson 4:** Began TypeScript migration — created `types.ts` with all domain interfaces and utility-type derived types, migrated leaf modules (utilities, constants), data layer (products, cart, API client), and DOM layer (event handlers, querySelector calls, form handling).
- **Lesson 5:** Build day — completed the migration. Migrated rendering functions, form validation, localStorage persistence, and UI state. Enforced strict null checks everywhere, eliminated all `any` types, validated external data boundaries. Final audit: `npx tsc --noEmit --strict` with zero errors, store works identically in the browser.

## Today's Sessions

### Mock Interview (90 min)
Copy the **interview prompt** from the extension and paste it into your AI assistant for a realistic technical interview simulation.

### Quiz (60 min)
Copy the **quiz prompt** from the extension and paste it into your AI assistant for a scored assessment.

### After the Sessions
- Review any questions you got wrong
- Note topics that felt shaky — revisit them over the weekend
- Check your quiz score trend — are you improving week over week?
- The first five weeks covered the foundations: HTML, CSS, JavaScript, and TypeScript. Starting the next module, React begins. The embroidery store gets rebuilt with components, props, state, and hooks — and all the TypeScript skills from this module transfer directly into typed React code.

## Checklist
- [ ] Completed mock interview
- [ ] Reviewed interview feedback and noted areas for improvement
- [ ] Completed weekly quiz
- [ ] Quiz score recorded: ___/100
- [ ] Reviewed wrong answers and understood corrections
- [ ] Identified weakest topic of the week for weekend review
- [ ] All week's code organized and committed in `workspace/vanilla-store`
