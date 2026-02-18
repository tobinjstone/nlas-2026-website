# Scholarship Page & Google Sheets Integration — Build Instructions

## Overview

Build a scholarship application page (`scholarships.html`) for the NLAS 2026 website that submits responses directly to a Google Sheet via a Google Apps Script web app. The form should be styled to match the existing site aesthetic (notebook paper, torn edges, typewriter font).

---

## Part 1: Google Apps Script (Backend)

Create a Google Apps Script that acts as a web endpoint to receive form submissions and write them to a Google Sheet.

### Setup Steps (manual, not code)
1. Create a new Google Sheet called "NLAS 2026 Scholarship Applications"
2. Add these column headers in Row 1:
   - A: Timestamp
   - B: Name
   - C: Email
   - D: Date of Birth
   - E: Street Address
   - F: Address Line 2
   - G: City
   - H: State/Province
   - I: Zip/Postal Code
   - J: Country
   - K: Twitter Handle
   - L: Dietary Restrictions
   - M: Active Dues-Paying Member
   - N: Active Member or Lead of CNL Chapter
   - O: Which Chapter
   - P: Why Attend
   - Q: How Would You Benefit

3. Open Extensions > Apps Script and paste the following script:

### Apps Script Code (`Code.gs`)

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),                    // Timestamp
      data.name,
      data.email,
      data.dob,
      data.streetAddress,
      data.addressLine2,
      data.city,
      data.state,
      data.zip,
      data.country,
      data.twitter,
      data.dietary,
      data.duesPaying,
      data.chapterMember,
      data.whichChapter,
      data.whyAttend,
      data.howBenefit
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Deploy as a web app:
   - Click Deploy > New Deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Copy the deployment URL — this is the `APPS_SCRIPT_URL` used in the frontend

---

## Part 2: Scholarship Page (`scholarships.html`)

### File location
Place at `scholarships.html` in the project root, alongside `index.html`.

### Page structure
Use the same structure as other pages on the site:
- Same `<head>` setup (fonts, styles.css, TornPaper.js)
- Same `<nav>` as index.html
- Same `<footer>` as index.html
- Same `<div class="page-background"></div>` for the continuous background

### Page content layout

The page should have two main sections:

#### 1. Info Section
A `notebook-paper paper-torn` container (same style as the schedule/about sections on index.html) with:
- Title: "Scholarship Applications"
- Brief paragraph explaining that CNL offers need-based scholarships for NLAS 2026 attendance, covering registration fees. Mention the deadline is TBD. Keep it to 2-3 sentences.
- A note that applicants will be notified via email.

#### 2. Application Form Section
A second `notebook-paper paper-torn` container holding the actual form. Style the form to feel like it belongs on notebook paper.

### Form fields (in order)

All fields are required unless noted.

1. **Name** — text input
2. **Email** — email input
3. **Date of Birth** — date input
4. **Address block:**
   - Street Address — text input
   - Address Line 2 — text input (optional)
   - City — text input
   - State / Province — text input
   - Zip / Postal Code — text input
   - Country — `<select>` dropdown with a full list of countries (use a standard country list, default to United States at top followed by alphabetical)
5. **Twitter / X Handle** — text input, placeholder: `@handle`
6. **Dietary Restrictions** — textarea, placeholder: "e.g., vegetarian, nut allergy, none" (optional)
7. **"I am an active dues-paying member of CNL"** — radio buttons: Yes / No
8. **"I am an active member or Lead of a CNL Chapter"** — radio buttons: Yes / No
9. **"If yes, which chapter?"** — text input. This field should be visually disabled/hidden when the previous question is "No" and shown when "Yes" is selected. Use JS to toggle visibility.
10. **"Why would you like to attend the New Liberal Action Summit?"** — textarea, set a reasonable max character count (~1500 chars)
11. **"How would you benefit from attending the New Liberal Action Summit?"** — textarea, same max char count

### Submit button
- Use the `btn btn-primary` class to match site buttons
- Text: "Submit Application"

### Form behavior

At the top of the `<script>` section or in `scholarships.js` (your choice — inline is fine), define a constant:

```javascript
const APPS_SCRIPT_URL = 'REPLACE_WITH_DEPLOYMENT_URL';
```

On submit:
1. Prevent default form submission
2. Validate all required fields client-side. Show inline error messages (red text below the field) for any empty required fields.
3. Disable the submit button and change text to "Submitting..."
4. Collect all form data into a JSON object with these exact keys (must match the Apps Script):
   - `name`, `email`, `dob`, `streetAddress`, `addressLine2`, `city`, `state`, `zip`, `country`, `twitter`, `dietary`, `duesPaying`, `chapterMember`, `whichChapter`, `whyAttend`, `howBenefit`
5. POST to `APPS_SCRIPT_URL` using fetch with `mode: 'no-cors'` (Google Apps Script doesn't return proper CORS headers on free deployments, so you won't be able to read the response — treat any non-network-error as success)
6. On success: hide the form and show a success message styled on the notebook paper: "Thank you! Your application has been received. We'll be in touch via email."
7. On error: show an error message above the form and re-enable the submit button

### Form CSS

Add styles for the form to `styles.css` (or a `<style>` block on the page — either works). The form should:

- Use `font-family: var(--font-typewriter)` for labels to match the notebook aesthetic
- Use `font-family: var(--font-body)` for inputs
- Style inputs with a subtle bottom-border-only look (no full box borders) to mimic writing on notebook lines. Specifically:
  - `border: none; border-bottom: 1.5px solid rgba(44, 54, 89, 0.3);`
  - `background: transparent;`
  - `padding: 0.5rem 0.25rem;`
  - On focus: `border-bottom-color: var(--cnl-red);` with `outline: none;`
- Radio buttons can use default browser styling but labels should be in the typewriter font
- Textareas should have a light border all around (dashed, matching the schedule day cards)
- Use a single-column layout — one field per row
- Group the address fields with a subtle label "Mailing Address" above them
- Space fields with about `1.25rem` gap
- Color all text and labels `var(--cnl-blue)`
- Error messages: `color: var(--cnl-red); font-size: 0.8rem;`

### Important implementation notes

- The country `<select>` should include all countries. You can use a standard list. Place "United States" first, then a disabled separator option "───────", then the rest alphabetically.
- For the chapter question conditional visibility: use a simple `display: none` / `display: block` toggle based on the radio button state. Default to hidden.
- Do NOT use any external form libraries. Plain HTML + vanilla JS only.
- The page must be fully responsive and work on mobile, same as the rest of the site.
- Make sure the nav highlights or doesn't highlight any link (scholarships is already in the nav on index.html, so it should work).

---

## Summary of deliverables

1. `scholarships.html` — complete page with form, info section, nav, footer
2. Any new CSS added to `styles.css` (or inline on the page)
3. The Google Apps Script code block above (user will paste manually)

The `APPS_SCRIPT_URL` should be left as a placeholder string for the user to replace after deploying their script.
