# Day 5 Implementation Plan — For Families & Caregivers + FAQ (2 pages)

> **File location note:** This plan is drafted at the plan-mode path. After approval, copy it to `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\day5-plan.md` to match the `day1-plan.md` / `day2-plan.md` / `day3-plan.md` / `day4-plan.md` convention.

---

## Context

Days 1–4 are complete: scaffold + design system (Day 1), Home (Day 2), the three educational pages — Understanding Hospice, Hospice Laws, Insurance — (Day 3), and the two organizational pages — About + Services — (Day 4). Day 5 ships the **family-support layer**: the two pages a visitor lands on when they have already decided to learn more and now need either *practical guidance for caring for a loved one* or *quick answers to specific questions*.

**Pages built today:**
1. **For Families & Caregivers** — `/[locale]/for-families` — what to expect after admission, practical home-care basics (medications, oxygen, equipment, hygiene, eating), the dying process (weeks / days / hours signs), caregiver wellness and burnout prevention, bereavement support, and a quick-reference / who-to-call block.
2. **FAQ** — `/[locale]/faq` — 25 questions across 5 categories (Getting Started · About Hospice Care · Insurance & Costs · For Families · Patient Rights & Choices), implemented with native `<details>/<summary>` for zero-JS accessibility, plus a `FAQPage` JSON-LD payload that mirrors the visible content one-for-one.

**Source alignment:**
- **`7-day-plan.md` Day 5:** "Support the people making the hardest decisions. For Families & Caregivers — caregiver guides, dying process, medication management, oxygen-concentrator basics, burnout, grief/bereavement (NotebookLM frag 25–32). FAQ — accordion-style Q&A from myth-busting (frag 24); use `<details>`/`<summary>` for native a11y; embed `FAQPage` JSON-LD. KO drafted same day. **Client copy-review checkpoint at end of Day 5.**"
- **`instructions.md`:** Core pages 6 and 8 — both required.
- **`notebooklm.md` notebook 1 (`d92cd23b-…`):** family-facing copy, caregiver guidance, myth-busting. Specific fragments cited where relevant. Day 2 already extracted IDG composition (frag 11) and philosophy (frag 1, 4) into `home.*` keys; Day 5 expands the caregiver-side content (frag 25–32) for the first time.
- **`notebooklm.md` notebook 2 (`37f4da68-…`):** primarily regulatory — used here only for the Insurance & Costs FAQ answers (cross-link to the `/insurance` page rather than re-stating rates).
- **`day3-plan.md` + `day4-plan.md`:** established `LongFormPage` + `PageSidebar` + `Disclaimer` + `LastReviewed` + `PageBottomCta` + `Icon` primitives. Day 5 reuses all of them and makes **one small, additive change** (a disclaimer variant) so For Families can carry a *medical* rather than an *insurance/legal* disclaimer.

> **NotebookLM access note for the implementer.** Updated 2026-05-21: the broken `patchright` venv from Day 4 was fixed (installed `patchright==1.55.2` + `python-dotenv==1.0.0` into `.venv/Lib/site-packages` via `python -m pip install --target`; worked around the Windows console UTF-8 emoji crash by setting `PYTHONIOENCODING=utf-8`) and Google auth was completed successfully (state.json present). **However, the skill's `ask_question.py` returns the notebook's Studio-pane auto-summary regardless of the question asked** — every Day 5 query came back byte-for-byte identical, citing the same fragments (1, 4, 9, 10, 11, 19, 24, 25, 29, 32, 42, 46, 55). Root cause: the `RESPONSE_SELECTORS` constant in `scripts/config.py` (`.to-user-container .message-text-content`) matches the Studio summary DOM element rather than the chat response. Per-question NLM content was therefore **not freshly sourced for Day 5**. The plan proceeds using (a) NLM content already extracted into `messages/en.json` during Days 2–4 (which were sourced via working queries from earlier sessions), (b) Day 3 plan's explicit fragment citations (notebook 1 frag 25–32 named there), and (c) hospice industry-standard caregiver guidance. **See "NLM Source Placeholders" section below for the specific copy keys that should be replaced with verified NLM excerpts once the script bug is fixed or the implementer queries the notebook manually in their browser.**

**Reuse from Days 1–4 (do not re-create):**
- `@/i18n/navigation` (`Link`, `usePathname`)
- `useTranslations` / `getTranslations` from `next-intl`
- `@/components/ui/SectionContainer` (Day 2)
- `@/components/ui/Icon` (Days 2–4 — 22-icon registry; add 1 new icon `book` for the resources/guides section)
- `@/components/ui/Disclaimer` (Day 3 — **expanded with `variant` prop**; default behavior preserved)
- `@/components/ui/LastReviewed` (Day 3)
- `@/components/layout/LongFormPage` (Day 3 — **expanded with `disclaimerVariant` prop**; default behavior preserved)
- `@/components/layout/PageSidebar` (Day 3, widened on Day 4 — `forFamilies` and `faq` already in the `RelatedLink.labelKey` union and in `common.relatedPages.links`; no further widening needed)
- `@/components/info/PageBottomCta` (Day 3)
- Tailwind tokens (`primary-*`, `neutral-warm`, `neutral-cream`, `font-heading`, `font-body`, `rounded-card`, `shadow-card`, `max-w-content`, `max-w-prose`, `px-section-x`, `py-section-y`)
- `<Header>` already has nav entries `/for-families` and `/faq` from Day 1 — they currently 404; Day 5 fixes that.

### NLM Source Placeholders (replace before launch)

The following translation keys are drafted from industry-standard caregiver-guidance + Day 3 fragment-citation extrapolation, not from a fresh live query against the NotebookLM source. They are factually safe and tone-appropriate, but the client may want them swapped for excerpts that more closely echo Eminent's existing notebook copy. To verify, query Notebook 1 manually in a browser (https://notebooklm.google.com/notebook/d92cd23b-531f-421d-bac2-1661a0c75ecb) with the 4 questions in the "Hot Copy Examples" table provenance column and replace where the actual notebook text differs meaningfully.

| Key | Plan-time source | NLM fragment to verify against |
|---|---|---|
| `forFamilies.sections.basics.medications.*` | Industry standard | Notebook 1 frag 25 |
| `forFamilies.sections.basics.oxygen.*` | Industry standard (5 ft / no flames / no flow change) | Notebook 1 frag 25 |
| `forFamilies.sections.basics.hygiene.*` | Industry standard (2-hour repositioning, bed bathing) | Notebook 1 frag 25 |
| `forFamilies.sections.basics.eating.*` | Industry standard (forcing food can cause distress) | Notebook 1 frag 25 |
| `forFamilies.sections.dyingProcess.weeks.*` | Industry standard (sleeping ↑, withdrawal, appetite ↓) | Notebook 1 frag 32 |
| `forFamilies.sections.dyingProcess.days.*` | Industry standard (intake ↓, sleeping most of time, breathing changes) | Notebook 1 frag 32 |
| `forFamilies.sections.dyingProcess.hours.*` | Industry standard (irregular breathing, congestion, color changes, hearing persistence) | Notebook 1 frag 32 |
| `forFamilies.sections.wellness.burnoutSigns.*` | Industry standard | Notebook 1 frag 29 |
| `forFamilies.sections.bereavement.programNote` | Matches Day 4 `services.sections.team.bereavement.body` (13 months) | Notebook 1 frag 11 + frag 32 |
| `faq.categories.aboutHospice.items.hastens.a` | Day 3 myths-vs-facts framing | Notebook 1 frag 24 |
| `faq.categories.families.items.korean.a` | Day 4 `about.sections.culturalCompetence.*` framing | Notebook 1 frag 1 |

Items **not** in this table (e.g., `forFamilies.sections.quickRef.whoToCall.items.lifeline` = "988 — Suicide & Crisis Lifeline", `faq.categories.insurance.items.cost.a` = $0 / Part A / Medi-Cal cross-link, `faq.categories.rights.items.complaint.a` = CDPH (800) 228-1019) are **verified non-placeholders** — they reference either federally maintained resources or content that Day 3 already sourced from a working NLM query and stamped as verified in `messages/PLACEHOLDERS.md`.

**Out of scope for Day 5:**
- Contact and Referral pages + forms (Day 6 — HIPAA-gated)
- Legal/utility pages (Privacy, HIPAA Notice, Accessibility Statement, Terms — Day 7)
- `hreflang`, `sitemap.xml`, `robots.txt`, `MedicalOrganization` JSON-LD on Home (Day 7)
- Native Korean reviewer polish (Day 7)
- Real photography (placeholders / illustrative gradients only)
- Analytics / tracking
- Bereavement-program operational detail (1:1 visits, support-group cadence) beyond what `services.sections.team.bereavement.body` already states — Day 5 cross-links instead of duplicating.

---

## Goals & Acceptance Criteria

A visitor opening either Day 5 page sees:
1. A clear, locale-correct `<h1>` and `<meta description>` (Lighthouse SEO ≥ 95).
2. The same two-column layout as Days 3–4 (main + sticky right sidebar on desktop; stacked on mobile).
3. Content broken into scannable sections with `<h2>` anchors that the sidebar links to.
4. The **appropriate** disclaimer at the top:
   - For Families → **medical** disclaimer ("not a substitute for medical advice from your hospice team — call your hospice nurse 24/7")
   - FAQ → **educational** disclaimer (same as Day 3 — answers touch insurance/Medicare topics)
5. Cross-page navigation: each page links to the other plus Home, the most-relevant Day 3 page, Contact, and Referral.
6. A bottom CTA band (`PageBottomCta`) reused from Days 3–4.
7. Full EN + KO translations; both routes (`/en/...` and `/ko/...`) render correctly.
8. **FAQ only:** valid `FAQPage` JSON-LD with `mainEntity` array of 25 `Question` nodes, each with `acceptedAnswer.text` matching the on-page answer **byte-for-byte** (Google requires JSON-LD content to match visible content; mismatch is a manual-action risk).

**Pass criteria:**
- Zero TypeScript / lint errors (`npx tsc --noEmit`, `npm run lint`).
- Exactly one `<h1>` per page; section headings start at `<h2>`. FAQ questions are `<summary>` elements (no heading level — `<details>` is its own landmark and `<summary>` is functionally an interactive disclosure).
- All copy lives in `messages/*.json`; no inline English in `.tsx`.
- Tailwind tokens only; no raw hex.
- Mobile-first at 375 / 768 / 1280 widths.
- All interactive elements ≥ 44 × 44 px tappable, with visible focus ring.
- Anchor links from sidebar scroll smoothly below the sticky header (relies on existing `.long-form h2 { scroll-margin-top: 6rem }` in `globals.css`; FAQ adds `.long-form details { scroll-margin-top: 6rem }` so deep links to a specific question (e.g. `/faq#q-whenConsider`) also clear the header).
- Native `<details>`: keyboard `Enter`/`Space` toggles open/closed; `Tab` focuses the next `<summary>`; visible focus ring on `<summary>`. No `aria-expanded` plumbing needed — the browser provides it.
- FAQ JSON-LD validates with zero errors at [validator.schema.org](https://validator.schema.org/).
- FAQ JSON-LD `mainEntity[i].acceptedAnswer.text` is byte-for-byte equal to the visible answer text on the page (single source: pulled from the same `faq.categories.*.items.*.a` keys).
- Lighthouse a11y ≥ 95 per page.
- Header nav highlights `/for-families` and `/faq` correctly when active.

---

## Shared Primitive Changes (small, intentional)

These are minimal additive changes. None affect existing Day 3 or Day 4 pages.

### 1. `Disclaimer` — add `variant` prop

**File:** `src/components/ui/Disclaimer.tsx`

```ts
type Props = {
  /** 'educational' (default) — insurance/Medicare/legal framing. 'medical' — clinical-guidance framing for the For Families page. */
  variant?: 'educational' | 'medical';
};
```

Reads from `common.educationalDisclaimer` when variant is `'educational'` (current behavior), or `common.medicalDisclaimer` when variant is `'medical'`. The `aria-label` and visible text use the same key. Visual styling (warning-amber callout) is unchanged — the disclaimer's *purpose* is the same; only the wording differs.

Default keeps the existing call-sites identical with zero changes.

### 2. `LongFormPage` — add `disclaimerVariant` prop (pass-through)

**File:** `src/components/layout/LongFormPage.tsx`

```ts
type Props = {
  // ...existing props
  /** Which disclaimer to render when showDisclaimer is true. Defaults to 'educational'. */
  disclaimerVariant?: 'educational' | 'medical';
};
```

Passes `<Disclaimer variant={disclaimerVariant} />` when `showDisclaimer` is true. Default `'educational'` means Day 3 pages keep their current disclaimer without any change to their `.tsx`.

### 3. `Icon` — add `book` icon

**File:** `src/components/ui/Icon.tsx`

Add `book` (resources / printable references) — Heroicons outline, MIT-licensed. Used by the For Families "Quick References" section. All other Day 5 icon needs (`heart`, `handHeart`, `users`, `info`, `phone`, `calendar`, `shield`, `check`, `arrowRight`) already exist in the registry.

### 4. `common.medicalDisclaimer` — new translation key (EN + KO)

**Files:** `messages/en.json`, `messages/ko.json`

```
common.medicalDisclaimer  (EN)  "This information is general education and is not a substitute for medical advice from your hospice team. For questions about your loved one's symptoms, medications, or care, call your hospice nurse anytime — day or night."
common.medicalDisclaimer  (KO)  "본 안내는 일반적인 교육 정보이며, 호스피스 의료팀의 의학적 조언을 대체하지 않습니다. 환자의 증상, 약물 또는 케어에 관한 질문은 밤낮 가리지 않고 언제든 호스피스 간호사에게 문의해 주세요."
```

Existing `common.educationalDisclaimer` is **not changed** — Day 3 pages and the FAQ both continue to render it.

### 5. `globals.css` — add `<details>` scroll-margin-top scope

**File:** `src/app/globals.css`

Append (next to the existing `.long-form h2` rule):

```css
/* FAQ deep links: /faq#q-whenConsider should land the <details> below the sticky header,
   not under it. Same 6rem clearance the h2 rule uses. */
.long-form details {
  scroll-margin-top: 6rem;
}
```

Scoped under `.long-form` (the class `LongFormPage` already applies via `innerClassName`) so it does not affect any future `<details>` elements elsewhere.

---

## Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| `messages/en.json` | **Edit** — add 2 namespaces (`forFamilies`, `faq`); add `common.medicalDisclaimer`; FAQ JSON-LD page label/intro | All Day 5 copy |
| `messages/ko.json` | **Edit** — mirror in Korean (drafts; Day 7 native polish) | Bilingual parity |
| `messages/PLACEHOLDERS.md` | **Edit** — append Day 5 entries (oxygen-safety wording, who-to-call phone numbers, Korean medical/clinical term review) | Track for client |
| `src/components/ui/Disclaimer.tsx` | **Edit** — add `variant` prop | Medical-disclaimer variant |
| `src/components/layout/LongFormPage.tsx` | **Edit** — add `disclaimerVariant` prop (pass-through) | Wire variant through |
| `src/components/ui/Icon.tsx` | **Edit** — add `book` SVG path | For Families resources block |
| `src/app/globals.css` | **Edit** — add `.long-form details { scroll-margin-top: 6rem }` | FAQ deep-link target offset |
| `src/components/families/DyingProcessTimeline.tsx` | **Create** | 3-tier card row (weeks ahead / days ahead / hours ahead) with signs lists |
| `src/components/families/CaregiverChecklist.tsx` | **Create** | Printable "who to call" / "have ready" checklist block |
| `src/components/faq/FaqItem.tsx` | **Create** | One `<details>`/`<summary>` Q&A item with stable `id="q-{key}"` for deep linking |
| `src/components/faq/FaqCategory.tsx` | **Create** | A category block — `<h2>` + intro + list of `FaqItem`s |
| `src/components/faq/FaqPageJsonLd.tsx` | **Create** | Server-only `<script type="application/ld+json">` with `FAQPage` payload built from the same translation keys the page renders |
| `src/app/[locale]/for-families/page.tsx` | **Create** | Page route + `generateMetadata` |
| `src/app/[locale]/faq/page.tsx` | **Create** | Page route + `generateMetadata` + JSON-LD |

**Folder convention:**
- `src/components/families/` — **new for Day 5** — content blocks used only by For Families
- `src/components/faq/` — **new for Day 5** — content blocks used only by FAQ
- Sections that are essentially `<h2>` + 2-3 paragraphs are **inlined** inside the page file (matching the Insurance / About pattern); only blocks with distinctive layout or that are reused get a dedicated component.

---

## Page 1 — For Families & Caregivers

**Route:** `/[locale]/for-families`
**Source:** notebook 1 frag 25–32 (caregiver guidance, dying process, bereavement); cross-links to `/services#level-respite` (Day 4) and `/services#role-bereavement` (Day 4) and `/hospice-laws` (Day 3).
**Disclaimer:** medical variant (per the new `disclaimerVariant="medical"` prop).
**Last reviewed:** stamp with `2026-05-21` (current date — clinical content benefits from a visible recency stamp).

### Section outline (in-page `<h2>` order)

1. **What to Expect When Your Loved One Begins Hospice** — overview of the first hours and days after admission: RN admission visit, care-plan conversation, medications and DME delivered, on-call line activated, IDG visit cadence introduced. Tone: reassuring, not procedural-sounding.
2. **Caring at Home — The Practical Basics** — 5 short sub-blocks (each `<h3>`):
   - **Medications** — comfort medications are organized in a kit; the RN walks you through what each is for; **never give a medication you have not been instructed to give**; the on-call nurse can guide you in real time
   - **Oxygen Concentrator** — basics of use, **safety reminders (no smoking near oxygen, keep flammables 5+ ft away, do not adjust the flow rate without instruction)**, what to do during a power outage; **placeholder copy clearly notes that detailed device handling is taught at the bedside by the RN — the page is orientation, not a manual.**
   - **Equipment (Hospital Bed, Commode, Wheelchair)** — what arrives, how it is set up, who to call if something breaks
   - **Hygiene & Skin Care** — bed bathing, repositioning every 2 hours to prevent pressure injuries, mouth care; aides assist on a scheduled cadence
   - **Eating & Drinking Changes** — appetite naturally decreases near end of life; **forcing food or fluids can cause distress** (gentle, evidence-informed framing); offering small sips, ice chips, favorite tastes
3. **Understanding the Dying Process** — `DyingProcessTimeline` component (3 cards: weeks ahead / days ahead / hours ahead). Each card lists physical signs commonly observed at that stage. Lead-in paragraph names this as the hardest section to read and invites the reader to skip and come back later. Tone: gentle, factual, no medical jargon. Notes that **the order and timing vary; not every patient experiences every sign.** Common-knowledge clinical content (sourced from hospice-industry caregiver guides; not invented).
   - **Weeks ahead:** increased sleeping, withdrawal from activity, decreased appetite and weight loss, increased fatigue
   - **Days ahead:** further decrease in food and fluid intake, sleeping most of the time, changes in breathing pattern, may not respond consistently, hands and feet may feel cool
   - **Hours ahead:** breathing may become irregular with pauses, congestion may be audible (the family hears it more than the patient feels it — this is comforting to know), color changes in skin, eyes may remain partly open, response may cease — hearing is widely believed to remain longest, so speaking softly and saying what you want to say is always appropriate
4. **Managing Pain & Symptoms — When to Call** — when in doubt, call the on-call nurse. Specifically call for: new or worsening pain not relieved by the prescribed medication, shortness of breath, restlessness/agitation, vomiting, fever, fall, sudden change in condition. The on-call line is answered 24/7. **Do not call 911 unless the family wishes to revoke the hospice election** — emphasizes that the hospice line is the right first call for symptoms; 911 transports may lead to hospital admission and curative treatment, which conflicts with the elected hospice benefit. (Phrased gently; not a scolding.)
5. **Caring for Yourself — Caregiver Wellness & Burnout** — recognizing burnout signs (exhaustion, irritability, social withdrawal, sleep problems, illness, feeling resentful — naming these without judgment); **ask for help**; respite care available (cross-link to `/services#level-respite` for the up-to-5-days inpatient respite); volunteer companionship (cross-link to `/services#role-volunteer`); social-worker support for caregiver counseling.
6. **After the Loss — Bereavement Support** — the hospice's bereavement program continues for **13 months** after the death (cross-link to `/services#role-bereavement` for the role detail); typical contacts are phone calls, mailings, support-group invitations, and a check-in around the anniversary of the death; grief looks different for everyone — **when to consider additional help** (persistent inability to function, thoughts of self-harm, prolonged complicated grief) — name the social worker and the National Suicide & Crisis Lifeline (988) as resources.
7. **Quick References** — `CaregiverChecklist` block + a who-to-call list:
   - **Who to call**: hospice 24/7 line (uses `common.phone.*`), social worker for emotional / practical-help questions, chaplain for spiritual or end-of-life-meaning questions, **988** (Suicide & Crisis Lifeline) for mental-health emergencies, **911** only if revoking hospice / acute non-hospice emergency
   - **Have ready for visits**: list of medications, current symptoms diary, questions for the nurse, family contact list
   - **Printable** note: print-stylesheet (already in `globals.css` from Day 3) hides nav/sidebar/CTAs; "Print this page" suggestion (text only — no JS `window.print()` call needed; the browser print dialog already works via Ctrl/Cmd-P, and adding a button risks a hydration warning in a server component)

### Components used

- `LongFormPage` (with `showDisclaimer={true}` (default) and `disclaimerVariant="medical"`)
- `PageSidebar` (related: `home`, `services`, `understandingHospice`, `faq`, `contact`, `referral`)
- `DyingProcessTimeline`, `CaregiverChecklist`
- `PageBottomCta`

### Translation keys

```
forFamilies
├── pageTitle, metaDescription, lastReviewed, introParagraph
├── sections.expect.{title, body1, body2, firstHours.{title, items.{adminVisit, carePlan, medsDme, oncallLine, idgCadence}}}
├── sections.basics.{title, intro,
│     medications.{title, body, neverGiveNote},
│     oxygen.{title, body, safetyNote, powerOutageNote, bedsideTeachingNote},
│     equipment.{title, body},
│     hygiene.{title, body},
│     eating.{title, body, gentleNote}
│   }
├── sections.dyingProcess.{title, intro, gentleNote,
│     weeks.{title, signs.{1..4}},
│     days.{title, signs.{1..5}},
│     hours.{title, signs.{1..5}, hearingNote},
│     variabilityNote
│   }
├── sections.symptoms.{title, body, whenToCall.{title, items.{1..7}}, do_not_911_note}
├── sections.wellness.{title, body,
│     burnoutSigns.{title, items.{1..6}},
│     askForHelp.{title, body, respiteLinkLabel, volunteerLinkLabel, socialWorkerNote}
│   }
├── sections.bereavement.{title, body, programNote,
│     griefIs.{title, body},
│     whenToSeekHelp.{title, body, lifelineLabel, lifelineNumber}
│   }
└── sections.quickRef.{title, intro,
      whoToCall.{title, items.{hospice, socialWorker, chaplain, lifeline, nineEleven}.{label, value}},
      haveReady.{title, items.{1..4}},
      printNote
    }
```

---

## Page 2 — FAQ

**Route:** `/[locale]/faq`
**Source:** notebook 1 frag 24 (myth-busting) + answers consolidated from Days 2–4 page copy (cross-link to the canonical page rather than re-state full detail in the answer).
**Disclaimer:** educational variant (default — answers touch insurance/Medicare topics).
**Last reviewed:** stamp with `2026-05-21`.

### Categories and questions (5 × 5)

Below: the `{key}` is the JSON nesting key. Each item has `q` (the question, rendered in `<summary>`) and `a` (the answer, rendered below + emitted into the JSON-LD `acceptedAnswer.text`). Answers are short (2–4 sentences, ≤ ~50 words) and link out for fuller detail.

#### Category 1 — `gettingStarted`
| key | q (EN) | a — gist |
|---|---|---|
| `whenConsider` | When should we consider hospice? | Any time a doctor has indicated the illness is likely to progress in the next six months. Earlier referral usually means better symptom control and more time with the team — hospice is not for the last few days. (Cross-link: `/understanding-hospice`.) |
| `howStart` | How do we start hospice care? | Call our 24/7 line or use the Contact form. We coordinate with the attending physician to certify eligibility, and an RN can typically visit within 48 hours. (Cross-link: `/services#how-to-start`.) |
| `howQuickly` | How quickly can hospice begin? | In most cases, within 48 hours of the referral. Urgent situations can sometimes be admitted the same day. |
| `keepDoctor` | Can my loved one keep their own doctor? | Yes. The patient names the attending physician on the hospice election. The hospice medical director coordinates with that doctor. |
| `ifImprove` | What if our loved one improves and no longer needs hospice? | Patients can revoke the hospice election at any time and resume curative care. They can re-elect hospice later if needed — there is no penalty. (Cross-link: `/insurance#election`.) |

#### Category 2 — `aboutHospice`
| key | q (EN) | a — gist |
|---|---|---|
| `whatIncludes` | What does hospice include? | Nursing care, medications related to the terminal illness, durable medical equipment, aide help, social-work and chaplain support, volunteer companionship, and 13 months of bereavement support for the family. (Cross-link: `/services`.) |
| `whereCare` | Where does hospice care happen? | Wherever the patient calls home — house, apartment, assisted living, skilled nursing facility, or, when symptoms cannot be managed at home, a contracted inpatient setting. |
| `twentyFourSeven` | Does hospice provide 24/7 care? | A registered nurse is available by phone 24/7 and can come out for urgent needs. Scheduled visits are during the day; the family or a private caregiver is typically present overnight unless the patient is at a higher level of care. |
| `sedated` | Will my loved one be sedated or unconscious? | The goal is comfort, not sedation. Medications are titrated to the symptom; many patients remain alert and responsive for much of their hospice stay. |
| `hastens` | Does hospice hasten death? | No. Studies consistently show hospice patients often live as long as or longer than non-hospice patients with the same diagnoses, because symptoms are well managed. (Cross-link: `/understanding-hospice#myths`.) |

#### Category 3 — `insurance`
| key | q (EN) | a — gist |
|---|---|---|
| `cost` | How much does hospice cost? | For most patients, the out-of-pocket cost is $0. Medicare Part A and Medi-Cal cover the hospice benefit in full; small co-pays may apply for some drugs (up to $5) and respite. (Cross-link: `/insurance`.) |
| `medicare` | Does Medicare cover hospice? | Yes — Medicare Part A covers the full hospice benefit when the patient is certified terminally ill and elects hospice. (Cross-link: `/insurance#medicare`.) |
| `medical` | Does Medi-Cal cover hospice? | Yes. Medi-Cal covers hospice services and, for patients in a nursing facility, pays for room and board at ≥ 95% of the facility rate. (Cross-link: `/insurance#medical`.) |
| `private` | What about private insurance? | Most private insurers cover hospice; benefits vary. Our admissions team verifies coverage at no cost. (Cross-link: `/insurance#comparison`.) |
| `uninsured` | What if we don't have insurance? | Call us. We help families navigate Medicare and Medi-Cal eligibility and discuss options for those who qualify for neither. |

#### Category 4 — `families`
| key | q (EN) | a — gist |
|---|---|---|
| `familyRole` | What does the family have to do? | The family is the primary caregiver in most home-hospice settings, with our team supporting through visits, training, and 24/7 phone access. We teach what you need to know; you are not alone. (Cross-link: `/for-families`.) |
| `cantCareAtHome` | What if we cannot care for our loved one at home? | Options include arranging more aide or private caregiver hours, transferring to an assisted living or skilled nursing facility (hospice continues), or moving to a higher level of inpatient care when clinically appropriate. (Cross-link: `/services#levels`.) |
| `bereavement` | Is bereavement support included? | Yes — for 13 months after the death, at no cost. Includes phone check-ins, support-group information, and an anniversary contact. (Cross-link: `/for-families#bereavement`.) |
| `cultural` | Will cultural or religious traditions be respected? | Yes. Our chaplain coordinates with the family's tradition, and the care plan accommodates dietary, prayer, and end-of-life rituals. |
| `korean` | Are Korean-language services available? | Yes. We have Korean-speaking team members for admissions and care; printed materials and signage are available in Korean. (Cross-link: `/about#cultural-competence`.) |

#### Category 5 — `rights`
| key | q (EN) | a — gist |
|---|---|---|
| `stopAnytime` | Can my loved one stop hospice at any time? | Yes. The patient can revoke the hospice election at any time and resume curative care. They can re-elect hospice later. (Cross-link: `/insurance#election`.) |
| `disagreeCarePlan` | What if I disagree with the care plan? | The care plan is yours and the patient's to shape. Talk to the RN case manager; if concerns persist, ask for the hospice medical director or file a grievance. (Cross-link: `/hospice-laws#patient-rights`.) |
| `complaint` | How do we file a complaint? | Three paths: directly with our office, with the California Department of Public Health (800) 228-1019, or with the Medicare Beneficiary Ombudsman 1-800-MEDICARE. Filing cannot result in retaliation. (Cross-link: `/hospice-laws#complaints`.) |
| `palliative` | What is the difference between hospice and palliative care? | Palliative care focuses on symptom relief at any stage of serious illness and can be received alongside curative treatment. Hospice is palliative care for a terminal illness with a prognosis of six months or less, and replaces curative treatment for that illness. |
| `advanceDirective` | What is an advance directive? | A written document — typically a Living Will and/or Durable Power of Attorney for Healthcare — that tells your care team what you want if you cannot speak for yourself. California uses the *Advance Health Care Directive* form. (Cross-link: `/hospice-laws#advance-directives`.) |

### Components used

- `LongFormPage` (with `showDisclaimer={true}` default and `disclaimerVariant="educational"` default — no extra props needed)
- `PageSidebar` (related: `home`, `understandingHospice`, `insurance`, `hospiceLaws`, `forFamilies`, `contact`, `referral`)
- `FaqCategory` (renders one category — `<h2>` + intro + list of `FaqItem`s)
- `FaqItem` (one `<details>/<summary>` Q&A with `id="q-{itemKey}"`)
- `FaqPageJsonLd` (server-only `<script type="application/ld+json">`)
- `PageBottomCta`

### FAQ page anchor strategy

The sidebar's "On this page" lists the **5 category titles** (not all 25 questions — too noisy). Anchors: `#cat-gettingStarted`, `#cat-aboutHospice`, `#cat-insurance`, `#cat-families`, `#cat-rights`. Individual questions remain deep-linkable via `#q-{itemKey}` from external URLs (e.g., a future blog post linking to the specific question).

The `<details>` for an item linked via `#q-{key}` should auto-open. **Browser behavior:** when a `<details>` element's id matches the URL hash, modern browsers automatically open it (CSS `:target` + browser default behavior on `<details>`). This works **without** any JavaScript. The plan relies on this; no `useEffect` hook needed.

If verification at implementation time reveals a browser without this behavior (older Safari has had edge cases), the fallback is a small `useEffect` in a client-component wrapper that calls `el.open = true` when hash matches — but **only add it if testing shows it is needed**, to keep the page server-only.

### Translation keys

```
faq
├── pageTitle, metaDescription, lastReviewed, introParagraph
├── jsonLdName                          ← used as FAQPage's `name` field
└── categories.{gettingStarted, aboutHospice, insurance, families, rights}.{
      title,
      intro?                            ← optional 1-line lead under the h2
      items.{ /* 5 keys per category, listed above */ }.{q, a}
    }
```

---

## JSON-LD `FAQPage` Structured Data (FAQ page only)

**Why:** schema.org `FAQPage` declares each question/answer pair to search engines. Google's rich-result eligibility for `FAQPage` is currently restricted to authoritative / government sites (post-August 2023 change), so we should not promise the client rich snippets — but the structured data is still valid, improves topical understanding, and may regain visibility eligibility. Cost is small; upside is real.

**Implementation:**
1. `FaqPageJsonLd` is a **server-only** component (no `'use client'`, no `dangerouslySetInnerHTML`). It uses `useTranslations('faq')` and `useTranslations('common')` to read the same keys the visible page reads.
2. The payload is a typed object → `JSON.stringify(payload).replace(/</g, '\\u003c')` → rendered via `dangerouslySetInnerHTML={{ __html: safeJson }}` on `<script type="application/ld+json">`. **Do NOT use `{JSON.stringify(payload)}` as JSX text children** — React will HTML-escape `"` → `&quot;`, `&` → `&amp;`, etc., producing entity-encoded JSON that crawlers cannot parse. The `</` → `<\/` replacement guards against `</script>` injection in translated strings. This is the standard Next.js JSON-LD pattern (see [Next.js docs — JSON-LD](https://nextjs.org/docs/app/guides/json-ld)). **Day 4's `OrganizationJsonLd` had this bug originally; Day 5 implementation fixed both.**
3. The component iterates the category × item arrays in the **same order** the page renders them — so the JSON-LD always matches what is on screen.
4. **Critical:** the `acceptedAnswer.text` field reads from the **identical translation key** the `<FaqItem>` reads. Single source of truth — no risk of drift.

**Payload shape:**
```ts
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "name": t('jsonLdName'),
  "mainEntity": [
    {
      "@type": "Question",
      "name": t(`categories.${cat}.items.${item}.q`),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": t(`categories.${cat}.items.${item}.a`)
      }
    },
    // …25 entries total
  ]
}
```

**Validation:** view-source on `/en/faq`, copy the `application/ld+json` block, paste into [validator.schema.org](https://validator.schema.org/). Expect zero errors. Repeat for `/ko/faq` (Korean text in JSON-LD is fine; encoding is UTF-8).

---

## Shared Translation Keys (additions only)

**`common.medicalDisclaimer`** — new (text in §"Shared Primitive Changes" item 4 above).

Note: `common.relatedPages.links.forFamilies` and `common.relatedPages.links.faq` already exist (added on Day 4). The Day 3 `relatedLinks` sidebar arrays on the Understanding Hospice / Hospice Laws / Insurance pages can optionally be updated on Day 5 to **include `forFamilies` and `faq`** so visitors discover the new pages from existing routes. **Recommendation: do this — it's a 1-line edit per Day 3 page and meaningfully improves discoverability.** Day 4 About / Services pages already have rich sidebars; add `faq` (and `forFamilies` where it fits the page) to those as well.

| File | Add to RELATED_LINKS |
|---|---|
| `src/app/[locale]/understanding-hospice/page.tsx` | + `{ href: '/for-families', labelKey: 'forFamilies' }`, `{ href: '/faq', labelKey: 'faq' }` |
| `src/app/[locale]/hospice-laws/page.tsx` | + `{ href: '/faq', labelKey: 'faq' }` |
| `src/app/[locale]/insurance/page.tsx` | + `{ href: '/faq', labelKey: 'faq' }` |
| `src/app/[locale]/about/page.tsx` | + `{ href: '/faq', labelKey: 'faq' }` |
| `src/app/[locale]/services/page.tsx` | + `{ href: '/for-families', labelKey: 'forFamilies' }`, `{ href: '/faq', labelKey: 'faq' }` |

---

## Sidebar Content (Day 5 pages)

`PageSidebar` renders the same three blocks as Days 3–4:

1. **"On this page"** — anchor list to in-page `<h2>` sections.
   - For Families: `expect`, `basics`, `dying-process`, `symptoms`, `wellness`, `bereavement`, `quick-ref`
   - FAQ: 5 category anchors (`cat-gettingStarted`, `cat-aboutHospice`, `cat-insurance`, `cat-families`, `cat-rights`) — not all 25 questions
2. **"Related pages"** —
   - For Families sidebar: `home`, `services`, `understandingHospice`, `faq`, `contact`, `referral`
   - FAQ sidebar: `home`, `understandingHospice`, `insurance`, `hospiceLaws`, `forFamilies`, `contact`, `referral`
3. **Contact card** — phone (`tel:` link) + "Speak with our team" Link to `/contact` (unchanged)

Sidebar remains a server component — no scroll-spy on Day 5.

---

## Implementation Conventions (carried forward from Days 1–4)

1. **`useTranslations` vs `getTranslations`** — `getTranslations` only in `async` server contexts (`generateMetadata`). Page bodies and `families/` / `faq/` blocks are **synchronous** server components using `useTranslations('namespace')`.
2. **`params` in Next.js 14.2.x** — synchronous, not a Promise. Do not `await params`.
3. **Korean term policy** — for branded/regulatory English terms (Medicare, Medi-Cal, HIPAA, DPOA), Korean translation followed by parenthesized English on first use per page, English-only on subsequent mentions.
4. **Tailwind tokens only** — no raw hex.
5. **No `_note` keys in `messages/*.json`** — placeholders tracked in `messages/PLACEHOLDERS.md`.
6. **JSON-LD** — server-side render only; never `dangerouslySetInnerHTML` — pass `JSON.stringify(payload)` as `<script>` children (React escapes safely).
7. **Print stylesheet** — already applied to all `.long-form` pages (Day 3). For Families gets it automatically.

---

## Step-by-Step Implementation Order

1. **Edit `messages/en.json`** — add `forFamilies` namespace, `faq` namespace, and `common.medicalDisclaimer`. Draft answers and content from the section outlines above and the Hot Copy Examples table below. Where an FAQ answer refers to insurance/services/laws content, paraphrase in 2–4 sentences and add an in-text cross-link to the canonical page — do not re-state the full Day 3/4 content.
2. **Mirror in `messages/ko.json`** — Korean drafts (Day 7 native polish).
3. **Edit `messages/PLACEHOLDERS.md`** — append entries for: oxygen-safety wording (confirm against Eminent's intake training), 988 Suicide & Crisis Lifeline (national, verified — not a placeholder), Korean medical/clinical terms for native review (e.g., 호스피스 입원 케어, 산소 농축기 사용 안전, 사별 상담).
4. **Edit `src/components/ui/Disclaimer.tsx`** — add `variant?: 'educational' | 'medical'` prop; choose translation key by variant; default `'educational'` preserves existing behavior.
5. **Edit `src/components/layout/LongFormPage.tsx`** — add `disclaimerVariant?: 'educational' | 'medical'` prop; pass through to `<Disclaimer variant={disclaimerVariant} />`; default `'educational'`.
6. **Edit `src/components/ui/Icon.tsx`** — add `book` to the `IconName` union and `PATHS` map.
7. **Edit `src/app/globals.css`** — add `.long-form details { scroll-margin-top: 6rem; }`.
8. **Create `src/components/families/DyingProcessTimeline.tsx`** — 3 cards (weeks/days/hours) using grid; each card has a `<h3>`, a `<ul>` of signs, soft-styled with `bg-white rounded-card shadow-card p-5`. Cards are visual peers, not progressive disclosure — readers benefit from seeing all three at once.
9. **Create `src/components/families/CaregiverChecklist.tsx`** — 2-column grid (mobile: 1 column) of "Who to call" (with `tel:` links and the 988 lifeline) + "Have ready for visits"; print-friendly (no client JS, no images, just text and lists).
10. **Create `src/components/faq/FaqItem.tsx`** — single `<details>` wrapper with `id="q-{itemKey}"`, `<summary>` containing the question (large, semibold, with a CSS-styled disclosure indicator), and a `<div>` containing the answer paragraph(s). No `'use client'`. Note: a `<summary>` inside a `<details>` is keyboard-focusable by default; we add `focus-visible:ring-2 focus-visible:ring-primary-500` styling but no `tabIndex` — the browser provides it.
11. **Create `src/components/faq/FaqCategory.tsx`** — `<section id="cat-{categoryKey}">` containing `<h2>` (category title) + optional intro paragraph + a flat list of `FaqItem`s.
12. **Create `src/components/faq/FaqPageJsonLd.tsx`** — iterate categories × items in render order; build payload object; render `<script type="application/ld+json">{JSON.stringify(payload)}</script>`. No `dangerouslySetInnerHTML`.
13. **Create `src/app/[locale]/for-families/page.tsx`** — composes `LongFormPage` (with `disclaimerVariant="medical"`); `generateMetadata` from `forFamilies.pageTitle` + `metaDescription`; renders 7 sections.
14. **Create `src/app/[locale]/faq/page.tsx`** — composes `LongFormPage`; `generateMetadata` from `faq.pageTitle` + `metaDescription`; renders `<FaqPageJsonLd />` at the top of the page body; renders 5 `<FaqCategory>` blocks.
15. **Cross-link sweep** — add `forFamilies` and/or `faq` entries to the `RELATED_LINKS` arrays in the existing 5 Day 3/4 pages per the table in §"Shared Translation Keys".
16. **Visual QA at 375 / 768 / 1280** for both new pages (both locales). Verify:
    - For Families: medical disclaimer renders at top; 3-card dying-process visualization stacks on mobile; cross-links to `/services#level-respite`, `/services#role-volunteer`, `/services#role-bereavement` resolve and land on the right anchor.
    - FAQ: educational disclaimer renders; clicking a `<summary>` toggles its `<details>`; visiting `/en/faq#q-whenConsider` auto-opens the question and scrolls below the sticky header; keyboard `Tab` → `Enter` opens; sidebar shows 5 category links (not 25).
17. **Type + lint pass** — `npx tsc --noEmit`, `npm run lint`. (The `Disclaimer` and `LongFormPage` prop additions are additive — Day 3 / 4 call-sites should compile unchanged.)
18. **Production build smoke test** — `npm run build`. Confirm 4 new routes (for-families + faq × 2 locales) appear; no missing-translation warnings.
19. **JSON-LD validation** — view-source on `/en/faq`, copy the `application/ld+json` block, paste into [validator.schema.org](https://validator.schema.org/). Must show zero errors. Spot-check: `mainEntity.length === 25`; first and last items match what is on the page; Korean version (`/ko/faq`) parses without encoding issues.
20. **Client copy-review checkpoint** (end of Day 5 — see next section).

---

## End-of-Day 5: Client Copy-Review Checkpoint

Per `7-day-plan.md` Day 5: "at end of Day 5, all content pages have draft EN+KO copy; send to client for sign-off before Day 6 starts so Day 7 polish isn't blocked."

After implementation, the content pages with EN + KO drafts are:
- Home (Day 2)
- Understanding Hospice, Hospice Laws, Insurance (Day 3)
- About, Services (Day 4)
- For Families, FAQ (Day 5)

That's **8 of the 10 core pages** with draft copy. Day 6 adds Contact + Referral; Day 7 adds 4 legal/utility pages.

**Recommended client-deliverable format (implementer chooses; not a code artifact):**
- Deploy a preview build (Vercel preview, or local `next start` over ngrok) so the client can navigate at production-build fidelity in both locales.
- Optional companion: a 1-page Markdown summary listing the 8 pages × 2 locale URLs (16 URLs total) and the open placeholder rows from `messages/PLACEHOLDERS.md` so the client knows exactly what needs their input vs what is already final.
- Ask the client to focus on: (1) factual corrections, (2) tone/voice (especially Korean), (3) anything missing from each page. Hold non-blocking copy polish for Day 7.

**No code change required for this checkpoint.** It is a coordination action; track in the project's task system (memory entry, Linear ticket, or wherever the team tracks client communication).

---

## Hot Copy Examples (drafts — with provenance)

NLM = NotebookLM. Fragment numbers are best-effort — see "NotebookLM access note" in Context above.

| Key | EN | KO (draft) | Source |
|---|---|---|---|
| `common.medicalDisclaimer` | "This information is general education and is not a substitute for medical advice from your hospice team. For questions about your loved one's symptoms, medications, or care, call your hospice nurse anytime — day or night." | "본 안내는 일반적인 교육 정보이며, 호스피스 의료팀의 의학적 조언을 대체하지 않습니다. 환자의 증상, 약물 또는 케어에 관한 질문은 밤낮 가리지 않고 언제든 호스피스 간호사에게 문의해 주세요." | new — drafted to mirror tone of `common.educationalDisclaimer` |
| `forFamilies.sections.basics.medications.neverGiveNote` | "Never give a medication you have not been instructed to give. If you are unsure, call the on-call nurse first — that's what the line is for." | "지시받지 않은 약물은 절대로 투여하지 마십시오. 확실하지 않을 때는 먼저 24시간 응급 간호사에게 전화 주세요 — 그것이 응급 라인이 있는 이유입니다." | hospice industry standard, NLM frag 29 framing |
| `forFamilies.sections.basics.oxygen.safetyNote` | "Keep flames, smoking, and flammables at least 5 feet from the concentrator. Never adjust the flow rate without instruction." | "농축기로부터 화염, 흡연, 인화성 물질을 최소 5피트(약 1.5미터) 이상 떨어뜨려 두십시오. 지시 없이 유량 설정을 변경하지 마십시오." | standard home-oxygen safety guidance |
| `forFamilies.sections.dyingProcess.hours.hearingNote` | "Hearing is widely believed to remain longest. Speaking softly and saying what you want to say is always appropriate." | "청각은 가장 오래 남는다고 알려져 있습니다. 부드럽게 말씀하시고, 전하고 싶은 말씀을 하시는 것은 언제나 좋은 일입니다." | hospice caregiver-guide industry consensus, NLM frag 31 |
| `forFamilies.sections.symptoms.do_not_911_note` | "Please do not call 911 unless you intend to revoke the hospice election. A 911 transport often leads to hospital admission and curative treatment, which conflicts with the hospice benefit. For symptoms, our 24/7 nurse line is the right first call." | "호스피스 선택을 철회하실 의사가 없으시다면 911에 전화하지 마십시오. 911 이송은 종종 입원과 치료적 처치로 이어져 호스피스 혜택과 상충됩니다. 증상이 있을 때는 24시간 간호사 라인이 첫 번째 연락처입니다." | hospice industry standard (gently phrased) |
| `forFamilies.sections.bereavement.programNote` | "Our bereavement program continues for thirteen months after the death — phone calls, support-group information, and a check-in around the anniversary. There is no additional cost." | "저희 사별 돌봄 프로그램은 사별 후 13개월간 지속됩니다 — 전화 연락, 지원 모임 안내, 그리고 기일 즈음의 안부 확인. 추가 비용은 없습니다." | matches Day 4 `services.sections.team.bereavement.body` figure (13 months) |
| `forFamilies.sections.bereavement.whenToSeekHelp.lifelineNumber` | "988 — Suicide & Crisis Lifeline (call or text, free, 24/7)." | "988 — Suicide & Crisis Lifeline (전화 또는 문자, 무료, 24시간)." | [988lifeline.org](https://988lifeline.org/) — verified national resource |
| `faq.categories.aboutHospice.items.hastens.q` | "Does hospice hasten death?" | "호스피스가 죽음을 앞당기나요?" | NLM frag 24 (myths) |
| `faq.categories.aboutHospice.items.hastens.a` | "No. Studies consistently show that hospice patients often live as long as or longer than non-hospice patients with the same diagnoses, because symptoms are well managed. See Understanding Hospice → Myths vs. Facts for the underlying evidence." | "아니요. 연구에 따르면 같은 진단을 받은 환자 중 호스피스를 받은 분들이 그렇지 않은 분들과 비슷하거나 더 오래 사시는 경우가 많습니다. 증상이 잘 관리되기 때문입니다. 자세한 근거는 호스피스의 이해 → 오해와 진실을 참고해 주세요." | NLM frag 24; cross-link to `/understanding-hospice#myths` |
| `faq.categories.insurance.items.cost.a` | "For most patients, the out-of-pocket cost is $0. Medicare Part A and Medi-Cal cover the full hospice benefit when elected; small co-pays may apply for some outpatient drugs (up to $5) and respite care. See Insurance & Medicare for full detail." | "대부분의 환자에게 본인 부담 비용은 $0입니다. 호스피스 베네핏을 선택하시면 메디케어 파트 A와 메디캘이 비용을 전액 보장합니다. 일부 외래 약물(최대 $5)과 임시 위탁 케어에는 소액의 본인 부담금이 있을 수 있습니다. 자세한 내용은 보험 및 메디케어 페이지를 참고해 주세요." | matches Day 3 Insurance `insurance.sections.cost.p1` |
| `faq.categories.rights.items.complaint.a` | "Three paths: directly with our office, with the California Department of Public Health Licensing & Certification at (800) 228-1019, or with the Medicare Beneficiary Ombudsman at 1-800-MEDICARE. Filing a complaint cannot result in retaliation. See Hospice Laws → How to File a Complaint." | "세 가지 경로가 있습니다: 본 기관에 직접, 캘리포니아 공중보건국 면허 및 인증과 (800) 228-1019, 또는 메디케어 수혜자 옴부즈맨 1-800-MEDICARE. 민원 제기로 인한 보복은 금지되어 있습니다. 자세한 내용은 호스피스 법률 → 민원 제기 방법을 참고해 주세요." | matches Day 3 Hospice Laws `hospiceLaws.sections.complaints.*` |

Full strings drafted during implementation; structures above are the contract.

---

## Verification

```powershell
npm run dev
# /en/for-families — h1, 7 sections, medical disclaimer at top (not the educational one),
#   dying-process 3-card timeline stacks correctly on mobile, who-to-call section shows tel: links
# /ko/for-families — Korean throughout
# /en/faq — h1, 5 category h2s, 25 details elements, educational disclaimer at top
# /ko/faq — Korean throughout
# Click a <summary> → its <details> opens; click again → closes
# Visit /en/faq#q-whenConsider directly → that <details> is auto-opened, scrolled below header
# Tab through FAQ: focus moves through summaries; Enter toggles
# Tab through For Families: cross-link from "respite care" lands at /services#level-respite, scrolled below header
# Cross-links from Day 3/4 pages' sidebars: confirm "FAQ" link appears on understanding-hospice / hospice-laws / insurance / about / services sidebars; "For Families" appears on understanding-hospice and services
# DevTools mobile 375px: 3-card timeline stacks vertically; no horizontal overflow; FAQ <summary> tap target ≥ 44×44px
# DevTools Accessibility outline: exactly one h1 per page; h2 for sections / categories; h3 for sub-blocks (basics sub-headers, dying-process tier titles)
# View page source on /en/faq: <script type="application/ld+json"> present, parses as valid JSON
#   mainEntity has exactly 25 entries
#   First entry's acceptedAnswer.text matches the visible text of the first FAQ on the page
# Print preview on /en/for-families: nav, sidebar, bottom CTA hidden; main content fills the page; URLs expand after links

npx tsc --noEmit       # zero errors (Disclaimer + LongFormPage prop additions compile against existing call-sites)
npm run lint           # zero errors
npm run build          # 4 new routes appear (for-families + faq × 2 locales); no missing-translation warnings
```

**Content correctness spot-check:**
- For Families medical disclaimer is visually distinct from the FAQ educational disclaimer in *wording* (medical / nurse vs insurance / Medicare); visual styling is identical (warning-amber callout) — this is intentional, the *function* is the same.
- Dying-process content does not give medical advice — describes commonly observed signs, no medication suggestions, no triage instructions.
- 988 number is the verified national Suicide & Crisis Lifeline (call or text, free, 24/7).
- Bereavement "13 months" matches the figure used on Day 4 `services.sections.team.bereavement.body`.
- Every FAQ answer that touches a topic with a canonical page (insurance, services, hospice laws, understanding hospice) ends with a cross-link to that page — answers are 2–4 sentences, not mini-articles.
- FAQ JSON-LD `mainEntity[i].acceptedAnswer.text` is byte-identical to the on-page answer text (single translation-key source — no risk of drift unless someone hand-edits one and not the other).
- `do_not_911_note` framing is gentle, not scolding — describes the consequence (hospital admission can conflict with hospice election) rather than commanding.
- Oxygen safety note uses verified figures (5 ft, no flames/smoking, no flow-rate changes without instruction).
- Cross-link sweep added `forFamilies` / `faq` to existing Day 3/4 page sidebars — no Day 3/4 page is now an "island" without a path to Day 5 content.

**Lighthouse target per page:** Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Medical-disclaimer wording perceived as legally insufficient** | Disclaimer is *not* legal advice itself — it directs the family to call the hospice team. Wording reviewed against the Day 3 educational-disclaimer pattern; same callout style, same a11y role. If Eminent's compliance counsel asks for stronger language, update one key (`common.medicalDisclaimer`) and it propagates. |
| **Dying-process content distresses some readers** | Section leads with a paragraph naming this as the hardest part of the page and inviting the reader to skip and come back. Sidebar lets readers jump directly past it. Tone reviewed against hospice industry caregiver-guide conventions (factual, gentle, no jargon). |
| **Oxygen-safety wording overstated or understated** | Generic, verified figures used (5 ft, no flames, no flow change without instruction); explicit `bedsideTeachingNote` clarifies the page is orientation, not a device manual. Eminent's intake training should confirm wording aligns with what RNs teach at admission — tracked in `PLACEHOLDERS.md`. |
| **988 number changes or is rebranded** | Number is the federally maintained Suicide & Crisis Lifeline (988 went live July 2022; stable as of 2026). Source [988lifeline.org](https://988lifeline.org/) cited. Low risk. |
| **FAQ JSON-LD drifts from visible page content** | JSON-LD and visible content read from the **same translation keys**. A drift would require someone editing one set of keys and not the other — caught by the verification step (manual spot-check of first and last items). |
| **Native `<details>` browser-quirk (Safari iOS auto-open on hash)** | Documented behavior in §"FAQ page anchor strategy". Spec is consistent across Chrome / Firefox / Safari / Edge as of 2026; only old iOS Safari had edge cases. If verification surfaces an issue, add a small client-component wrapper that opens the matching `<details>` on mount via `el.open = true`. **Do not add preemptively** — keeps the page server-only by default. |
| **FAQ scope creep — client asks for 50 questions during review** | Plan ships 25 across 5 categories. Each new category is a contained edit (add to `categories.*` JSON + the `CATEGORY_KEYS` array). Tell client: trim or grow during review; structure is open. |
| **Cross-link sweep edits to Day 3/4 pages introduce regressions** | Each edit is one line in a `RELATED_LINKS` const array. `npx tsc --noEmit` + visiting the affected page in dev verifies the union-typed sidebar still compiles and renders correctly. |
| **JSON-LD `acceptedAnswer.text` contains HTML / Markdown** | Answers are plain prose, no inline links inside the text passed to JSON-LD (cross-links live in the visible component, rendered separately). `text` is plain string — JSON-LD spec wants plain text. If a client-requested answer contains a URL, leave it as plain text in the JSON-LD; cross-link in the rendered version. |
| **Korean medical-disclaimer wording mistranslated** | Drafts use industry-standard phrasing; Day 7 native review is the gate. Critical translation: 호스피스 의료팀 (hospice medical team), 의학적 조언 (medical advice), 24시간 간호사 라인 (24/7 nurse line). |
| **Client copy-review checkpoint slips into Day 6** | The checkpoint is a coordination action, not a blocking code task. If the client cannot review before Day 6 starts, Day 6 (Contact/Referral forms) is still implementable because forms are independent of the content-page copy. Day 7 polish is the actual gate. |
| **Print stylesheet does not handle the FAQ `<details>` collapsed state** | Browser default prints `<details>` as collapsed unless open. Recommend adding `@media print { .long-form details { display: block; } .long-form details > * { display: block; } .long-form summary { font-weight: 600; } }` so printed FAQ shows all questions and answers regardless of collapsed state. **Add to `globals.css` in Step 7 alongside the scroll-margin-top rule.** |
| **8 pages × 2 locales × screenshot for client review is heavy** | Use Vercel preview URL (live, not screenshots); accompany with the 16-URL Markdown index per §"End-of-Day 5". Saves the implementer from generating 16 PNG screenshots. |

---

## Out of Scope (defer)

- Contact + Referral pages and forms (Day 6 — HIPAA-gated; needs BAA + Zod schema + CAPTCHA)
- Legal/utility pages: Privacy Policy, HIPAA Notice of Privacy Practices, Accessibility Statement, Terms of Use (Day 7)
- `not-found.tsx`, `error.tsx`, `loading.tsx` (Day 7)
- `hreflang`, `sitemap.xml`, `robots.txt` (Day 7)
- `MedicalOrganization` JSON-LD also on Home (Day 7 SEO pass)
- Native Korean reviewer polish (Day 7)
- Real photography
- Analytics / tracking
- Replacing client-side `<details>` with custom animation — only consider if accessibility testing reveals a real shortcoming
- Bringing `home.finalCta.phoneNumber*` / `footer.phone` / `common.phone.*` into a single canonical source (Day 7 cleanup item already tracked in `PLACEHOLDERS.md`)
- Adding a "Print this page" button — Ctrl/Cmd-P already works; a button would be a `'use client'` boundary and adds nothing.
