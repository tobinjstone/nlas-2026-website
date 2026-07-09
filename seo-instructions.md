# SEO & Social Card Implementation Instructions

## Overview
Add favicon links, Open Graph meta tags, Twitter Card meta tags, canonical URLs, and a site.webmanifest to every HTML page on the site. The favicon files and `nlascard.png` social card image are already in the `assets/` folder.

The site domain is `https://nlas.cnliberalism.org`.

---

## 1. Add to EVERY page's `<head>` (after `<meta name="viewport">`)

### Favicon block (identical on all pages):
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

### Canonical URL (unique per page):
```html
<link rel="canonical" href="https://nlas.cnliberalism.org/{page-path}">
```

### Open Graph tags (customize title/description per page):
```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://nlas.cnliberalism.org/{page-path}">
<meta property="og:title" content="{Page Title}">
<meta property="og:description" content="{Page Description}">
<meta property="og:image" content="https://nlas.cnliberalism.org/assets/brand/nlascard.png">
<meta property="og:site_name" content="NLAS 2026">
```

### Twitter/X Card tags (customize title/description per page):
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@cnliberalism">
<meta name="twitter:title" content="{Page Title}">
<meta name="twitter:description" content="{Page Description}">
<meta name="twitter:image" content="https://nlas.cnliberalism.org/assets/brand/nlascard.png">
```

---

## 2. Per-page values

Use these title/description/path values for each page:

| Page | Path | `<title>` / `og:title` / `twitter:title` | `<meta name="description">` / `og:description` / `twitter:description` |
|---|---|---|---|
| **index.html** | `/` | New Liberal Action Summit 2026 \| Center for New Liberalism | Join the next generation of center-left leaders at NLAS 2026 in Washington, DC. July 15-17, 2026. |
| **register.html** | `/register.html` | Register \| NLAS 2026 | Register for the New Liberal Action Summit 2026 in Washington, DC. July 15-17, 2026. |
| **speakers.html** | `/speakers.html` | Speakers \| NLAS 2026 | Meet the featured speakers at NLAS 2026 — policymakers, political scientists, and center-left leaders. |
| **schedule.html** | `/schedule.html` | Schedule \| NLAS 2026 | Three days of policy workshops, professional training, and coalition-building at NLAS 2026. |
| **faqs.html** | `/faqs.html` | FAQs \| NLAS 2026 | Frequently asked questions about the New Liberal Action Summit 2026. |
| **scholarships.html** | `/scholarships.html` | Scholarships \| NLAS 2026 | Learn about scholarship opportunities to attend NLAS 2026. |
| **code-of-conduct.html** | `/code-of-conduct.html` | Code of Conduct \| NLAS 2026 | Code of conduct for the New Liberal Action Summit 2026. |

---

## 3. Update site.webmanifest

Update the `name` and `short_name` fields and the icon paths to point to `assets/`:

```json
{
  "name": "New Liberal Action Summit 2026",
  "short_name": "NLAS 2026",
  "icons": [
    { "src": "/assets/favicons/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/favicons/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#2C3659",
  "background_color": "#FDFBE9",
  "display": "standalone"
}
```

---

## 4. Create robots.txt at site root

```
User-agent: *
Allow: /

Sitemap: https://nlas.cnliberalism.org/sitemap.xml
```

## 5. Create sitemap.xml at site root

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://nlas.cnliberalism.org/</loc><priority>1.0</priority></url>
  <url><loc>https://nlas.cnliberalism.org/register.html</loc><priority>0.9</priority></url>
  <url><loc>https://nlas.cnliberalism.org/speakers.html</loc><priority>0.8</priority></url>
  <url><loc>https://nlas.cnliberalism.org/schedule.html</loc><priority>0.8</priority></url>
  <url><loc>https://nlas.cnliberalism.org/faqs.html</loc><priority>0.7</priority></url>
  <url><loc>https://nlas.cnliberalism.org/scholarships.html</loc><priority>0.7</priority></url>
  <url><loc>https://nlas.cnliberalism.org/code-of-conduct.html</loc><priority>0.5</priority></url>
</urlset>
```

---

## Summary of changes
- Add favicon, OG, and Twitter meta tags to every `.html` page's `<head>`
- Ensure each page has a unique `<title>`, `<meta name="description">`, canonical URL, and matching OG/Twitter titles and descriptions
- Update `site.webmanifest` with proper name, colors, and icon paths
- Create `robots.txt` and `sitemap.xml` at the site root
