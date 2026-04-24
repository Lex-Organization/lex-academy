# Lesson 3 (Module 2) — Forms & Validation

## Lesson Context
This is a 4-hour hands-on session. Remember: you are warm, conversational, and human. Follow the teaching style from the preamble above.

The student is building a real project throughout the course: **an embroidery e-commerce store** for custom t-shirts and embroidery work.

**Previous days completed:**
- Module 1: HTML5 semantics, accessibility, CSS flexbox/grid/responsive, JavaScript basics (variables, types, functions, arrays, objects, array methods), ES2024+ features (destructuring, spread, optional chaining). Built static embroidery store landing page with product data and filtering/sorting functions.
- Module 2, Lesson 1: DOM manipulation -- querySelector, createElement, DocumentFragment, textContent vs innerHTML. Built dynamic product catalog rendered from JS data array.
- Module 2, Lesson 2: Events -- addEventListener, event object, bubbling, capturing, stopPropagation. Event delegation with closest(). Built "Add to Cart" with event delegation and cart count display.

**Today's focus:** HTML form elements, FormData API, client-side validation, real-time validation
**Today's build:** Contact form with validation and newsletter signup for the embroidery store

**Story so far:** The store renders products dynamically and has working "Add to Cart" buttons. But there is no way for customers to reach out, subscribe to updates, or provide any input beyond clicking buttons. Today the student learns HTML forms -- the other half of web interactivity. Forms are how users talk back to the application.

**Work folder:** `workspace/vanilla-store`

## Hour 1: HTML Form Elements (60 min)

### The Form Element

Every group of inputs that should be submitted together belongs in a `<form>`. The form element is a semantic container that provides built-in features: keyboard submission (Enter key), built-in validation, and the FormData API.

```html
<form id="contact-form" novalidate>
  <!-- novalidate: we'll handle validation ourselves in JS -->
  <!-- Without novalidate, the browser shows its own ugly tooltips -->
</form>
```

Ask: "Why add `novalidate` to the form? Aren't browser tooltips helpful?" (They are ugly, inconsistent across browsers, hard to style, and limited in what they can express. Custom validation gives full control.)

### Input Types

Walk through the input types relevant to the embroidery store:

```html
<!-- Text input -->
<label for="customer-name">Full Name</label>
<input type="text" id="customer-name" name="name" required minlength="2" maxlength="100"
       placeholder="Jane Smith" autocomplete="name">

<!-- Email -->
<label for="customer-email">Email Address</label>
<input type="email" id="customer-email" name="email" required
       placeholder="jane@example.com" autocomplete="email">

<!-- Phone -->
<label for="customer-phone">Phone Number</label>
<input type="tel" id="customer-phone" name="phone"
       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="555-123-4567" autocomplete="tel">

<!-- Number (for quantity) -->
<label for="quantity">Quantity</label>
<input type="number" id="quantity" name="quantity" min="1" max="99" value="1" step="1">

<!-- URL (for custom design reference) -->
<label for="design-url">Reference Design URL (optional)</label>
<input type="url" id="design-url" name="designUrl" placeholder="https://pinterest.com/pin/...">

<!-- Hidden field -->
<input type="hidden" name="formType" value="contact">
```

**Exercise:** Ask the student to identify which input type and attributes to use for each of these embroidery store fields:
1. Customer's name
2. Customer's email
3. The embroidery text they want stitched on a product
4. How many items they want
5. Their preferred thread color (from a fixed list)
6. A message for the store team

### Select, Textarea, Checkbox, Radio

```html
<!-- Select dropdown -->
<label for="thread-color">Thread Color</label>
<select id="thread-color" name="threadColor" required>
  <option value="">Choose a color...</option>
  <option value="gold">Gold</option>
  <option value="silver">Silver</option>
  <option value="navy">Navy</option>
  <option value="burgundy">Burgundy</option>
  <option value="forest-green">Forest Green</option>
  <option value="black">Black</option>
  <option value="white">White</option>
</select>

<!-- Textarea -->
<label for="message">Message</label>
<textarea id="message" name="message" rows="4" maxlength="500"
          placeholder="Tell us about your custom embroidery idea..."></textarea>

<!-- Checkboxes (multiple selections) -->
<fieldset>
  <legend>Embroidery Placement</legend>
  <label><input type="checkbox" name="placement" value="chest"> Chest</label>
  <label><input type="checkbox" name="placement" value="back"> Back</label>
  <label><input type="checkbox" name="placement" value="sleeve"> Sleeve</label>
  <label><input type="checkbox" name="placement" value="collar"> Collar</label>
</fieldset>

<!-- Radio buttons (single selection) -->
<fieldset>
  <legend>Order Priority</legend>
  <label><input type="radio" name="priority" value="standard" checked> Standard (7-10 days)</label>
  <label><input type="radio" name="priority" value="rush"> Rush (3-5 days, +$15)</label>
  <label><input type="radio" name="priority" value="express"> Express (1-2 days, +$35)</label>
</fieldset>
```

Ask: "When should you use checkboxes vs radio buttons?" (Checkboxes for multiple selections, radio buttons for exactly one choice from a group.)

Ask: "Why use `<fieldset>` and `<legend>` for checkbox and radio groups?" (Screen readers announce the legend as context for each option -- without it, a screen reader user hears "Chest" with no context about what "Chest" means.)

### The FormData API

FormData makes it straightforward to read all form values at once:

```javascript
document.querySelector("#contact-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  // Read individual values
  const name = formData.get("name");          // string
  const email = formData.get("email");        // string
  const placement = formData.getAll("placement"); // ["chest", "sleeve"] (for checkboxes)

  // Convert to a plain object
  const data = Object.fromEntries(formData);
  console.log(data);
  // { name: "Jane", email: "jane@example.com", threadColor: "gold", ... }

  // Note: Object.fromEntries loses multiple values for the same name
  // For checkboxes, use formData.getAll("placement") instead
});
```

**Exercise:** Build a basic contact form in HTML with: name, email, message, and a submit button. Add a submit handler that reads values with FormData and logs them to the console. Verify in DevTools that the data is correct.

**Confidence check.** Can the student build an HTML form with various input types and read values with FormData? (1-5)

## Hour 2: Form Validation (60 min)

### Built-in HTML Validation Attributes

Walk through the constraint validation attributes:

```html
<!-- required: field must have a value -->
<input type="text" name="name" required>

<!-- minlength/maxlength: text length bounds -->
<input type="text" name="name" required minlength="2" maxlength="100">

<!-- min/max: number bounds -->
<input type="number" name="quantity" min="1" max="99">

<!-- pattern: regex match -->
<input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">

<!-- type-based: email, url, number have built-in format validation -->
<input type="email" name="email" required>
```

### Custom Validation with JavaScript

The built-in attributes cover common cases, but custom logic requires JavaScript:

```javascript
function validateField(input) {
  const value = input.value.trim();
  const fieldName = input.name;

  // Clear previous error
  clearError(input);

  // Required check
  if (input.required && !value) {
    return showError(input, `${getLabel(input)} is required`);
  }

  // Field-specific validation
  switch (fieldName) {
    case "name":
      if (value.length < 2) return showError(input, "Name must be at least 2 characters");
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return showError(input, "Name can only contain letters, spaces, hyphens, and apostrophes");
      break;

    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return showError(input, "Please enter a valid email address");
      break;

    case "message":
      if (value.length < 10) return showError(input, "Message must be at least 10 characters");
      if (value.length > 500) return showError(input, `Message is too long (${value.length}/500 characters)`);
      break;

    case "quantity":
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) return showError(input, "Quantity must be at least 1");
      if (num > 99) return showError(input, "Maximum quantity is 99");
      break;
  }

  return true; // valid
}
```

### Showing Error Messages

```javascript
function showError(input, message) {
  const wrapper = input.closest(".form-field");
  const errorEl = wrapper.querySelector(".field-error");

  input.classList.add("invalid");
  input.setAttribute("aria-invalid", "true");

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    input.setAttribute("aria-describedby", errorEl.id);
  }

  return false;
}

function clearError(input) {
  const wrapper = input.closest(".form-field");
  const errorEl = wrapper.querySelector(".field-error");

  input.classList.remove("invalid");
  input.removeAttribute("aria-invalid");

  if (errorEl) {
    errorEl.textContent = "";
    errorEl.hidden = true;
  }
}

function getLabel(input) {
  const label = document.querySelector(`label[for="${input.id}"]`);
  return label ? label.textContent : input.name;
}
```

### HTML Structure for Validation

```html
<div class="form-field">
  <label for="customer-name">Full Name <span class="required" aria-hidden="true">*</span></label>
  <input type="text" id="customer-name" name="name" required minlength="2"
         aria-required="true">
  <p class="field-error" id="name-error" hidden role="alert"></p>
</div>
```

### Real-Time Validation with Input Events

```javascript
// Validate on blur (when the user leaves the field)
document.querySelectorAll("#contact-form input, #contact-form textarea, #contact-form select")
  .forEach(input => {
    input.addEventListener("blur", () => validateField(input));
  });

// Validate on input (while typing) -- only AFTER the field has been blurred once
// This avoids showing errors while the user is still typing for the first time
const touchedFields = new Set();

document.querySelector("#contact-form").addEventListener("focusout", (e) => {
  if (e.target.matches("input, textarea, select")) {
    touchedFields.add(e.target.name);
    validateField(e.target);
  }
});

document.querySelector("#contact-form").addEventListener("input", (e) => {
  if (touchedFields.has(e.target.name)) {
    validateField(e.target);
  }
});
```

Ask: "Why validate on input only after the field has been touched? Why not validate every keystroke from the start?" (Showing an error before the user has finished typing is annoying and confusing. Validate on blur first, then on input for immediate feedback while they correct the error.)

**Exercise:** Implement the validation pattern: validate on blur, then on input for touched fields. Test by:
1. Tabbing through the form without entering anything -- errors appear on blur
2. Going back to a field and typing -- errors update in real-time
3. Entering valid data -- errors disappear immediately

### Full Form Submission

```javascript
document.querySelector("#contact-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.target;
  const inputs = form.querySelectorAll("input, textarea, select");

  // Validate all fields
  let isValid = true;
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    // Focus the first invalid field
    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // All valid -- collect data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  console.log("Form submitted:", data);

  // Show success state
  showSuccessMessage(form);
});

function showSuccessMessage(form) {
  form.innerHTML = `
    <div class="form-success" role="alert">
      <h3>Thank you!</h3>
      <p>We've received your message and will get back to you within 24 hours.</p>
    </div>
  `;
}
```

**Confidence check.** Can the student validate form fields, show/clear errors, and handle form submission? (1-5)

## Hour 3: Build -- Contact Form and Newsletter Signup (60 min)

### The Goal
Build two forms for the embroidery store: a contact/custom order request form and a newsletter signup form. Both with full client-side validation and accessible error messages.

### Form 1: Contact / Custom Order Form

This form lets customers reach out about custom embroidery work:

**Fields:**
- Full name (required, min 2 characters)
- Email (required, valid email format)
- Phone (optional, pattern-validated)
- Order type (select: "Custom Embroidery", "Bulk Order", "Repair/Alteration", "General Question")
- Preferred thread color (select, required if order type is Custom Embroidery)
- Embroidery text (text input, max 50 characters, required for Custom Embroidery)
- Message (textarea, required, min 10 characters, max 500 characters with live counter)
- Submit button

**Behavior:**
- Validate on blur, then on input for touched fields
- Character counter on message field: "23/500 characters"
- Thread color and embroidery text fields show/hide based on order type selection
- On submit: validate all, focus first invalid field, or show success
- Success message replaces the form with a thank-you note

### Form 2: Newsletter Signup

A compact form in the footer:

**Fields:**
- Email (required, valid email)
- Interest checkboxes: "New Products", "Sale Alerts", "Design Inspiration", "Custom Order Updates"
- At least one interest must be selected
- Submit button: "Subscribe"

**Behavior:**
- Inline validation on the email field
- Custom validation: at least one checkbox selected
- On submit: show "Subscribed!" confirmation inline
- If already subscribed (check localStorage), show "You're already subscribed" message

### Implementation Guidance

The student drives. Guide them through:

1. **HTML structure first** -- semantic form with fieldsets, labels, error containers
2. **CSS styling** -- form layout (stack on mobile, two-column on desktop), error states (red border, error text), focus styles
3. **Validation logic** -- field validators, error display, touched-field tracking
4. **Conditional fields** -- show/hide thread color and embroidery text based on order type
5. **Character counter** -- live count on the message textarea
6. **Form submission** -- collect data, validate, show success

Let the student build each piece and test it before moving on.

**Acceptance criteria:**
- Both forms have proper labels, fieldsets, and ARIA attributes
- Validation errors show on blur, update in real-time for touched fields
- First invalid field receives focus on submit
- Conditional fields appear/disappear based on order type
- Character counter updates in real-time
- Newsletter checks localStorage for existing subscription
- Success messages display after valid submission
- Forms look polished on mobile and desktop

## Hour 4: Review + Stretch (60 min)

### Code Review
Review the student's form code. Look for:
- Are all inputs associated with labels via `for`/`id`?
- Do error messages have `role="alert"` or use `aria-live`?
- Is `aria-invalid` set on invalid fields?
- Is `aria-describedby` pointing errors to their field?
- Does the error state include both a visual indicator (red border) and a text message?
- Are form fields in a logical tab order?
- Does Enter key submit the form?
- Is the success message accessible (screen reader announces it)?

### Stretch: Form Accessibility Deep Dive

Walk through the accessibility requirements for forms:

```html
<!-- Labels: every input needs one -->
<label for="customer-name">Full Name</label>
<input type="text" id="customer-name" name="name">

<!-- Required indicator -->
<label for="email">Email <span class="required" aria-hidden="true">*</span></label>
<input type="email" id="email" name="email" aria-required="true" required>
<!-- The asterisk is hidden from screen readers; aria-required announces "required" -->

<!-- Error association -->
<input type="email" id="email" name="email" aria-invalid="true" aria-describedby="email-error email-hint">
<p id="email-hint" class="field-hint">We'll never share your email</p>
<p id="email-error" class="field-error" role="alert">Please enter a valid email address</p>

<!-- Group labels for checkboxes/radios -->
<fieldset>
  <legend>Embroidery Placement</legend>
  <label><input type="checkbox" name="placement" value="chest"> Chest</label>
</fieldset>

<!-- Error announcement for screen readers -->
<div class="sr-only" aria-live="assertive" id="form-errors"></div>
```

**Exercise:** Tab through the contact form using only the keyboard. Can the student:
1. Reach every field with Tab?
2. Select checkboxes and radio buttons with Space?
3. Open and navigate the select dropdown with arrows?
4. Submit with Enter?
5. Hear error messages announced? (Test with a screen reader or check aria attributes)

### Stretch: Inline Error Animation

Add smooth error appearance with CSS:

```css
.field-error {
  color: #dc2626;
  font-size: 0.875rem;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.2s ease, opacity 0.2s ease, margin 0.2s ease;
}

.field-error:not([hidden]) {
  max-height: 3rem;
  opacity: 1;
  margin-top: 0.25rem;
}

.form-field input.invalid,
.form-field textarea.invalid,
.form-field select.invalid {
  border-color: #dc2626;
  box-shadow: 0 0 0 1px #dc2626;
}

.form-field input:focus.invalid {
  box-shadow: 0 0 0 2px #dc2626;
}
```

### Key Takeaways
1. Use `novalidate` on forms and handle validation in JavaScript for full control over error messages and timing. The built-in browser validation is inconsistent and hard to style.
2. Validate on blur first, then on input for touched fields. This gives users a chance to finish typing before showing errors, but gives immediate feedback once they start correcting.
3. Form accessibility is not optional: every input needs a label, every error needs `aria-invalid` and `aria-describedby`, and error announcements need `role="alert"` or `aria-live`. Inaccessible forms lose customers.

### Coming Up Next
The store has product rendering, event handling, and forms. In the next lesson, the student learns modern JavaScript features (destructuring, spread, optional chaining) in depth and builds a sliding cart drawer with add/remove/update quantity functionality.

## Student Support

### Before You Start
Open `workspace/vanilla-store` and start from the last committed version of the store. Run the project if this is a build lesson, then make sure the previous lesson's checklist is complete.

**Folder:** `workspace/vanilla-store`

### Where This Fits
You are growing the vanilla JavaScript version of the embroidery store. The goal is to understand the platform before frameworks enter the picture.

### Expected Outcome
By the end of this lesson, the student should have: **Contact form with validation and newsletter signup for the embroidery store**.

### Acceptance Criteria
- You can explain today's focus in your own words: HTML form elements, FormData API, client-side validation, real-time validation.
- The expected outcome is present and reviewable: Contact form with validation and newsletter signup for the embroidery store.
- Any code or project notes are saved under `workspace/vanilla-store`.
- You tested or reviewed the work using the lesson's instructions, not just by assuming it is done.
- You can name one thing you would improve next if you had another hour.

### If You Get Stuck
Copy one of these prompts into the assistant instead of pushing through silently:

```text
I am stuck on today's focus: HTML form elements, FormData API, client-side validation, real-time validation. Ask me one diagnostic question at a time and help me find the smallest next step. Do not solve the whole lesson for me.
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
- [ ] Built HTML forms with input types: text, email, tel, number, url, select, textarea, checkbox, radio
- [ ] Used `<label>`, `<fieldset>`, and `<legend>` correctly for all form elements
- [ ] Read form values with the FormData API and `Object.fromEntries`
- [ ] Implemented custom validation with `validateField()` showing inline error messages
- [ ] Validation fires on blur, then on input for already-touched fields
- [ ] First invalid field receives focus on form submit
- [ ] Built contact form with conditional fields (thread color/embroidery text appear based on order type)
- [ ] Built character counter on the message textarea
- [ ] Built newsletter signup with checkbox validation (at least one interest selected)
- [ ] Success messages display after valid submission
- [ ] All forms have `aria-required`, `aria-invalid`, `aria-describedby`, and `role="alert"` on errors
- [ ] Forms are fully keyboard-navigable (Tab, Space, Enter, arrow keys)
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
