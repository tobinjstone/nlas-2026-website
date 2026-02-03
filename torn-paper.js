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
    // Re-apply after dynamically injected components (e.g. nav) are ready
    document.addEventListener('componentsLoaded', () => {
        if (window.tornPaperEffect) {
            window.tornPaperEffect.refresh();
        }
    });
}
