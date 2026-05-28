# Responsive & Spacing Audit — Eminent Hospice Care

Generated: 2026-05-28T02:31:52.224Z

## Overview

| Metric | Value |
| --- | --- |
| Total matrix cells tested | 180 |
| Cells that loaded successfully | 180 |
| Cells with errors | 0 |
| Special viewports tested | 6 |
| Overflow detection widths swept | 10 |

## Horizontal overflow failures

Total cells with horizontal overflow: **2**

| Locale | Route | Width | scrollWidth | clientWidth | Delta | Top offending nodes |
| --- | --- | --- | --- | --- | --- | --- |
| en | /en | 320 | 331 | 305 | 26 | h2.font-heading text-display-lg t |
| en | /en | 1024 | 1017 | 1009 | 8 | - |

## Home page overflow sweep (widths 280–360)

| Locale | 280 | 300 | 320 | 340 | 360 |
| --- | --- | --- | --- | --- | --- |
| /en | overflow Δ66 | overflow Δ46 | overflow Δ26 | overflow Δ6 | ok |
| /ko | ok | ok | ok | ok | ok |

First width without overflow: /en at 360px, /ko clean from 280px+.

## Tap target violations

| Bucket | Count |
| --- | --- |
| < 24px (severe, below WCAG minimum) | 3008 |
| 24–43px (below WCAG 2.2 AA target) | 1883 |
| **Total interactive elements undersized across matrix** | **4891** |

### Top routes by tap target violations

| Route | < 24px | 24–43px | Total | Worst examples |
| --- | --- | --- | --- | --- |
| en|/en/terms | 152 | 135 | 287 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/privacy | 152 | 131 | 283 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/accessibility | 152 | 83 | 235 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/contact | 151 | 20 | 171 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/about | 150 | 125 | 275 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/hospice-laws | 147 | 94 | 241 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/services | 146 | 129 | 275 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/for-families | 146 | 122 | 268 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/understanding-hospice | 136 | 116 | 252 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |
| en|/en/faq | 136 | 116 | 252 | "Skip to main content" 1×1 • "Skip to main content" 1×1 • "Skip to main content" 1×1 |

## Section spacing inconsistency (variance of inner padding)

| Route | Var(top) | Var(bot) | Unique top values | Unique bot values | Samples (top px) |
| --- | --- | --- | --- | --- | --- |
| ko|/ko/referral | 1956.9 | 1956.9 | 4 | 4 | 104, 0, 24, 32 |
| en|/en/referral | 1946.6 | 1946.6 | 4 | 4 | 104, 0, 24, 32 |
| en|/en/hospice-laws | 1768.5 | 1768.5 | 3 | 3 | 80, 0, 104 |
| en|/en/accessibility | 1768.5 | 1768.5 | 3 | 3 | 80, 0, 104 |
| ko|/ko/hospice-laws | 1768.5 | 1768.5 | 3 | 3 | 80, 0, 104 |
| ko|/ko/accessibility | 1768.5 | 1768.5 | 3 | 3 | 80, 0, 104 |
| en|/en/understanding-hospice | 1623.0 | 1623.0 | 3 | 3 | 80, 0, 104 |
| ko|/ko/understanding-hospice | 1623.0 | 1623.0 | 3 | 3 | 80, 0, 104 |
| en|/en/insurance | 1494.9 | 1494.9 | 3 | 3 | 80, 0, 104 |
| ko|/ko/insurance | 1494.9 | 1494.9 | 3 | 3 | 80, 0, 104 |

## Sticky / fixed elements (overlap suspects)

Cells with sticky/fixed elements landing in the upper-200px viewport region: **168** (header, primarily).

Most prevalent: header.sticky.top-0.z-fixed across every route × every viewport — expected behaviour, but verify it does not occlude in-page anchor links on /en/about (#mission, #values, etc.) since the page has on-this-page navigation.

## Top 15 highest-severity findings

1. **[CRITICAL]** horizontal_overflow — /en @ 320 — scrollWidth=331 clientWidth=305 delta=26px
   - Evidence: h2.font-heading text-display-lg text-ink-90
2. **[CRITICAL]** horizontal_overflow — /en @ 1024 — scrollWidth=1017 clientWidth=1009 delta=8px
3. **[CRITICAL]** home_overflow_sweep — /en @ multi — overflows at: 280px(delta 66), 300px(delta 46), 320px(delta 26), 340px(delta 6)
4. **[HIGH]** tap_targets — en|/en/terms — <24px: 152, 24–43px: 135, total: 287 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
5. **[HIGH]** tap_targets — en|/en/privacy — <24px: 152, 24–43px: 131, total: 283 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
6. **[HIGH]** tap_targets — en|/en/accessibility — <24px: 152, 24–43px: 83, total: 235 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
7. **[HIGH]** tap_targets — en|/en/contact — <24px: 151, 24–43px: 20, total: 171 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
8. **[HIGH]** tap_targets — en|/en/about — <24px: 150, 24–43px: 125, total: 275 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
9. **[HIGH]** tap_targets — en|/en/hospice-laws — <24px: 147, 24–43px: 94, total: 241 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
10. **[HIGH]** tap_targets — en|/en/services — <24px: 146, 24–43px: 129, total: 275 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
11. **[HIGH]** tap_targets — en|/en/for-families — <24px: 146, 24–43px: 122, total: 268 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
12. **[HIGH]** tap_targets — en|/en/understanding-hospice — <24px: 136, 24–43px: 116, total: 252 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
13. **[HIGH]** tap_targets — en|/en/faq — <24px: 136, 24–43px: 116, total: 252 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
14. **[HIGH]** tap_targets — en|/en/insurance — <24px: 136, 24–43px: 106, total: 242 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)
15. **[HIGH]** tap_targets — en|/en/hipaa-notice — <24px: 136, 24–43px: 60, total: 196 — Skip to main content (1x1) / Skip to main content (1x1) / Skip to main content (1x1)

## Methodology

- 30 routes × 8 (English) or 4 (Korean) breakpoints = 180 matrix cells, plus special viewports (320 @200% zoom, 1024×600, 1920×1080), plus overflow-sweep at 280/300/320/340/360 on home pages.
- Cells were measured by injecting fetched HTML into a same-origin iframe sized to the target viewport (X-Frame-Options bypass via document.write + base href). Layout reflows naturally; getBoundingClientRect, getComputedStyle, scrollWidth/clientWidth, sticky/fixed detection are taken from the iframe document.
- Tap-target check uses 44×44 CSS pixels per WCAG 2.2 success criterion 2.5.8 (Target Size — Minimum) Enhanced; <24 is treated as severe (below WCAG 2.2 AA minimum of 24×24).
- /en/not-found and /ko/not-found return HTTP 404 (Next.js convention) with a minimal error body — measured separately and reported as such.