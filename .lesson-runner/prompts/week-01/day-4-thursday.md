# Lesson 4 (Module 1) — Arrays, Objects & Array Methods

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work.

**Previous days completed:**
- Lesson 1: How the web works (DNS, HTTP, browser rendering pipeline), HTML5 semantic elements, accessibility (alt text, aria-label, skip links, heading hierarchy, aria-live). Built the semantic HTML skeleton of the store landing page.
- Lesson 2: CSS fundamentals (selectors, specificity, box model, custom properties), flexbox, CSS Grid, responsive design (mobile-first, min-width media queries, clamp(), auto-fill/auto-fit), Chrome DevTools. Styled the store into a beautiful responsive landing page.
- Lesson 3: JavaScript variables (const/let, no var), primitive types (string, number, boolean, null, undefined), typeof, type coercion, functions (declarations, expressions, arrows), parameters, return values, scope, control flow (if/else, switch, ternary, truthy/falsy). Built price calculator functions for the store.

**Today's focus:** Arrays, objects, and array methods (map, filter, find, reduce) -- the data structures that hold the product catalog
**Today's build:** A complete product catalog data structure with filtering, sorting, and searching functions

**Story so far:** The store has a styled landing page and price calculation logic -- but there are no actual products. The price functions take raw numbers (`calculateSubtotal(39.99, 2)`) but a real store has products with names, descriptions, categories, and images. Today we learn the data structures that hold all of that: arrays (ordered lists of things) and objects (bundles of related properties). By the end of this lesson, the student will have a product catalog they can filter by category, search by name, and sort by price -- the data backbone of the embroidery store.

**The student learned JavaScript for the first time in the previous lesson. Arrays and objects are new concepts. Teach from the ground up, but move briskly -- the student has momentum from Lesson 3.**

**Work folder:** `workspace/vanilla-store`

## Hour 1: Arrays (60 min)

### What is an Array? (10 min)

An array is an ordered list. Like a thread organizer in an embroidery kit -- each slot holds one spool, and they are numbered starting from 0.

```javascript
const threadColors = ["navy", "sage", "burgundy", "gold", "white"];

// Access by index (starting from 0, not 1)
threadColors[0]   // "navy" (first item)
threadColors[2]   // "burgundy" (third item)
threadColors[4]   // "white" (last item)
threadColors[5]   // undefined (there is no sixth item)

// Length
threadColors.length  // 5
```

Ask: "Why does the first item have index 0 instead of 1?" (Nearly every programming language counts from 0. It is a convention that dates back to how memory works in computers -- the index represents the offset from the start.)

**Exercise:** Create an array of product categories for the store:

```javascript
const categories = ["t-shirts", "hoodies", "accessories", "hats", "kids"];

// Student answers:
// What is categories[1]?
// What is categories[categories.length - 1]?
// What happens if you try categories[10]?
```

### Mutating Arrays (15 min)

Arrays have methods that change them in place (mutate) and methods that create new arrays (immutable). Both matter.

**Adding items:**
```javascript
const cart = [];
cart.push("Floral Tee");       // Add to the END: ["Floral Tee"]
cart.push("Mountain Hoodie");  // ["Floral Tee", "Mountain Hoodie"]
cart.unshift("Wildflower Tote"); // Add to the START: ["Wildflower Tote", "Floral Tee", "Mountain Hoodie"]
```

**Removing items:**
```javascript
cart.pop();     // Removes from the END, returns "Mountain Hoodie"
cart.shift();   // Removes from the START, returns "Wildflower Tote"
```

**Finding items:**
```javascript
const prices = [39.99, 59.99, 24.99, 44.99, 29.99];
prices.indexOf(24.99);    // 2 (the index where it was found)
prices.indexOf(99.99);    // -1 (not found)
prices.includes(39.99);   // true
prices.includes(99.99);   // false
```

**Extracting a portion (non-mutating):**
```javascript
const allProducts = ["Tee", "Hoodie", "Tote", "Hat", "Onesie"];
const firstThree = allProducts.slice(0, 3);  // ["Tee", "Hoodie", "Tote"]
const lastTwo = allProducts.slice(-2);        // ["Hat", "Onesie"]
// .slice() does NOT change the original array
```

**Removing/replacing items by index (mutating):**
```javascript
const items = ["Tee", "Hoodie", "Tote", "Hat"];
items.splice(1, 1);  // Remove 1 item at index 1: ["Tee", "Tote", "Hat"]
items.splice(1, 0, "Jacket");  // Insert at index 1: ["Tee", "Jacket", "Tote", "Hat"]
```

Ask: "What is the difference between `slice` and `splice`?" (slice copies a portion without changing the original. splice changes the original by removing or inserting items. The names are confusingly similar -- pay attention to which one you use.)

**Exercise:** The student builds a simple cart using array methods:

```javascript
const cart = [];

// 1. Add three products to the cart (push)
// 2. Remove the last product (pop)
// 3. Check if "Floral Tee" is in the cart (includes)
// 4. Find the index of "Mountain Hoodie" (indexOf)
// 5. Get the first 2 items without changing the cart (slice)
```

### Iterating Over Arrays (10 min)

The `for...of` loop visits each item:

```javascript
const products = ["Floral Tee", "Mountain Hoodie", "Wildflower Tote"];

for (const product of products) {
  console.log(`Product: ${product}`);
}
```

We will mostly use array methods (map, filter, etc.) instead of loops, but `for...of` is useful when you need `break` or `continue`:

```javascript
// Find the first product over $40 and stop looking
for (const product of products) {
  if (product.price > 40) {
    console.log(`Found: ${product.name}`);
    break;  // Stop the loop
  }
}
```

**Confidence check:** "Rate 1-5: Arrays, indexing, and basic methods?"

### Exercise: ThreadCraft Product Names (25 min)

```javascript
const productNames = [
  "Floral Embroidered Tee",
  "Mountain Scene Hoodie",
  "Wildflower Tote Bag",
  "Custom Name Tee",
  "Embroidered Denim Jacket",
  "Botanical Canvas Bag",
  "Vintage Rose Hat",
  "Embroidered Baby Onesie",
  "Sunrise Landscape Tee",
  "Herb Garden Apron",
  "Constellation Hoodie",
  "Monogram Laptop Sleeve"
];

// Student completes each task:
// 1. How many products are there? (length)
// 2. What is the third product? (index 2)
// 3. What is the last product without hardcoding the index? (length - 1)
// 4. Add "Embroidered Pocket Square" to the end
// 5. Is "Vintage Rose Hat" in the list? (includes)
// 6. Get the first 4 products (slice)
// 7. Get all products except the first 2 (slice)
// 8. Loop through and log each product with its number: "1. Floral Embroidered Tee"
```

## Hour 2: Objects (60 min)

### What is an Object? (15 min)

An object groups related data under named keys. An array is a list. An object is a labeled collection.

```javascript
const product = {
  name: "Floral Embroidered Tee",
  price: 39.99,
  category: "t-shirts",
  inStock: true,
  rating: 4.8,
  description: "Hand-embroidered wildflower design on 100% organic cotton."
};
```

Like a product tag on a piece of embroidery: it has a name, a price, a size, a material -- all describing the same item.

**Accessing properties:**

```javascript
// Dot notation (most common)
product.name       // "Floral Embroidered Tee"
product.price      // 39.99

// Bracket notation (needed when the key is a variable or has special characters)
product["name"]           // "Floral Embroidered Tee"
const key = "category";
product[key]              // "t-shirts"
```

Ask: "When would you use bracket notation instead of dot notation?" (When the property name is stored in a variable, or when the property name has spaces or special characters.)

**Adding and modifying properties:**
```javascript
product.sku = "FET-001";        // Add a new property
product.price = 44.99;          // Modify existing property (if declared with const, properties can still change!)
```

Wait -- `const product` but we can change `product.price`? Yes. `const` means the variable `product` always points to the same object. But the object's contents can change. Like a labeled shelf: the label stays the same, but you can rearrange what is on the shelf.

### Nested Objects (10 min)

Objects can contain other objects:

```javascript
const product = {
  name: "Floral Embroidered Tee",
  price: 39.99,
  details: {
    material: "organic cotton",
    embroideryType: "hand-stitched",
    careInstructions: "Machine wash cold, tumble dry low"
  },
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["navy", "white", "sage"]
};

// Access nested properties
product.details.material           // "organic cotton"
product.sizes[0]                   // "XS"
product.details.embroideryType     // "hand-stitched"
```

### Object Methods: keys, values, entries (10 min)

```javascript
const product = {
  name: "Floral Embroidered Tee",
  price: 39.99,
  category: "t-shirts"
};

Object.keys(product)     // ["name", "price", "category"]
Object.values(product)   // ["Floral Embroidered Tee", 39.99, "t-shirts"]
Object.entries(product)  // [["name", "Floral Embroidered Tee"], ["price", 39.99], ["category", "t-shirts"]]
```

Ask: "When would `Object.keys` be useful for the store?" (Counting how many properties a product has, iterating over properties, checking if a property exists.)

### Exercise: Build a Product Object (25 min)

The student builds a complete product object from scratch:

```javascript
// 1. Create an object for a new embroidery product
// Must include: id, name, price, category, inStock, rating, description,
// details (nested object with material, embroideryType), sizes, colors

// 2. Access the embroidery type using dot notation

// 3. Access the second color using bracket notation

// 4. Add a new property: sku with value "BCV-006"

// 5. Write a function that takes a product and returns a formatted string:
//    "Floral Embroidered Tee — $39.99 (T-Shirts)"
function formatProduct(product) {
  // Student writes this
}

// 6. Write a function that checks if a product is available in a specific size:
function isAvailableInSize(product, size) {
  // Student writes this (hint: use .includes())
}

// 7. Write a function that returns all the keys of a product as a comma-separated string:
function getProductFields(product) {
  // Student writes this
}

// 8. Get all the values from the product's details object
```

**Confidence check:** "Rate 1-5: Objects, dot/bracket access, nesting?"

## Hour 3: Array Methods That Return New Arrays (60 min)

### Why Array Methods? (5 min)

In the previous lesson, we used `for...of` to loop through arrays. Array methods are a more powerful and expressive alternative. Instead of telling the computer HOW to loop, you tell it WHAT you want.

```javascript
// Loop approach: HOW to filter
const inStockProducts = [];
for (const product of products) {
  if (product.inStock) {
    inStockProducts.push(product);
  }
}

// Array method approach: WHAT you want
const inStockProducts = products.filter(product => product.inStock);
```

The second version is shorter, clearer, and less error-prone. Array methods are the standard way to work with data in modern JavaScript.

### The Product Catalog (5 min)

First, create the product data the student will work with for the rest of this lesson and the next:

```javascript
const products = [
  { id: 1, name: "Floral Embroidered Tee", price: 39.99, category: "t-shirts", inStock: true, rating: 4.8 },
  { id: 2, name: "Mountain Scene Hoodie", price: 59.99, category: "hoodies", inStock: true, rating: 4.5 },
  { id: 3, name: "Wildflower Tote Bag", price: 24.99, category: "accessories", inStock: false, rating: 4.9 },
  { id: 4, name: "Custom Name Tee", price: 44.99, category: "t-shirts", inStock: true, rating: 4.7 },
  { id: 5, name: "Embroidered Denim Jacket", price: 89.99, category: "jackets", inStock: true, rating: 4.6 },
  { id: 6, name: "Botanical Canvas Bag", price: 29.99, category: "accessories", inStock: true, rating: 4.8 },
  { id: 7, name: "Vintage Rose Hat", price: 22.99, category: "hats", inStock: true, rating: 4.3 },
  { id: 8, name: "Embroidered Baby Onesie", price: 19.99, category: "kids", inStock: false, rating: 4.9 },
  { id: 9, name: "Sunrise Landscape Tee", price: 42.99, category: "t-shirts", inStock: true, rating: 4.4 },
  { id: 10, name: "Herb Garden Apron", price: 34.99, category: "accessories", inStock: true, rating: 4.7 },
  { id: 11, name: "Constellation Hoodie", price: 64.99, category: "hoodies", inStock: true, rating: 4.8 },
  { id: 12, name: "Monogram Laptop Sleeve", price: 34.99, category: "accessories", inStock: true, rating: 4.5 }
];
```

### `.map()` -- Transform Every Item (10 min)

`map` creates a new array by transforming each item. The original array is untouched.

```javascript
// Get just the product names
const names = products.map(product => product.name);
// ["Floral Embroidered Tee", "Mountain Scene Hoodie", ...]

// Get formatted price strings
const priceLabels = products.map(product => `${product.name}: $${product.price.toFixed(2)}`);
// ["Floral Embroidered Tee: $39.99", ...]

// Create display-ready objects
const displayProducts = products.map(product => ({
  label: product.name,
  displayPrice: `$${product.price.toFixed(2)}`,
  available: product.inStock ? "In Stock" : "Out of Stock"
}));
```

Ask: "Does `.map()` change the original `products` array?" (No. It creates and returns a NEW array. The original is untouched.)

**Exercise:** Use `.map()` to:
1. Get an array of just product prices
2. Get an array of product names in UPPERCASE
3. Create an array of objects with just `name` and `category`

### `.filter()` -- Keep Items That Match (10 min)

`filter` creates a new array with only the items that pass a test.

```javascript
// Get in-stock products only
const inStock = products.filter(product => product.inStock);

// Get products under $30
const affordable = products.filter(product => product.price < 30);

// Get accessories that are in stock
const availableAccessories = products.filter(
  product => product.category === "accessories" && product.inStock
);
```

**Exercise:** Use `.filter()` to:
1. Get all t-shirts
2. Get products rated 4.7 or higher
3. Get in-stock products that cost more than $40
4. Get all products that are NOT accessories

### `.find()` and `.findIndex()` -- Get One Item (5 min)

`find` returns the FIRST matching item (or `undefined`). `findIndex` returns its index (or `-1`).

```javascript
const jacket = products.find(product => product.id === 5);
// { id: 5, name: "Embroidered Denim Jacket", ... }

const jacketIndex = products.findIndex(product => product.id === 5);
// 4

const nonexistent = products.find(product => product.id === 999);
// undefined
```

**Exercise:** Use `.find()` to:
1. Find the product with id 3
2. Find the first product in the "hoodies" category
3. Find the first product that costs exactly $34.99

### `.some()` and `.every()` -- Check Conditions (5 min)

`some` returns `true` if ANY item passes. `every` returns `true` if ALL items pass.

```javascript
products.some(p => p.price > 80);    // true (the jacket is $89.99)
products.some(p => p.price > 100);   // false (nothing over $100)
products.every(p => p.rating > 4.0); // true (all ratings above 4.0)
products.every(p => p.inStock);      // false (tote bag and onesie are out of stock)
```

### `.reduce()` -- Combine Into One Value (10 min)

`reduce` takes an array and reduces it to a single value -- a total, an average, a grouped object.

```javascript
// Calculate the total price of all products
const totalValue = products.reduce((sum, product) => sum + product.price, 0);
// 0 is the starting value of "sum"

// Count products by category
const categoryCounts = products.reduce((counts, product) => {
  counts[product.category] = (counts[product.category] || 0) + 1;
  return counts;
}, {});
// { "t-shirts": 3, "hoodies": 2, "accessories": 4, ... }
```

`reduce` is the hardest array method. Break it down:
- First argument: a function that runs on each item
  - `sum` (or any name): the accumulated value so far
  - `product`: the current item
- Second argument: the starting value for the accumulator

Ask: "What would happen if we forgot the `, 0` at the end?" (The first product object would be used as the starting sum, and you would get `[object Object]39.99...` -- a mess.)

**Exercise:** Use `.reduce()` to:
1. Calculate the total value of only in-stock products
2. Find the most expensive product (use reduce to track the max)
3. Calculate the average rating across all products

### Chaining Methods (10 min)

Array methods return arrays, so you can chain them:

```javascript
// Get the names of in-stock products under $40, sorted by price
const affordableNames = products
  .filter(p => p.inStock && p.price < 40)
  .sort((a, b) => a.price - b.price)
  .map(p => p.name);
// ["Embroidered Baby Onesie" filtered out (not in stock), "Vintage Rose Hat", "Wildflower Tote Bag" filtered out, ...]

// Calculate total of the cheapest 3 products
const cheapestThreeTotal = products
  .sort((a, b) => a.price - b.price)
  .slice(0, 3)
  .reduce((sum, p) => sum + p.price, 0);
```

Note: `.sort()` mutates the original array. For safety, copy first: `[...products].sort(...)`.

**Confidence check:** "Rate 1-5: Array methods (map, filter, find, reduce)?"

## Hour 4: Review + Catalog Challenge (60 min)

### Code Review (15 min)

Review the student's work from Hours 1-3. Check for:
1. **Method choice:** Using `find` when looking for one item, `filter` when looking for many, `map` when transforming, `reduce` when accumulating
2. **Immutability awareness:** Does the student understand that `map` and `filter` return new arrays?
3. **Arrow function syntax:** Comfortable with `p => p.inStock`?
4. **Edge cases:** What does `find` return when nothing matches? (undefined) What does `filter` return? (empty array)

### Challenge: Build the Product Catalog Module (35 min)

The student creates a complete catalog module. Add to `scripts/products.js`:

```javascript
// The student already has the products array from Hour 3.
// Now build functions that operate on it.

// 1. Get all unique categories from the product list
function getCategories(products) {
  // Hint: map to get categories, then remove duplicates
  // (For now, use a loop or indexOf check -- we will learn Set later)
}
// Expected: ["t-shirts", "hoodies", "accessories", "jackets", "hats", "kids"]

// 2. Filter products by category
function filterByCategory(products, category) {
  // Return all products if category is "all" or empty
}

// 3. Sort products by a given field
function sortProducts(products, sortBy) {
  // sortBy can be: "price-low", "price-high", "rating", "name"
  // IMPORTANT: do not mutate the original array
}

// 4. Search products by name (case-insensitive)
function searchProducts(products, query) {
  // Return products whose name includes the query string
  // Handle empty query (return all)
}

// 5. Get a complete product summary
function getCatalogSummary(products) {
  // Returns an object with:
  // - totalProducts: number
  // - inStockCount: number
  // - outOfStockCount: number
  // - priceRange: { min: number, max: number }
  // - averagePrice: number
  // - averageRating: number
  // - categories: array of unique category strings
}

// 6. Combine filter + sort + search
function getFilteredProducts(products, options) {
  // options = { category: "t-shirts", sortBy: "price-low", query: "floral" }
  // Apply all active filters (skip if option is empty/null)
  // Return the final filtered, sorted array
}
```

**Test each function:**

```javascript
console.log(getCategories(products));
console.log(filterByCategory(products, "t-shirts"));
console.log(sortProducts(products, "price-low"));
console.log(searchProducts(products, "embroidered"));
console.log(getCatalogSummary(products));
console.log(getFilteredProducts(products, {
  category: "accessories",
  sortBy: "rating",
  query: ""
}));
```

### Git Commit (5 min)

```bash
git add .
git commit -m "feat: add product catalog data with filtering, sorting, and search functions"
```

### Key Takeaways
1. **Arrays hold ordered collections, objects hold labeled properties.** The product catalog is an array of objects -- a list where each item is a bundle of related data. This pattern (array of objects) is the most common data shape in frontend development.
2. **Array methods (map, filter, find, reduce) replace loops.** Instead of writing HOW to loop, you write WHAT you want: "filter products where inStock is true." This is more readable, less error-prone, and the pattern React is built on.
3. **Immutability matters.** `map` and `filter` return NEW arrays. The original is untouched. This habit -- never mutating the source data -- prevents an entire class of bugs and is essential for React state management.

### Coming Up Next
The catalog data works, but it is stuck in the console. `console.log` shows the filtered products, but the page still shows the same hardcoded HTML from Lesson 2. In the next lesson, we connect JavaScript to the HTML page -- rendering products dynamically, building a working search bar, and seeing the catalog come alive in the browser.

**End of day preview:** The catalog data is solid: filtering, sorting, searching. But open the browser -- the page still shows the old hardcoded products. In the next lesson, we wire the JavaScript to the page and see the catalog render live for the first time.

## Student Support

### Before You Start
Open `workspace/vanilla-store` and start from the last committed version of the store. Run the project if this is a build lesson, then make sure the previous lesson's checklist is complete.

**Folder:** `workspace/vanilla-store`

### Where This Fits
You are growing the vanilla JavaScript version of the embroidery store. The goal is to understand the platform before frameworks enter the picture.

### Expected Outcome
By the end of this lesson, the student should have: **A complete product catalog data structure with filtering, sorting, and searching functions**.

### Acceptance Criteria
- You can explain today's focus in your own words: Arrays, objects, and array methods (map, filter, find, reduce) -- the data structures that hold the product catalog.
- The expected outcome is present and reviewable: A complete product catalog data structure with filtering, sorting, and searching functions.
- Any code or project notes are saved under `workspace/vanilla-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: Arrays, objects, and array methods (map, filter, find, reduce) -- the data structures that hold the product catalog. Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
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
- [ ] Can create arrays and access items by index
- [ ] Can use push, pop, shift, unshift, slice, splice, indexOf, and includes
- [ ] Can explain the difference between slice (non-mutating) and splice (mutating)
- [ ] Can create objects with nested properties and access them with dot and bracket notation
- [ ] Can use Object.keys, Object.values, and Object.entries
- [ ] Can use `.map()` to transform arrays (get names, format prices, create new shapes)
- [ ] Can use `.filter()` to get subsets (by category, by price range, by stock status)
- [ ] Can use `.find()` to get a single item and `.findIndex()` to get its position
- [ ] Can use `.some()` and `.every()` to check conditions across an array
- [ ] Can use `.reduce()` to calculate totals and averages
- [ ] Can chain array methods (filter then map, filter then sort then slice)
- [ ] Built `getCategories`, `filterByCategory`, `sortProducts`, `searchProducts`, and `getFilteredProducts`
- [ ] Product catalog has 12 products with id, name, price, category, inStock, and rating
- [ ] All functions tested in the console with multiple inputs
- [ ] Committed catalog module with a descriptive commit message

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
