# Responsive Spacing Fix Pass

Applied: 2026-05-27

## P0 — Home overflow

- **Hero**: Responsive display scale (`text-display-xl` → `3xl` by breakpoint), `min-w-0` on grid, bleed margin moved to `xl` only.
- **TeamCallout**: Flex wrap + `min-w-0` on title row (fixes `&` + heading overflow).
- **PhilosophyBand**: `overflow-x-clip`, `min-w-0` on grid columns.
- **EditorialFigure**: Image bleed at `xl` instead of `lg` (reduces 1024px overflow).
- **globals**: `overflow-x: clip` on `html`/`body`, `overflow-wrap` on headings.

## P1 — Tap targets & focus

- **Skip link**: New `.skip-link` pattern (off-screen, 44px+ on focus).
- **Header**: Utility bar + mobile drawer phone links `min-h-11`; desktop nav `min-h-11`.
- **Footer**: `.link-target` on all footer links.
- **PageSidebar**: Anchor + related links `min-h-11`.
- **Dialog**: Close control `h-11 w-11`.
- **LevelsOfCare**: “Learn more” link `min-h-11`.

## P2 — Spacing rhythm

- **LongFormPage**: `!py-section-y md:!py-section-2xl` on main container.
- **Referral / Contact**: Same vertical padding tokens + `space-y-10 md:space-y-12` on referral.
- **SectionContainer**: `min-w-0` on inner wrapper.
- **CoverageTable**: Removed `-mx-4` bleed; scroll contained in bordered wrapper.

## P3 — Polish

- **scroll-margin-top**: Extended to `.long-form h3[id]` and `.long-form section[id]`.

## Verification

- `npm run build` — passed.

## Suggested follow-up

Re-run the responsive matrix (`audit/raw/`) to confirm overflow cells drop to 0 and tap-target counts decrease materially.
