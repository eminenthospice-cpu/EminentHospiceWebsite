# Day 7 Implementation Plan — SEO, Polish, Legal & Launch Prep

> **File location note:** After approval, copy this plan to `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\day7-plan.md` to match the `day1-plan.md` … `day6-plan.md` convention.

---

## Context

Days 1–6 are complete. Ten of ten core content pages ship — Home (Day 2), the three educational pages (Day 3), About + Services (Day 4), For Families + FAQ (Day 5), and Contact + Referral with the full HIPAA-aware form pipeline + security headers (Day 6). Both API routes (`/api/contact`, `/api/referral`) are wired with rate-limit + Turnstile + Zod + Resend.

Day 7 is the **final launch-prep sprint**. It ships no new content pages. It (a) adds the four legal/utility pages the Footer and the Day 6 Mode B referral privacy snippet already point at, (b) ships the SEO infrastructure layer the prior six days deliberately deferred (hreflang, sitemap, robots, OG, JSON-LD on Home), (c) adds the three system-route safety nets (`not-found`, `error`, `loading`), (d) runs the Lighthouse + axe + Korean-rendering audit and fixes anything that misses target, (e) runs a native-reviewer pass on the KO drafts from Days 2–6 (checklist-driven from `PLACEHOLDERS.md`), (f) re-attempts the NotebookLM verification of the ten Day 5 keys flagged because of the `RESPONSE_SELECTORS` bug, and (g) compiles the production env-var inventory + the BAA / hosting / analytics decision rows. The site that exists at the end of Day 6 is **functionally complete**; Day 7 makes it **launchable**.

**Source alignment:**
- **`7-day-plan.md` Day 7 (lines 129–178):** Korean polish, per-page metadata + hreflang + sitemap + robots, JSON-LD `MedicalOrganization`/`LocalBusiness` on Home + About (About done Day 4) + `FAQPage` on FAQ (done Day 5), WCAG 2.1 AA pass with Lighthouse a11y ≥ 95, perf budget (LCP < 2.5 s, INP < 200 ms, CLS < 0.1, First Load JS < 200 KB / route), `app/not-found.tsx` + `app/error.tsx` + `app/loading.tsx`, favicon + apple-touch-icon + og-default (1200×630), Privacy Policy + HIPAA Notice + Accessibility Statement + Terms of Use linked from Footer, deployment env vars + headers verification, final QA checklist.
- **`requirements.md` §2, §3.2, §4, §8:** SEO optimization, performance optimization, logo asset wiring, completed website, source code, basic maintenance guidance — all addressed today.
- **`instructions.md`:** "professionalism, compassion, clarity, and accessibility" + "SEO-focused content organization" — Day 7 enforces and measures these non-functional requirements.
- **`notebooklm.md`:** Notebook 1 fragments 24, 25, 29, 32 are the verification source for the 10 Day 5 keys flagged in `PLACEHOLDERS.md` "Day 5 — NLM-grounded copy." Notebook 2 is unchanged from Day 3. Neither notebook covers Privacy Policy or HIPAA Notice — those are by definition operational / client-provided legal text.
- **`messages/PLACEHOLDERS.md`:** all rows tagged "Day 7 polish" / "Day 7 cleanup" roll up here. Rows that require client input (real address, real phone, real logo, real testimonial, BAA status, founder names) stay tracked but are not Day 7 work.
- **`day1-plan.md` … `day6-plan.md`:** every primitive Day 7 needs already exists.

**Reuse from Days 1–6 (do not re-create):**
- `@/i18n/navigation` (`Link`, `redirect`), `@/i18n/routing` (`routing.locales`, `routing.defaultLocale`)
- `useTranslations` / `getTranslations` (the latter only in `generateMetadata`)
- `@/components/layout/LongFormPage` — used for all four legal pages with `showDisclaimer={false}` (legal pages do not carry the educational disclaimer)
- `@/components/layout/PageSidebar` — used on all four legal pages for table-of-contents + related-links
- `@/components/ui/SectionContainer`, `Icon`, `Disclaimer`, `LastReviewed`, `FormSuccess`
- `@/components/info/PageBottomCta` — reused at the bottom of Privacy + Accessibility (**not** Terms or HIPAA Notice — those are deliberately quiet pages)
- `@/components/about/OrganizationJsonLd` — the implementation pattern for the new Home emitter; `aboutJsonLd.*` namespace stays the **single source of truth** for address/phone/hours
- All Tailwind tokens — no new tokens needed
- Header is untouched; Footer gets a new legal-links rail
- Day 6 inline form-privacy snippets (`common.formPrivacyShort.*`) stay; today wires the full Privacy Policy page they reference

**Out of scope for Day 7 (defer to post-launch):**
- Real client-provided HIPAA Notice of Privacy Practices text (route ships with an honest interim block; replacing it is one JSON edit when client text arrives)
- Real client logo PNG if not yet delivered (the `aboutJsonLd.logo` field stays omitted until the file lands; `favicon.ico` Next.js scaffold default stays)
- Analytics wiring (gated on the open question — Plausible / Vercel Analytics / GA4 / none). If analytics is later added, CCPA "Do Not Sell" link + cookie banner become required.
- Upstash Redis swap for `src/lib/rate-limit.ts` (single-file change documented in Day 6)
- Nonce-based CSP (removes the two `'unsafe-inline'` directives — breaks SSG caching, deferred per Day 6 risk row)
- Real photography (Hero gradient + text-only About staff cards stay)
- Real testimonial quote with signed release
- Day 3 phone-key consolidation across `home.finalCta.phoneNumber*` / `footer.phone` / `common.phone.*` (pure refactor, not a launch blocker)
- BAA flip (`HAS_BAA=true`) — operational act tied to vendor contract, not code
- Sitemap submission to Google Search Console — post-launch, requires production domain to be live and verified

---

## Goals & Acceptance Criteria

A visitor or crawler opening any of the **28 page-locale combinations** (10 content × 2 locales + 4 legal × 2 locales) sees:

1. A locale-correct `<title>`, `<meta description>`, `<meta property="og:*">`, `<meta name="twitter:*">`, plus `<link rel="canonical">` + sibling `<link rel="alternate" hreflang>` entries for `en-US`, `ko-KR`, and `x-default`.
2. A `MedicalBusiness`/`LocalBusiness` JSON-LD block on Home (in addition to the existing `MedicalOrganization` on About and `FAQPage` on FAQ).
3. A Footer with five new legal links (Privacy Policy, HIPAA Notice, Accessibility Statement, Terms of Use, Sitemap).
4. A working 404 at any unknown URL (root and locale-scoped), a working error boundary, and a brief loading state on slow navigations.
5. Four legal pages rendering in EN and KO. The Mode B referral privacy snippet's forward-link to the HIPAA Notice **no longer 404s**.
6. `/robots.txt` reachable, allows crawl, points at `/sitemap.xml`. `/sitemap.xml` reachable, lists every `/en/*` and `/ko/*` URL with `<xhtml:link rel="alternate" hreflang>` siblings.
7. Lighthouse on every page (EN + KO): **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.** First Load JS ≤ 200 KB per route.
8. Korean text renders correctly on Windows and Android (visual check; some default Android fonts have weak Hangul kerning).

**Pass criteria:**
- Zero TypeScript / lint errors (`npx tsc --noEmit`, `npm run lint`).
- `npm run build` reports the 4 new legal routes × 2 locales + system routes; no missing-translation warnings.
- Exactly one `<h1>` per page. Legal pages carry a sidebar anchor table of contents (same structure as Day 3).
- All copy lives in `messages/*.json`; no inline English in `.tsx` for any new page.
- Tailwind tokens only.
- Axe DevTools on each page returns **zero serious or critical** violations.
- Color contrast verified ≥ 4.5:1 body, ≥ 3:1 large text. Closest pair to watch: `text-text-muted` on `bg-neutral-cream`.
- Skip-link, focus order, `aria-current="page"` highlight verified across locales.
- Canonical URL on every page is the **localized** URL, never un-localed root.
- `sitemap.xml` validates with the [Google Sitemap test](https://search.google.com/test/sitemap).
- 404 page returns an actual HTTP 404 (`curl -sI`), not 200.
- Footer legal links resolve in both locales after Day 7 deploy.

---

## Architecture Decisions

Decisions recorded here so the implementer does not re-deliberate.

### A. System routes — root **and** locale-scoped, with deliberate division of labor

- `src/app/not-found.tsx` at the **root**: locale-agnostic. Catches paths the middleware never routes (`/foo` before locale prefix). Minimal bilingual-neutral HTML linking to both `/en` and `/ko` Home.
- `src/app/[locale]/not-found.tsx`: catches `notFound()` calls from within a localized route; full Header/Footer chrome; uses `useTranslations('notFound')`.
- `src/app/[locale]/error.tsx`: **must** be `'use client'` (App Router requirement). Receives `error` + `reset` props; renders a "Reload" button + phone fallback.
- `src/app/[locale]/loading.tsx`: server-rendered skeleton with `role="status"` + `aria-label={t('srLabel')}`.

**Rationale:** two-level not-found is the documented Next.js App Router pattern for a localized site. Error + loading at the locale level only — every navigable URL lives under `[locale]`.

### B. Hreflang strategy — shared helper, not hand-rolled

A new `src/lib/seo.ts` exports `buildAlternates(path)`, `buildOpenGraph(title, description, path, locale)`, and `absoluteUrl(path)`. Every `generateMetadata` calls them with a locale-agnostic path. Builds canonical from `NEXT_PUBLIC_SITE_URL` so Vercel previews don't poison production canonicals.

**Rationale:** 28 metadata blocks × hand-rolling = 28 chances to forget `x-default` or get the locale tag wrong. One helper, one place to fix.

### C. Privacy Policy — full draft by us

Covers: data collected (Contact: name/email/phone/subject/message; Referral Mode A: referrer contact + best-time-to-call only — no PHI; Referral Mode B when enabled: PHI under HIPAA), transmission (TLS, vendor with BAA where Mode B is live), retention (interpolates `{retentionDays}` from `PHI_RETENTION_DAYS` env), explicit cookie-free statement, CCPA/CPRA rights (right to know / delete / correct — no "Do Not Sell" because nothing is sold), how to exercise rights (email + phone), forward-link to HIPAA Notice.

**Rationale:** master plan splits the work — we draft the operational Privacy Policy; the client provides the HIPAA Notice (a regulated 45 CFR §164.520 instrument).

### D. HIPAA Notice — ship the route with an honest interim block

`/[locale]/hipaa-notice` renders a `LongFormPage` with one section: "We are finalizing our Notice of Privacy Practices. Please call us at {phone} for a copy of our current Notice. This page will be updated when the final Notice is published. — Last updated: 2026-05-25." Plus a one-paragraph "what a HIPAA Notice is" overview so the page is informative even in interim state.

**Rationale:** the Day 6 Mode B privacy snippet forward-links to this page; shipping a 404 is worse than shipping honest interim text. Replacing the interim with client text is a single JSON edit — no code change. Tracked in `PLACEHOLDERS.md`.

### E. Home JSON-LD — `LocalBusinessJsonLd`, sharing the existing keys

Create `src/components/home/LocalBusinessJsonLd.tsx` modeled on the existing `OrganizationJsonLd.tsx`. Reads from the **same** `aboutJsonLd.*` namespace so updating the address once propagates everywhere. `@type: ['MedicalBusiness', 'LocalBusiness']`, `@id` = Home URL (distinct from About's `@id`).

**Rationale:** Google's local-pack prefers `LocalBusiness` for click-to-call ranking; Schema.org allows the union so both signals coexist. Sharing the translation namespace prevents two-place address drift.

### F. Favicon strategy — Next.js conventions

`src/app/icon.png` (32×32) and `src/app/apple-icon.png` (180×180) — auto-wired by App Router, no manual `<link>` tags. If client logo has not arrived by Day 7, the existing `favicon.ico` Next scaffold stays.

### G. OG image — server-generated via `next/og`

`src/app/opengraph-image.tsx` (root) + `src/app/[locale]/opengraph-image.tsx` (locale-aware). Uses `ImageResponse` to render a 1200×630 PNG with brand colors + locale-correct title text.

**Rationale:** server-generated stays in sync with localized title automatically; a static PNG would miss bilingual differentiation. Swapping to a client-brand static PNG later is a one-file change.

### H. NotebookLM bug workaround — three-step fallback, document outcomes

Step 1: re-run the `anthropic-skills:notebooklm` skill's `ask_question.py` with one Day 5 query (Notebook 1 frag 25). If it returns chat-pane content (not the Studio summary), the bug is fixed — verify all four queries.

Step 2: if still broken, open Notebook 1 in a browser (URL in `notebooklm.md`), submit the four queries by hand, compare returned text to current `forFamilies.*` and `faq.*` drafts.

Step 3: regardless of path, edit `messages/PLACEHOLDERS.md` "Day 5 — NLM-grounded copy" — either remove the row (current draft matches the notebook source closely enough) or replace it with a note about specific phrasing that changed.

**Rationale:** Day 5 drafts are clinically sound. Day 7 verification buys confidence, not correctness. We document the outcome either way so client review has a clear before/after.

### I. Footer legal-links rail — additive

Add a fourth row beneath the existing `border-t` divider with five small text links (Privacy / HIPAA / Accessibility / Terms / Sitemap). Visual treatment matches the existing `text-xs text-primary-400` copyright row — quiet, not competing with quick-links.

### J. Korean polish — by-key checklist

Walk `PLACEHOLDERS.md` "Korean Copy Polish (Day 7)" list in order. Touch only listed keys. Compare git diff after the pass — should be ≤ 20 keys touched.

### K. Sitemap source-of-truth — single static `src/lib/routes.ts`

A new `src/lib/routes.ts` exports a single `ROUTES` array. Both `app/sitemap.ts` and any future human-readable sitemap consume it.

### L. Robots.txt — `app/robots.ts` file-convention

One-file export returning `{ rules: [{ userAgent: '*', allow: '/' }], sitemap: absoluteUrl('/sitemap.xml') }`. No `/api/` disallow — API routes return 405 to GET and are not indexable.

### M. Print stylesheet — explicit non-decision

`PageBottomCta` already has `data-print-hide`. Day 7 does not add a print stylesheet — print is not in the master plan and would be net-new scope. Logged so the implementer does not silently expand scope.

---

## Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| `src/lib/seo.ts` | **Create** | `buildAlternates(path)`, `buildOpenGraph(...)`, `absoluteUrl(path)` helpers consumed by every `generateMetadata` |
| `src/lib/routes.ts` | **Create** | Single `ROUTES` array — locale-agnostic content + legal routes |
| `src/app/[locale]/layout.tsx` | **Edit** | Replace static `metadata` export with `generateMetadata` so title-template + OG defaults are locale-aware |
| `src/app/sitemap.ts` | **Create** | `/sitemap.xml` covering all `/en/*` and `/ko/*` URLs with hreflang alternates |
| `src/app/robots.ts` | **Create** | `/robots.txt` allowing crawl, pointing at sitemap |
| `src/app/opengraph-image.tsx` | **Create** | Root OG image (locale-default fallback) |
| `src/app/[locale]/opengraph-image.tsx` | **Create** | Locale-aware OG image |
| `src/app/not-found.tsx` | **Create** | Root 404 — bilingual-neutral |
| `src/app/[locale]/not-found.tsx` | **Create** | Locale-aware 404 with chrome |
| `src/app/[locale]/error.tsx` | **Create** | `'use client'` error boundary with Reload + phone fallback |
| `src/app/[locale]/loading.tsx` | **Create** | Skeleton placeholder for slow navigations |
| `src/components/home/LocalBusinessJsonLd.tsx` | **Create** | `MedicalBusiness + LocalBusiness` JSON-LD on Home, sharing `aboutJsonLd.*` |
| `src/app/[locale]/page.tsx` | **Edit** | Mount `<LocalBusinessJsonLd />`; add `buildAlternates('/')` + `buildOpenGraph(...)` |
| `src/app/[locale]/{about,services,understanding-hospice,hospice-laws,insurance,for-families,faq,contact,referral}/page.tsx` | **Edit** | Add `buildAlternates(<path>)` + `buildOpenGraph(...)` to each `generateMetadata` (9 files, same pattern) |
| `src/app/[locale]/privacy/page.tsx` | **Create** | Privacy Policy — `LongFormPage`, drafted by us |
| `src/app/[locale]/hipaa-notice/page.tsx` | **Create** | HIPAA Notice — interim placeholder block |
| `src/app/[locale]/accessibility/page.tsx` | **Create** | Accessibility Statement (WCAG 2.1 AA, contact for accommodations) |
| `src/app/[locale]/terms/page.tsx` | **Create** | Terms of Use — drafted by us |
| `src/components/layout/Footer.tsx` | **Edit** | Add legal-links rail below existing border-t |
| `src/components/layout/PageSidebar.tsx` | **Edit** | Widen `RelatedLink.labelKey` to include `privacy`, `hipaaNotice`, `accessibility`, `terms` (additive only) |
| `messages/en.json` | **Edit** | Add `privacy`, `hipaaNotice`, `accessibility`, `terms`, `meta`, `notFound`, `error`, `loading` namespaces; extend `footer.legalLinksHeading` + `footer.legalLinks.*`; extend `common.relatedPages.links` |
| `messages/ko.json` | **Edit** | Mirror all new keys; native-reviewer polish pass on Day 2–6 keys flagged in `PLACEHOLDERS.md` |
| `messages/PLACEHOLDERS.md` | **Edit** | Close out Day 5 NLM rows after verification; close out Day 6 forward-link rows; add Day 7 rows (HIPAA Notice client text pending, OG image brand override, analytics decision, prod `SITE_URL`) |
| `.env.example` | **Edit** | Add `NEXT_PUBLIC_SITE_URL` with prod-value comment |
| `src/app/icon.png`, `src/app/apple-icon.png`, `public/images/logo.png` | **Create if delivered** | Logo + favicon wiring |
| `src/components/about/OrganizationJsonLd.tsx` | **Edit if logo delivered** | Add `"logo": "/images/logo.png"` to payload |

**Folder conventions:**
- `src/app/[locale]/{privacy,hipaa-notice,accessibility,terms}/` — new for Day 7
- `src/components/home/LocalBusinessJsonLd.tsx` — only new component file today
- `src/lib/seo.ts`, `src/lib/routes.ts` — new
- **Zero new dependencies, zero new top-level folders**

---

## Translation Keys (additions only — full strings drafted at implementation)

### `meta.*` (new — locale-default OG defaults)
```
meta
├── siteName, ogDescription, ogImageAlt, twitterHandle
```

### `privacy.*` (new)
```
privacy
├── pageTitle, metaDescription, introParagraph, lastReviewed
└── sections
    ├── overview.{title, body}
    ├── dataCollected.{title, contactForm.{...}, referralForm.{modeA, modeB}, serverLogs, cookies}
    ├── howWeUse.{title, body, bullets[]}
    ├── howWeShare.{title, body, vendors.{baa, hosting}, neverSold}
    ├── retention.{title, body, contactRetention, referralRetentionModeA, referralRetentionModeB}
    ├── security.{title, body}
    ├── rights.{title, ccpa.{...}, hipaa.{forwardLinkToNotice}}
    ├── children.{title, body}
    ├── changes.{title, body}
    └── contact.{title, body, email, phone}
```

### `hipaaNotice.*` (new — interim)
```
hipaaNotice
├── pageTitle, metaDescription, introParagraph, lastReviewed
└── sections
    ├── interim.{title, body, callToObtain}
    └── overview.{title, body}    // one-paragraph "what a HIPAA Notice is"
```
When client text arrives, replace `sections.interim.*` with canonical section keys (`uses`, `disclosures`, `patientRights`, `dutiesOfTheCoveredEntity`, `changesToNotice`, `complaints`, `contact`). The `LongFormPage` shell does not change.

### `accessibility.*` (new)
```
accessibility
├── pageTitle, metaDescription, introParagraph, lastReviewed
└── sections
    ├── commitment.{title, body}
    ├── conformance.{title, statement, conformanceLevel}  // "Partially conformant"
    ├── features.{title, items[]}   // skip-link, keyboard nav, bilingual, ≥4.5:1, ≥44px
    ├── knownIssues.{title, body, items[]}
    ├── howToReport.{title, body, email, phone}
    └── lastReviewed.{title, body}
```

### `terms.*` (new)
```
terms
├── pageTitle, metaDescription, introParagraph, lastReviewed
└── sections
    ├── acceptance, useOfSite, notMedicalAdvice, notServiceContract,
    ├── intellectualProperty, externalLinks, disclaimers,
    ├── limitationOfLiability, governingLaw, changes,
    └── contact.{email, phone}
```

### `footer.*` (extend)
```
footer
└── legalLinksHeading              "Legal"   ↔   "법적 고지"
    legalLinks
    ├── privacy        "Privacy Policy"          ↔  "개인정보 처리방침"
    ├── hipaaNotice    "HIPAA Notice"            ↔  "HIPAA 개인정보 보호 고지"
    ├── accessibility  "Accessibility Statement" ↔  "접근성 정책"
    ├── terms          "Terms of Use"            ↔  "이용약관"
    └── sitemap        "Sitemap"                 ↔  "사이트맵"
```

### `common.relatedPages.links.*` (extend)
Add 4 keys: `privacy`, `hipaaNotice`, `accessibility`, `terms`.

### `notFound.*`, `error.*`, `loading.*` (new small namespaces)
```
notFound  ├── pageTitle, metaDescription, heading, body, ctaHome, ctaContact
error     ├── heading, body, ctaReload, ctaHome, ctaPhone
loading   └── srLabel  "Loading…" ↔ "로딩 중…"
```
The error body surfaces phone as a fallback ("If this persists, please call us at {phone}") — same pattern as Day 6 form errors.

---

## Implementation Conventions (carried forward from Days 1–6)

1. `getTranslations` only inside `async generateMetadata`. All other server components use sync `useTranslations`.
2. `params` in Next.js 14.2.x — synchronous, not a Promise.
3. Korean term policy — Korean rendering followed by parenthesized English on first use for branded terms (HIPAA, CCPA, BAA, PHI, NPI). Legal pages will see heavy use.
4. Tailwind tokens only — no raw hex.
5. Server components by default — only `error.tsx` carries `'use client'` (App Router requirement).
6. Single source of truth — `routes.ts` for sitemap, `aboutJsonLd.*` for Home + About JSON-LD, `common.phone.*` for phone everywhere.
7. No PHI anywhere new — Day 7 does not touch the form pipeline.
8. `alternates.canonical` always the localized URL, never un-localed root.

---

## Step-by-Step Implementation Order

1. **NotebookLM retry** — run `anthropic-skills:notebooklm` `ask_question.py` against Notebook 1 frag 25 ("guidance for caregivers on medication management"). If chat-pane content returns, the bug is fixed; proceed to step 2. If still broken, browser fallback.
2. **Browser fallback NotebookLM verification** — open Notebook 1, submit four queries (frag 24 myths, frag 25 caregiver basics, frag 29 burnout, frag 32 dying process). Compare returned text to current `forFamilies.*` + `faq.*` drafts. Record in a scratch note.
3. **Update `messages/PLACEHOLDERS.md`** — close out Day 5 "NLM-grounded copy" rows whose drafts match closely enough; rewrite any keys where notebook said something substantively different (update EN + KO together).
4. **Native Korean polish pass** — walk `PLACEHOLDERS.md` "Korean Copy Polish (Day 7)" in order: `home.levels.respite.title`, team role titles, testimonial KO, Day 3 regulatory terms (`룸 앤 보드`, `다학제`, `너싱홈/SNF`, `종말기`), Day 6 form copy. Touch KO only.
5. **Create `src/lib/seo.ts`** — `buildAlternates`, `buildOpenGraph`, `absoluteUrl`. Read `process.env.NEXT_PUBLIC_SITE_URL` with localhost fallback.
6. **Create `src/lib/routes.ts`** — `ROUTES` array listing 14 paths.
7. **Edit `.env.example`** — add `NEXT_PUBLIC_SITE_URL=http://localhost:3000` with a "prod = https://www.eminenthospice.com" comment.
8. **Edit `messages/en.json`** — add `privacy`, `hipaaNotice`, `accessibility`, `terms`, `meta`, `notFound`, `error`, `loading` namespaces; extend `footer.legalLinksHeading` + `footer.legalLinks.*` (5 keys); extend `common.relatedPages.links` (4 keys). Draft EN copy per templates above.
9. **Mirror in `messages/ko.json`** — KO drafts following established `한국어 (English)` convention for branded terms.
10. **Edit `src/components/layout/PageSidebar.tsx`** — widen `RelatedLink.labelKey` union to include the four new keys (additive only).
11. **Create `src/app/[locale]/privacy/page.tsx`** — `LongFormPage` (with `showDisclaimer={false}`) + `PageSidebar` with section anchors + `PageBottomCta`. `generateMetadata` uses `buildAlternates('/privacy')` and `buildOpenGraph(t('pageTitle'), t('metaDescription'), '/privacy', locale)`.
12. **Create `src/app/[locale]/hipaa-notice/page.tsx`** — same shell, interim placeholder block. **No** `PageBottomCta` (deliberately quiet page).
13. **Create `src/app/[locale]/accessibility/page.tsx`** — `LongFormPage` + `PageSidebar` + `PageBottomCta`. "How to report an issue" surfaces phone + email path.
14. **Create `src/app/[locale]/terms/page.tsx`** — same shell, no `PageBottomCta` (Terms is also quiet).
15. **Edit `src/components/layout/Footer.tsx`** — add fourth row beneath the existing `border-t` row with 5 legal links. `<nav aria-label={t('legalLinksHeading')}>` so screen readers announce a landmark.
16. **Create `src/components/home/LocalBusinessJsonLd.tsx`** — modeled on `OrganizationJsonLd.tsx`. `@type: ['MedicalBusiness', 'LocalBusiness']`, `@id` = Home URL, reads from `aboutJsonLd.*`. Same `dangerouslySetInnerHTML` pattern.
17. **Edit `src/app/[locale]/page.tsx`** — mount `<LocalBusinessJsonLd />` as the first child; update `generateMetadata` with `buildAlternates('/')` + `buildOpenGraph(...)`.
18. **Edit each of the 9 other content pages' `page.tsx`** — same `generateMetadata` update. The 9: `/about`, `/services`, `/understanding-hospice`, `/hospice-laws`, `/insurance`, `/for-families`, `/faq`, `/contact`, `/referral`.
19. **Edit `src/app/[locale]/layout.tsx`** — replace static `metadata` export with `generateMetadata({ params })` pulling title-template + OG defaults from `meta.*`. Page-level `generateMetadata` overrides as needed.
20. **Create `src/app/sitemap.ts`** — imports `ROUTES` + `routing.locales`; emits one `url` entry per locale per route with `alternates.languages` siblings.
21. **Create `src/app/robots.ts`** — allows all, points sitemap at `absoluteUrl('/sitemap.xml')`.
22. **Create `src/app/opengraph-image.tsx`** (root) — `next/og` `ImageResponse`, 1200×630, brand background, English wordmark.
23. **Create `src/app/[locale]/opengraph-image.tsx`** — locale-aware variant reading `meta.siteName` + `meta.ogDescription`. Use `wordBreak: 'keep-all'` for KO.
24. **Create `src/app/not-found.tsx`** (root) — minimal HTML, no `useTranslations`. Bilingual text "Page not found · 페이지를 찾을 수 없습니다" + two buttons.
25. **Create `src/app/[locale]/not-found.tsx`** — `useTranslations('notFound')`. Full chrome via inherited locale layout. CTA: Home + Contact.
26. **Create `src/app/[locale]/error.tsx`** — `'use client'`. Receives `error` + `reset`. Renders heading + body + "Reload" button + phone fallback. Logs nothing PHI-related.
27. **Create `src/app/[locale]/loading.tsx`** — `SectionContainer` with three `animate-pulse` skeleton rectangles. `role="status"` + `aria-label={t('srLabel')}`.
28. **If client logo delivered**: add `src/app/icon.png` (32×32), `src/app/apple-icon.png` (180×180), `public/images/logo.png`. Edit `OrganizationJsonLd.tsx` to add `"logo": "/images/logo.png"`. Remove "Logo for JSON-LD" row from `PLACEHOLDERS.md`.
29. **Edit `messages/PLACEHOLDERS.md`** — close completed rows; add Day 7 rows (HIPAA Notice client text pending, OG image brand override, analytics decision, prod `SITE_URL`).
30. **Type + lint pass** — `npx tsc --noEmit`, `npm run lint`.
31. **Production build** — `npm run build`. Confirm 8 new legal routes + sitemap + robots + system routes + OG image routes. No missing-translation warnings. First Load JS per route under 200 KB.
32. **Lighthouse pass** — every page in both locales (28 total). Capture scores. Any page < 95 a11y or < 90 perf gets a same-day fix.
33. **Axe DevTools pass** — every page. Resolve every serious / critical finding. Document "needs review" with a manual decision.
34. **Korean rendering visual QA** — `/ko/` on Chrome mobile-emulation (Pixel 5) + Windows Chrome at 100/125/150%. If Hangul renders poorly with the default Inter+Playfair cascade, add `noto-sans-kr` to layout font config (Inter+Playfair are Latin-only — real risk).
35. **Manual final QA checklist** — walk `7-day-plan.md` lines 169–177 list exhaustively. Tick each off in a deploy doc.

---

## Verification

```powershell
# Dev server
npm run dev

# SEO infrastructure
curl -sI http://localhost:3000/sitemap.xml | findstr "200 application/xml"
curl -s  http://localhost:3000/sitemap.xml | findstr "hreflang"
curl -sI http://localhost:3000/robots.txt  | findstr "200"
curl -s  http://localhost:3000/robots.txt  | findstr "Sitemap:"

# JSON-LD on Home — both locales
curl -s http://localhost:3000/en | findstr "application/ld+json"
curl -s http://localhost:3000/ko | findstr "application/ld+json"

# Hreflang spot-check
curl -s http://localhost:3000/en/about    | findstr "hreflang"
curl -s http://localhost:3000/ko/insurance| findstr "hreflang"
curl -s http://localhost:3000/en/privacy  | findstr "hreflang"

# OG meta
curl -s http://localhost:3000/en/about | findstr "og:title og:image og:description"

# Legal pages resolve in both locales
@('/privacy','/hipaa-notice','/accessibility','/terms') | ForEach-Object {
  curl -sI "http://localhost:3000/en$_" | findstr "200"
  curl -sI "http://localhost:3000/ko$_" | findstr "200"
}

# Mode B forward-link no longer 404s
curl -sI http://localhost:3000/en/hipaa-notice | findstr "200"
curl -sI http://localhost:3000/ko/hipaa-notice | findstr "200"

# 404 returns actual 404
curl -sI http://localhost:3000/en/this-does-not-exist | findstr "404"
curl -sI http://localhost:3000/this-does-not-exist    | findstr "404"

# Footer legal links present in both locales
curl -s http://localhost:3000/en | findstr "Privacy Policy"
curl -s http://localhost:3000/ko | findstr "개인정보"

# Build pipeline
npx tsc --noEmit
npm run lint
npm run build       # 4 legal × 2 locales + sitemap + robots + system routes; FLJS ≤ 200 KB / route

# Lighthouse — every page in both locales (28 audits)
# Target: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95

# Axe DevTools — every page; zero serious/critical findings

# JSON-LD validation
# Paste LocalBusinessJsonLd payload into https://validator.schema.org/ → zero errors

# KO rendering — Chrome DevTools → Pixel 5 → /ko/about, /ko/insurance, /ko/for-families
# Confirm Hangul renders cleanly (no ?-box fallbacks)
```

**Content correctness spot-check:**
- Privacy Policy lists Resend as the email vendor under "How we share" and notes "BAA in place when Mode B is enabled" — matches Day 6.
- HIPAA Notice page does not pretend to have client text — interim block reads honestly.
- Accessibility Statement claims "Partially conformant" (the honest framing — full conformance is hard to claim without a third-party audit).
- Terms of Use says explicitly: site is informational, submitting a form does not establish a hospice relationship — matches Day 6 snippets.
- Footer legal-links row exists in both locales; existing quick-links and contact band unchanged.
- Mode B referral privacy snippet forward-link to HIPAA Notice **no longer 404s**.
- `LocalBusinessJsonLd` + `OrganizationJsonLd` both read from `aboutJsonLd.*` — address is in one place.
- Korean polish on `home.levels.respite.title` resolves the regulatory-meaning question flagged in `PLACEHOLDERS.md`.
- Day 5 NLM-flagged keys are either verified-as-is in `PLACEHOLDERS.md` or rewritten with notebook-aligned text.

---

## HIPAA, Privacy & Retention (Day 7 specific)

| Concern | Day 7 handling |
|---|---|
| **Form pipeline** | Unchanged from Day 6. Day 7 ships no new data collection. |
| **Privacy Policy** | Full page drafted by us. Covers Contact + Referral Mode A + Mode B (when enabled). Explicit cookie-free statement, CCPA rights, contact for privacy questions. Footer link now resolves. |
| **HIPAA Notice of Privacy Practices** | Route ships at `/[locale]/hipaa-notice` with an honest interim block + a phone path to obtain the current Notice. Replacing the interim with client text is one JSON edit. |
| **Accessibility Statement** | WCAG 2.1 AA "Partially conformant" framing; known issues listed; accommodation-request path provided. |
| **Terms of Use** | Drafted by us. Site is informational; submitting a form does not establish a hospice relationship. Governing law: California. |
| **CCPA** | Site remains cookie-free. No "Do Not Sell or Share" link required. Privacy Policy still covers CCPA rights. If analytics is later added, banner + "Do Not Sell" become required — tracked. |
| **JSON-LD** | `LocalBusinessJsonLd` shares `aboutJsonLd.*` namespace; no new client-facing data exposed beyond About. |
| **OG image** | Generated server-side by `next/og`; no third-party tracking. |
| **Sitemap / robots** | No PHI exposure; routes only. |
| **Audit trail** | Day 6 audit logging untouched. Production deploy still needs HIPAA-eligible log sink — same `PLACEHOLDERS.md` row. |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Hreflang wrong on some pages because helper called with wrong path** | Centralize via `src/lib/seo.ts`; one place to fix. Spot-check 5 random pages in verification. |
| **`LocalBusiness` on Home and `MedicalOrganization` on About collide in Google's understanding** | Different `@id` (Home URL vs About URL); `@type` arrays disambiguate. Validate at validator.schema.org. |
| **`next/og` runtime cost on Vercel** | Runs Edge by default — fast + cacheable. Crawlers cache the image too. Per-page cost amortized. |
| **Privacy Policy contains factual errors about our own vendor/retention** | Single source of truth: `{retentionDays}` interpolates from `PHI_RETENTION_DAYS`; vendor name ties to the same value `src/lib/mail.ts` uses. |
| **HIPAA Notice interim block looks unprofessional** | Framing is "Notice is being finalized" — accurate and tonally appropriate for a clinical organization. Phone path provided. |
| **Accessibility Statement overclaims conformance** | "Partially conformant" not "Conformant". Specific known issues listed. Accommodation-request path provided. |
| **Terms limitation-of-liability is California-specific** | Governing-law clause names California; "to the extent permitted by applicable law" hedge. |
| **Sitemap lastmod drifts from `lastReviewed` keys** | `src/lib/routes.ts` is single source. New pages add one row to the array. |
| **Korean polish introduces regressions on previously-correct keys** | Checklist-driven from `PLACEHOLDERS.md`. Compare git diff after; ≤ 20 keys touched. |
| **404 page returns HTTP 200 (Next.js gotcha)** | Locale-level `not-found.tsx` is reached via `notFound()` which sets 404 status. Root-level triggers for unrouted paths. Verified in `curl -sI`. |
| **`error.tsx` Client Component bundles its own `useTranslations`** | Acceptable — error pages off the hot path. Bundle audit at step 31 will catch unexpected growth. |
| **Hangul rendering on Windows defaults to a font without proper coverage** | Inter + Playfair is Latin-only. Step 34 visually verifies; if poor, add `noto-sans-kr` to layout font config. |
| **OG image's locale-aware KO text overflows 1200×630** | `next/og` supports text wrapping. Template uses max-width + `wordBreak: 'keep-all'` for Korean. Test both locales. |
| **`NEXT_PUBLIC_SITE_URL` is `localhost` in production by accident** | `.env.example` documents prod value with comment. Vercel build env-var vault must be set. Pre-deploy checklist row. |
| **Lighthouse a11y < 95 on a page** | Likely culprits: missing `alt`, color contrast on `text-text-muted`/`bg-neutral-cream`, missing focus-visible ring. Same-day fixes. |
| **First Load JS > 200 KB on Referral Mode B** | Mode B has the heaviest form. RHF + Zod are tree-shaken. If overshooting: lazy-load Turnstile via `dynamic(...)`. |
| **HIPAA Notice client text arrives Day 7 evening** | Ship interim. Replacing it is a JSON edit + redeploy — 10-minute follow-up that does not delay launch. |
| **Logo arrives Day 7** | Wire it (step 28) if before Lighthouse runs; otherwise log as 5-minute post-launch follow-up. |
| **Footer legal-links row pushes copyright below the fold on mobile** | Visually inspect at 375 px. Use `flex-wrap`; legal links sit on the same row with smaller font or wrap. |

---

## Out of Scope (ships post-launch)

- Real client-provided HIPAA Notice text — route exists; flip-in is one JSON edit.
- Real client logo — `aboutJsonLd.logo` stays omitted until delivered.
- Analytics wiring — gated on client decision:
  - Plausible / Vercel Analytics (cookieless) — 30-min add, no CCPA banner needed.
  - GA4 — 1-hour add, requires CCPA banner + "Do Not Sell" link.
  - None — ships as-is.
- Upstash Redis swap for `src/lib/rate-limit.ts` — single-file change, only needed at scale.
- Nonce-based CSP — removes the two `'unsafe-inline'` directives; breaks SSG caching, deferred.
- Real photography (Hero gradient + text-only About staff cards stay).
- Real testimonial quote with signed release.
- Day 3 phone-key consolidation across `home.finalCta.phoneNumber*` / `footer.phone` / `common.phone.*`.
- Day 6 `aboutJsonLd.address.streetAddress` + `postalCode` fill — waiting on client.
- BAA flip (`HAS_BAA=true`) — operational, not code.
- Server-side audit-log sink (HIPAA §164.312(b)) — Day 6 logs to stdout; production must route stdout to a HIPAA-eligible sink.
- Sitemap submission to Google Search Console — post-launch.

---

## Critical Files for Implementation

- `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\src\lib\seo.ts` *(new — central hreflang/canonical/OG helpers consumed by all 14 `generateMetadata` blocks)*
- `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\src\app\sitemap.ts` *(new — emits sitemap.xml with hreflang alternates)*
- `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\src\app\[locale]\privacy\page.tsx` *(new — drafted Privacy Policy; the largest legal page and the model for the other three)*
- `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\src\components\layout\Footer.tsx` *(edit — wires the 5 legal links so nothing 404s after deploy)*
- `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\src\components\home\LocalBusinessJsonLd.tsx` *(new — Home JSON-LD; shares `aboutJsonLd.*` namespace with About)*
- `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\messages\en.json` *(edit — four new top-level namespaces + system-route + meta keys; the KO mirror in `ko.json` follows the same structure)*
- `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\messages\PLACEHOLDERS.md` *(edit — close out NLM rows, close out forward-link rows, add Day 7 rows)*
