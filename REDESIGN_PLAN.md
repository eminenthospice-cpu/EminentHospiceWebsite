# Eminent Hospice — UI/UX Redesign (Phase 1)

## Context

The Eminent Hospice site (Next.js 14, bilingual EN/KO via next-intl) has a strong design-system foundation — well-architected color palette, editorial typography stack (Fraunces, Newsreader, Inter + Noto Sans/Serif KR), accessible motion infrastructure (Framer Motion with `useReducedMotion` everywhere), and clean CVA-based primitives. The execution, however, reads as templated: repeated icon-above-heading pattern across four home sections, uniform 1/2/3/4-column grids with no asymmetry, SaaS-trope decorative blur orbs on the hero, and pull-quote sections that visually duplicate each other.

Five design skills installed (`design-taste-frontend`, `impeccable`, `emil-design-eng`, `frontend-design`, `motion-framer`) plus `ui-ux-pro-max`. Chosen direction: **soft/premium/calm aesthetic** (Forward / Headspace / One Medical), **placeholder slots + photography brief** (the `/public` folder is empty), and **pilot Phase 1 on the home page + design tokens** before cascading to remaining pages.

This plan covers Phase 1 only. Outcome: a home page that holds its own as an editorial, premium hospice presence, plus an extended token system the rest of the site can adopt in Phase 2.

---

## A. Design System Extensions

### Tokens — `tailwind.config.ts`

Add to the existing color palette (do not remove anything; both old and new names coexist for safety during cascade):

```
ink:    { 900: '#1F2A37', 700: '#3D4A5C', 500: '#5F6B7A', 300: '#94A0AE' }
tint:   { ivory: '#FEFCF7', dust: '#EFEBE4' }
line:   { hairline: 'rgba(31,42,55,0.08)', soft: 'rgba(31,42,55,0.14)' }
surface.canvas: '#FAF6F0'   // deepest editorial cream
```

Shift `surface.paper` from `#FBFAF7` → `#FBF8F3` (warmer cream).

Add to `fontSize`:

```
'display-3xl': ['clamp(4rem, 9vw, 8rem)',    { lineHeight: '0.92', letterSpacing: '-0.035em' }],
'numeral-xl':  ['clamp(5rem, 11vw, 9rem)',   { lineHeight: '0.95', letterSpacing: '-0.04em' }],
'lead':        ['1.375rem',                  { lineHeight: '1.6',  letterSpacing: '-0.005em' }],
'marginalia':  ['0.8125rem',                 { lineHeight: '1.45', letterSpacing: '0.005em' }],
```

Add `boxShadow.soft`, `boxShadow.float`, `boxShadow.inset-line`, and `borderRadius.organic: 1.25rem` — softer-than-current premium shadows replacing the harsher `card-md`.

### Spring presets — new file `src/lib/motion.ts`

Tailwind can't express spring physics; export plain objects consumable by Framer Motion `transition` props.

```ts
export const spring = {
  gentle: { type: 'spring', stiffness: 160, damping: 24, mass: 0.9 },
  snap:   { type: 'spring', stiffness: 380, damping: 30 },
  crisp:  { type: 'spring', stiffness: 240, damping: 26 },
} as const;
export const ease = {
  out: [0.16, 1, 0.3, 1],   // entering
  in:  [0.7, 0, 0.84, 0],   // exiting
} as const;
```

### Utility classes — `src/app/globals.css`

Add to `@layer components`:
- `.callout-marginalia` — `<aside>` with left rule `border-l-2 border-accent-warm-300`, `font-prose text-marginalia text-ink-700`, `sticky top-32` on desktop.
- `.lead` — `font-prose text-lead text-ink-700 max-w-prose`.
- `.rule-hair` — single hairline section divider in `var(--line-soft)`.
- `.numeral-wall` — `font-heading text-numeral-xl text-ink-900`, with `font-variant-numeric: oldstyle-nums tabular-nums; font-feature-settings: "ss01";`.
- `.lift-card` — `transition: transform 320ms var(--ease-editorial), box-shadow 320ms var(--ease-editorial);` (property-specific, never `all` — impeccable rule).
- `.press-tap` — `:active { transform: scale(0.985); transition-duration: 80ms; }`.
- `.underline-grow` — pseudo-element underline scaling from 0 with `transform-origin: left`, `transition: transform 260ms var(--ease-editorial)`.

Existing `prefers-reduced-motion` block in `globals.css:49-57` already short-circuits transitions; add explicit transform-→opacity-only fallbacks for `.lift-card` and the new `ScaleIn` motion primitive.

---

## B. New / Refactored Primitives

| File | Purpose |
|---|---|
| `src/components/ui/primitives/Stat.tsx` | Editorial numeral with hairline divider + marginalia label. Replaces icon-tile pattern in `ByTheNumbers`. Props: `value`, `label`, `align`. |
| `src/components/ui/primitives/Marginalia.tsx` | `<aside>` sidenote with left rule. Used by `PhilosophyBand` and Phase 2 long-form pages. Props: `children`, `align`, `sticky`. |
| `src/components/ui/EditorialFigure.tsx` | Image frame with optional caption + credit hairline. Props: `slot`, `aspect`, `caption`, `bleed: 'none'│'left'│'right'`. Used by `Hero` and `LevelsOfCare`. |
| `src/components/motion/ScaleIn.tsx` | Scale 0.96 → 1 with `transform-origin` at the visual anchor (Emil rule). Wraps `useReducedMotion` guard. |
| Refactor `src/components/ui/primitives/Button.tsx` | Bake `.press-tap` into the CVA root so every button variant gets the active-state scale. |

---

## C. Home Section Redesigns

All files under `src/components/home/`.

### 1. `Hero.tsx` — HIGH
**Problem:** SaaS tropes (decorative blur orbs `Hero.tsx:25-34`, gradient-dawn wash, floating "Medicare" card, symmetric 2-col).
**Concept:** Editorial magazine-cover hero. **Drop both blur orbs.** Switch to asymmetric `grid-cols-[1.15fr_0.85fr]`. Promote headline to `text-display-3xl` Fraunces with the first word italic. Negative right margin on the text column lets the headline overlap the photograph's left edge on `lg+`. Replace the floating credential card with a hairline rule + small-caps caption beneath the photograph (`"Medicare-certified · Los Angeles County"`). Flat `bg-surface-paper` — no gradient. Reveal stagger 80ms with `spring.gentle`. Reference: Forward homepage, NYT Magazine cover features.

### 2. `ByTheNumbers.tsx` — HIGH
**Problem:** Literal stats in icon-pill rows; no typographic moment for Fraunces.
**Concept:** Three giant `numeral-wall`-styled Fraunces numerals separated by `divide-x divide-line-soft` hairlines, label in `text-marginalia` below each. Drop icons entirely. Each numeral scales in from 0.94 with `spring.gentle`, **`transform-origin: bottom`** so it grows from where the hairline anchors it (Emil rule). Reference: Pentagram annual reports, Wired typography spreads.

### 3. `PhilosophyBand.tsx` — HIGH
**Problem:** Centered pull-quote + big curly quote duplicates `Testimonial` visually.
**Concept:** Editorial article layout. Asymmetric 2-col: left (`col-span-7`) holds a `.lead` paragraph and body prose; right (`col-span-4 col-start-9`) holds a sticky `Marginalia` callout pulling one key phrase, with the `homePhilosophy` portrait (4:5, see brief) below it bleeding slightly into the gutter. **No giant decorative quote mark.** Background `bg-surface-canvas` with `.rule-hair` above. Reference: NYT Magazine feature lede with sidebar.

### 4. `LevelsOfCare.tsx` — HIGH
**Problem:** Four uniform bento tiles, all built on the same icon-above-heading pattern.
**Concept:** **Numbered editorial list (01–04)**, no icons. Asymmetric 2-col: left holds clickable rows (`tabular-nums` Fraunces numeral + title + chevron); right holds a preview pane (small `EditorialFigure` + expanded body + "Learn more" link) that swaps on hover/focus via Radix Tabs (`orientation="vertical"` — already installed). `AnimatePresence mode="wait"` cross-fades pane content with `spring.crisp`, ease-out entering / ease-in exiting. Mobile: falls back to the existing `Accordion` primitive with numbers as eyebrow. Reference: Stripe docs index, Linear workflow pages, Aesop product list.

### 5. `WhoWeServe.tsx` — MEDIUM
**Problem:** Three centered icon-circle tiles = textbook AI-template.
**Concept:** Inline editorial paragraph. Heading and intro span full width, then a single horizontal row where each of (LA County / Korean & English / Medicare & Medi-Cal) is a left-aligned text block with a small Fraunces numeral or one-word eyebrow tag — no card, no circle icon. Hairline `border-t border-line-soft pt-6` separates the row from the intro. **Content audit**: this overlaps with the certification strip in `Footer.tsx`; if redundant, consider folding into Hero caption or FinalCta trust line.

### 6. `TeamCallout.tsx` — MEDIUM
**Problem:** Eight uniform tiles with sage icon circles — over-repeats the icon-then-text pattern.
**Concept:** Editorial roster — typographic list, two columns, each role row has uppercase eyebrow ("PHYSICIAN"), Newsreader body description, `divide-y divide-line-soft` between rows. **No icons.** Decorative compensation: one ornamental Fraunces "&" at `display-2xl` in the section opener. Stagger reveals at 60ms (faster — 8 items would otherwise drag). Reference: New York Review of Books contributors page.

### 7. `Testimonial.tsx` — MEDIUM
**Problem:** Visually identical to `PhilosophyBand` — both centered pull-quotes with giant curly quote.
**Concept:** Quote as typographic object. Single column, **left-aligned** (not centered), Fraunces italic at `text-display-lg`. Attribution as marginalia to the left: small-caps name eyebrow + body italic relation. Above the quote, a hairline rule + small-caps label "TESTIMONIAL · LOS ANGELES" (editorial provenance). Flat `bg-surface-paper`, drop `bg-gradient-mist`. Reference: New Yorker "Talk of the Town" pulls.

### 8. `FinalCta.tsx` — MEDIUM
**Problem:** Dark slab + gradient overlays + blur orbs = SaaS dark-section trope.
**Concept:** Keep dark mode (useful tonal close) but drop both blur orbs and the warm/secondary gradient. Replace with a tiled noise/grain SVG dataURI at ~5% opacity for filmic warmth. Headline at `text-display-2xl` Fraunces italic on one keyword. Promote the phone number into typographic spotlight — set it `text-display-lg font-heading tabular-nums` as a clickable phrase, not buried in a button. Subtle Parallax distance 8px. `:active` press-tap on primary CTA, `spring.snap`.

---

## D. Header / Footer Polish (Light)

`src/components/layout/Header.tsx`:
1. Add `.underline-grow` to nav link hovers (replaces flat color transition).
2. Bump phone number tracking `tracking-wide → tracking-[0.05em]` for premium feel.
3. On scroll, micro-shrink main bar `h-20 → h-16` with `spring.snap` (currently only the utility bar collapses).

`src/components/layout/Footer.tsx`:
1. Drop the `bg-primary-800/70` icon circles on the certification strip — hairline + small-caps label only.
2. Add a typographic flourish above the four-column grid: `"A Tradition of Compassion."` in Fraunces italic at `text-display-lg`, `text-accent-warm-200` — bookends the hero's editorial voice.
3. Apply `.underline-grow` to footer links, consistent with header.

---

## E. Photography Brief (Phase 1 — 4 images)

All images: natural daylight only, real people not stock-actor smiles, no medical equipment in foreground, no clinical white/blue overheads, no purple/cyan duotone. Color palette must complement warm cream (`#FBF8F3`).

1. **`homeHero`** (replaces existing slot) — Tight crop on two hands meeting on a soft linen/knit fabric, late-afternoon side-light. Camera at hand level. Aspect **3:4** (1500×2000). Mood: cream/oat/butter palette, contemplative.
2. **`homePhilosophyPortrait`** (rename current `homePhilosophy`, change orientation) — Elderly person seen from behind or three-quarter rear in a window-lit chair, never showing face. Tea, knit blanket, books in soft focus. Aspect **4:5** (1200×1500). Mood: honey-warm domestic interior.
3. **`homeLevelRoutine` / `homeLevelContinuous` / `homeLevelInpatient` / `homeLevelRespite`** — Four small object-based vignettes (hands holding tea, open book + reading glasses, sunlit bedroom corner, garden detail). No faces. Aspect **4:3** (1000×750) each. Must read as a series — same photographer and color treatment.
4. **`homeFinalCtaTexture`** (optional) — Generated mono noise SVG tile, 256×256, ~5% opacity overlay for FinalCta background.

Register each in `src/lib/imageSlots.ts` with `i18n` alt text in `en` + `ko`, blur placeholder, credit field, and `TODO: client photo` marker. Until real photos arrive, use license-clean Unsplash placeholders matching the brief.

---

## F. Verification

1. **Dev server:** `npm run dev`. Visit `/en` and `/ko`.
2. **Per-section visual sweep:** Hero asymmetric overflow renders at `lg`, doesn't crash at `md`. Numeral wall oldstyle figures render (Fraunces `ss01`). Philosophy marginalia sticks correctly on scroll. LevelsOfCare keyboard nav cycles rows with arrow keys (Radix Tabs handles natively), AnimatePresence swaps without flash, mobile accordion smooth. FinalCta phone tel: link works on touch.
3. **Reduced motion:** Toggle OS "Reduce motion" setting, reload — all springs/parallax should be inert (existing `useReducedMotion` covers Reveal/Stagger/Parallax; verify new `ScaleIn` does too).
4. **Mobile:** 375px iPhone SE in DevTools — Hero stacks, ByTheNumbers stacks with `divide-y` instead of `divide-x`, LevelsOfCare accordion, FinalCta phone readable.
5. **KO locale:** `word-break: keep-all` on display headings prevents mid-syllable wrap (already in `globals.css:40-43`); Noto Serif KR fallback renders for Hangul body text; Fraunces tabular-nums work in Korean stat strings.
6. **Accessibility (axe-core in DevTools):** contrast of new `ink-700` on `surface-paper` ≥ 4.5:1; tab order follows visual order; `.underline-grow` visible on `:focus-visible` not just `:hover`; all icon-only buttons retain `aria-label`.
7. **Anti-pattern check:** Run `npx impeccable` from project root — should catch regressions on card-in-card, purple/blue gradient, Inter-for-display, icon-tile-above-heading, `transition-all`, missing `:active`. Phase 1 design specifically avoids all six.
8. **Build:** `npm run build` clean (no TS errors). Lucide is tree-shaken; removing icons from sections shouldn't regress bundle size.

---

## G. Out of Scope (Phase 1)

- Phase 2 cascade pages (about, services, for-families, understanding-hospice, insurance, faq, contact, referral, legal). Same primitives + tokens will drive those after Phase 1 approval.
- Real photography sourcing — brief only, placeholders stay.
- Backend / CMS / form changes — `contact` and `referral` form pipelines untouched.
- Dark mode — single light system stays.
- Performance overhaul (LCP / CLS) — "do not regress existing speed" only.
- New icon library — lucide stays, just deployed sparingly.

---

## Critical Files

**Tokens & config**
- `tailwind.config.ts` — extend colors, fontSize, boxShadow, borderRadius
- `src/app/globals.css` — add `.callout-marginalia`, `.lead`, `.rule-hair`, `.numeral-wall`, `.lift-card`, `.press-tap`, `.underline-grow`
- `src/lib/motion.ts` — **new** — spring + ease presets

**New primitives**
- `src/components/ui/primitives/Stat.tsx` — new
- `src/components/ui/primitives/Marginalia.tsx` — new
- `src/components/ui/EditorialFigure.tsx` — new
- `src/components/motion/ScaleIn.tsx` — new
- `src/components/ui/primitives/Button.tsx` — refactor: bake in `.press-tap`

**Home sections (all in `src/components/home/`)**
- `Hero.tsx` · `ByTheNumbers.tsx` · `PhilosophyBand.tsx` · `LevelsOfCare.tsx` · `WhoWeServe.tsx` · `TeamCallout.tsx` · `Testimonial.tsx` · `FinalCta.tsx`

**Layout polish**
- `src/components/layout/Header.tsx` — `.underline-grow`, tracking bump, scroll micro-shrink
- `src/components/layout/Footer.tsx` — drop icon circles, add typographic flourish, `.underline-grow`

**Image registry**
- `src/lib/imageSlots.ts` — add `homePhilosophyPortrait`, `homeLevelRoutine/Continuous/Inpatient/Respite`, `homeFinalCtaTexture`; update existing `homeHero` aspect to 3:4
