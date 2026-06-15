---
name: performance
description: Optimize web performance for faster loading and better user experience. Use when asked to "speed up my site", "optimize performance", "reduce load time", "fix slow loading", "improve page speed", or "performance audit".
license: MIT
metadata:
  author: web-quality-skills (Addy Osmani)
  version: "1.0"
  source: https://github.com/addyosmani/web-quality-skills
---

# Performance optimization

Deep performance optimization based on Lighthouse audits. Focuses on loading, runtime, and resource optimization.

## Performance budget

| Resource | Budget | Rationale |
|----------|--------|-----------|
| Total page weight | < 1.5 MB | 3G loads in ~4s |
| JavaScript (compressed) | < 300 KB | Parsing + execution time |
| CSS (compressed) | < 100 KB | Render blocking |
| Images (above-fold) | < 500 KB | LCP impact |
| Fonts | < 100 KB | FOIT/FOUT prevention |
| Third-party | < 200 KB | Uncontrolled latency |

## Critical rendering path

### Server response
- TTFB < 800ms; use CDN, caching, efficient backend.
- Enable Brotli (preferred) or gzip.
- HTTP/2 or HTTP/3.
- Edge-cache HTML when possible.
- Send Early Hints (HTTP 103) for slow origins.

### Resource loading

**Preconnect** to required origins:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
```

**Preload critical**:
```html
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
```

**Prerender likely-next navigations** with the Speculation Rules API.

**Defer non-critical CSS** via `rel="preload"` + onload swap.

### JavaScript

- `defer` for app scripts; `async` for independent ones (analytics).
- Route-based / component-based / feature-based code splitting.
- Tree-shake: import only what you need (`import debounce from 'lodash/debounce'`).

## Image optimization

| Format | Use case |
|--------|----------|
| AVIF | Photos, best compression |
| WebP | Photos, fallback |
| PNG | Graphics with transparency |
| SVG | Icons, logos |

Use `<picture>` with `srcset` + `sizes`. Set `width`/`height` on every `<img>`. LCP image: `fetchpriority="high" loading="eager"`. Below-fold: `loading="lazy" decoding="async"`.

## Font optimization

- System font stack as fallback.
- `font-display: swap` (or `optional` for non-critical).
- Subset to needed `unicode-range`.
- Preload critical fonts.
- Variable fonts to consolidate weights.

## Caching strategy

```
# HTML
Cache-Control: no-cache, must-revalidate

# Hashed static assets
Cache-Control: public, max-age=31536000, immutable

# Non-hashed static
Cache-Control: public, max-age=86400, stale-while-revalidate=604800
```

## Runtime performance

- Avoid layout thrashing: batch reads then batch writes.
- Debounce scroll/resize handlers.
- Use `requestAnimationFrame` for visual updates.
- Virtualize long lists (react-window, `content-visibility: auto`).
- Use View Transitions API for cross-page smooth nav.

## Third-party scripts

- Async load; delay until interaction or viewport.
- Facade pattern for embeds (YouTube, maps): static placeholder until click.

## Measurement

| Metric | Target | Tool |
|--------|--------|------|
| LCP | < 2.5s | Lighthouse, CrUX |
| FCP | < 1.8s | Lighthouse |
| Speed Index | < 3.4s | Lighthouse |
| TBT | < 200ms | Lighthouse |
| TTI | < 3.8s | Lighthouse |

```bash
npx lighthouse https://example.com --output html --output-path report.html
```
