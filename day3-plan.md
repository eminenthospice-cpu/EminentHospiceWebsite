# Day 3 Implementation Plan — Informational Pages (3 pages)

## Context

Days 1 (scaffold) and 2 (Home) are complete. Day 3 ships the **educational core** of the site: three long-form information pages that establish Eminent Hospice Care as a trustworthy, authoritative source. These three pages are the primary destinations for organic search traffic from "what is hospice," "Medicare hospice benefit," and "patient rights hospice" queries.

**Pages built today:**
1. **Understanding Hospice Care** — `/[locale]/understanding-hospice` — what hospice is, myths vs facts, eligibility, what to expect after enrollment
2. **Hospice Laws & Patient Rights** — `/[locale]/hospice-laws` — Medicare Conditions of Participation, patient rights, advance directives, how to file a complaint
3. **Insurance & Medicare Information** — `/[locale]/insurance` — Medicare Part A coverage, Medi-Cal, FY2026 rates, what families pay, election process

**Source alignment:**
- `7-day-plan.md` Day 3: "educational core — builds trust and authority. Consistent layout: main content + sidebar (quick links, contact CTA)." All three pages must carry the educational-content disclaimer.
- `instructions.md`: Priority #1 = "accurate and trustworthy information about hospice care." These three pages are where that promise is kept.
- `notebooklm.md` notebook 2 (Hospice Regulations, Medicare & Compliance — `37f4da68-…`): primary source for regulatory content. Already queried — covers the federal Conditions of Participation (42 CFR Part 418, Subparts C–D), two-physician certification, ≤6-month prognosis, four levels of care (RHC/CHC/GIP/IRC), FY2026 rates (2.6% increase, Aggregate Cap $35,361.44), HQRP, HOPE tool (effective Oct 1, 2025), LA County fraud scrutiny. *Note: the often-cited "23 CoPs" headline number is widely used in industry literature but is not directly enumerated in a single CMS reference page — page copy avoids citing a specific count unless an implementer verifies it against the eCFR table of contents before publish.* The HQRP/HOPE/Inpatient Cap items are provider-side context only and do **not** appear in family-facing page copy.
- `notebooklm.md` notebook 1 (`d92cd23b-…`): family-facing copy — plain-language hospice definition (frag 1, 4), myth-busting (frag 24), eligibility lists (frag 42), advance directives (frag 46), insurance coverage in everyday language (frag 55).
- `day2-plan.md`: established the reusable primitives (`SectionContainer`, `Icon`, content-in-JSON pattern). Day 3 builds **one new shared layout primitive** (`LongFormPage`) that Days 4 and 5 will also use.

**Reuse from Days 1–2 (do not re-create):**
- `@/i18n/navigation` (`Link`, `usePathname`) — locale-aware routing
- `useTranslations` / `getTranslations` from `next-intl`
- `@/components/ui/SectionContainer` (Day 2) — keeps padding/max-width consistent
- `@/components/ui/Icon` (Day 2) — extend with 2–3 new icons for Day 3 (`scale`, `document`, `info`) but reuse the same registry pattern
- Tailwind tokens: `primary-*`, `neutral-warm`, `neutral-cream`, `font-heading`, `font-body`, `rounded-card`, `shadow-card`, `max-w-content`, `max-w-prose`, `px-section-x`, `py-section-y`
- `<Header>` / `<Footer>` already wrap every page via `[locale]/layout.tsx`

**Out of scope for Day 3:**
- Forms, FAQ accordions, About Us, Services page (Days 4–6)
- Real photography (placeholder gradients only; client assets pending)
- Final Korean review — KO is *drafted* today, native-reviewer polish on Day 7
- The four legal/utility pages (Privacy Policy, HIPAA Notice, etc.) — Day 7

---

## Goals & Acceptance Criteria

A visitor opening any of the three Day 3 pages sees:
1. A clear, locale-correct `<h1>` and meta description (Lighthouse SEO ≥ 95).
2. A consistent two-column layout on desktop (main content + right sidebar with quick links + contact CTA), collapsing to single-column with sidebar-as-footer-block on mobile.
3. Long-form content broken into scannable sections with `<h2>` anchors and a "Last reviewed: YYYY-MM" stamp at the top.
4. The **educational-content disclaimer** prominently placed near the top of every page.
5. Cross-page navigation: each page links to the other two via the sidebar.
6. A bottom CTA band ("Have questions? Speak with our care team") with phone + Contact + Referral buttons — visually distinct from the Day 2 Final CTA so the user knows they've reached a different content path.
7. Full EN + KO translations; both routes (`/en/...` and `/ko/...`) render correctly.

**Pass criteria:**
- Zero TypeScript / lint errors.
- Exactly one `<h1>` per page (the page title); section headings start at `<h2>`.
- All copy lives in `messages/*.json`; no inline English in `.tsx`.
- Tailwind tokens only; no raw hex.
- Mobile-first at 375 / 768 / 1280 widths.
- All interactive elements ≥44×44px tappable, with visible focus ring.
- Anchor links from sidebar to in-page `<h2>` sections scroll smoothly and update the URL hash without a page reload.
- Lighthouse a11y ≥ 95 per page.
- Insurance page cites CMS source + visible "Last reviewed: 2026-05" stamp.

---

## New Shared Layout Primitive: `LongFormPage`

A reusable shell for any text-heavy informational page (used today by all three Day 3 pages, again on Day 4 About + Services, and on Day 5 For-Families).

**Props:**
```tsx
type LongFormPageProps = {
  title: string;                  // h1 — the page title
  lastReviewed?: string;          // ISO date string, e.g. "2026-05-01"
  introParagraph?: string;        // optional lead paragraph below h1
  disclaimer?: React.ReactNode;   // educational/insurance disclaimer slot
  sidebar: React.ReactNode;       // sidebar content (quick links + CTA)
  children: React.ReactNode;      // main content
};
```

**Layout:**
- Desktop (`lg:`): `grid grid-cols-[1fr_18rem] gap-12` — content + 18rem sidebar
- Mobile: stacked, sidebar appears below main content with a subtle visual separator
- Page padding via `<SectionContainer bg="cream">` (cream background reads as documentation/educational)
- Main column constrained to `max-w-prose` (~65ch) for readability
- Title in `font-heading text-4xl md:text-5xl`
- "Last reviewed" stamp: small caps, `text-text-muted`, positioned just below title
- Disclaimer slot: visually distinct callout box (`bg-warning/10 border-l-4 border-warning`) — communicates "important notice" without alarm
- Sidebar: `sticky top-24` (6rem) on desktop so it stays visible while scrolling; not sticky on mobile. **Before implementing, measure the actual `<Header>` rendered height in DevTools — if it differs from 6rem, update both `top-` on the sidebar AND `scroll-margin-top` in `globals.css` to match so anchor targets and the sidebar share the same offset.**
- Root element gets `class="long-form"` so the scoped `scroll-margin-top` rule in `globals.css` applies to its `<h2>` headings.

---

## Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| `messages/en.json` | **Edit** — add 3 namespaces (`understandingHospice`, `hospiceLaws`, `insurance`) + shared `common` namespace | All Day 3 copy |
| `messages/ko.json` | **Edit** — mirror in Korean | Bilingual parity (draft today, polish Day 7) |
| `messages/PLACEHOLDERS.md` | **Edit** — append any keys holding placeholder values (e.g. Eminent complaint contact phone) | Track for client review |
| `src/app/globals.css` | **Edit** — add `scroll-margin-top` scoped to long-form content (e.g. `.long-form h2 { scroll-margin-top: 6rem }`), **not** applied globally to `h2` so Home/other pages aren't affected | Sidebar anchor links |
| `src/components/layout/LongFormPage.tsx` | **Create** | Shared two-column shell |
| `src/components/layout/PageSidebar.tsx` | **Create** | Reusable sidebar (quick links + contact card) |
| `src/components/ui/Disclaimer.tsx` | **Create** | Callout box used across Day 3 pages |
| `src/components/ui/LastReviewed.tsx` | **Create** | Date stamp component |
| `src/components/ui/Icon.tsx` | **Edit** | Add `scale` (justice/law), `document`, `info` icons |
| `src/components/info/MythsList.tsx` | **Create** | Used on Understanding Hospice page |
| `src/components/info/EligibilityList.tsx` | **Create** | Used on Understanding Hospice page |
| `src/components/info/PatientRightsList.tsx` | **Create** | Used on Hospice Laws page |
| `src/components/info/AdvanceDirectivesGrid.tsx` | **Create** | 3-card grid (Living Will / DPOA / POLST) used on Hospice Laws page |
| `src/components/info/CoverageTable.tsx` | **Create** | Medicare vs Medi-Cal vs Private comparison — used on Insurance page. **Must use semantic `<table>` + `<thead>` + `<th scope="col">` + `<tbody>` + `<th scope="row">` for a11y; wrap in `<div class="overflow-x-auto">` for mobile.** |
| `src/components/info/PageBottomCta.tsx` | **Create** | "Have questions?" CTA band — reused by all 3 Day 3 pages |
| `src/app/[locale]/understanding-hospice/page.tsx` | **Create** | Page route |
| `src/app/[locale]/hospice-laws/page.tsx` | **Create** | Page route |
| `src/app/[locale]/insurance/page.tsx` | **Create** | Page route |

**Folder convention:**
- `src/components/layout/` — site-wide shells (Header, Footer, Layout, LongFormPage, PageSidebar)
- `src/components/ui/` — small reusable primitives (Icon, SectionContainer, Disclaimer, LastReviewed)
- `src/components/info/` — **new for Day 3** — content-specific blocks used only by informational pages
- `src/components/home/` — Day 2 home-page sections

---

## Page 1 — Understanding Hospice Care

**Route:** `/[locale]/understanding-hospice`
**Source:** notebook 1 frag 1, 4, 24, 42 + notebook 2 frag 4, 7 (eligibility)

### Section outline (in-page `<h2>` order)

1. **What is Hospice?** — plain-language definition (notebook 1 frag 1, 4). Two short paragraphs.
2. **Who Qualifies?** — eligibility explained for families: certified terminal illness with ≤6-month prognosis if illness runs its normal course; certification requires **two physicians** (notebook 2 frag 4); patient elects the hospice benefit. List of common qualifying conditions (cancer, advanced heart disease, COPD, dementia, ALS, kidney failure — notebook 1 frag 42). Clarify that prognosis is an estimate — patients who live longer can stay on hospice with re-certification.
3. **Myths vs. Facts** — top 5 misconceptions corrected (`MythsList` component, notebook 1 frag 24):
   - *Myth:* Hospice means giving up. → *Fact:* Hospice is choosing comfort and dignity, not death.
   - *Myth:* Hospice hastens death. → *Fact:* Studies show hospice patients often live as long as or longer than non-hospice patients with the same diagnoses.
   - *Myth:* You must give up all your medications. → *Fact:* Comfort medications continue; only treatments aimed at curing the terminal illness stop.
   - *Myth:* Hospice is only for cancer patients. → *Fact:* Any terminal diagnosis with ≤6-month prognosis qualifies.
   - *Myth:* Hospice is only for the last few days. → *Fact:* Hospice is most beneficial when started early (weeks or months, not days).
4. **What to Expect After You Enroll** — first 48 hours, the IDG visit schedule (RN visits 1–3× per week typical; aides, social worker, chaplain on schedule), 24/7 on-call nurse line, medications and equipment delivered to home, how care plans are reviewed.
5. **Where Hospice Happens** — home, assisted living, skilled nursing facility, dedicated inpatient hospice; the patient chooses.
6. **Stopping or Pausing Hospice** — patients can revoke hospice at any time and resume curative treatment; they can re-elect hospice later. Clarifies "no trap" concern.

### Components used
- `LongFormPage` shell, `Disclaimer`, `LastReviewed`, `MythsList`, `EligibilityList`, `PageBottomCta`

### Translation keys
```
understandingHospice
├── pageTitle, metaDescription
├── lastReviewed                     ← ISO date for stamp
├── sections.whatIsHospice.{title, p1, p2}
├── sections.whoQualifies.{title, intro, conditions.{cancer,heart,copd,dementia,als,kidney}.{name,desc}, prognosisNote}
├── sections.myths.{title, items.{1..5}.{myth, fact}}
├── sections.whatToExpect.{title, p1, p2, p3}
├── sections.whereCareHappens.{title, options.{home,assistedLiving,snf,inpatient}.{name,desc}}
└── sections.stoppingHospice.{title, p1}
```

---

## Page 2 — Hospice Laws & Patient Rights

**Route:** `/[locale]/hospice-laws`
**Source:** notebook 2 frag 1 (CoPs), 4, 7 + notebook 1 frag 46 (advance directives)

### Section outline

1. **Federal Standards: Conditions of Participation** — 1-paragraph plain-language overview of the **Medicare Conditions of Participation** (42 CFR Part 418, Subparts C–D; notebook 2 frag 1). Explain in family terms: "Every hospice that accepts Medicare must meet federal standards covering patient rights, assessment, the interdisciplinary care team, quality, and infection control." Link out to the official CMS regulation (`https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-418`) so the curious can verify. *If a specific CoP count is added to copy later, confirm against the eCFR Part 418 Subparts C–D table of contents first; "23" is the industry shorthand but not a single-source CMS figure.*
2. **Your Rights as a Hospice Patient** — `PatientRightsList` component, plain-language list (paraphrased from 42 CFR §418.52 — patient rights):
   - To receive effective pain and symptom management
   - To be treated with dignity and respect
   - To participate in developing your care plan
   - To choose your attending physician
   - To privacy and confidentiality of your medical information (HIPAA)
   - To refuse care or treatment
   - To voice grievances without fear of retaliation
   - To be informed of services and costs in advance
   - To receive care without discrimination (race, religion, national origin, gender, sexual orientation, disability)
   - To have your cultural and language preferences honored
3. **Advance Directives** — `AdvanceDirectivesGrid` (3-card layout):
   - **Living Will** — written instructions about end-of-life care if you cannot speak for yourself. California: any adult can complete an *Advance Health Care Directive* (Probate Code §4670 et seq.). Free forms available from the California Hospital Association and California Department of Justice.
   - **Durable Power of Attorney for Healthcare (DPOA-HC)** — names someone to make medical decisions for you. Part of the same California Advance Health Care Directive form.
   - **POLST (Physician Orders for Life-Sustaining Treatment)** — a medical order signed by a physician for seriously ill patients; travels with the patient across care settings. In California, the POLST form is *recommended* (not required) to be printed on bright pink paper (Ultra Pink 65#) so emergency responders can locate it quickly; the form remains legally valid on any color paper or in electronic form.
4. **How to File a Complaint or Grievance** — three paths:
   - With Eminent Hospice directly (contact info — placeholder until client confirms)
   - With the California Department of Public Health (CDPH) Licensing & Certification — (800) 228-1019
   - With the Medicare Beneficiary Ombudsman — 1-800-MEDICARE
   - Stress: **filing a complaint cannot result in retaliation** (federal protection).
5. **HIPAA & Your Privacy** — short paragraph on what's protected. **Do not ship a placeholder link to a not-yet-built page** (would 404). Instead: render plain text *"Our full Notice of Privacy Practices will be published before launch — see the footer for the linked notice once available."* On Day 7 when the page exists, swap the text for a real `<Link>`. Tracked as a TODO in `messages/PLACEHOLDERS.md`.

### Components used
- `LongFormPage`, `Disclaimer`, `LastReviewed`, `PatientRightsList`, `AdvanceDirectivesGrid`, `PageBottomCta`

### Translation keys
```
hospiceLaws
├── pageTitle, metaDescription, lastReviewed
├── sections.cops.{title, body, cmsLinkLabel, cmsLinkUrl}
├── sections.patientRights.{title, intro, items.{1..10}}
├── sections.advanceDirectives.{title, intro, livingWill.{title, body, caLawNote}, dpoa.{title, body}, polst.{title, body, paperColorNote}}
├── sections.complaints.{title, intro, paths.{eminent, cdph, medicare}.{name, contact}, retaliationProtection}
└── sections.hipaa.{title, body, noticeLinkLabel}
```

---

## Page 3 — Insurance & Medicare Information

**Route:** `/[locale]/insurance`
**Source:** notebook 2 frag 12, 18, 21, 22, 23, 30, 33, 34 + notebook 1 frag 55

### Section outline

1. **Quick Answer: What Does It Cost?** — opens with the family's #1 question. For most patients: **$0**. Medicare Part A and Medi-Cal cover hospice services in full when you elect the hospice benefit. Small co-pays may apply for outpatient drugs (up to $5) and respite care (5% of the Medicare-approved rate).
2. **Medicare Part A Hospice Benefit** — eligibility (Part A entitled, certified terminally ill), what's covered (all hospice services, related medications, durable medical equipment, the four levels of care), what's not covered (curative treatment for the terminal illness, room and board in a non-facility setting).
3. **The Four Levels of Care** (with FY2026 federal rates — *cite CMS as source*) — table:
   - **Routine Home Care (RHC)** — daily rate, tiered (days 1–60 vs 61+)
   - **Continuous Home Care (CHC)** — hourly rate for acute symptom crises at home
   - **General Inpatient Care (GIP)** — facility-based for symptoms unmanageable at home
   - **Inpatient Respite Care (IRC)** — up to 5 consecutive days to relieve the family caregiver
   - Place FY2026 *Aggregate Cap dollar amount* ($35,361.44 per beneficiary, notebook 2 frag 23) in a sidebar callout. Note **2.6% FY2026 increase** (notebook 2 frag 21–22).
   - **Insert this note explicitly:** "Specific dollar amounts shown reflect the FY2026 federal final rule (effective Oct 1, 2025). Rates update each fiscal year — see the 'Last reviewed' date above."
4. **Medi-Cal Hospice Coverage** — for California residents who qualify; covers hospice services plus, for those in a nursing facility, a **"room and board" payment of at least 95% of the facility rate** (notebook 2 frag 30) — this is the meaningful difference from Medicare alone.
5. **Medicare vs. Medi-Cal vs. Private Insurance** — `CoverageTable` component, side-by-side comparison covering: hospice services covered, room & board, eligibility, election process, what the family pays.
6. **The Election Process — Step by Step**
   1. Your attending physician and the hospice medical director certify your terminal illness.
   2. You sign the hospice election statement, choosing comfort care instead of curative treatment for the terminal illness.
   3. You can name your attending physician and your hospice provider.
   4. Care begins within 48 hours (most cases).
   5. Two 90-day benefit periods, then unlimited 60-day periods, each requiring recertification.
   6. You can revoke election at any time; you can re-elect later.
7. **Need Help Verifying Coverage?** — short paragraph: "Our admissions team verifies your coverage at no cost." Phone + Contact link.

### Components used
- `LongFormPage`, `Disclaimer`, `LastReviewed`, `CoverageTable`, `PageBottomCta`

### Translation keys
```
insurance
├── pageTitle, metaDescription, lastReviewed
├── sections.cost.{title, p1, footnote}
├── sections.medicare.{title, eligibility, covered, notCovered}
├── sections.levels.{title, intro, sourceNote, fy2026Note,
│   rhc.{name, desc, rateNote},
│   chc.{name, desc, rateNote},
│   gip.{name, desc, rateNote},
│   irc.{name, desc, rateNote},
│   aggregateCap.{label, value, desc}
│ }
├── sections.medical.{title, body, roomAndBoardNote}
├── sections.comparison.{title, intro, table.headers.{service, medicare, medical, private}, table.rows.{coverage, roomBoard, eligibility, election, familyPay}}
├── sections.election.{title, intro, steps.{1..6}, revocationNote}
└── sections.help.{title, body, ctaLabel}
```

---

## Shared Translation Keys (used by all 3 pages)

```
common
├── educationalDisclaimer            ← "This information is general education, not legal or insurance advice. Coverage decisions are made by Medicare, Medi-Cal, and your physician. For your specific situation, please contact us or your insurance provider."
├── lastReviewedLabel                ← "Last reviewed:"
├── relatedPages.{title, links.{understandingHospice, hospiceLaws, insurance, contact, referral}}
└── pageBottomCta.{title, subtitle, call, contact, refer}
```

The **disclaimer text is regulatory-sensitive**. Wording is locked across all three pages; if it changes, change once in `common.educationalDisclaimer` and it propagates everywhere.

---

## Sidebar Content (every Day 3 page)

`PageSidebar` renders:
1. **"On this page"** — anchor list to in-page `<h2>` sections (parent page passes the anchor array as a prop; no DOM scraping)
2. **"Related pages"** — links to the other two Day 3 pages plus FAQ (Day 5) and Contact (Day 6)
3. **Contact card** — small `bg-primary-50` block with phone (tel: link) and "Speak with our team" Link to `/contact`

**Implementation rule:** the sidebar stays a server component. No client-side scroll-spy on Day 3 — the URL hash + `scroll-margin-top` is enough for now.

---

## Implementation Conventions (carried forward from Days 1–2)

These were established earlier; restated here because Day 3 spins up 3 new pages × `generateMetadata` and 5 new components, and missing any of them silently breaks a11y, SEO, or i18n.

1. **`useTranslations` vs `getTranslations`** — `getTranslations` (from `next-intl/server`, `await`ed) is only required in async server contexts: `generateMetadata` and async server components. The three Day 3 page bodies and all `info/*` blocks stay **synchronous** server components using `useTranslations('namespace')`. Don't `await` either.
2. **`params` in Next.js 14.2.x** — `params` is synchronous (not a Promise). In `generateMetadata({ params }: { params: { locale: string } })`, do **not** `await params`.
3. **Korean term policy** — for regulatory/branded English terms (Medicare, Medi-Cal, POLST, DPOA, HIPAA, Medicare Part A), use the Day 2 hybrid: Korean translation followed by parenthesized English on first use per page (`"메디케어 파트 A (Medicare Part A)"`), and English-only on subsequent mentions. Educational-disclaimer copy may use Korean transliterations (메디케어/메디캘) because the disclaimer is regulatory boilerplate, not a teaching moment — but be consistent within a section.
4. **Tailwind tokens only** — no raw hex; for any `bg-*`/`text-*` chosen via prop, use an explicit `Record<…, string>` lookup map of full literal class strings so the JIT compiles them (see Day 2 `SectionContainer`).
5. **No `_note` keys in `messages/*.json`** — placeholders are tracked in `messages/PLACEHOLDERS.md`, never in the runtime JSON (next-intl would otherwise emit them in the client bundle).

---

## Step-by-Step Implementation Order

1. **Add Day 3 namespaces to `messages/en.json`** — full nested structure for `understandingHospice`, `hospiceLaws`, `insurance`, and shared `common`. Draft copy from NotebookLM sources.
2. **Mirror in `messages/ko.json`** — Korean drafts (Day 7 native polish).
3. **Update `messages/PLACEHOLDERS.md`** — note that CDPH/Medicare phone numbers and the CMS link URL are official values (not placeholders), but any phone number listed as Eminent's complaint contact is a placeholder until the client confirms.
4. **Edit `src/app/globals.css`** — add **scoped** `.long-form h2 { scroll-margin-top: 6rem; }` (not a global `h2` rule — that would affect Home and every future page). Also add a minimal print stylesheet for the three info pages — caregivers commonly print regulatory content (patient rights, advance directives, insurance):

   ```css
   @media print {
     header, footer, [data-print-hide] { display: none; }
     .long-form { max-width: none; color: #000; background: #fff; }
     .long-form a::after { content: " (" attr(href) ")"; font-size: 0.85em; color: #444; }
     .long-form h2 { break-after: avoid; }
     .long-form table { break-inside: avoid; }
   }
   ```

   Add `data-print-hide` to the `PageSidebar` and `PageBottomCta` root elements so they vanish on print.
5. **Extend `src/components/ui/Icon.tsx`** with `scale`, `document`, `info` icons (Heroicons outline, MIT-licensed).
6. **Create `src/components/ui/Disclaimer.tsx`** and `src/components/ui/LastReviewed.tsx`.
7. **Create `src/components/layout/PageSidebar.tsx`**.
8. **Create `src/components/layout/LongFormPage.tsx`** — the shell that wires sidebar + main column + disclaimer + last-reviewed stamp.
9. **Create `src/components/info/PageBottomCta.tsx`** — shared bottom CTA band (distinct from Day 2's `FinalCta` so visitors can tell apart "Home → convert" from "Info → next step").
10. **Create the page-specific blocks** — `MythsList`, `EligibilityList`, `PatientRightsList`, `AdvanceDirectivesGrid`, `CoverageTable`. Each <120 lines, synchronous server components, no client JS.
11. **Create `src/app/[locale]/understanding-hospice/page.tsx`** — composes `LongFormPage` with section blocks; `generateMetadata` from `understandingHospice.pageTitle` + `metaDescription`.
12. **Create `src/app/[locale]/hospice-laws/page.tsx`** — same pattern.
13. **Create `src/app/[locale]/insurance/page.tsx`** — same pattern.
14. **Visual QA** at 375 / 768 / 1280 widths for all three pages.
15. **Type + lint pass** — `npx tsc --noEmit`, `npm run lint`.
16. **Production build smoke test** — `npm run build`, confirm 6 new routes (3 EN + 3 KO) appear and no missing-translation warnings.

---

## Hot Copy Examples (drafts — with provenance)

NLM = NotebookLM. Citations refer to the fragment numbers from the earlier queries.

| Key | EN | KO (draft) | Source |
|---|---|---|---|
| `common.educationalDisclaimer` | "This information is general education, not legal or insurance advice. Coverage decisions are made by Medicare, Medi-Cal, and your physician. For your specific situation, please contact us or your insurance provider." | "본 안내는 일반적인 교육 정보이며, 법률 또는 보험 자문이 아닙니다. 보장 여부는 메디케어, 메디캘 및 담당 의사가 결정합니다. 구체적인 상황은 본 기관 또는 보험 제공자에게 문의해 주세요." | regulatory standard |
| `understandingHospice.sections.myths.items.1.myth` | "Hospice means giving up." | "호스피스는 포기하는 것이다." | NLM 1 frag 24 |
| `understandingHospice.sections.myths.items.1.fact` | "Hospice is choosing comfort and dignity. Many patients live as long as or longer than expected once symptoms are well managed." | "호스피스는 편안함과 존엄을 선택하는 것입니다. 증상이 잘 관리되면 많은 환자가 예상보다 오래 생활하기도 합니다." | NLM 1 frag 24 |
| `hospiceLaws.sections.cops.body` | "Every hospice that accepts Medicare must meet the federal Conditions of Participation. These cover patient rights, assessment, the interdisciplinary care team, quality, and infection control." | "메디케어를 수용하는 모든 호스피스 기관은 환자 권리, 평가, 다학제 팀 운영, 품질, 감염 관리 등을 다루는 연방 참여 조건(Conditions of Participation)을 충족해야 합니다." | 42 CFR Part 418 Subparts C–D (NLM 2 frag 1) |
| `hospiceLaws.sections.advanceDirectives.polst.paperColorNote` | "In California, the POLST form is recommended to be printed on bright pink (Ultra Pink) paper so emergency responders can locate it quickly. The form is legally valid on any color paper or in electronic form." | "캘리포니아에서는 응급 구조대원이 빠르게 식별할 수 있도록 POLST 양식을 밝은 분홍색(Ultra Pink) 종이에 인쇄하는 것이 권장됩니다. 다른 색상의 종이나 전자 양식도 법적으로 유효합니다." | [capolst.org Provider FAQ](https://capolst.org/wp-content/uploads/2025/10/POLST-FAQ-for-Medical-Providers-Who-Can-Sign-POLST.pdf) |
| `insurance.sections.cost.p1` | "For most patients, hospice care costs $0. Medicare Part A and Medi-Cal cover the hospice benefit in full when you elect it." | "대부분의 환자에게 호스피스 케어 비용은 $0입니다. 호스피스 베네핏을 선택하면 메디케어 파트 A와 메디캘이 비용을 전액 보장합니다." | NLM 1 frag 55 |
| `insurance.sections.levels.aggregateCap.value` | "$35,361.44 per beneficiary (FY2026)" | "$35,361.44 / 수혜자당 (2026 회계연도)" | NLM 2 frag 23 |
| `insurance.sections.levels.sourceNote` | "Source: CMS FY2026 Hospice Wage Index Final Rule, effective October 1, 2025." | "출처: CMS 2026 회계연도 호스피스 임금 지수 최종 규정, 2025년 10월 1일 시행." | NLM 2 frag 21–22 |

Full strings drafted during implementation; the structures above are the contract.

---

## Verification

```bash
npm run dev
# /en/understanding-hospice — h1, disclaimer, all 6 sections render, sidebar present
# /en/hospice-laws — all 5 sections, advance-directives 3-card grid, complaint paths
# /en/insurance — quick-answer + comparison table + FY2026 source citation visible
# /ko/[all three] — Korean throughout, no English leakage
# Click an "On this page" anchor → smooth scroll, URL hash updates, target lands below sticky header
# Tab through each page: visible focus on every interactive element
# DevTools mobile 375px: sidebar moves below main content, table stays scrollable, no horizontal overflow
# DevTools Accessibility outline: exactly one h1 per page, h2s for sections, no skipped levels
# View page source: <title> + <meta description> are locale-specific
# Disclaimer text should be byte-identical across all three pages (single source key)

npx tsc --noEmit       # zero errors
npm run lint           # zero errors
npm run build          # 6 new routes (3 × 2 locales) appear, no missing-translation warnings
```

**Content correctness spot-check (verified May 2026 against primary sources):**
- FY2026 Aggregate Cap value ($35,361.44) matches CMS-1835-F final rule ([CMS fact sheet](https://www.cms.gov/newsroom/fact-sheets/fy-2026-hospice-wage-index-and-payment-rate-update-and-hospice-quality-reporting-program))
- 2.6% FY2026 increase — confirm the exact decomposition (market basket − productivity adjustment) against CMS-1835-F before publishing the breakdown; CMS publishes the topline 2.6% but the component figures vary year to year
- Patient rights list has 10 items, each phrased plainly (not regulatory legalese), paraphrased from [42 CFR §418.52](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-418/subpart-C/section-418.52)
- POLST pink-paper wording matches [California POLST Provider FAQ](https://capolst.org/wp-content/uploads/2025/10/POLST-FAQ-for-Medical-Providers-Who-Can-Sign-POLST.pdf) — "recommended" not "required"; valid on any color paper
- CDPH complaint line **(800) 228-1019** verified against [cdph.ca.gov contact page](https://www.cdph.ca.gov/Pages/contact_us.aspx); Medicare ombudsman is **1-800-MEDICARE (1-800-633-4227)**
- All California-specific items flagged as state-jurisdictional, not federal
- **Page copy does not cite a specific CoP count** (e.g. "23") unless an implementer has counted the CoPs in [eCFR Part 418 Subparts C–D](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-418) and confirmed it; safer default is to reference "the federal Conditions of Participation" without a number
- Educational disclaimer appears above the fold on every Day 3 page
- Medicare hospice election structure: **two 90-day periods, then unlimited 60-day periods** (verified — [42 CFR Part 418 Subpart B](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-418/subpart-B/))
- Drug copay capped at $5; respite coinsurance 5% of Medicare-approved rate ([42 CFR Part 418 Subpart H](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-418/subpart-H))
- Medi-Cal room and board ≥95% of NF rate (revenue code 0658) verified against DHCS guidance

**Lighthouse target per page:** Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Regulatory copy goes out of date** (CMS rates, HOPE tool dates, etc.) | Every Day 3 page carries a `lastReviewed` ISO date stamp. Add a calendar reminder for September each year to re-review before the new federal fiscal year starts October 1. Cite CMS as source so accuracy is verifiable. |
| **Patient-rights list misstated as the literal CFR text** | List is plain-language *paraphrase*, not a quote. Page links to the official 42 CFR §418.52 for the authoritative text. The educational disclaimer is on the page. |
| **Eminent's complaint contact is a placeholder** | Tracked in `messages/PLACEHOLDERS.md`. Client confirms before launch. CDPH and Medicare ombudsman numbers are real and verified. |
| **Coverage table oversimplifies** | Each cell stays factual; "Family pays" cell explicitly references the drug co-pay (up to $5) and respite co-pay (5% of Medicare-approved rate). Sidebar callout reminds the reader to verify their specific plan. |
| **Sidebar sticky behavior buggy on long pages** | Use plain `sticky top-24`; if sticky stacking issues appear, fall back to non-sticky — the sidebar still functions as a footer-block on each page. |
| **Korean medical terminology mistranslated** | Day 3 ships *drafts*. Day 7 native review will catch incorrect Korean medical/legal terms. Critical terms (Medicare, Medi-Cal, hospice, POLST) should remain in English even in KO copy where Korean equivalents could mislead, e.g. `"메디케어 파트 A (Medicare Part A)"`. |
| **Anchor links collide with sticky header offset** | Scoped `.long-form h2 { scroll-margin-top: 6rem }` in `globals.css` (Step 4). Measure actual `<Header>` height first and tune `top-` + `scroll-margin-top` together. |
| **POLST "printed on pink" overstated as a legal requirement** | Wording softened to "recommended … to be printed on bright pink paper; valid on any color or electronically." Single source of truth in `hospiceLaws.sections.advanceDirectives.polst.paperColorNote`. |
| **CoP-count claim ("23") not directly attributable to a single CMS page** | Page copy references "the federal Conditions of Participation" without a count; verification step in spot-check list. If the client insists on a number, count Subparts C–D sections in eCFR Part 418 before publishing. |
| **Caregivers print these pages and get a broken layout** | Print stylesheet added in Step 4 — hides nav/sidebar/CTAs, expands main, expands URLs after links for paper readability. |
| **`NLM frag N` source pointers unverifiable in future audits** | Optional: dump a `messages/SOURCES.md` with the quoted snippets from notebooks 1 and 2 next to each translation key. Adds maintenance but makes the regulatory provenance reviewable without re-querying NotebookLM. |
| **3 pages in one day is aggressive** | Per `7-day-plan.md` Day 3 contingency: if time runs short, ship Understanding + Insurance first; push Hospice Laws to Day 4 morning. The shared `LongFormPage` shell built today makes Day 4 about 30% faster than starting fresh. |

---

## Out of Scope (defer)

- Real Eminent complaint contact (placeholder until client confirms)
- HIPAA Notice of Privacy Practices full page (Day 7)
- Forms on these pages (Day 6 wires them)
- About Us, Services, FAQ, For Families pages (Days 4–5)
- Multilingual SEO hreflang tags (Day 7)
- Structured data (`MedicalOrganization`, `FAQPage`) — Day 7
- Native Korean reviewer pass (Day 7)
- Real photography
- Analytics / tracking
- Print stylesheet (could be considered Day 7 polish if requested — long-form info pages are often printed)
