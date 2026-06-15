---
name: accessibility
description: Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".
license: MIT
metadata:
  author: web-quality-skills (Addy Osmani)
  version: "1.1"
  source: https://github.com/addyosmani/web-quality-skills
---

# Accessibility (a11y)

Comprehensive accessibility guidelines based on WCAG 2.2 and Lighthouse accessibility audits. Goal: make content usable by everyone, including people with disabilities.

## WCAG Principles: POUR

| Principle | Description |
|-----------|-------------|
| **P**erceivable | Content can be perceived through different senses |
| **O**perable | Interface can be operated by all users |
| **U**nderstandable | Content and interface are understandable |
| **R**obust | Content works with assistive technologies |

## Conformance levels

| Level | Requirement | Target |
|-------|-------------|--------|
| **A** | Minimum accessibility | Must pass |
| **AA** | Standard compliance | Should pass (legal requirement in many jurisdictions) |
| **AAA** | Enhanced accessibility | Nice to have |

---

## Perceivable

### Text alternatives (1.1)

- All meaningful images need descriptive `alt` text.
- Decorative images: `alt=""` + `role="presentation"`.
- Icon-only buttons require `aria-label` or visually-hidden text.

### Color contrast (1.4.3, 1.4.6)

| Text Size | AA minimum | AAA enhanced |
|-----------|------------|--------------|
| Normal text (< 18px / < 14px bold) | 4.5:1 | 7:1 |
| Large text (≥ 18px / ≥ 14px bold) | 3:1 | 4.5:1 |
| UI components & graphics | 3:1 | 3:1 |

Never rely on color alone — pair with icon/text/pattern.

### Media alternatives (1.2)

- Video: captions + audio descriptions
- Audio: transcripts

---

## Operable

### Keyboard accessible (2.1)

All functionality must be keyboard accessible. Prefer native `<button>`, `<a href>`, and form controls — they handle Enter/Space, focus, and AT semantics for free.

When you MUST use a non-interactive element with `role="button"`, also set `tabindex="0"` AND add keyboard handlers for Enter/Space.

No keyboard traps. Users must Tab into and out of every component.

### Focus visible (2.4.7)

Never use `outline: none` without an alternative. Use `:focus-visible` for keyboard-only focus rings, with ≥3:1 contrast against every background.

### Focus not obscured (2.4.11) — new in 2.2

Focused elements must not be entirely hidden by sticky headers/footers. Use `scroll-margin-top` to account for sticky elements.

### Skip links (2.4.1)

Provide a "Skip to main content" link as the first focusable element.

### Target size (2.5.8) — new in 2.2

Interactive targets ≥ 24×24 CSS pixels (AA). Recommended 44×44 for comfortable touch.

### Dragging movements (2.5.7) — new in 2.2

Any drag action must have a single-pointer alternative.

### Motion (2.3)

Respect `prefers-reduced-motion: reduce` — reduce animation-duration to 0.01ms.

---

## Understandable

### Page language (3.1.1)

`<html lang="en">` (or appropriate). Use `<span lang="fr">` for inline language changes.

### Consistent navigation (3.2.3)

Navigation should be consistent across pages. Use `aria-current="page"` for active links.

### Consistent help (3.2.6) — new in 2.2

Help mechanisms (contact, chat, FAQ link) must appear in the same relative order across pages.

### Form labels (3.3.2)

Every input needs a programmatically associated label (`<label for>`, wrap, or `aria-labelledby`).

### Error handling (3.3.1, 3.3.3)

- Announce errors via `role="alert"` or `aria-live`
- Set `aria-invalid="true"` on invalid fields
- Focus the first error on submit

### Redundant entry (3.3.7) — new in 2.2

Don't force users to re-enter info from the same session. Auto-fill or let users select previous values.

### Accessible authentication (3.3.8) — new in 2.2

Login must not depend on cognitive tests (password recall, puzzles) without alternative (paste/autofill, passkey, magic link).

---

## Robust

### ARIA usage (4.1.2)

Prefer native elements. Use ARIA only when native won't work. Get the role + state right (e.g., `aria-expanded`, `aria-selected`, `aria-controls`).

### Live regions (4.1.3)

Use `aria-live="polite"` or `role="status"` to announce dynamic content without moving focus.

---

## Testing checklist

### Automated
```bash
npx lighthouse https://example.com --only-categories=accessibility
npx @axe-core/cli https://example.com
```

### Manual
- Keyboard nav: Tab through, activate with Enter/Space
- Screen reader: VoiceOver / NVDA / TalkBack
- Zoom: usable at 200%
- High contrast mode
- Reduced motion mode
- Focus order matches visual order
- 24×24px minimum on interactive targets

---

## Common issues by impact

**Critical:** missing labels, missing alt, low contrast, keyboard traps, no focus indicators.

**Serious:** missing `lang`, broken heading structure, non-descriptive link text, autoplay media, missing skip links.

**Moderate:** missing ARIA labels on icons, inconsistent nav, missing error identification, timing without controls, missing landmarks.

---

## References

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Deque axe Rules](https://dequeuniversity.com/rules/axe/)
