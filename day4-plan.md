# Day 4 Implementation Plan — About & Services Pages (2 pages)

> **File location note:** This file lives at the plan-mode path. After approval, copy it to `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\day4-plan.md` to match the `day1-plan.md` / `day2-plan.md` / `day3-plan.md` convention.

---

## Context

Days 1–3 are complete: scaffold + design system (Day 1), Home page (Day 2), and the three educational pages — Understanding Hospice, Hospice Laws, Insurance — (Day 3). Day 4 ships the **organizational credibility pages**: who Eminent is (About Us) and what Eminent actually does (Hospice Services). Together they convert a visitor who arrived from the Home or Educational pages into a referrer or family ready to call.

**Pages built today:**
1. **About Us** — `/[locale]/about` — mission, philosophy, values, founding/leadership context, LA County service area, **bilingual cultural-competence statement for Korean-American families**
2. **Hospice Services** — `/[locale]/services` — the full service offering: 4 levels of care (Routine / Continuous / General Inpatient / Respite) and the 8 IDG team disciplines, expanded beyond Home-page summaries; 24/7 availability; bereavement and volunteer programs

**Source alignment:**
- **`7-day-plan.md` Day 4:** "Build organizational credibility and explain the offering. Reuse `LongFormPage` from Day 3. JSON-LD `Organization` structured data on About Us." Per the master plan, the Hospice Laws + Patient Rights page was scheduled to slip into Day 4 morning if Day 3 ran long — but Day 3 shipped all three pages, so Day 4 is purely About + Services.
- **`instructions.md`:** Priority #2 = "Clearly explain the services provided by Eminent Hospice Care." Cultural fit for Korean-American families is a stated design direction.
- **`requirements.md`:** Sitemap §5 names both About Us and Services/Products explicitly. §3.1 content requirements: "Company overview (About Us)" and "Service/Product descriptions" — Day 4 satisfies both.
- **`notebooklm.md` notebook 1 (`d92cd23b-…`):** family-facing copy — hospice philosophy (NLM frag 1, 4), IDG composition + role descriptions (NLM frag 11), Korean-American outreach framing. Already extracted into `home.philosophy.*` and `home.team.roles.*` in `messages/en.json` during Day 2. Day 4 deepens these blurbs into full paragraphs on the Services page.
- **`notebooklm.md` notebook 2 (`37f4da68-…`):** the four levels of care (NLM frag 19) and their clinical indications. Day 3 used this for FY2026 rates on the Insurance page; Day 4 uses the same fragment for the patient-experience description of each level on Services (no dollar amounts).
- **`day3-plan.md`:** established the `LongFormPage` shell + `PageSidebar` + `Disclaimer` + `LastReviewed` + `PageBottomCta` primitives. Day 4 reuses all of them. **One small modification needed: `LongFormPage` currently hard-codes `<Disclaimer />`; Day 4 makes it optional** (About + Services are not regulatory pages and should not carry the educational-content disclaimer).

> **NotebookLM access note for the implementer.** During planning, the `anthropic-skills:notebooklm` skill's Python venv on this machine is missing `patchright` and the `pip` shim is absent, so the plan could not issue a fresh live query. The plan instead relies on (a) NotebookLM excerpts already extracted into `messages/en.json` by Day 2, (b) the Day 2 and Day 3 plans' explicit fragment-number citations (notebook 1 frag 1, 4, 11; notebook 2 frag 19), and (c) the source-of-truth notebook URLs in `notebooklm.md` for re-querying at implementation time if the implementer wants to verify or add. If the implementer can fix the venv (`pip install patchright && patchright install chromium`), they should re-query Notebook 1 for fresh **mission / values / founding-story** copy specifically — this is the one slice of About-page content that Day 2 did **not** already extract.

**Reuse from Days 1–3 (do not re-create):**
- `@/i18n/navigation` (`Link`, `usePathname`) — locale-aware routing
- `useTranslations` / `getTranslations` from `next-intl`
- `@/components/ui/SectionContainer` — padding/max-width
- `@/components/ui/Icon` — 20-icon registry; add 2 new icons (`target`, `flag`) for mission/values; everything else (`heart`, `users`, `shield`, `mapPin`, `language`, `briefcase`, `sparkles`, `sun`, `handHeart`, `chat`, `globe`, `home`, `hospital`, `calendar`) is already in place
- `@/components/layout/LongFormPage` — Day 3 shell (with one prop change — see "Shared primitive changes" below)
- `@/components/layout/PageSidebar` — Day 3 sidebar (with one type expansion — see below)
- `@/components/ui/LastReviewed` — Day 3 date stamp
- `@/components/info/PageBottomCta` — Day 3 closer
- All Tailwind tokens (`primary-*`, `neutral-warm`, `neutral-cream`, `font-heading`, `font-body`, `rounded-card`, `shadow-card`, `max-w-content`, `max-w-prose`, `px-section-x`, `py-section-y`)
- `<Header>` / `<Footer>` already wrap every page via `[locale]/layout.tsx` and Header already has nav entries for `/about` and `/services` (they currently 404 — Day 4 fixes that)

**Out of scope for Day 4:**
- For Families & Caregivers page, FAQ page (Day 5)
- Contact, Referral form (Day 6)
- Legal pages, hreflang, sitemap.xml, `FAQPage` JSON-LD, final Korean polish, real photography (Day 7)
- **Real staff photos / leadership bios** — placeholder gradient blocks pending client assets per `requirements.md` §3.2
- **Disclaimer copy** — About + Services do not need the educational-content disclaimer (that's Day 3's territory)

---

## Goals & Acceptance Criteria

A visitor opening either Day 4 page sees:
1. A clear, locale-correct `<h1>` and `<meta description>` (Lighthouse SEO ≥ 95).
2. The same two-column layout as the Day 3 pages on desktop (main content + right sidebar with quick links + contact CTA), collapsing to single-column on mobile. **No disclaimer band** — these pages are descriptive, not regulatory.
3. Content broken into scannable sections with `<h2>` anchors.
4. Cross-page navigation: each page links to the other Day 4 page, plus Home, Understanding Hospice (Day 3), and Contact / Referral (Day 6).
5. A bottom CTA band (`PageBottomCta`) reused from Day 3.
6. Full EN + KO translations; both routes (`/en/...` and `/ko/...`) render correctly.
7. **About Us only:** JSON-LD `Organization` structured data emitted in the `<head>` (`@context`: `https://schema.org`, `@type`: `MedicalOrganization`, fields: name, url, logo (placeholder if pending), address, telephone, openingHours `24/7`, areaServed `Los Angeles County, CA`, sameAs (empty array until socials confirmed), `@id` anchored to the canonical About URL). Use a `<script type="application/ld+json">` injected via the page's `generateMetadata` returning an `other` head element, **not** `dangerouslySetInnerHTML` inside the page body — keep it server-rendered.

**Pass criteria:**
- Zero TypeScript / lint errors (`npx tsc --noEmit`, `npm run lint`).
- Exactly one `<h1>` per page; section headings start at `<h2>`.
- All copy lives in `messages/*.json`; no inline English in `.tsx`.
- Tailwind tokens only; no raw hex.
- Mobile-first at 375 / 768 / 1280 widths; sidebar moves below main on mobile.
- All interactive elements ≥ 44×44 px tappable, with visible focus ring.
- Anchor links from sidebar to in-page `<h2>` sections scroll smoothly (relies on the scoped `.long-form h2 { scroll-margin-top: 6rem }` rule already in `globals.css`).
- Lighthouse a11y ≥ 95 per page.
- About page JSON-LD validates against schema.org (manual paste into [validator.schema.org](https://validator.schema.org/)).
- Header nav highlights `/about` and `/services` correctly when active (Day 1 `isActive` logic already handles this — verify no regressions).

---

## Shared Primitive Changes (small, intentional)

These are minimal, additive changes to Day 3's primitives. None affect Day 3 pages.

### 1. `LongFormPage` — make Disclaimer optional

**File:** `src/components/layout/LongFormPage.tsx`

Currently hard-codes `<Disclaimer />`. Day 4's About + Services should not carry the educational-content disclaimer (regulatory copy doesn't apply). Change to:

```ts
type Props = {
  title: string;
  lastReviewed?: string;
  introParagraph?: string;
  /** Defaults to true on Day 3 info pages; pass false on About/Services. */
  showDisclaimer?: boolean;
  sidebar: ReactNode;
  children: ReactNode;
};
```

Default `showDisclaimer = true` so the three existing Day 3 pages keep current behavior with **zero changes** to their `.tsx`. Day 4 pages pass `showDisclaimer={false}`.

Render: `{showDisclaimer ? <Disclaimer /> : null}`.

**Also:** Day 4's About + Services pages do **not** stamp a `lastReviewed` date. The `lastReviewed` prop is already optional in the existing component, so just omit it on the new pages. This decision is intentional — `lastReviewed` carries a "regulatory information was current as of X" semantic that doesn't apply to mission / values / service descriptions.

### 2. `PageSidebar` — expand `RelatedLink.labelKey` union

**File:** `src/components/layout/PageSidebar.tsx`

Current union:
```ts
labelKey: 'understandingHospice' | 'hospiceLaws' | 'insurance' | 'contact' | 'referral';
```

Expand to:
```ts
labelKey: 'home' | 'about' | 'services' | 'understandingHospice' | 'hospiceLaws' | 'insurance' | 'forFamilies' | 'faq' | 'contact' | 'referral';
```

Adding `home`, `about`, `services`, `forFamilies`, `faq` lets Day 4 sidebars link back to Home + each other and forward to Day 5/6 pages once they exist. Adding the entries to the type now (and to `common.relatedPages.links.*` JSON keys, see below) means Day 5/6 pages can reference the same union without further widening — one less primitive churn later.

### 3. `Icon` — add 2 new icons

**File:** `src/components/ui/Icon.tsx`

Add `target` (mission) and `flag` (values / founding milestones). Both Heroicons outline, MIT-licensed. Keep the existing static `PATHS` map pattern. No other icons need adding for Day 4 — the IDG team and 4-levels already have icons assigned in `LevelsOfCare` and `TeamCallout`, and About reuses `mapPin`, `language`, `globe`, `users`, `heart`, `handHeart`, `sparkles`.

### 4. `common.relatedPages.links` — add 5 new entries (EN + KO)

**Files:** `messages/en.json`, `messages/ko.json`

Add five new label keys under `common.relatedPages.links`:
```
home, about, services, forFamilies, faq
```

Values mirror the existing `nav.*` labels (e.g., `home.about = nav.aboutUs`'s human label, `home.services = nav.hospiceServices`'s human label). Do not delete the existing 5 keys — keep both sets so the type union + JSON stay in lockstep.

---

## Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| `messages/en.json` | **Edit** — add 2 namespaces (`about`, `services`); extend `common.relatedPages.links` with 5 new keys | All Day 4 copy |
| `messages/ko.json` | **Edit** — mirror in Korean (draft today, Day 7 polish) | Bilingual parity |
| `messages/PLACEHOLDERS.md` | **Edit** — add entries for founding-story copy, leadership names, JSON-LD address values | Track for client |
| `src/components/layout/LongFormPage.tsx` | **Edit** — add `showDisclaimer?: boolean` prop, default true | Allow About/Services to skip disclaimer |
| `src/components/layout/PageSidebar.tsx` | **Edit** — widen `RelatedLink.labelKey` union | Allow Day 4+ pages to link back |
| `src/components/ui/Icon.tsx` | **Edit** — add `target`, `flag` SVG paths | About mission + values |
| `src/components/about/MissionValues.tsx` | **Create** | About: mission paragraph + 4-card values grid |
| `src/components/about/ServiceArea.tsx` | **Create** | About: LA County coverage block (`mapPin` + sub-areas) |
| `src/components/about/CulturalCompetence.tsx` | **Create** | About: bilingual / Korean-American care callout |
| `src/components/about/IdgTeamDetail.tsx` | **Create** | About: condensed IDG team grid (reuses 8 roles from `home.team.roles.*`) — links into Services for deep dives |
| `src/components/about/OrganizationJsonLd.tsx` | **Create** | About: server-only component returning a `<script type="application/ld+json">` |
| `src/components/services/LevelsDetail.tsx` | **Create** | Services: full clinical detail per level of care (4 expanded panels, one per level) |
| `src/components/services/TeamDisciplinesDetail.tsx` | **Create** | Services: full description per IDG role (8 expanded panels) |
| `src/components/services/AdditionalServices.tsx` | **Create** | Services: 24/7 on-call, medications + DME delivery, bereavement (13 months), volunteer programs |
| `src/app/[locale]/about/page.tsx` | **Create** | Page route + `generateMetadata` + JSON-LD injection |
| `src/app/[locale]/services/page.tsx` | **Create** | Page route + `generateMetadata` |

**Folder convention:**
- `src/components/about/` — **new for Day 4** — content blocks used only by the About page
- `src/components/services/` — **new for Day 4** — content blocks used only by the Services page
- Day 3's `src/components/info/` directory stays as-is; Day 4 does not reuse it (these pages aren't regulatory info).

---

## Page 1 — About Us

**Route:** `/[locale]/about`
**Source:** notebook 1 frag 1 + 4 (philosophy), notebook 1 frag 11 (IDG composition); Day 2 already-extracted copy in `home.philosophy.*` + `home.team.roles.*` + `home.whoWeServe.*`. **Mission, values, and founding-story copy are new for Day 4** — see NotebookLM access note in Context above.

### Section outline (in-page `<h2>` order)

1. **Our Mission** — single paragraph stating Eminent's purpose. Frame as commitment, not description ("Our mission is to walk alongside…", not "Eminent provides…"). Pulls philosophical grounding from notebook 1 frag 1, 4 — already-translated in `home.philosophy.paragraph1`. About-page mission copy should be a parallel statement, **not** a verbatim re-use, so the two pages don't feel redundant when visited in the same session.
2. **Our Values** — `MissionValues` 4-card grid:
   - **Compassion** (`heart`) — "We meet every patient and family where they are, with patience and gentleness."
   - **Dignity** (`shield`) — "We protect each person's right to be seen, heard, and treated with respect."
   - **Cultural Humility** (`globe`) — "We listen to each family's language, faith, and traditions and let those guide care."
   - **Clinical Excellence** (`sparkles`) — "Our team holds itself to the federal Conditions of Participation and to the higher bar of what families would want for their own."
3. **A Brief Story** — **PLACEHOLDER**. Client must confirm founding year, founder names, and origin story. Until then, render **interim copy** marked as illustrative in `messages/PLACEHOLDERS.md`. Do **not** render a "Coming soon" stub — that reads as unfinished; instead use a short, factually safe statement: "Eminent Hospice Care was founded to bring compassionate, culturally aware end-of-life care to Los Angeles County, with a particular commitment to the Korean-American community whose families have long needed care delivered in their own language." Replace verbatim with client copy when received.
4. **Service Area** — `ServiceArea` block:
   - LA County focus, with named sub-regions ("South Bay, San Fernando Valley, San Gabriel Valley, Greater Los Angeles") — mirror the `home.whoWeServe.area.desc` framing but expand to named regions
   - 24/7 availability (`calendar` icon)
   - Map placeholder (no Google Maps embed here — that's the Contact page's job on Day 6; About page is brand-level)
5. **Care for Korean-American Families** — `CulturalCompetence` callout:
   - Bilingual EN/KO care
   - Korean-speaking staff (mark as a client-confirmation placeholder if the actual KO-speaking headcount isn't known)
   - Cultural and faith traditions honored — chaplain coordinates with the family's tradition
   - **Display the Korean equivalent of the section title and lead sentence inline on the EN page** — so a Korean-American family browsing the English version still sees the Korean reassurance. This is a small but meaningful UX choice for the target community.
6. **Your Care Team** — `IdgTeamDetail` (8 roles, condensed — reuses `home.team.roles.*` blurbs). Each role card links via anchor to the Services-page deep dive (e.g., `/services#role-rn`). About is the "who" — Services is the "what they do."
7. **What Sets Us Apart** — short paragraph + bulleted list:
   - Medicare-certified and surveyed against the federal Conditions of Participation (link to Day 3's `/hospice-laws` page for the regulatory primer)
   - Same-day admission when clinically appropriate
   - Pharmacy and DME (durable medical equipment) coordination — meds and equipment arrive at home
   - 24/7 RN on-call line
   - Bilingual EN/KO intake

### Components used
- `LongFormPage` (with `showDisclaimer={false}`)
- `PageSidebar` (with new related links: home, services, understanding-hospice, contact, referral)
- `MissionValues`, `ServiceArea`, `CulturalCompetence`, `IdgTeamDetail`
- `OrganizationJsonLd` (server-only — emits `<script type="application/ld+json">` via `generateMetadata` `other` field)
- `PageBottomCta`

### Translation keys
```
about
├── pageTitle, metaDescription
├── introParagraph
├── sections.mission.{title, body}
├── sections.values.{title, intro, items.{compassion, dignity, culturalHumility, clinicalExcellence}.{title, body}}
├── sections.story.{title, body}                ← placeholder; track in PLACEHOLDERS.md
├── sections.serviceArea.{title, body, regions.{southBay, sanFernandoValley, sanGabrielValley, greaterLA}, hoursNote}
├── sections.culturalCompetence.{title, koreanTitle, intro, koreanIntro, bullets.{bilingual, koreanStaff, traditions, chaplainCoord}, note}
├── sections.team.{title, intro, viewServicesLink}
└── sections.distinctives.{title, intro, items.{certified, sameDay, pharmacy, oncall, bilingual}}

aboutJsonLd                                       ← non-rendered; structured-data values only
├── name             "Eminent Hospice Care Inc."
├── url              (canonical EN URL — set per-locale at runtime)
├── logoPlaceholder  "/images/logo-placeholder.png"   ← swap to real file when client delivers
├── telephone        from common.phone.tel
├── address.{streetAddress, addressLocality, addressRegion, postalCode, addressCountry}   ← placeholders; see PLACEHOLDERS.md
├── openingHours     "Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59"
└── areaServed       "Los Angeles County, CA"
```

---

## Page 2 — Hospice Services

**Route:** `/[locale]/services`
**Source:** notebook 1 frag 11 (IDG roles) + notebook 2 frag 19 (4 levels of care, clinical detail). Day 2 already-extracted blurbs in `home.team.roles.*` and `home.levels.*` are the starting point; Day 4 deepens each into a paragraph + clinical eligibility note.

### Section outline (in-page `<h2>` order)

1. **What We Offer** — single paragraph framing the offering: "All four Medicare-defined levels of hospice care, delivered by a full interdisciplinary team, 24 hours a day, 7 days a week, anywhere a patient calls home in Los Angeles County." Cross-link to `/understanding-hospice` for the "what hospice is" primer.
2. **The Four Levels of Care** — `LevelsDetail` (4 expanded panels). Each panel:
   - `<h3 id="level-{routine|continuous|gip|respite}">`
   - One-paragraph plain-language description (expand the existing `home.levels.{key}.desc` one-liner into 2–3 sentences)
   - **Clinical eligibility / when used** — 2–3 sentences describing the patient situation that triggers this level. Sourced from notebook 2 frag 19. Patient-experience oriented, **no dollar amounts** (those live on the Insurance page from Day 3 — cross-link).
   - **What this looks like at home / in facility** — 1–2 sentences of practical detail
   - For the Insurance / cost question, render a small footnote: "For coverage and payment information, see [Insurance & Medicare](/insurance)."
3. **Your Interdisciplinary Team** — `TeamDisciplinesDetail` (8 expanded panels):
   - `<h3 id="role-{physician|rn|lvn|msw|chaplain|aide|bereavement|volunteer}">` so About page can deep-link to each
   - For each role: existing one-line `home.team.roles.{key}.desc` becomes the lead; add **a second paragraph describing typical visit frequency, what the visit looks like, and how the role coordinates with the rest of the team.**
   - Specifically for **Bereavement Coordinator**: note the 13-month post-loss follow-up (industry-standard hospice bereavement service — every hospice that meets Medicare Conditions of Participation provides at least 12 months of bereavement support to surviving family; 13 months is common Conditions-of-Participation interpretation. Notebook 1 frag 11.)
   - Specifically for **Volunteer**: note that volunteers go through a structured training program and are background-checked; the role is meaningful, not casual.
4. **Additional Services** — `AdditionalServices` block:
   - **24/7 on-call nursing line** — single phone number, answered by an RN
   - **Medication delivery** — comfort medications coordinated with our pharmacy partner and delivered to the home
   - **Medical equipment (DME) delivery** — hospital bed, oxygen concentrator, wheelchair, commode, etc., at no additional cost when ordered through the hospice
   - **Bereavement support** — 13 months for surviving family (cross-link to Day 5's For-Families page once it exists; until then, render as plain text — Day 7 swaps in the link)
   - **Volunteer program** — companionship, light errands, respite presence
5. **How to Start** — short ordered list (3 steps):
   1. Call our 24/7 line or use the Contact form
   2. We coordinate with your physician to certify eligibility
   3. An RN visits within 48 hours to start care
   - Two prominent buttons below: "Call Now" (tel link) and "Make a Referral" (`/referral`)

### Components used
- `LongFormPage` (with `showDisclaimer={false}`)
- `PageSidebar` (related: home, about, understanding-hospice, insurance, contact, referral)
- `LevelsDetail`, `TeamDisciplinesDetail`, `AdditionalServices`
- `PageBottomCta`

### Translation keys
```
services
├── pageTitle, metaDescription
├── introParagraph
├── sections.offer.{title, body, linkToUnderstanding}
├── sections.levels.{title, intro,
│   routine.{title, summary, clinical, atHome, costFootnote},
│   continuous.{title, summary, clinical, atHome, costFootnote},
│   gip.{title, summary, clinical, atHome, costFootnote},
│   respite.{title, summary, clinical, atHome, costFootnote}
│ }
├── sections.team.{title, intro,
│   physician.{role, body},
│   rn.{role, body},
│   lvn.{role, body},
│   msw.{role, body},
│   chaplain.{role, body},
│   aide.{role, body},
│   bereavement.{role, body},
│   volunteer.{role, body}
│ }
├── sections.additional.{title, intro,
│   oncall.{title, body},
│   meds.{title, body},
│   dme.{title, body},
│   bereavement.{title, body},
│   volunteer.{title, body}
│ }
└── sections.howToStart.{title, intro, steps.{1, 2, 3}, callCta, referCta}
```

---

## JSON-LD Structured Data (About page only)

**Why:** `MedicalOrganization` schema on the About page powers local-pack ranking and Google Knowledge Panel eligibility — the highest-ROI single piece of SEO work for a local-business site, per `7-day-plan.md` Day 7 SEO checklist (pulled forward to Day 4 because About is the natural carrier).

**Implementation:**
1. Page uses `generateMetadata` (already required for `<title>` / `<meta description>`). Extend the returned `Metadata` with the `other` field to inject a `<script type="application/ld+json">` tag — OR — render an `<OrganizationJsonLd />` server component **inside the page body** (no client JS, no `dangerouslySetInnerHTML` workaround, just a server-rendered `<script>` tag).
2. The component reads structured data values from the `aboutJsonLd` translation namespace (so locale-specific values like `url` and `addressCountry` work).
3. **All address fields are placeholders** until the client confirms — tracked in `messages/PLACEHOLDERS.md`. Render the JSON-LD anyway (with placeholders) so the schema is wired and ready; Day 7 swaps the placeholder values.
4. **`telephone`** pulls from `common.phone.tel` (already E.164 from Day 3); change there once, propagates.
5. **`logo`**: until the client provides a logo PNG (per `requirements.md` §3.2), reference `/images/logo-placeholder.png` and add a `logo-placeholder.png` to the `public/images/` directory (Day 4 — create a 512×512 transparent PNG with the text "Eminent Hospice Care" rendered server-side or simply omit the `logo` field if no placeholder image is added; **prefer omitting over rendering a broken image URL**).

**Validation:** Manual paste into [validator.schema.org](https://validator.schema.org/) — must return zero errors. Add as a Day 7 final-QA step in `7-day-plan.md` Final QA checklist.

---

## Shared Translation Keys (additions to `common`)

```
common.relatedPages.links
  + home              "Home"               / "홈"
  + about             "About Us"           / "회사 소개"
  + services          "Hospice Services"   / "호스피스 서비스"
  + forFamilies       "For Families & Caregivers"  / "가족 및 보호자를 위한 안내"
  + faq               "FAQ"                / "자주 묻는 질문"
```

Korean values draft today; Day 7 native polish.

---

## Sidebar Content (Day 4 pages)

`PageSidebar` renders the same three blocks as Day 3:
1. **"On this page"** — anchor list to in-page `<h2>` sections (parent page passes the anchor array as a prop)
2. **"Related pages"** —
   - About page sidebar: `home`, `services`, `understandingHospice`, `contact`, `referral`
   - Services page sidebar: `home`, `about`, `understandingHospice`, `insurance`, `contact`, `referral`
3. **Contact card** — phone (`tel:` link) + "Speak with our team" Link to `/contact` (unchanged from Day 3)

**Implementation rule:** sidebar stays a server component. No client-side scroll-spy.

---

## Implementation Conventions (carried forward from Days 1–3)

These are restated because Day 4 adds 2 new pages + `generateMetadata` and 9 new components, and any silent miss breaks a11y/SEO/i18n.

1. **`useTranslations` vs `getTranslations`** — `getTranslations` only in async server contexts (`generateMetadata`). Page bodies and `about/`, `services/` blocks stay synchronous server components using `useTranslations('namespace')`. Don't `await` either.
2. **`params` in Next.js 14.2.x** — synchronous, not a Promise. In `generateMetadata({ params }: { params: { locale: string } })` do not `await params`.
3. **Korean term policy** — for branded/regulatory English terms (Medicare, Medi-Cal, IDG, RN, MSW, POLST, HIPAA), use the hybrid: Korean translation followed by parenthesized English on first use per page, English-only on subsequent mentions. About + Services touch fewer regulatory terms than Day 3 — but where they appear (e.g., "Medicare-certified", "Conditions of Participation"), apply the same convention.
4. **Tailwind tokens only** — no raw hex; for any `bg-*`/`text-*` chosen via prop, use an explicit `Record<…, string>` lookup of full literal class strings (JIT requires literals — Day 2 `SectionContainer` is the canonical pattern).
5. **No `_note` keys in `messages/*.json`** — placeholders tracked in `messages/PLACEHOLDERS.md`, never in the runtime JSON.
6. **JSON-LD** — render server-side only, no `dangerouslySetInnerHTML` shortcut inside JSX. Either via `Metadata.other` or a server-component `<script>` tag.

---

## Step-by-Step Implementation Order

1. **Edit `messages/en.json`** — add `about` and `services` namespaces + 5 new `common.relatedPages.links` keys. Draft copy: mission/values/distinctives written fresh (notebook 1 framing); founding-story is interim placeholder copy (see Page 1 §3); levels/team detail expanded from `home.levels.*` / `home.team.roles.*`.
2. **Mirror in `messages/ko.json`** — Korean drafts (Day 7 native polish).
3. **Edit `messages/PLACEHOLDERS.md`** — append:
   - `about.sections.story.body` — interim copy, client confirms founding year + names
   - `aboutJsonLd.address.*` — placeholder address; client confirms before Day 7 publish
   - `aboutJsonLd.logoPlaceholder` — pending logo PNG (per `requirements.md` §3.2)
   - `about.sections.culturalCompetence.bullets.koreanStaff` — staff headcount in Korean — confirm actual number with client
4. **Edit `src/components/ui/Icon.tsx`** — add `target` and `flag` to the `IconName` union and `PATHS` map (Heroicons outline, MIT-licensed).
5. **Edit `src/components/layout/LongFormPage.tsx`** — add `showDisclaimer?: boolean` prop (default `true`); conditionally render `<Disclaimer />`. Verify Day 3 pages still render with disclaimer (they pass no prop → default true).
6. **Edit `src/components/layout/PageSidebar.tsx`** — widen `RelatedLink.labelKey` union to include `home`, `about`, `services`, `forFamilies`, `faq`. Verify Day 3 pages still type-check.
7. **Create `src/components/about/MissionValues.tsx`** — 4-card grid of values (`heart`, `shield`, `globe`, `sparkles`).
8. **Create `src/components/about/ServiceArea.tsx`** — LA County focus block with sub-regions.
9. **Create `src/components/about/CulturalCompetence.tsx`** — bilingual / Korean-American care callout. Renders Korean inline on EN page (see Page 1 §5).
10. **Create `src/components/about/IdgTeamDetail.tsx`** — condensed team grid; each role card is a `<Link>` to `/services#role-{key}`.
11. **Create `src/components/about/OrganizationJsonLd.tsx`** — server-only component; emits `<script type="application/ld+json">` reading from the `aboutJsonLd` translation namespace.
12. **Create `src/components/services/LevelsDetail.tsx`** — 4 panels with deep clinical detail; each has stable `id="level-{key}"` for anchor linking.
13. **Create `src/components/services/TeamDisciplinesDetail.tsx`** — 8 panels with role detail; each has stable `id="role-{key}"`.
14. **Create `src/components/services/AdditionalServices.tsx`** — 5-item list (24/7, meds, DME, bereavement, volunteer).
15. **Create `src/app/[locale]/about/page.tsx`** — composes `LongFormPage` (with `showDisclaimer={false}`); `generateMetadata` from `about.pageTitle` + `metaDescription`; renders `<OrganizationJsonLd />` near the top.
16. **Create `src/app/[locale]/services/page.tsx`** — same pattern, no JSON-LD.
17. **Visual QA at 375 / 768 / 1280** for both pages (both locales).
18. **Type + lint pass** — `npx tsc --noEmit`, `npm run lint`.
19. **Production build smoke test** — `npm run build`. Confirm 4 new routes (2 EN + 2 KO) appear; no missing-translation warnings.
20. **JSON-LD validation** — view-source on `/en/about`, copy the `application/ld+json` block, paste into [validator.schema.org](https://validator.schema.org/). Must show zero errors.

---

## Hot Copy Examples (drafts — with provenance)

NLM = NotebookLM. Fragment numbers cited from Day 2 / Day 3 plans where the same fragment was previously surfaced.

| Key | EN | KO (draft) | Source |
|---|---|---|---|
| `about.sections.mission.body` | "Our mission is to walk alongside patients and families through life's final chapter — with skilled medical care, gentle presence, and respect for the language, traditions, and choices that make each family who they are." | "저희의 사명은 환자와 가족이 인생의 마지막 장을 걸어가는 모든 순간을 함께하는 것입니다. 전문 의료 케어, 따뜻한 동행, 그리고 각 가정의 언어와 전통, 선택을 존중하는 마음으로." | parallel to NLM frag 1, 4 (philosophical grounding) |
| `about.sections.values.items.culturalHumility.body` | "We listen to each family's language, faith, and traditions and let those guide care." | "각 가정의 언어와 신앙, 전통을 경청하고, 그 안에서 케어의 방향을 찾습니다." | NLM frag 11 (cultural framing) |
| `about.sections.culturalCompetence.koreanIntro` | "에미넌트 호스피스 케어는 한국어로 진행되는 입원 상담, 한국어를 구사하는 간호 인력, 그리고 한인 가족의 전통과 신앙을 존중하는 케어를 제공합니다." | (same — renders on EN page too) | NLM bilingual EN-KO outreach section |
| `services.sections.levels.routine.clinical` | "Routine Home Care is appropriate when symptoms are stable and the patient and family can manage day-to-day at home with scheduled team support. This is the level most hospice patients use most of the time." | "정기 가정 호스피스 케어는 증상이 안정적이고 환자와 가족이 정기적인 팀의 방문 지원으로 일상 생활을 관리할 수 있을 때 적합합니다. 호스피스 환자 대부분이 가장 오랜 기간 받는 케어 단계입니다." | NLM frag 19 (4 levels, clinical) |
| `services.sections.levels.continuous.clinical` | "Continuous Home Care provides nursing presence for stretches of 8 or more hours within a 24-hour period during an acute symptom crisis — pain that's not yet controlled, severe shortness of breath, or another situation that would otherwise lead to a hospital visit. The goal is to manage the crisis at home." | "지속적 가정 케어는 24시간 중 8시간 이상 간호 인력이 머무르며 통증, 호흡 곤란 등 급성 증상 위기 상황에서 입원 없이 자택에서 위기를 관리할 수 있도록 돕습니다." | NLM frag 19 (Continuous Home Care) |
| `services.sections.levels.gip.clinical` | "General Inpatient Care is short-term care at a contracted facility — hospital, freestanding hospice inpatient unit, or skilled nursing facility — used when symptoms cannot be safely managed at home. Patients return home as soon as symptoms are stable." | "일반 입원 케어는 자택에서 안전하게 증상을 관리할 수 없을 때, 계약된 병원이나 호스피스 입원 시설, SNF에서 단기간 받는 케어입니다. 증상이 안정되면 다시 자택으로 돌아갑니다." | NLM frag 19 (GIP) |
| `services.sections.levels.respite.clinical` | "Respite Care provides up to five consecutive days of inpatient stay to give the primary family caregiver a needed break. The patient is cared for in a Medicare-certified facility; the family rests." | "임시 위탁 케어는 주 보호자가 휴식을 가질 수 있도록 최대 5일 연속 입원 케어를 제공합니다. 환자는 메디케어 인증 시설에서 케어를 받고, 가족은 휴식을 취합니다." | NLM frag 19 (Respite) |
| `services.sections.team.bereavement.body` | "Our bereavement coordinator stays in touch with surviving family for thirteen months after the loss — calls, support-group resources, anniversary check-ins. Grief support is not an add-on to hospice; it is hospice." | "사별 돌봄 코디네이터는 사별 후 13개월간 가족과 연락을 유지하며 통화, 지원 모임 안내, 기일 안부 등을 통해 슬픔의 시간을 함께합니다. 사별 돌봄은 호스피스의 부가 서비스가 아니라 핵심입니다." | NLM frag 11 (bereavement role) |

Full strings drafted during implementation; structures above are the contract.

---

## Verification

```powershell
npm run dev
# /en/about — h1, 7 sections, sidebar, no disclaimer band
# /ko/about — Korean throughout, Korean inline in cultural-competence section on EN page
# /en/services — h1, 5 sections, 4 levels with anchor IDs, 8 roles with anchor IDs
# /ko/services — Korean throughout
# Click About sidebar's "Services" link → lands /services
# Click About's IdgTeamDetail card for "Registered Nurse" → lands /services#role-rn, scrolls below sticky header
# Tab through both pages: visible focus on every interactive element
# DevTools mobile 375px: sidebar moves below main, panels stack, no horizontal overflow
# DevTools Accessibility outline: exactly one h1, h2 for sections, h3 for sub-panels — no skipped levels
# View page source on /en/about: <script type="application/ld+json"> present, valid JSON, MedicalOrganization @type
# Header nav: "About Us" and "Hospice Services" highlight when on those pages

npx tsc --noEmit       # zero errors (including the LongFormPage prop addition)
npm run lint           # zero errors
npm run build          # 4 new routes (about + services × 2 locales) appear, no missing-translation warnings
```

**Content correctness spot-check:**
- Mission copy is parallel to Home's philosophy paragraph, not a verbatim duplicate (visiting Home then About should not feel like reading the same page twice)
- Values copy avoids hospital-vendor cliché; each value has a concrete behavioral statement, not just a feeling word
- Cultural-competence section renders Korean inline on the EN page so a Korean-American visitor on `/en/about` still sees the Korean reassurance
- Services 4 levels match the Day 3 Insurance page's level names exactly (`Routine Home Care`, `Continuous Home Care`, `General Inpatient Care`, `Respite Care` — and the Korean equivalents already in `home.levels.*.title`)
- Services 8 IDG roles match `home.team.roles.*` names exactly
- Bereavement 13-month figure used (notebook 1 frag 11 phrasing); not "12 months" (which is the Conditions-of-Participation floor — 13 is industry-standard)
- About JSON-LD validates at validator.schema.org with zero errors (placeholder address values are syntactically valid even if not real)
- About page does NOT carry the educational-content disclaimer (regulatory disclaimer is for Day 3 info pages only)
- Founding-story interim copy contains no fabricated specifics (no invented founder names, no invented founding year) — replaced by client before launch

**Lighthouse target per page:** Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **About-page founding story is fabricated rather than real** | Use the deliberately generic interim copy (Page 1 §3); flag in `messages/PLACEHOLDERS.md`; client confirms before launch. No invented founder names, no invented founding year. |
| **JSON-LD ships with placeholder address → schema present but factually wrong** | Render the JSON-LD anyway (so the schema is wired) but use clearly-placeholder values; Day 7 swaps in real values; explicit row in `messages/PLACEHOLDERS.md`. |
| **Logo file still pending** → JSON-LD `logo` field references missing image | Omit `logo` from JSON-LD until the file exists rather than emitting a broken URL. Schema.org marks `logo` as recommended-not-required. |
| **Cultural-competence claims overstate bilingual capability** | Korean-staff bullet flagged as a placeholder in `messages/PLACEHOLDERS.md`. Client confirms actual headcount. Until then, render the safe phrasing "Korean-speaking team members" without a count. |
| **`LongFormPage` prop change breaks Day 3 pages** | Default `showDisclaimer = true` keeps existing pages identical without `.tsx` change. `npx tsc --noEmit` plus visiting all three Day 3 pages in dev catches regression. |
| **Services page deep-dives feel redundant with Home page summaries** | Home blurbs are intentionally short (one line); Services expands each into 2–3 sentences with clinical context. Different reader intent, different depth. Cross-link both directions so visitors who arrived on Services from Home don't feel stuck. |
| **"23 CoPs" or other Day-3 cautioned figures sneak into About copy** | About page references "the federal Conditions of Participation" without a count, matching the Day 3 plan's safer convention. |
| **JSON-LD injected via `dangerouslySetInnerHTML` opens an XSS surface** | Build the JSON-LD as a typed `Record<string, unknown>`, then `JSON.stringify` it in the server component; React escapes the string content inside the `<script>` tag automatically. No `dangerouslySetInnerHTML` needed. (Standard Next.js 14 server-component pattern.) |
| **`/services#role-rn` anchors collide with sticky Header offset** | The `.long-form h2 { scroll-margin-top: 6rem }` rule already in `globals.css` from Day 3 also affects descendant `<h3>` if extended — verify and, if needed, add `.long-form h3 { scroll-margin-top: 6rem }` in Day 4 (still scoped to `.long-form`, no global effect). |
| **NotebookLM venv is broken at implementation time too** | Plan already includes the Day 2 / Day 3 fragment citations and the in-JSON copy that was extracted previously. Implementer can ship the full Day 4 without a fresh NotebookLM query if needed — but should re-query for mission / values once venv is fixed (`pip install patchright && patchright install chromium`). |
| **3 page styles (About long-form, Services long-form, neither truly "long-form") feels forced** | The `LongFormPage` shell is general — two-column + sidebar + main + bottom-CTA. It works just as well for descriptive content as for regulatory content; the disclaimer band was the one Day-3-specific affordance, and that's exactly what the new `showDisclaimer` prop addresses. |
| **Korean cultural-competence copy gets reviewer pushback on Day 7** | Day 4 ships Korean *drafts* using the same hybrid convention as Day 3 (한국어 + parenthesized English for regulatory terms). Day 7 native-reviewer polish is the gate. |

---

## Out of Scope (defer)

- Real client-confirmed founding story (placeholder Day 4; client copy Day 7)
- Real address values for JSON-LD (placeholder Day 4; client confirms before launch)
- Real logo file referenced in JSON-LD (omit until provided)
- Real staff photos / leadership bios (gradient placeholders until client delivers)
- Google Maps embed on About — that's the Contact page (Day 6); About stays brand-level
- For-Families / FAQ pages, the Contact/Referral forms (Days 5–6)
- `MedicalOrganization` JSON-LD also on Home (Day 7 SEO pass)
- `hreflang` tags, `sitemap.xml`, `robots.txt` (Day 7)
- Native Korean reviewer polish (Day 7)
- Bringing `home.finalCta.phoneNumber*` / `footer.phone` / `common.phone.*` into a single canonical source (Day 7 cleanup item already tracked in `messages/PLACEHOLDERS.md`)
- Print stylesheet — Day 3 added scoped `.long-form @media print` rules in `globals.css`; About + Services inherit them automatically because they share the `long-form` class on the `LongFormPage` shell. No new print CSS needed.
