# Day 2 Implementation Plan — Home Page

## Context

Day 1 of the Eminent Hospice Care website is complete: Next.js 14 + Tailwind + next-intl bilingual scaffold (`en`/`ko`), design tokens, Header, Footer, Layout, and a placeholder Hero on `/[locale]/page.tsx`. Day 2 turns that stub into the **full Home page** — the most important page in the site because it is the first impression for grieving families, referring physicians, and Korean-American community members searching for end-of-life care in LA County.

**Source alignment:**
- `7-day-plan.md` (Day 2): Hero + 4-levels-of-care cards + Trust/IDG callout + Testimonial block, content sourced from NotebookLM.
- `notebooklm.md` notebook 1 (`d92cd23b-…`): the authoritative copy source. Already queried — covers hospice philosophy ("comfort-focused, dignity, 6-month prognosis, palliative not curative"), 4 levels of care (Routine Home, Continuous Home, General Inpatient, Respite), IDG composition (MD/RN/LVN/MSW/Chaplain/Aide/Homemaker/Bereavement/Volunteer), bilingual EN-KO outreach, myth-busting.
- `requirements.md`: responsive, SEO-optimized, fast, conversion-focused (inquiry CTA prominent), CMS-friendly content updates.
- `day1-plan.md`: established the **content-in-JSON pattern** — *all* copy must live in `messages/en.json` and `messages/ko.json`, never hard-coded in components. All styling must use Tailwind tokens (`primary`, `neutral-warm`, `font-heading`, etc.), no raw hex.

**Out of scope for Day 2:** other pages (Days 3–6), real testimonial text from real patients (use a representative quote sourced from NotebookLM philosophy content, marked as illustrative until client provides real testimonials), real photography (use placeholder `<div>` blocks or free stock from `next/image` with `placeholder="blur"` data URLs — client photos pending per `requirements.md` §3.3).

**Corrections to Day 1 stub being made in Day 2:**
- Day 1 hero routed its primary CTA ("Learn About Hospice") to `/services`. The semantically correct target is `/understanding-hospice` (the Day 3 educational page). Day 2 fixes this.
- Day 1 used flat `home.heroHeading` / `home.heroSubtext` / `home.heroCta` / `home.heroCtaSecondary` keys. Day 2 **deletes** these and replaces with the nested `home.hero.{heading,subtext,ctaPrimary,ctaSecondary}` structure used by the new sections. Both `en.json` and `ko.json` must drop the old keys to avoid stale translation warnings.

**Why this 7-section order?** Narrative arc designed for the actual visitor: a frightened family member searching for hospice for the first time.
1. Hero — emotional hook + reassurance + immediate CTA path.
2. Philosophy — answers their first real question ("what *is* hospice, really?") and corrects the common misconception that hospice = giving up.
3. Levels of Care — concrete proof there's a defined system, not vague "comfort care."
4. Team — multiplies trust (it isn't just one nurse; it's an interdisciplinary team).
5. Who We Serve — disqualifies confusion fast (LA County, bilingual EN/KO, insurance covered).
6. Testimonial — social proof at the moment of decision.
7. Final CTA — convert: phone, contact, referral.

---

## Goals & Acceptance Criteria

A visitor landing on `/en` or `/ko` sees, in order:

1. **Hero** — compassionate headline, sub-text, two CTAs (primary → `/understanding-hospice`, secondary → `/contact`), optional decorative visual.
2. **Philosophy / "What is Hospice" intro band** — 2–3 sentence plain-language definition pulled from NotebookLM, anchoring the page emotionally.
3. **4 Levels of Care** — 4-card grid (Routine Home, Continuous Home, General Inpatient, Respite) with icon, title, 1–2 line description, link to Services page.
4. **Interdisciplinary Team (IDG) trust block** — short heading + list/grid of team roles with one-line description each, conveying breadth of support.
5. **Who We Serve** — short callout: LA County, bilingual EN/KO, Medicare/Medi-Cal accepted.
6. **Testimonial / Quote** — single representative quote block, styled distinctly.
7. **Final CTA band** — "Speak with our care team 24/7" with phone + Contact + Referral buttons.

**Pass criteria:**
- Renders without TypeScript or lint errors.
- Both `/en` and `/ko` show the new sections fully translated.
- All copy lives in `messages/*.json`; no English strings in `.tsx`.
- Tailwind tokens only — no raw hex.
- Mobile-first: looks correct at 375px, 768px, 1024px+.
- All interactive elements have visible focus states and ≥44×44px hit area.
- **Exactly one `<h1>`** on the page (in Hero); every other section starts with `<h2>`. Card titles inside sections use `<h3>`.
- Lighthouse a11y ≥ 95 on the Home page.
- Phone number value lives in `messages/*.json` (single source of truth) — never hardcoded in `.tsx`.

---

## Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| `messages/en.json` | **Edit** — replace `home` namespace | Delete old flat keys; add full nested structure |
| `messages/ko.json` | **Edit** — replace `home` namespace | Bilingual parity with KO drafts |
| `messages/PLACEHOLDERS.md` | **Create** | Track every JSON key currently holding illustrative/placeholder copy for client review |
| `src/components/home/Hero.tsx` | **Create** | Page's single `<h1>` + dual CTA; routes primary to `/understanding-hospice` |
| `src/components/home/PhilosophyBand.tsx` | **Create** | "What is Hospice" intro |
| `src/components/home/LevelsOfCare.tsx` | **Create** | 4-card grid |
| `src/components/home/TeamCallout.tsx` | **Create** | IDG roles grid (8 roles) |
| `src/components/home/WhoWeServe.tsx` | **Create** | LA County + bilingual + insurance callout |
| `src/components/home/Testimonial.tsx` | **Create** | Quote block (semantic `<blockquote>` + `<cite>`) |
| `src/components/home/FinalCta.tsx` | **Create** | Bottom CTA band with phone, contact, referral buttons |
| `src/components/ui/Icon.tsx` | **Create** | Inline SVG icon registry — no npm dep |
| `src/components/ui/SectionContainer.tsx` | **Create** | Reusable `<section>` wrapper with static `BG_CLASSES` map |
| `src/app/[locale]/page.tsx` | **Edit** — full rewrite | Replace inline hero with 7-section composition + `generateMetadata` with description |

**Reuse from Day 1:**
- `@/i18n/navigation` `Link` for locale-aware internal links.
- `useTranslations` / `getTranslations` from `next-intl` for copy.
- Tailwind tokens already defined: `primary-500/600/900`, `neutral-warm`, `neutral-cream`, `font-heading`, `font-body`, `rounded-card`, `rounded-btn`, `shadow-card`, `max-w-content`, `px-section-x`, `py-section-y`.
- Existing focus-visible ring in `globals.css`.

---

## Component Design Details

### `SectionContainer.tsx`
Server component. Props: `id?`, `className?`, `bg?: 'warm' | 'cream' | 'white' | 'primary'`, `children`. Renders a `<section>` with consistent vertical/horizontal padding and a constrained inner `<div className="max-w-content mx-auto">`. Eliminates duplicating layout boilerplate across the 7 sections.

**Critical Tailwind JIT requirement:** Tailwind's JIT only compiles class names that appear *as complete literals* in source. Do NOT write `bg-${bg}` — those classes will not exist in the build. Use an explicit lookup map of full literals:

```tsx
const BG_CLASSES: Record<NonNullable<Props['bg']>, string> = {
  warm:    'bg-neutral-warm',
  cream:   'bg-neutral-cream',
  white:   'bg-white',
  primary: 'bg-primary-900 text-white',
};
```

### `Hero.tsx`
Server component (synchronous — uses `useTranslations`, which works fine in non-async server components in next-intl v4). Reads `home.hero.*` keys. Two-column on `lg:`, stacked on mobile. Left: **the page's single `<h1>`** (`font-heading text-4xl md:text-5xl lg:text-6xl`), subtext, two `<Link>` CTAs (primary filled → `/understanding-hospice`, secondary outlined → `/contact`). Right: decorative gradient block (Tailwind `bg-gradient-to-br from-primary-100 to-secondary-500/30`) holding a placeholder `<div>` with a soft circular shape, wrapped with `aria-hidden="true"` since it's decorative — designed so swapping in a real `<Image>` later requires only replacing the child and dropping the aria-hidden.

### `PhilosophyBand.tsx`
Server. Single-column. Background `bg-neutral-cream`. Centered headline (e.g. "Care Focused on Comfort, Dignity, and Family") + 2-paragraph definition of hospice (from NotebookLM: comfort-focused vs. curative, 6-month prognosis, holistic mind/body/spirit). Quiet, no CTAs — purely educational.

### `LevelsOfCare.tsx`
Server. Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`. Each card:
- Icon (Icon.tsx) in a `bg-primary-50` rounded-full pill.
- H3 title (Routine Home Care / Continuous Home Care / General Inpatient / Respite).
- 1–2 line description.
- "Learn more →" link to `/services` (Day 4 page; link will work after Day 4 ships but is harmless until then since the route exists in middleware once Day 4 adds the file).
- `rounded-card shadow-card hover:shadow-card-md transition-shadow duration-ui` + `focus-within:ring-2`.

Keys: `home.levels.title`, `home.levels.subtitle`, `home.levels.routine.{title,desc}`, `…continuous.*`, `…inpatient.*`, `…respite.*`, `home.levels.learnMore`.

### `TeamCallout.tsx`
Server. Heading + intro sentence + responsive grid of 8 roles (MD, RN, LVN, MSW, Chaplain, Aide, Bereavement Coordinator, Volunteer). Each item: small icon or accent dot + role name + one-line scope. Uses NotebookLM IDG breakdown.

Keys: `home.team.title`, `home.team.intro`, `home.team.roles.physician.{name,desc}`, `…rn`, `…lvn`, `…msw`, `…chaplain`, `…aide`, `…bereavement`, `…volunteer`.

### `WhoWeServe.tsx`
Server. Three icon-tiles inline:
1. **Service Area** — "Throughout Los Angeles County"
2. **Languages** — "English & 한국어 — culturally aware care for Korean-American families"
3. **Coverage** — "Medicare Part A, Medi-Cal, and most private insurance"

Keys: `home.whoWeServe.title`, `home.whoWeServe.area.{title,desc}`, `…languages.{title,desc}`, `…coverage.{title,desc}`.

### `Testimonial.tsx`
Server. Centered blockquote (`<blockquote>` semantic element) with large opening quote glyph (decorative, `aria-hidden`), italic body, attribution via `<cite>` ("— Family Member, Los Angeles"). Background `bg-primary-50`.

Placeholder tracking — **don't pollute the runtime JSON with `_note` keys** (next-intl loads everything in the namespace; underscore keys can produce noisy "unused" warnings and ship to the client bundle). Instead, document placeholder copy in a separate `messages/PLACEHOLDERS.md` file at the project root, listing each key that holds illustrative content. Client review will check that file and replace the JSON values before launch.

Keys: `home.testimonial.quote`, `home.testimonial.attribution`.

### `FinalCta.tsx`
Server. Dark background (`bg-primary-900` like footer for visual rhythm). Centered: `<h2>` "Available 24/7 to Support Your Family", subtext, three buttons with **explicit visual hierarchy** — Call dominates, the other two are secondary:

- **Primary (filled white-on-dark, largest):** `<a href={`tel:${phoneNumberTel}`}>` Call Now — read the tel-formatted number from `home.finalCta.phoneNumberTel` (e.g. `"+13105551234"`) and the human-display version from `home.finalCta.phoneNumberDisplay` (e.g. `"(310) 555-1234"`).
- **Secondary (outlined white):** `<Link href="/contact">` Contact Us
- **Secondary (outlined white):** `<Link href="/referral">` Make a Referral

On mobile, all three stack full-width with Call on top.

Keys: `home.finalCta.{title, subtitle, call, contact, refer, phoneNumberTel, phoneNumberDisplay}`.

**Single source of truth for the phone:** the `footer.phone` key currently holds the display number. Day 2 introduces `home.finalCta.phoneNumberTel` + `phoneNumberDisplay`. Day 7 (or sooner) should refactor `footer.phone` to reference the same canonical pair so the number lives in exactly one place. For Day 2, accept temporary duplication and note it as a Day 7 cleanup item.

### `Icon.tsx`
Server. Exports `<Icon name="home" | "heart" | "hospital" | "calendar" | "users" | "phone" | "globe" | "shield" className?>`. Inline SVG paths from Heroicons (MIT-licensed) — copy the 24×24 outline paths directly; no npm dependency needed. Keeps bundle lean.

### `src/app/[locale]/page.tsx` (edited)

```tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { PhilosophyBand } from '@/components/home/PhilosophyBand';
import { LevelsOfCare } from '@/components/home/LevelsOfCare';
import { TeamCallout } from '@/components/home/TeamCallout';
import { WhoWeServe } from '@/components/home/WhoWeServe';
import { Testimonial } from '@/components/home/Testimonial';
import { FinalCta } from '@/components/home/FinalCta';

// Next.js 14.2.x: params is synchronous (NOT a Promise). Don't `await` it.
export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'home' });
  return {
    title: t('pageTitle'),
    description: t('metaDescription'),
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <PhilosophyBand />
      <LevelsOfCare />
      <TeamCallout />
      <WhoWeServe />
      <Testimonial />
      <FinalCta />
    </>
  );
}
```

> **`useTranslations` vs `getTranslations`:** Section components are **synchronous** server components that use `useTranslations('home.levels')` etc. from `next-intl`. `getTranslations` (from `next-intl/server`) is only required in async contexts like `generateMetadata` or async server components. Keep the 7 section components synchronous — there's no data-fetching here.

---

## Translation Key Plan (`messages/en.json` `home` namespace — full replacement)

The existing `home` namespace (4 flat keys) is replaced wholesale with the nested structure below. Old flat keys `heroHeading`, `heroSubtext`, `heroCta`, `heroCtaSecondary` are **deleted** from both `en.json` and `ko.json`.

```
home
├── pageTitle
├── metaDescription                ← NEW: SEO description, ~150–160 chars, locale-specific
├── hero
│   ├── heading                   ← replaces old heroHeading
│   ├── subtext                   ← replaces old heroSubtext
│   ├── ctaPrimary                ← replaces old heroCta
│   └── ctaSecondary              ← replaces old heroCtaSecondary
├── philosophy
│   ├── title
│   ├── paragraph1                ← "Hospice is comfort-focused care…"
│   └── paragraph2                ← "Our care team addresses mind, body, spirit…"
├── levels
│   ├── title                     ← "Four Levels of Care"
│   ├── subtitle
│   ├── learnMore                 ← "Learn more"
│   ├── routine.{title, desc}
│   ├── continuous.{title, desc}
│   ├── inpatient.{title, desc}
│   └── respite.{title, desc}
├── team
│   ├── title                     ← "Your Interdisciplinary Care Team"
│   ├── intro
│   └── roles.{physician,rn,lvn,msw,chaplain,aide,bereavement,volunteer}.{name,desc}
├── whoWeServe
│   ├── title
│   ├── area.{title, desc}
│   ├── languages.{title, desc}
│   └── coverage.{title, desc}
├── testimonial
│   ├── quote
│   └── attribution
└── finalCta
    ├── title
    ├── subtitle
    ├── call
    ├── contact
    ├── refer
    ├── phoneNumberTel            ← e.g. "+13105551234" — used in href
    └── phoneNumberDisplay        ← e.g. "(310) 555-1234" — shown to user
```

Placeholder strings (testimonial copy, phone number) are tracked in `messages/PLACEHOLDERS.md` — see `Testimonial.tsx` note above.

`messages/ko.json` must mirror **every** key. Use NotebookLM Korean drafts where available; otherwise write professional Korean copy (the notebook has Korean source material per `notebooklm.md`). Day 7 polish pass will refine Korean further with native-reviewer pass.

**Hot key examples (draft, with NotebookLM provenance):**

NotebookLM source citations use the fragment numbers returned by the notebook query (notebook `d92cd23b-…`).

| Key | EN | KO | Source |
|---|---|---|---|
| `home.philosophy.paragraph1` | "Hospice care is comfort-focused care for individuals with a life expectancy of six months or less. Rather than pursuing a cure, our team focuses on relieving pain, managing symptoms, and preserving dignity in the place you call home." | "호스피스 케어는 기대 여명이 6개월 이하인 환자를 위한 편안함 중심의 케어입니다. 치료보다 통증 완화, 증상 관리, 그리고 자택에서의 존엄 유지에 집중합니다." | NLM frag 1, 4 |
| `home.levels.routine.title` | "Routine Home Care" | "정기 가정 호스피스 케어" | NLM frag 19 |
| `home.levels.continuous.title` | "Continuous Home Care" | "지속적 가정 케어" | NLM frag 19 |
| `home.levels.inpatient.title` | "General Inpatient Care" | "일반 입원 케어" | NLM frag 19 |
| `home.levels.respite.title` | "Respite Care" | "임시 위탁 케어" *(literal "휴식 케어" doesn't capture the Medicare regulatory meaning of short-term inpatient relief for the primary caregiver)* | NLM frag 19 |
| `home.team.roles.msw.name` | "Medical Social Worker" | "의료 사회복지사" | NLM frag 11 |
| `home.team.roles.physician.name` | "Hospice Physician" | "호스피스 전문의" | NLM frag 11 |
| `home.team.roles.chaplain.name` | "Spiritual Care / Chaplain" | "영적 상담사 / 채플린" | NLM frag 11 |
| `home.team.roles.bereavement.name` | "Bereavement Coordinator" | "사별 돌봄 코디네이터" | NLM frag 11 |
| `home.finalCta.title` | "Available 24/7 to Support Your Family" | "가족을 위한 24시간 연중무휴 지원" | brand line |

(Full strings drafted during implementation; structure above is the contract. Korean copy gets a native-reviewer polish on Day 7 — flag in the Day 7 checklist.)

---

## Step-by-Step Implementation Order

1. **Replace the `home` namespace in `messages/en.json`** — delete the 4 old flat keys, add the full nested structure with drafted copy.
2. **Mirror in `messages/ko.json`** — same key shape, Korean values (Day 7 will polish).
3. **Create `messages/PLACEHOLDERS.md`** — list every key currently holding placeholder copy (testimonial quote/attribution, phone number) so the client review is fast.
4. **Create `src/components/ui/Icon.tsx`** (inline SVG registry — Heroicons MIT-licensed outline paths, no npm dep).
5. **Create `src/components/ui/SectionContainer.tsx`** with the explicit static `BG_CLASSES` map.
6. **Create the 7 home section components** in `src/components/home/` (`Hero`, `PhilosophyBand`, `LevelsOfCare`, `TeamCallout`, `WhoWeServe`, `Testimonial`, `FinalCta`) — keep each file <150 lines, **synchronous** server components, Tailwind tokens only, exactly one `<h1>` lives in Hero.
7. **Refactor `src/app/[locale]/page.tsx`** to compose them and add `generateMetadata` with `metaDescription`. Drop the inline hero markup that exists today.
8. **Visual QA pass** at 375 / 768 / 1280 widths in DevTools.
9. **Type + lint pass:** `npx tsc --noEmit` and `npm run lint`.
10. **Production build smoke test:** `npm run build` — confirm both `/en` and `/ko` appear in the output and bundle size hasn't regressed catastrophically.

---

## Verification

```bash
npm run dev
# 1. Visit http://localhost:3000/en — confirm all 7 sections render in order
# 2. Visit http://localhost:3000/ko — confirm Korean copy throughout, no English leakage
# 3. Click 한국어 / English in Header — page persists section structure, copy swaps
# 4. DevTools mobile (375px): hero stacks, level cards stack to 1-col, CTAs full-width
# 5. Tab through the page: every CTA, every "Learn more" link shows visible focus ring
# 6. View page source: <title>, <meta name="description"> present and locale-specific
# 7. Hover level cards: shadow elevates smoothly (200ms)
# 8. Telephone link on FinalCta opens dialer (mobile) / prompts on desktop
# 9. Headings outline (DevTools Accessibility tab → "Show outline"): exactly one h1, h2s for each section, no skipped levels

npx tsc --noEmit       # zero errors
npm run lint           # zero errors
npm run build          # builds clean, both /en and /ko in output, no missing-translation warnings
```

**Lighthouse target (run on `npm run build && npm start` output, not dev server):**
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

**Color contrast spot-check (Chrome DevTools "Inspect" → contrast panel):**
- `text-primary` (#1A2B3C) on `neutral-warm` (#F8F6F2) → ~15:1 ✅
- `text-secondary` (#4A5568) on `neutral-warm` → ~8:1 ✅
- `text-muted` (#718096) on `neutral-warm` → ~4.6:1 — passes AA for normal text but is **borderline**. Reserve `text-muted` for non-essential metadata (captions, timestamps); never use it for primary readable body copy on Day 2 sections.
- White on `primary-900` (#0C2346) → ~15:1 ✅ (FinalCta band is safe)

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Real testimonial not yet provided by client | Use a representative quote in the tone of NotebookLM's caregiver-support content. Track in `messages/PLACEHOLDERS.md` (not in JSON itself) so client review checklist is one file. |
| Real phone number not yet provided by client | Same approach — `home.finalCta.phoneNumberTel` / `phoneNumberDisplay` placeholders listed in PLACEHOLDERS.md. |
| Hero imagery pending from client (`requirements.md` §3.2) | Hero right column uses a Tailwind gradient + decorative shape placeholder marked `aria-hidden`. Component structured so swapping in `<Image>` later is a 1-line change. |
| Korean copy quality | Draft from NotebookLM Korean source on Day 2; reserve final native-review polish for Day 7. Already noted that `휴식 케어`-style literal translations should be replaced with Medicare-context terminology. |
| Day 3–6 routes (`/services`, `/contact`, `/referral`, `/understanding-hospice`) don't exist yet | Links are correct future paths; the i18n middleware matcher already covers `/[locale]/anything`, so 404s today resolve naturally as those pages ship. No code change needed. |
| Bundle bloat from icon library | Use ~8 inline SVG paths in a custom `Icon.tsx` — zero npm dependency. |
| `SectionContainer` `bg` prop class generation | Static lookup map prevents the Tailwind JIT silently dropping dynamically constructed class names. Documented in component spec. |
| Phone number duplicated between `footer.phone` and `home.finalCta.phoneNumberDisplay` | Accept on Day 2; add to Day 7 checklist to unify into a single `contact.phone*` namespace. |

---

## Out of Scope (defer)

- Real client photography / video.
- Hospice myth-busting section (lives on `/understanding-hospice`, Day 3).
- FAQ accordion (Day 5).
- Forms (Day 6).
- Sitemap / robots / OG images (Day 7).
- Animation/scroll-reveal effects — keep Day 2 static; can layer Framer Motion on Day 7 if time allows.
