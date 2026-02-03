# Torn Paper Effect Refactor: TornPaper.js → Canvas 2D

## Overview

Replace the current TornPaper.js SVG filter approach (which isn't rendering properly) with a custom Canvas 2D solution that creates torn paper edges and texture effects.

## Current State (What to Remove)

### 1. Remove from `index.html`:
- Delete the TornPaper.js CDN script tag:
  ```html
  <!-- DELETE THIS LINE -->
  <script src="https://cdn.jsdelivr.net/gh/happy358/TornPaper@v0.0.3/tornpaper.min.js"></script>
  ```

### 2. Remove from `script.js`:
- Delete the entire `initTornPaper()` function
- Remove the `initTornPaper()` call from the `DOMContentLoaded` event listener

### 3. Remove from `styles.css`:
- Remove all `filter: url(#filter_tornpaper)` references throughout the stylesheet
- Keep the `drop-shadow()` filters where they exist (just remove the `url(#filter_tornpaper)` part)

---

## New Implementation: Canvas 2D Torn Paper

### Approach

Create a JavaScript module that:
1. Finds all elements with a `.paper-torn` class
2. Generates a canvas with torn edges and paper texture
3. Positions the canvas behind the element content

### New File: `torn-paper.js`

Create this new file with the following functionality:

```javascript
// ============================================
// Torn Paper Canvas Effect
// ============================================

class TornPaperEffect {
    constructor(options = {}) {
        this.options = {
            tearSize: options.tearSize || 8,        // Size of tear variations
            tearDetail: options.tearDetail || 0.5,   // How detailed the tears are (0-1)
            paperColor: options.paperColor || '#FDFBE9',
            shadowColor: options.shadowColor || 'rgba(0,0,0,0.15)',
            shadowBlur: options.shadowBlur || 15,
            shadowOffsetY: options.shadowOffsetY || 5,
            addTexture: options.addTexture !== false, // Add paper grain texture
            ...options
        };
    }

    // Generate torn edge path
    generateTornPath(ctx, width, height, padding) {
        const { tearSize, tearDetail } = this.options;
        
        ctx.beginPath();
        
        // Start at top-left with padding for shadow
        let x = padding;
        let y = padding;
        
        ctx.moveTo(x, y);
        
        // Top edge (left to right)
        while (x < width - padding) {
            const segmentLength = tearSize * (0.5 + Math.random() * tearDetail);
            const tearDepth = (Math.random() - 0.5) * tearSize * tearDetail;
            
            x = Math.min(x + segmentLength, width - padding);
            y = padding + tearDepth;
            
            ctx.lineTo(x, y);
        }
        
        // Right edge (top to bottom)
        x = width - padding;
        while (y < height - padding) {
            const segmentLength = tearSize * (0.5 + Math.random() * tearDetail);
            const tearDepth = (Math.random() - 0.5) * tearSize * tearDetail;
            
            y = Math.min(y + segmentLength, height - padding);
            x = width - padding + tearDepth;
            
            ctx.lineTo(x, y);
        }
        
        // Bottom edge (right to left)
        y = height - padding;
        while (x > padding) {
            const segmentLength = tearSize * (0.5 + Math.random() * tearDetail);
            const tearDepth = (Math.random() - 0.5) * tearSize * tearDetail;
            
            x = Math.max(x - segmentLength, padding);
            y = height - padding + tearDepth;
            
            ctx.lineTo(x, y);
        }
        
        // Left edge (bottom to top)
        x = padding;
        while (y > padding) {
            const segmentLength = tearSize * (0.5 + Math.random() * tearDetail);
            const tearDepth = (Math.random() - 0.5) * tearSize * tearDetail;
            
            y = Math.max(y - segmentLength, padding);
            x = padding + tearDepth;
            
            ctx.lineTo(x, y);
        }
        
        ctx.closePath();
    }

    // Add subtle paper texture
    addPaperTexture(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Only add noise to non-transparent pixels
            if (data[i + 3] > 0) {
                const noise = (Math.random() - 0.5) * 8;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    // Create torn paper canvas for an element
    createTornPaper(element) {
        const rect = element.getBoundingClientRect();
        const padding = 30; // Extra space for shadow and tears
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Account for device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        const width = rect.width + padding * 2;
        const height = rect.height + padding * 2;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        ctx.scale(dpr, dpr);
        
        // Draw shadow first
        ctx.save();
        ctx.shadowColor = this.options.shadowColor;
        ctx.shadowBlur = this.options.shadowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = this.options.shadowOffsetY;
        
        // Generate and fill the torn path
        this.generateTornPath(ctx, width, height, padding);
        ctx.fillStyle = this.options.paperColor;
        ctx.fill();
        ctx.restore();
        
        // Add paper texture if enabled
        if (this.options.addTexture) {
            this.addPaperTexture(ctx, canvas.width, canvas.height);
        }
        
        return { canvas, padding };
    }

    // Apply effect to an element
    applyTo(element) {
        // Store original position style
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'static') {
            element.style.position = 'relative';
        }
        
        const { canvas, padding } = this.createTornPaper(element);
        
        // Style the canvas as background
        canvas.style.position = 'absolute';
        canvas.style.top = `-${padding}px`;
        canvas.style.left = `-${padding}px`;
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        canvas.classList.add('torn-paper-canvas');
        
        // Remove any existing torn paper canvas
        const existing = element.querySelector('.torn-paper-canvas');
        if (existing) {
            existing.remove();
        }
        
        // Insert canvas as first child
        element.insertBefore(canvas, element.firstChild);
        
        // Remove the element's own background (canvas provides it now)
        element.style.background = 'transparent';
        
        return canvas;
    }

    // Apply to all elements with .paper-torn class
    applyToAll(selector = '.paper-torn') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => this.applyTo(el));
    }

    // Refresh effect (call on resize)
    refresh(selector = '.paper-torn') {
        this.applyToAll(selector);
    }
}

// Initialize on DOM ready
function initTornPaper() {
    const tornPaper = new TornPaperEffect({
        tearSize: 10,
        tearDetail: 0.6,
        paperColor: '#FDFBE9',
        shadowBlur: 20,
        shadowOffsetY: 8
    });
    
    tornPaper.applyToAll();
    
    // Refresh on window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => tornPaper.refresh(), 250);
    });
    
    // Make available globally if needed
    window.tornPaperEffect = tornPaper;
}

// Export for module use or run on DOMContentLoaded
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TornPaperEffect;
} else {
    document.addEventListener('DOMContentLoaded', initTornPaper);
}
```

---

## CSS Updates

### Remove TornPaper Filter References

Find and update these CSS rules:

#### `.main-nav`
```css
/* BEFORE */
.main-nav {
    filter: url(#filter_tornpaper)
            drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

/* AFTER */
.main-nav {
    /* Remove filter entirely - canvas effect will handle this */
}
```

#### `.main-nav.scrolled`
```css
/* BEFORE */
.main-nav.scrolled {
    filter: url(#filter_tornpaper)
            drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

/* AFTER */
.main-nav.scrolled {
    /* Remove filter entirely */
}
```

#### `.paper-torn`
```css
/* BEFORE */
.paper-torn {
    filter: url(#filter_tornpaper)
            drop-shadow(0 4px 6px var(--paper-shadow))
            drop-shadow(0 10px 40px rgba(0, 0, 0, 0.2));
}

/* AFTER - DELETE THIS ENTIRE RULE */
/* The canvas effect handles shadows internally */
```

#### `.speaker-clipping.paper-torn`
```css
/* BEFORE */
.speaker-clipping.paper-torn {
    filter: url(#filter_tornpaper)
            drop-shadow(0 4px 8px var(--paper-shadow))
            drop-shadow(0 8px 30px rgba(0, 0, 0, 0.15));
}

.speaker-clipping.paper-torn:hover {
    filter: url(#filter_tornpaper)
            drop-shadow(0 8px 16px var(--paper-shadow))
            drop-shadow(0 15px 50px rgba(0, 0, 0, 0.25));
}

/* AFTER - DELETE BOTH RULES */
/* Canvas handles the base effect; hover can use CSS transform only */
```

#### Mobile nav (inside `@media (max-width: 768px)`)
```css
/* BEFORE */
.main-nav {
    filter: none;
}

.main-nav::before {
    filter: url(#filter_tornpaper);
}

.nav-links {
    filter: none;
}

/* AFTER */
.main-nav {
    /* No filter needed */
}

.main-nav::before {
    /* Remove filter line */
}

.nav-links {
    /* No filter needed */
}
```

---

## HTML Updates

### `index.html`

1. **Remove TornPaper.js script** (as noted above)

2. **Add new script** before closing `</body>` tag:
```html
<script src="torn-paper.js"></script>
<script src="script.js"></script>
```

3. **Ensure elements have proper classes** - the following should have `.paper-torn`:
   - `.notebook-paper` elements (already have it)
   - `.paper-sheet` elements (already have it)
   - `.speaker-clipping` elements (already have it)
   - `.main-nav` (ADD this class)

---

## Special Cases

### Navigation Bar
The nav needs special handling because it's fixed position. You may want to:

**Option A**: Add `.paper-torn` class and let the canvas system handle it
```html
<nav class="main-nav paper-torn">
```

**Option B**: Keep nav separate and just remove the non-working filter, using a simpler CSS-only approach for the nav background.

### Speaker Clippings Hover Effect
Since the canvas is static, hover shadows need to be handled separately. Add this CSS:

```css
.speaker-clipping {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.speaker-clipping:hover {
    transform: rotate(var(--rotation, 0deg)) scale(1.05) translateY(-5px);
    /* Canvas handles base shadow; this adds hover enhancement */
}
```

---

## Testing Checklist

After implementing:

- [ ] Verify torn edges appear on all paper elements
- [ ] Check shadows render correctly
- [ ] Test responsive behavior (elements should re-render on resize)
- [ ] Confirm no console errors
- [ ] Test on mobile viewport
- [ ] Verify navigation still works properly
- [ ] Check speaker clipping hover states
- [ ] Ensure page performance is acceptable (canvas is lightweight)

---

## Optional Enhancements

If more visual interest is needed:

1. **Varying tear patterns**: Add a `seed` option to `TornPaperEffect` constructor to create consistent but different patterns per element

2. **Folded corners**: Add a corner fold effect to some paper elements

3. **Coffee stain accents**: Small circular gradient "stains" on select elements

4. **Tape/pin effects**: CSS pseudo-elements to add tape strips or pushpins to corners
