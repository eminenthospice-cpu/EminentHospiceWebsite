---
name: core-web-vitals
description: Optimize LCP, INP, and CLS for Google Search ranking and user experience. Use when asked about "Core Web Vitals", "LCP", "INP", "CLS", or "Lighthouse score".
license: MIT
metadata:
  author: web-quality-skills (Addy Osmani)
  source: https://github.com/addyosmani/web-quality-skills
---

# Core Web Vitals

Thresholds at the 75th percentile of real-user data:

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

---

## LCP — Largest Contentful Paint

Common issues:
- Slow server response (high TTFB)
- Render-blocking resources (CSS, sync JS)
- Client-side rendering instead of SSR
- Large unoptimized hero image

Fixes:
- CDN + edge caching → lower TTFB
- Inline critical CSS; defer non-critical
- Preload hero with `fetchpriority="high"`
- Use SSR/RSC; avoid client-side hydration for above-fold content
- Speculation Rules API for prerendering (`eagerness: "moderate"` triggers after ~200ms hover, good intent signal)

---

## INP — Interaction to Next Paint

Three phases:
- **Input delay** (< 50ms target)
- **Processing** (< 100ms)
- **Presentation delay** (< 50ms)

Fixes:
- Break long tasks with `scheduler.yield()`
- Provide immediate visual feedback before heavy work
- Defer analytics with `requestIdleCallback`
- Lazy-load third-party scripts on interaction

---

## CLS — Cumulative Layout Shift

Causes:
- Images without `width`/`height`
- Ads/embeds without reserved space
- Web fonts swapping in different size
- Dynamically injected content above existing

Fixes:
- Set explicit `width`/`height` (or `aspect-ratio`) on every image/video/iframe
- Reserve `min-height` for ad/embed containers
- Use `font-display: optional` or size-matched fallbacks
- Use CSS `transform` for animations (composited, no layout)

---

## Measurement

```javascript
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

---

## Framework integration

**Next.js:** `next/image` (sized, lazy, AVIF/WebP); `next/font` (zero CLS); RSC for above-fold content; `priority` on LCP image; `revalidate` + ISR for cached HTML.

**React:** `lazy()` + `<Suspense>` for code splitting; `useTransition` for non-urgent updates; memoize expensive renders.

**Vue/Nuxt:** `<NuxtImg>` with `provider: 'ipx'`; auto-imports; `definePageMeta({ keepalive: true })` for back/forward cache.
