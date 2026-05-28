# Responsive Spacing Audit Report

Generated: 2026-05-27
Scope: Read-only audit of spacing and responsiveness across EN/KO routes and breakpoints.

## Audit Health Score

| # | Dimension | Score | Key finding |
|---|---|---:|---|
| 1 | Accessibility | 1/4 | 4,891 undersized interactive targets across matrix (3,008 < 24px). |
| 2 | Performance | 3/4 | No broad CLS spike surfaced in matrix, but sticky header overlap risk remains. |
| 3 | Responsive Design | 2/4 | Horizontal overflow on `/en` at 320px and 1024px; `/en` needs 360px to clear overflow in sweep. |
| 4 | Theming | 3/4 | Token usage is mostly consistent, but spacing token overrides are frequent and reduce predictability. |
| 5 | Anti-Patterns | 2/4 | System-wide spacing rhythm drift (0/24/32/80/104 mix) and recurring tiny link hitboxes. |
| **Total** |  | **11/20** | **Acceptable (significant work needed)** |

## Execution Coverage

- Main matrix: 180 cells (15 EN routes x 8 widths + 15 KO routes x 4 widths)
- Special viewports: 6 cells
- Overflow sweep: 10 cells
- Accessibility snapshot cells: 12
- Attempted: 220, completed with probe data: 208, hard failures: 0

Raw artifacts:
- `audit/raw/responsive-matrix.json`
- `audit/raw/responsive-summary.md`

## Anti-Patterns Verdict

Fail. The UI does not present as layout-stable across all device contexts due to repeated small tap targets and inconsistent section spacing scale application. Issues are systemic, not isolated.

## Executive Summary

- P0 issues: 2
- P1 issues: 5
- P2 issues: 4
- P3 issues: 2
- Top blocking problems:
  - `/en` horizontal overflow at narrow phone widths (and slight overflow at 1024).
  - Global tap-target failures from small links (especially skip link and footer links).
  - Referral and long-form pages showing spacing variance beyond design-token expectations.

## Detailed Findings (by severity)

### P0 Blocking

1) **[P0] Home page horizontal overflow on small widths**
- Location: `route /en` at 320px (overflow sweep shows 280/300/320/340 fail)
- Category: Responsive Design
- Impact: Users on narrow phones get horizontal scroll and clipped reading flow.
- Standard: WCAG 1.4.10 Reflow risk
- Recommendation: Rework heading/container constraints in home hero and adjacent sections; ensure no element forces minimum layout width > viewport.
- Suggested command: `impeccable adapt /en`

2) **[P0] Home page desktop-tablet overflow at 1024**
- Location: `route /en` at 1024px
- Category: Responsive Design
- Impact: Subtle horizontal scroll and potential visual jitter around breakpoint transitions.
- Standard: Reflow/layout stability expectation
- Recommendation: Audit 1024-specific grid + typography interactions in home layout; remove any width-expanding element.
- Suggested command: `impeccable layout /en`

### P1 Major

3) **[P1] Severe tap-target failures across routes**
- Location: Most routes, strongest on `/en/terms`, `/en/privacy`, `/en/about`, `/en/services`
- Category: Accessibility
- Impact: Keyboard/touch usability is degraded; many links are hard to activate.
- Standard: WCAG 2.5.8 Target Size (Minimum)
- Recommendation: Enforce min target size for interactive elements via shared primitive styles.
- Suggested command: `impeccable harden src/components/ui/primitives`

4) **[P1] Skip link appears as 1x1 target before focus**
- Location: `src/components/layout/Header.tsx` (skip link)
- Category: Accessibility
- Impact: Critical navigation aid appears effectively non-targetable in many states.
- Standard: WCAG 2.4.1 Bypass Blocks + 2.5.8 target sizing
- Recommendation: Keep visually hidden behavior but ensure focus state creates a robust, reachable target area.
- Suggested command: `impeccable harden src/components/layout/Header.tsx`

5) **[P1] Footer links consistently under target size**
- Location: `src/components/layout/Footer.tsx` routes across matrix
- Category: Accessibility / Responsive
- Impact: Touch interactions on legal/resource links are error-prone.
- Standard: WCAG 2.5.8
- Recommendation: Increase line-height and vertical padding for footer links.
- Suggested command: `impeccable adapt src/components/layout/Footer.tsx`

6) **[P1] Utility bar links under target size**
- Location: `src/components/layout/Header.tsx` utility row
- Category: Accessibility
- Impact: High-value actions (phone/referral) are too small for touch contexts.
- Standard: WCAG 2.5.8
- Recommendation: Increase control height and responsive spacing at coarse-pointer breakpoints.
- Suggested command: `impeccable adapt src/components/layout/Header.tsx`

7) **[P1] Sticky header can occlude anchor destinations**
- Location: pages with in-page anchors, notably `/en/about`
- Category: Accessibility / Responsive
- Impact: Anchor-jump content may land behind sticky header.
- Standard: WCAG 2.4.11 Focus Not Obscured (related behavior)
- Recommendation: Ensure consistent `scroll-margin-top` on all anchor targets and heading IDs.
- Suggested command: `impeccable harden src/app/[locale]/about/page.tsx`

### P2 Minor

8) **[P2] Referral pages have highest spacing variance**
- Location: `/en/referral`, `/ko/referral`
- Category: Responsive / Anti-pattern
- Impact: Rhythm feels uneven between stacked sections and form blocks.
- Recommendation: Normalize section inner padding to tokenized scale.
- Suggested command: `impeccable layout /referral`

9) **[P2] Long-form legal/info pages mix 0/80/104 spacing**
- Location: `/hospice-laws`, `/accessibility`, `/understanding-hospice`, `/insurance` (EN+KO)
- Category: Layout rhythm
- Impact: Reading cadence changes abruptly between sections.
- Recommendation: Define a long-form spacing contract and reuse it via shared wrappers.
- Suggested command: `impeccable layout src/components/layout/LongFormPage.tsx`

10) **[P2] Widespread `!py-*` overrides reduce spacing predictability**
- Location: multiple components (`Hero`, `FinalCta`, `WhoWeServe`, etc.)
- Category: Anti-pattern / Theming consistency
- Impact: Design tokens are bypassed, making responsive tuning harder.
- Recommendation: Replace one-off overrides with refined token values in Tailwind theme.
- Suggested command: `impeccable extract spacing`

11) **[P2] Min-width table risks overflow on narrow widths**
- Location: `src/components/info/CoverageTable.tsx` (`min-w-[640px]`)
- Category: Responsive
- Impact: Horizontal scrolling likely in constrained containers.
- Recommendation: Add mobile card fallback or adaptive table strategy.
- Suggested command: `impeccable adapt src/components/info/CoverageTable.tsx`

### P3 Polish

12) **[P3] Decorative overflow candidates on about page**
- Location: `/en/about` visual accents
- Category: Visual polish
- Impact: Technical overflow noise without major UX break.
- Recommendation: Clamp decorative offsets at narrow widths.
- Suggested command: `impeccable polish /about`

13) **[P3] Home heading wrap threshold differs EN vs KO**
- Location: `/en` vs `/ko` in overflow sweep
- Category: Typography polish
- Impact: Uneven cross-locale behavior at ultra-narrow widths.
- Recommendation: Tune English display heading scaling/line-break behavior.
- Suggested command: `impeccable typeset /`

## Patterns & Systemic Issues

- Global interactive-size policy is not enforced in one place; many links remain text-sized.
- Section spacing tokens exist, but page-level overrides are common and ungoverned.
- Home page has unique width pressure not reproduced on KO home or most inner pages.

## Positive Findings

- 180/180 matrix route cells loaded successfully.
- Only 2 true horizontal-overflow route+width failures in the primary matrix.
- `SectionContainer` abstraction provides a strong base for consistent spacing once overrides are reduced.
- Sticky/fixed layering is generally coherent with semantic z-index scale.

## Recommended Action Order

1. **[P0] `impeccable adapt /en`**: remove home overflow at 320 and 1024.
2. **[P1] `impeccable harden src/components/layout/Header.tsx`**: fix skip link + utility actions target sizes.
3. **[P1] `impeccable adapt src/components/layout/Footer.tsx`**: raise footer link hit areas to WCAG-compliant minimums.
4. **[P2] `impeccable layout /referral`**: normalize section rhythm and token usage.
5. **[P2] `impeccable layout src/components/layout/LongFormPage.tsx`**: standardize legal/info page spacing contract.
6. **[P2] `impeccable adapt src/components/info/CoverageTable.tsx`**: prevent narrow-width overflow behavior.
7. **[P3] `impeccable polish /about`**: clamp decorative overflow.
8. **[P3] `impeccable typeset /`**: smooth EN hero line wrapping at extreme widths.
9. **Final pass: `impeccable polish`** after fixes.

