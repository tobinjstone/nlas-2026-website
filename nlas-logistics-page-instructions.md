# NLAS 2026 Logistics/Travel Page — Claude Code Instructions

## Overview

Create a new page (`logistics.html`) for the NLAS 2026 conference website that provides attendees with lodging, venue, and travel information. The page must seamlessly match the existing scrapbook/torn paper aesthetic established in `index.html` and `styles.css`.

---

## 1. Pre-Implementation Checklist

Before writing any code, review these existing files to understand the design system:

```bash
# Review existing files
cat index.html      # Page structure, nav, footer patterns
cat styles.css      # CSS variables, paper effects, responsive breakpoints
cat script.js       # JS initialization (TornPaper.js, navigation)
```

### Key Design Tokens to Reuse

From `styles.css`:
```css
--cnl-red: #9F3C39;
--cnl-blue: #2C3659;
--cnl-white: #FDFBE9;
--paper-cream: #FDFBE9;
--font-display: 'Berlin Sans FB Demi', sans-serif;
--font-body: 'Source Sans 3', 'Segoe UI', sans-serif;
--font-typewriter: 'Special Elite', 'Courier New', monospace;
```

---

## 2. File Structure

Create/modify these files:

```
├── logistics.html          # NEW - Main logistics page
├── styles.css              # MODIFY - Add new polaroid styles
├── index.html              # MODIFY - Add nav link (optional)
├── assets/
│   └── logistics/          # NEW - Create folder for images
│       ├── hilton-garden-inn.jpg
│       ├── woolly-mammoth.jpg
│       ├── dc-metro.jpg
│       └── [placeholder images]
```

---

## 3. HTML Structure (`logistics.html`)

### 3.1 Document Head

Copy the exact `<head>` structure from `index.html`, updating only:
- `<title>`: "Logistics & Travel | NLAS 2026"
- `<meta name="description">`: "Plan your trip to NLAS 2026. Find lodging, venue, and transportation information for the New Liberal Action Summit in Washington, DC."

### 3.2 Navigation

Copy the **exact** navigation markup from `index.html`. Add an active state to the Logistics link if you add it to the nav.

### 3.3 Page Hero (Simplified)

Create a smaller hero section (not full-height like homepage):

```html
<header class="page-hero">
    <div class="page-hero-content">
        <h1 class="page-title">Logistics & Travel</h1>
        <p class="page-subtitle">Everything you need to plan your trip to NLAS 2026</p>
    </div>
</header>
```

### 3.4 Section Structure

The page has **three main sections**, each using a paper sheet container with polaroid photo cards inside:

```html
<!-- LODGING SECTION -->
<section id="lodging" class="logistics-section">
    <div class="paper-sheet paper-torn" style="--rotation: -0.5deg;">
        <div class="paper-content">
            <h2 class="section-title">Lodging</h2>
            
            <div class="logistics-grid">
                <!-- Primary Hotel - Polaroid Card -->
                <div class="polaroid-card paper-torn" style="--rotation: 1.2deg;">
                    <div class="polaroid-photo">
                        <img src="assets/logistics/hilton-garden-inn.jpg" alt="Hilton Garden Inn">
                    </div>
                    <div class="polaroid-caption">
                        <h3>Stay With Us at Hilton Garden Inn</h3>
                        <p>We've secured a special room block at the Hilton Garden Inn Washington DC/U.S. Capitol...</p>
                        <p class="booking-note">[Booking details and link coming soon]</p>
                    </div>
                </div>
                
                <!-- Other Options - Text Card -->
                <div class="info-card paper-torn" style="--rotation: -0.8deg;">
                    <h3>Other Options</h3>
                    <p>DC has plenty of accommodation options...</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- VENUES SECTION -->
<section id="venues" class="logistics-section">
    <div class="notebook-paper paper-torn" style="--rotation: 0.6deg;">
        <div class="notebook-holes">
            <span></span><span></span><span></span>
        </div>
        <div class="notebook-lines"></div>
        <div class="notebook-content">
            <h2 class="section-title notebook-title">Venues</h2>
            
            <div class="venue-feature">
                <div class="polaroid-card polaroid-large paper-torn" style="--rotation: -1deg;">
                    <div class="polaroid-photo">
                        <img src="assets/logistics/woolly-mammoth.jpg" alt="Woolly Mammoth Theatre">
                    </div>
                    <div class="polaroid-caption">
                        <h3>Woolly Mammoth Theatre Company</h3>
                        <p class="venue-tagline">Main Conference Venue — July 16</p>
                    </div>
                </div>
                
                <div class="venue-details">
                    <p>We're excited to return to Woolly Mammoth Theatre Company...</p>
                    <p class="venue-address">
                        <svg><!-- Map pin icon --></svg>
                        641 D Street NW, Washington, DC 20004
                    </p>
                    <p class="venue-note">Additional venues for workshops and evening events will be announced soon.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- TRAVEL SECTION -->
<section id="travel" class="logistics-section">
    <div class="paper-sheet paper-torn" style="--rotation: -0.3deg;">
        <div class="paper-content">
            <h2 class="section-title">Travel</h2>
            
            <div class="travel-grid">
                <!-- Getting to DC -->
                <div class="travel-subsection">
                    <h3 class="subsection-title">Getting to DC</h3>
                    <p>The nation's capital is served by three major airports:</p>
                    
                    <div class="airport-cards">
                        <div class="airport-card">
                            <span class="airport-code">DCA</span>
                            <span class="airport-name">Reagan National</span>
                            <span class="airport-note">Closest to downtown, Metro connected</span>
                        </div>
                        <div class="airport-card">
                            <span class="airport-code">IAD</span>
                            <span class="airport-name">Dulles International</span>
                            <span class="airport-note">Main international hub, ~30 mi from downtown</span>
                        </div>
                        <div class="airport-card">
                            <span class="airport-code">BWI</span>
                            <span class="airport-name">Baltimore/Washington</span>
                            <span class="airport-note">Alternative with train connections</span>
                        </div>
                    </div>
                </div>
                
                <!-- Getting Around -->
                <div class="travel-subsection">
                    <h3 class="subsection-title">Getting Around</h3>
                    
                    <div class="polaroid-card paper-torn" style="--rotation: 0.8deg;">
                        <div class="polaroid-photo">
                            <img src="assets/logistics/dc-metro.jpg" alt="DC Metro">
                        </div>
                        <div class="polaroid-caption">
                            <p class="polaroid-handwriting">The Metro is your best friend!</p>
                        </div>
                    </div>
                    
                    <div class="metro-info">
                        <p>DC's Metro system is your best friend during NLAS...</p>
                        
                        <div class="metro-stops">
                            <div class="metro-stop">
                                <div class="metro-lines">
                                    <span class="metro-dot red"></span>
                                    <span class="metro-dot green"></span>
                                    <span class="metro-dot yellow"></span>
                                </div>
                                <div class="metro-details">
                                    <strong>Woolly Mammoth</strong>
                                    <span>Gallery Place-Chinatown</span>
                                </div>
                            </div>
                            <div class="metro-stop">
                                <div class="metro-lines">
                                    <span class="metro-dot red"></span>
                                </div>
                                <div class="metro-details">
                                    <strong>Hilton Garden Inn</strong>
                                    <span>Union Station or NoMa-Gallaudet U</span>
                                </div>
                            </div>
                        </div>
                        
                        <p class="smartrip-tip">💳 We recommend getting a SmarTrip card for seamless travel throughout the weekend.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

### 3.5 Footer

Copy the **exact** footer markup from `index.html`.

---

## 4. CSS Additions (`styles.css`)

Add these new styles at the end of the existing stylesheet:

### 4.1 Page Hero (Subpages)

```css
/* ============================================
   Page Hero (Subpages)
   ============================================ */
.page-hero {
    min-height: 35vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: calc(var(--nav-height) + 2rem);
    padding-bottom: 2rem;
    text-align: center;
}

.page-title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    color: var(--cnl-white);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.4);
    margin-bottom: 0.5rem;
}

.page-subtitle {
    font-family: var(--font-body);
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: var(--cnl-white);
    opacity: 0.9;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}
```

### 4.2 Logistics Section Base

```css
/* ============================================
   Logistics Page
   ============================================ */
.logistics-section {
    padding: 3rem 2rem;
}

.logistics-section .paper-sheet,
.logistics-section .notebook-paper {
    max-width: 1000px;
}

.logistics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
}

@media (max-width: 768px) {
    .logistics-grid {
        grid-template-columns: 1fr;
    }
}
```

### 4.3 Polaroid Card Styles (KEY COMPONENT)

```css
/* ============================================
   Polaroid Cards
   ============================================ */
.polaroid-card {
    background: var(--paper-cream);
    padding: 0.75rem 0.75rem 1.5rem;
    transform: rotate(var(--rotation, 0deg));
    transition: var(--transition-smooth);
    max-width: 300px;
}

.polaroid-card:hover {
    transform: rotate(var(--rotation, 0deg)) scale(1.03) translateY(-5px);
    z-index: 10;
}

.polaroid-card.paper-torn {
    filter: url(#filter_tornpaper)
            drop-shadow(0 4px 8px var(--paper-shadow))
            drop-shadow(0 10px 35px rgba(0, 0, 0, 0.15));
}

.polaroid-card.paper-torn:hover {
    filter: url(#filter_tornpaper)
            drop-shadow(0 8px 16px var(--paper-shadow))
            drop-shadow(0 15px 50px rgba(0, 0, 0, 0.25));
}

.polaroid-photo {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    background: #e0e0e0;
    margin-bottom: 1rem;
}

.polaroid-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: contrast(1.02) saturate(0.95);
    transition: var(--transition-smooth);
}

.polaroid-card:hover .polaroid-photo img {
    filter: contrast(1.05) saturate(1);
}

.polaroid-caption {
    text-align: center;
    color: var(--cnl-blue);
}

.polaroid-caption h3 {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 0.5rem;
}

.polaroid-caption p {
    font-size: 0.9rem;
    line-height: 1.5;
}

/* Handwriting style for captions */
.polaroid-handwriting {
    font-family: var(--font-typewriter);
    font-size: 0.95rem !important;
    transform: rotate(-1deg);
    display: inline-block;
}

/* Larger polaroid variant for featured content */
.polaroid-large {
    max-width: 400px;
    padding: 1rem 1rem 2rem;
}

.polaroid-large .polaroid-photo {
    aspect-ratio: 4/3;
}

.polaroid-large .polaroid-caption h3 {
    font-size: 1.2rem;
}

.venue-tagline {
    font-family: var(--font-typewriter);
    font-size: 0.85rem !important;
    color: var(--cnl-red);
    margin-top: 0.25rem;
}
```

### 4.4 Info Cards (Text-Only Alternative)

```css
/* ============================================
   Info Cards
   ============================================ */
.info-card {
    background: var(--paper-cream);
    padding: 1.5rem;
    transform: rotate(var(--rotation, 0deg));
    color: var(--cnl-blue);
}

.info-card.paper-torn {
    filter: url(#filter_tornpaper)
            drop-shadow(0 3px 6px var(--paper-shadow))
            drop-shadow(0 8px 25px rgba(0, 0, 0, 0.12));
}

.info-card h3 {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 0.75rem;
    color: var(--cnl-red);
}

.info-card p {
    font-size: 0.95rem;
    line-height: 1.7;
}

.booking-note {
    font-family: var(--font-typewriter);
    font-size: 0.85rem !important;
    color: var(--cnl-blue);
    opacity: 0.7;
    font-style: italic;
    margin-top: 1rem;
}
```

### 4.5 Venue Section Specifics

```css
/* ============================================
   Venue Feature Layout
   ============================================ */
.venue-feature {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2.5rem;
    align-items: start;
}

.venue-details {
    color: var(--cnl-blue);
}

.venue-details p {
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 1rem;
}

.venue-address {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-typewriter);
    font-size: 0.95rem !important;
    background: rgba(44, 54, 89, 0.05);
    padding: 0.75rem 1rem;
    border-radius: 4px;
    border-left: 3px solid var(--cnl-red);
}

.venue-address svg {
    width: 18px;
    height: 18px;
    color: var(--cnl-red);
    flex-shrink: 0;
}

.venue-note {
    font-style: italic;
    opacity: 0.7;
}

@media (max-width: 768px) {
    .venue-feature {
        grid-template-columns: 1fr;
    }
    
    .venue-feature .polaroid-large {
        margin: 0 auto;
    }
}
```

### 4.6 Travel Section Specifics

```css
/* ============================================
   Travel Section
   ============================================ */
.travel-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
}

.travel-subsection {
    color: var(--cnl-blue);
}

.subsection-title {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--cnl-red);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(159, 60, 57, 0.3);
}

/* Airport Cards */
.airport-cards {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
}

.airport-card {
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-rows: auto auto;
    gap: 0.25rem 0.75rem;
    padding: 0.75rem;
    background: rgba(44, 54, 89, 0.03);
    border-radius: 4px;
    border: 1px dashed rgba(44, 54, 89, 0.15);
    transition: var(--transition-smooth);
}

.airport-card:hover {
    background: rgba(44, 54, 89, 0.07);
    border-color: var(--cnl-red);
}

.airport-code {
    grid-row: 1 / 3;
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--cnl-blue);
    display: flex;
    align-items: center;
    justify-content: center;
}

.airport-name {
    font-weight: 600;
    font-size: 0.95rem;
}

.airport-note {
    font-size: 0.8rem;
    opacity: 0.7;
}

/* Metro Info */
.metro-info {
    margin-top: 1.5rem;
}

.metro-info > p {
    font-size: 0.95rem;
    line-height: 1.7;
    margin-bottom: 1rem;
}

.metro-stops {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
}

.metro-stop {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: rgba(44, 54, 89, 0.03);
    border-radius: 4px;
}

.metro-lines {
    display: flex;
    gap: 0.35rem;
}

.metro-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
}

.metro-dot.red { background: #BF0D3E; }
.metro-dot.green { background: #00B140; }
.metro-dot.yellow { background: #FFD200; }

.metro-details {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.metro-details strong {
    font-size: 0.95rem;
}

.metro-details span {
    font-size: 0.85rem;
    opacity: 0.7;
}

.smartrip-tip {
    font-family: var(--font-typewriter);
    font-size: 0.9rem !important;
    background: rgba(159, 60, 57, 0.08);
    padding: 1rem;
    border-radius: 4px;
    border-left: 3px solid var(--cnl-red);
}

@media (max-width: 768px) {
    .travel-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .travel-subsection .polaroid-card {
        margin: 1.5rem auto;
    }
}
```

---

## 5. Navigation Update

Add the Logistics page to the navigation in **both** `index.html` and `logistics.html`:

```html
<ul class="nav-links">
    <li><a href="index.html#about">About</a></li>
    <li><a href="index.html#speakers">Speakers</a></li>
    <li><a href="index.html#schedule">Schedule</a></li>
    <li><a href="logistics.html">Logistics</a></li>  <!-- ADD THIS -->
    <li><a href="faqs.html">FAQs</a></li>
    <li><a href="scholarships.html">Scholarships</a></li>
    <li><a href="sponsors.html">Sponsors</a></li>
    <li><a href="register.html" class="nav-cta">Register</a></li>
</ul>
```

---

## 6. Placeholder Images

Create placeholder images or use these specifications:

| Image | Dimensions | Content |
|-------|------------|---------|
| `hilton-garden-inn.jpg` | 600x600px | Hotel exterior/lobby |
| `woolly-mammoth.jpg` | 800x600px | Theatre interior/exterior |
| `dc-metro.jpg` | 600x600px | Metro train/station |

If creating placeholders programmatically:

```html
<!-- Placeholder photo styling -->
<div class="polaroid-photo placeholder-photo">
    <span class="placeholder-icon">📍</span>
    <span class="placeholder-text">Photo Coming Soon</span>
</div>
```

```css
.placeholder-photo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(44, 54, 89, 0.08);
    gap: 0.5rem;
}

.placeholder-icon {
    font-size: 2.5rem;
}

.placeholder-text {
    font-family: var(--font-typewriter);
    font-size: 0.8rem;
    color: var(--cnl-blue);
    opacity: 0.5;
}
```

---

## 7. SVG Filter Requirement

**CRITICAL**: The torn paper effect requires the TornPaper.js SVG filter. Ensure the `<body>` includes the script initialization:

```html
<script src="https://cdn.jsdelivr.net/gh/happy358/TornPaper@v0.0.3/tornpaper.min.js"></script>
<script src="script.js"></script>
```

The filter is initialized in `script.js` via `initTornPaper()`.

---

## 8. Accessibility Checklist

- [ ] All images have descriptive `alt` text
- [ ] Color contrast meets WCAG AA standards
- [ ] Interactive elements are keyboard accessible
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Links have clear, descriptive text

---

## 9. Testing Checklist

- [ ] Navigation works on mobile (hamburger menu)
- [ ] Torn paper effects render correctly
- [ ] Page is responsive at all breakpoints (480px, 768px, 968px)
- [ ] All internal links work
- [ ] Polaroid hover effects are smooth
- [ ] Metro line colors are accurate to WMATA branding

---

## 10. Content Reference (Copy-Ready)

### Lodging Section

**Primary Hotel:**
> **Stay With Us at Hilton Garden Inn**
> 
> We've secured a special room block at the Hilton Garden Inn Washington DC/U.S. Capitol, conveniently located near all summit activities. Book early to guarantee our group rate and be close to the action.
> 
> [Booking details and link coming soon]

**Other Options:**
> DC has plenty of accommodation options to fit every budget. The city's excellent Metro system makes it easy to get around, so feel free to explore hotels in other neighborhoods like Dupont Circle, Foggy Bottom, or Capitol Hill.

### Venues Section

> **Woolly Mammoth Theatre Company**
> 
> We're excited to return to Woolly Mammoth Theatre Company for our main conference day on July 16. After a fantastic experience last year, we're thrilled to bring NLAS back to this intimate, historic venue in the heart of downtown DC.
> 
> 📍 641 D Street NW, Washington, DC 20004
> 
> Additional venues for workshops and evening events will be announced soon.

### Travel Section

**Getting to DC:**
> The nation's capital is served by three major airports:
> - **Reagan National (DCA)** — Closest to downtown, connected directly to Metro
> - **Dulles International (IAD)** — Main international hub, ~30 miles from downtown
> - **Baltimore/Washington International (BWI)** — Alternative option with train connections

**Getting Around:**
> DC's Metro system is your best friend during NLAS. Both Woolly Mammoth Theatre and Hilton Garden Inn are easily accessible via Metro:
> - **Woolly Mammoth:** Gallery Place-Chinatown station (Red, Green, Yellow lines)
> - **Hilton Garden Inn:** Union Station (Red line) or NoMa-Gallaudet U (Red line)
> 
> 💳 We recommend getting a SmarTrip card for seamless travel throughout the weekend.

---

## Summary of Tasks

1. **Create** `logistics.html` with proper structure
2. **Add** new CSS styles to `styles.css`
3. **Update** navigation in `index.html` and `logistics.html`
4. **Create** `assets/logistics/` folder for images
5. **Add** placeholder images or real photos
6. **Test** responsive behavior and torn paper effects
7. **Verify** accessibility compliance

---

*These instructions maintain the scrapbook/activist zine aesthetic while providing a clean, informative logistics page for NLAS 2026 attendees.*
