# NLAS 2026 Website Build Instructions for Claude Code

## Project Overview

Build out the remaining pages for the New Liberal Action Summit 2026 website. The site uses a scrapbook/collage aesthetic with torn paper effects, notebook paper textures, and newspaper clipping-style elements.

---

## Priority: Create Reusable Components First

Before building individual pages, **extract the header and footer into reusable JavaScript components** that can be injected into each page. This allows easy updates across all pages.

### Step 1: Create `components.js`

Create a new file `components.js` with functions that return the header and footer HTML:

```javascript
// components.js - Reusable header and footer components

function getHeader(currentPage = '') {
    return `
    <!-- Navigation -->
    <nav class="main-nav">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">NLAS 2026</a>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links">
                <li><a href="index.html#about" ${currentPage === 'about' ? 'class="active"' : ''}>About</a></li>
                <li><a href="speakers.html" ${currentPage === 'speakers' ? 'class="active"' : ''}>Speakers</a></li>
                <li><a href="schedule.html" ${currentPage === 'schedule' ? 'class="active"' : ''}>Schedule</a></li>
                <li><a href="faqs.html" ${currentPage === 'faqs' ? 'class="active"' : ''}>FAQs</a></li>
                <li><a href="scholarships.html" ${currentPage === 'scholarships' ? 'class="active"' : ''}>Scholarships</a></li>
                <li><a href="sponsors.html" ${currentPage === 'sponsors' ? 'class="active"' : ''}>Sponsors</a></li>
                <li><a href="register.html" class="nav-cta">Register</a></li>
            </ul>
        </div>
    </nav>

    <!-- Continuous Background -->
    <div class="page-background"></div>
    `;
}

function getFooter() {
    return `
    <!-- Footer -->
    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <p class="footer-logo">NLAS 2026</p>
                    <p>A summit by the Center for New Liberalism</p>
                </div>
                <div class="footer-links">
                    <a href="faqs.html">FAQs</a>
                    <a href="scholarships.html">Scholarships</a>
                    <a href="sponsors.html">Become a Sponsor</a>
                    <a href="code-of-conduct.html">Code of Conduct</a>
                    <a href="mailto:events@cnliberalism.org">Contact Us</a>
                </div>
                <div class="footer-social">
                    <a href="https://twitter.com/cnliberalism" aria-label="Twitter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="https://linkedin.com/company/cnliberalism" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Center for New Liberalism. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Insert header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const currentPage = headerPlaceholder.dataset.currentPage || '';
        headerPlaceholder.outerHTML = getHeader(currentPage);
    }
    
    // Insert footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = getFooter();
    }
});
```

### Step 2: Update `script.js`

Add a call at the end to re-initialize navigation after components load:

```javascript
// Add to end of script.js
// Re-run navigation init after components are injected
if (document.getElementById('header-placeholder') || document.getElementById('footer-placeholder')) {
    // Components will trigger re-init via custom event
    document.addEventListener('componentsLoaded', () => {
        initNavigation();
    });
}
```

---

## Page Templates

Each page should follow this basic HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[PAGE TITLE] | NLAS 2026</title>
    <meta name="description" content="[PAGE DESCRIPTION]">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&family=Special+Elite&display=swap" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/berlin-sans-fb-demi" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/gh/happy358/TornPaper@v0.0.3/tornpaper.min.js"></script>
</head>
<body>
    <div id="header-placeholder" data-current-page="[PAGE_ID]"></div>

    <!-- Page Content Goes Here -->
    <main class="page-content">
        <!-- Page-specific content -->
    </main>

    <div id="footer-placeholder"></div>

    <script src="components.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

---

## Pages to Create

### 1. `speakers.html` - Full Speakers Page

**Purpose:** Extended list of all confirmed speakers with bios

**Layout:**
- Page hero with title "Featured Speakers"
- Grid of speaker clippings (same newspaper clipping style as homepage)
- Each speaker card should be expandable or link to a bio section
- Include placeholder cards for "TBA" speakers

**Content placeholder structure:**
```html
<section class="speakers-page-section">
    <h1 class="page-title section-title-light">Featured Speakers</h1>
    <p class="page-subtitle">The leaders shaping the future of liberalism</p>
    
    <div class="speakers-full-grid">
        <!-- Keynote Speakers -->
        <div class="speaker-category">
            <h2 class="category-title">Keynote Speakers</h2>
            <div class="speakers-grid">
                <!-- Speaker clippings here -->
            </div>
        </div>
        
        <!-- Panel Speakers -->
        <div class="speaker-category">
            <h2 class="category-title">Panel Speakers</h2>
            <div class="speakers-grid">
                <!-- Speaker clippings here -->
            </div>
        </div>
        
        <!-- Workshop Leaders -->
        <div class="speaker-category">
            <h2 class="category-title">Workshop Leaders</h2>
            <div class="speakers-grid">
                <!-- Speaker clippings here -->
            </div>
        </div>
    </div>
</section>
```

**CSS additions needed:**
- `.speakers-page-section` - full page layout
- `.page-title` - larger title for interior pages
- `.speaker-category` - section groupings
- `.category-title` - styled subheadings (notebook/typewriter style)
- `.speaker-bio` - expandable bio text

---

### 2. `schedule.html` - Full Schedule Page

**Purpose:** Detailed day-by-day schedule

**Layout:**
- Notebook paper style container
- Tab-style day selectors (Day 1, Day 2, Day 3)
- Time blocks with session details
- Filter by track (Policy, Training, Networking)

**Content structure:**
```html
<section class="schedule-page-section">
    <div class="notebook-paper paper-torn" style="--rotation: 0.3deg;">
        <div class="notebook-holes"><span></span><span></span><span></span></div>
        <div class="notebook-lines"></div>
        <div class="notebook-content">
            <h1 class="section-title notebook-title">Full Schedule</h1>
            
            <!-- Day Tabs -->
            <div class="schedule-tabs">
                <button class="schedule-tab active" data-day="1">Day 1 - July 15</button>
                <button class="schedule-tab" data-day="2">Day 2 - July 16</button>
                <button class="schedule-tab" data-day="3">Day 3 - July 17</button>
            </div>
            
            <!-- Day 1 Content -->
            <div class="schedule-day-content active" id="day-1">
                <div class="time-block">
                    <div class="time-slot">9:00 AM</div>
                    <div class="session-details">
                        <h3 class="session-title">Registration & Coffee</h3>
                        <p class="session-location">Main Lobby</p>
                    </div>
                </div>
                <!-- More time blocks -->
            </div>
            
            <!-- Day 2 & 3 similar structure -->
        </div>
    </div>
</section>
```

**CSS additions needed:**
- `.schedule-tabs` - tab navigation styling
- `.schedule-tab` - individual tab buttons
- `.schedule-day-content` - content container for each day
- `.time-block` - individual schedule entry
- `.time-slot` - time display (typewriter font)
- `.session-details` - session info container
- `.session-title`, `.session-location`, `.session-track`

**JS additions needed:**
- Tab switching functionality
- Optional: filter by track

---

### 3. `scholarships.html` - Scholarship Information

**Purpose:** Information about financial assistance and how to apply

**Layout:**
- Paper sheet style container
- Information sections about available scholarships
- Application process
- Eligibility requirements
- Application form or link

**Content structure:**
```html
<section class="scholarships-section">
    <div class="paper-sheet paper-torn" style="--rotation: -0.5deg;">
        <div class="paper-content">
            <h1 class="section-title">Scholarships & Financial Aid</h1>
            <p class="lead-text">We believe cost should never be a barrier to participation.</p>
            
            <div class="scholarship-info">
                <div class="info-block">
                    <h2>Available Support</h2>
                    <ul class="scholarship-list">
                        <li><strong>Full Scholarships:</strong> Cover registration, travel, and lodging</li>
                        <li><strong>Partial Scholarships:</strong> Cover registration fees</li>
                        <li><strong>Travel Grants:</strong> Assistance with transportation costs</li>
                    </ul>
                </div>
                
                <div class="info-block">
                    <h2>Who Should Apply?</h2>
                    <p>[Eligibility criteria placeholder]</p>
                </div>
                
                <div class="info-block">
                    <h2>How to Apply</h2>
                    <p>[Application process placeholder]</p>
                </div>
                
                <div class="info-block">
                    <h2>Important Dates</h2>
                    <ul class="dates-list">
                        <li><strong>Application Opens:</strong> TBD</li>
                        <li><strong>Application Deadline:</strong> TBD</li>
                        <li><strong>Notifications Sent:</strong> TBD</li>
                    </ul>
                </div>
            </div>
            
            <a href="#apply" class="btn btn-primary">Apply for Scholarship</a>
        </div>
    </div>
</section>
```

**CSS additions needed:**
- `.scholarships-section` - page layout
- `.info-block` - content sections
- `.scholarship-list`, `.dates-list` - styled lists (but NOT bullet points - use the notebook/handwritten style)

---

### 4. `faqs.html` - Frequently Asked Questions

**Purpose:** Answer common questions about the summit

**Layout:**
- Accordion-style FAQ items
- Notebook paper or index card styling
- Categories for different question types

**Content structure:**
```html
<section class="faqs-section">
    <div class="notebook-paper paper-torn" style="--rotation: 0.4deg;">
        <div class="notebook-holes"><span></span><span></span><span></span></div>
        <div class="notebook-lines"></div>
        <div class="notebook-content">
            <h1 class="section-title notebook-title">Frequently Asked Questions</h1>
            
            <div class="faq-category">
                <h2 class="category-title">General Information</h2>
                
                <div class="faq-item">
                    <button class="faq-question">
                        <span>What is NLAS?</span>
                        <span class="faq-toggle">+</span>
                    </button>
                    <div class="faq-answer">
                        <p>[Answer placeholder]</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <button class="faq-question">
                        <span>When and where is NLAS 2026?</span>
                        <span class="faq-toggle">+</span>
                    </button>
                    <div class="faq-answer">
                        <p>NLAS 2026 will take place July 15-17, 2026 in Washington, DC. Exact venue TBD.</p>
                    </div>
                </div>
                
                <!-- More FAQ items -->
            </div>
            
            <div class="faq-category">
                <h2 class="category-title">Registration & Tickets</h2>
                <!-- FAQ items -->
            </div>
            
            <div class="faq-category">
                <h2 class="category-title">Travel & Accommodations</h2>
                <!-- FAQ items -->
            </div>
        </div>
    </div>
</section>
```

**CSS additions needed:**
- `.faq-item` - individual FAQ container
- `.faq-question` - clickable question button
- `.faq-toggle` - +/- indicator
- `.faq-answer` - collapsible answer area
- Accordion animation styles

**JS additions needed:**
- FAQ accordion toggle functionality

---

### 5. `register.html` - Registration Page

**Purpose:** Main registration page with ticket options

**Layout:**
- Ticket tier cards (Early Bird, General, etc.)
- Registration form or link to external registration
- Important information about what's included

**Content structure:**
```html
<section class="register-section">
    <h1 class="page-title section-title-light">Register for NLAS 2026</h1>
    <p class="page-subtitle">Secure your spot at this year's summit</p>
    
    <!-- Ticket Options -->
    <div class="ticket-grid">
        <div class="ticket-card paper-torn" style="--rotation: -1deg;">
            <div class="ticket-header">
                <span class="ticket-type">Early Bird</span>
                <span class="ticket-price">$XX</span>
            </div>
            <div class="ticket-details">
                <p class="ticket-deadline">Available until [DATE]</p>
                <ul class="ticket-includes">
                    <li>Full conference access</li>
                    <li>Welcome reception</li>
                    <li>Meals included</li>
                    <li>Conference materials</li>
                </ul>
            </div>
            <a href="#" class="btn btn-primary">Select</a>
        </div>
        
        <div class="ticket-card paper-torn" style="--rotation: 0.8deg;">
            <div class="ticket-header">
                <span class="ticket-type">General Admission</span>
                <span class="ticket-price">$XX</span>
            </div>
            <!-- Similar structure -->
        </div>
        
        <div class="ticket-card paper-torn" style="--rotation: -0.5deg;">
            <div class="ticket-header">
                <span class="ticket-type">Student</span>
                <span class="ticket-price">$XX</span>
            </div>
            <!-- Similar structure -->
        </div>
    </div>
    
    <!-- Registration Form Area -->
    <div class="paper-sheet paper-torn" style="--rotation: 0.3deg;">
        <div class="paper-content">
            <h2>Registration Form</h2>
            <p class="form-note">Registration opens [DATE]. Check back soon!</p>
            <!-- Form placeholder or embed -->
        </div>
    </div>
</section>
```

**CSS additions needed:**
- `.ticket-grid` - responsive ticket card layout
- `.ticket-card` - individual ticket styling
- `.ticket-header`, `.ticket-type`, `.ticket-price`
- `.ticket-details`, `.ticket-includes`
- `.ticket-deadline` - urgency styling

---

### 6. `member-register.html` - Dues-Paying Member Registration

**Purpose:** Special registration path for CNL members

**Layout:**
- Similar to main registration but with member benefits highlighted
- Member verification or login
- Discounted pricing display

**Content structure:**
```html
<section class="member-register-section">
    <h1 class="page-title section-title-light">Member Registration</h1>
    <p class="page-subtitle">Exclusive benefits for CNL members</p>
    
    <div class="paper-sheet paper-torn" style="--rotation: -0.4deg;">
        <div class="paper-content">
            <div class="member-benefits">
                <h2>Your Member Benefits</h2>
                <ul class="benefits-list">
                    <li>Discounted registration rate</li>
                    <li>Priority session selection</li>
                    <li>Exclusive networking events</li>
                    <li>Members-only swag</li>
                </ul>
            </div>
            
            <div class="member-pricing">
                <div class="price-comparison">
                    <span class="regular-price">Regular: $XXX</span>
                    <span class="member-price">Your Price: $XXX</span>
                </div>
            </div>
            
            <!-- Member verification / login area -->
            <div class="member-verify">
                <h3>Verify Your Membership</h3>
                <p>[Verification form or login placeholder]</p>
            </div>
            
            <a href="#" class="btn btn-primary btn-large">Register as Member</a>
            
            <p class="not-member">Not a member yet? <a href="#">Join CNL</a> to unlock member pricing.</p>
        </div>
    </div>
</section>
```

**CSS additions needed:**
- `.member-benefits`, `.benefits-list`
- `.member-pricing`, `.price-comparison`
- `.regular-price` (strikethrough style)
- `.member-price` (highlighted)
- `.member-verify`
- `.not-member` - link styling

---

### 7. `sponsors.html` - Sponsors & Partnership Info

**Purpose:** Display current sponsors and sponsorship opportunities

**Layout:**
- Tiered sponsor logos (Platinum, Gold, Silver, etc.)
- Sponsorship package information
- Contact information for potential sponsors

**Content structure:**
```html
<section class="sponsors-section">
    <h1 class="page-title section-title-light">Our Sponsors</h1>
    <p class="page-subtitle">NLAS 2026 is made possible by our generous partners</p>
    
    <!-- Sponsor Tiers -->
    <div class="paper-sheet paper-torn" style="--rotation: 0.5deg;">
        <div class="paper-content">
            <div class="sponsor-tier">
                <h2 class="tier-title platinum">Platinum Sponsors</h2>
                <div class="sponsor-logos large">
                    <div class="sponsor-logo placeholder">Logo</div>
                </div>
            </div>
            
            <div class="sponsor-tier">
                <h2 class="tier-title gold">Gold Sponsors</h2>
                <div class="sponsor-logos medium">
                    <!-- Logos -->
                </div>
            </div>
            
            <div class="sponsor-tier">
                <h2 class="tier-title silver">Silver Sponsors</h2>
                <div class="sponsor-logos small">
                    <!-- Logos -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- Become a Sponsor -->
    <div class="notebook-paper paper-torn" style="--rotation: -0.6deg;">
        <div class="notebook-holes"><span></span><span></span><span></span></div>
        <div class="notebook-lines"></div>
        <div class="notebook-content">
            <h2 class="notebook-title">Become a Sponsor</h2>
            <p>Partner with us to reach the next generation of liberal leaders.</p>
            
            <div class="sponsorship-packages">
                <div class="package">
                    <h3>Platinum - $XX,XXX</h3>
                    <ul>[Benefits placeholder]</ul>
                </div>
                <div class="package">
                    <h3>Gold - $XX,XXX</h3>
                    <ul>[Benefits placeholder]</ul>
                </div>
                <div class="package">
                    <h3>Silver - $X,XXX</h3>
                    <ul>[Benefits placeholder]</ul>
                </div>
            </div>
            
            <a href="mailto:sponsors@cnliberalism.org" class="btn btn-outline-dark">Contact Us About Sponsorship</a>
        </div>
    </div>
</section>
```

**CSS additions needed:**
- `.sponsor-tier` - tier sections
- `.tier-title` - with tier-specific colors
- `.sponsor-logos` - grid for logos (with size variants)
- `.sponsorship-packages`, `.package`

---

## CSS Additions Summary

Add these to `styles.css`:

```css
/* ============================================
   Interior Page Styles
   ============================================ */

/* Page Content Wrapper */
.page-content {
    padding-top: calc(var(--nav-height) + 2rem);
    min-height: 100vh;
}

/* Page Titles */
.page-title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
    margin-bottom: 0.5rem;
    padding-top: 2rem;
}

.page-subtitle {
    font-size: 1.2rem;
    text-align: center;
    opacity: 0.9;
    margin-bottom: 3rem;
    color: var(--cnl-white);
}

/* Active nav link styling */
.nav-links a.active {
    color: var(--cnl-red);
}

.nav-links a.active::after {
    width: 100%;
}

/* ============================================
   Schedule Page Styles
   ============================================ */
.schedule-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    justify-content: center;
}

.schedule-tab {
    font-family: var(--font-typewriter);
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 2px dashed var(--cnl-blue);
    color: var(--cnl-blue);
    cursor: pointer;
    transition: var(--transition-smooth);
}

.schedule-tab.active,
.schedule-tab:hover {
    background: var(--cnl-blue);
    color: var(--cnl-white);
    border-style: solid;
}

.schedule-day-content {
    display: none;
}

.schedule-day-content.active {
    display: block;
}

.time-block {
    display: flex;
    gap: 1.5rem;
    padding: 1rem 0;
    border-bottom: 1px dashed rgba(44, 54, 89, 0.2);
}

.time-slot {
    font-family: var(--font-typewriter);
    font-size: 0.9rem;
    color: var(--cnl-red);
    min-width: 100px;
    flex-shrink: 0;
}

.session-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--cnl-blue);
    margin-bottom: 0.25rem;
}

.session-location {
    font-size: 0.9rem;
    color: var(--cnl-blue);
    opacity: 0.7;
}

/* ============================================
   FAQ Accordion Styles
   ============================================ */
.faq-item {
    border-bottom: 1px dashed rgba(44, 54, 89, 0.2);
    margin-bottom: 0.5rem;
}

.faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--cnl-blue);
    text-align: left;
}

.faq-toggle {
    font-size: 1.5rem;
    font-weight: 300;
    transition: var(--transition-smooth);
}

.faq-item.active .faq-toggle {
    transform: rotate(45deg);
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.faq-item.active .faq-answer {
    max-height: 500px;
    padding-bottom: 1rem;
}

.faq-answer p {
    color: var(--cnl-blue);
    line-height: 1.7;
}

/* ============================================
   Ticket Cards
   ============================================ */
.ticket-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto 3rem;
    padding: 0 2rem;
}

.ticket-card {
    background: var(--paper-cream);
    padding: 2rem;
    text-align: center;
}

.ticket-header {
    margin-bottom: 1.5rem;
}

.ticket-type {
    display: block;
    font-family: var(--font-display);
    font-size: 1.3rem;
    color: var(--cnl-blue);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
}

.ticket-price {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--cnl-red);
}

.ticket-includes {
    list-style: none;
    text-align: left;
    margin-bottom: 1.5rem;
}

.ticket-includes li {
    padding: 0.5rem 0;
    border-bottom: 1px dotted rgba(44, 54, 89, 0.2);
    color: var(--cnl-blue);
}

.ticket-includes li::before {
    content: "✓ ";
    color: var(--cnl-red);
    font-weight: bold;
}

/* ============================================
   Sponsor Page Styles
   ============================================ */
.sponsor-tier {
    margin-bottom: 2.5rem;
}

.tier-title {
    font-family: var(--font-display);
    text-align: center;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.tier-title.platinum { color: #8E8E8E; }
.tier-title.gold { color: #C9A227; }
.tier-title.silver { color: #A8A8A8; }

.sponsor-logos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
}

.sponsor-logos.large .sponsor-logo { min-width: 200px; min-height: 100px; }
.sponsor-logos.medium .sponsor-logo { min-width: 150px; min-height: 75px; }
.sponsor-logos.small .sponsor-logo { min-width: 100px; min-height: 50px; }

/* ============================================
   Member Registration Styles
   ============================================ */
.price-comparison {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.regular-price {
    text-decoration: line-through;
    color: var(--cnl-blue);
    opacity: 0.6;
    font-size: 1.2rem;
}

.member-price {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--cnl-red);
    font-weight: 700;
}

.not-member {
    margin-top: 2rem;
    text-align: center;
    color: var(--cnl-blue);
}

.not-member a {
    color: var(--cnl-red);
    font-weight: 600;
}
```

---

## JavaScript Additions

Add FAQ accordion functionality to `script.js`:

```javascript
// ============================================
// FAQ Accordion
// ============================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items (optional - remove for multi-open)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ============================================
// Schedule Tabs
// ============================================
function initScheduleTabs() {
    const tabs = document.querySelectorAll('.schedule-tab');
    const contents = document.querySelectorAll('.schedule-day-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const day = tab.dataset.day;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `day-${day}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... existing init calls ...
    initFAQAccordion();
    initScheduleTabs();
});
```

---

## File Structure After Completion

```
/
├── index.html
├── speakers.html
├── schedule.html
├── scholarships.html
├── faqs.html
├── register.html
├── member-register.html
├── sponsors.html
├── code-of-conduct.html (optional)
├── styles.css
├── script.js
├── components.js (NEW)
└── assets/
    ├── logo.png
    ├── background.png
    └── speakers/
        ├── fukuyama.jpg
        ├── auchincloss.jpg
        ├── bennet.jpg
        └── [additional speaker photos]
```

---

## Implementation Order

1. **First:** Create `components.js` with header/footer functions
2. **Second:** Add CSS additions to `styles.css`
3. **Third:** Add JS functions to `script.js` (FAQ, tabs)
4. **Fourth:** Create pages in this order:
   - `faqs.html` (simplest structure)
   - `schedule.html` (needs tab JS)
   - `speakers.html` (extends existing pattern)
   - `scholarships.html`
   - `sponsors.html`
   - `register.html`
   - `member-register.html`

---

## Notes

- All pages should maintain the scrapbook/collage aesthetic
- Keep torn paper effects on major content containers
- Use notebook paper style for text-heavy sections
- Use newspaper clipping style for speaker cards and similar items
- Maintain responsive behavior matching the homepage
- All placeholder content is marked with brackets like `[PLACEHOLDER]`
- Colors, fonts, and design tokens are already defined in CSS variables
