# Placeholder Copy — Client Review Checklist

This file tracks every translation key in `messages/en.json` and `messages/ko.json` that currently holds **illustrative or placeholder content**. The site is wired up to read these keys, but the values are drafts and should be replaced with real, client-approved copy before launch.

> Update this file whenever a placeholder is replaced with final content — remove the row once approved.

## Phone / Fax / Email / Address — RESOLVED (2026-06-10)

Real values pulled from the live eminenthospice.com site and applied to all keys in `en.json` + `ko.json`:

- Phone: `(818) 824-3702` / `+18188243702` (`common.phone.*`, `home.finalCta.phoneNumber*`, `footer.phone`)
- Fax: `(818) 824-3712` (`common.fax.display`, `contact.info.faxLabel`, `aboutJsonLd.faxNumber`)
- Email: `admin@eminenthospice.com` (footer, contact card, legal pages, JSON-LD)
- Address: `10999 Riverside Dr Ste 306, North Hollywood, CA 91602` (`common.address.*`, `footer.address`, `aboutJsonLd.address.*`)
- Service area: 5 counties (Los Angeles, Orange, San Bernardino, Riverside, Ventura) per the live site's Services page
- Accreditation: Joint Commission Gold Seal of Approval® (About page, footer cert strip, home hero caption, JSON-LD `award`)
- Mission + 5 core values (Respect, Compassion/Empathy, Teamwork, Accountability, Service Excellence) folded into `about.sections.mission/values` from the live About page
- Korean how-to videos (4 YouTube embeds) added to `/for-families` (`forFamilies.sections.videos.*`)

## Testimonial

The testimonial quote is **illustrative** — written in the tone of the NotebookLM caregiver-support material so the page is not blank during early review. Replace with a real, attributed quote (with the family member's permission) before launch.

| Key | Status | Notes |
|---|---|---|
| `home.testimonial.quote` (en + ko) | Illustrative draft | Needs real quote + signed release. |
| `home.testimonial.attribution` (en + ko) | Generic "Family Member, Los Angeles" | Replace with attribution agreed with the family (first name + relationship is typical, e.g. "— Sarah, daughter of patient"). |

## Hero Imagery

The hero right column currently renders a decorative Tailwind gradient placeholder marked `aria-hidden`. When client photography is delivered (per `requirements.md` §3.2), the placeholder will be replaced with a `next/image` `<Image>` element. No JSON change required — purely a component swap in `src/components/home/Hero.tsx`.

## Day 3 — Eminent Complaint Contact (Hospice Laws page)

The "Eminent Hospice Care directly" complaint path on the Hospice Laws page currently routes users to the generic Contact form and the placeholder phone number above. When the client confirms how complaints should be intaked (dedicated email, separate compliance hotline, specific compliance officer's name?), update the copy at `hospiceLaws.sections.complaints.paths.eminent.contact` accordingly.

| Key | Current value | Notes |
|---|---|---|
| `hospiceLaws.sections.complaints.paths.eminent.contact` (en + ko) | Generic — "Call our office or use the Contact form…" | Confirm with client whether there is a dedicated compliance/complaint intake path. |

**Verified (NOT placeholders) — do not change without re-verifying:**

| Key | Value | Source |
|---|---|---|
| `hospiceLaws.sections.complaints.paths.cdph.contact` | `(800) 228-1019` | [CDPH Licensing & Certification — Centralized Complaint Intake](https://www.cdph.ca.gov/Pages/contact_us.aspx) |
| `hospiceLaws.sections.complaints.paths.medicare.contact` | `1-800-MEDICARE (1-800-633-4227)` | Medicare Beneficiary Ombudsman, federal hotline |
| `hospiceLaws.sections.cops.cmsLinkUrl` | `https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-418` | eCFR — current 42 CFR Part 418 |
| `hospiceLaws.sections.patientRights.linkUrl` | `https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-418/subpart-C/section-418.52` | eCFR — current §418.52 |
| `insurance.sections.levels.aggregateCap.value` | `$35,361.44 per beneficiary` | [CMS FY2026 Hospice Wage Index Final Rule (CMS-1835-F)](https://www.cms.gov/newsroom/fact-sheets/fy-2026-hospice-wage-index-and-payment-rate-update-and-hospice-quality-reporting-program) |

## Day 3 — HIPAA Notice link

`hospiceLaws.sections.hipaa.noticeLabel` currently renders plain explanatory text (no link) because the HIPAA Notice of Privacy Practices page does not yet exist. **Do not add a placeholder URL** — it would 404. On Day 7, when the Notice page is published, replace the rendered text with a `<Link>` and remove this entry from PLACEHOLDERS.md.

## Day 3 — `lastReviewed` dates

All three Day 3 pages stamp `lastReviewed: 2026-05-01`. Per `7-day-plan.md` Risk row, set a calendar reminder for **September each year** to re-review these pages against the new federal fiscal year (CMS updates each October).

| Key | Current value | Re-review by |
|---|---|---|
| `understandingHospice.lastReviewed` | `2026-05-01` | 2026-09 (annual cadence) |
| `hospiceLaws.lastReviewed` | `2026-05-01` | 2026-09 |
| `insurance.lastReviewed` | `2026-05-01` | 2026-09 (FY2027 rates publish in CMS final rule July–August) |

## Day 4 — About Us page

### Founding story

`about.sections.story.body` (en + ko) holds **interim copy** written to avoid a "coming soon" stub while preserving factual safety: no invented founder names, no invented founding year. Client must confirm:

| Detail to confirm | Notes |
|---|---|
| Founding year | Plug into rewritten story copy when known. |
| Founder name(s) | Currently absent from the copy by design. |
| Founding motivation / origin | Current copy uses a generic Korean-American–community framing that aligns with `instructions.md` priorities; client may want to replace with the actual origin story. |

| Key | Current value | Notes |
|---|---|---|
| `about.sections.story.body` (en + ko) | Interim draft, see above | Replace verbatim with client-confirmed copy. |

### Korean-speaking staff headcount

`about.sections.culturalCompetence.bullets.koreanStaff` currently uses the safe phrasing "Korean-speaking team members" without a count. If the client has a confirmed headcount they would like to publish (e.g. "three Korean-speaking RNs on staff"), update both EN and KO together.

| Key | Current value | Notes |
|---|---|---|
| `about.sections.culturalCompetence.bullets.koreanStaff` (en + ko) | "Korean-speaking team members on the clinical and admissions teams." | Confirm specific roles/headcount with client; until then, no number. |

### JSON-LD address values — RESOLVED (2026-06-10)

All `aboutJsonLd.*` values filled from the live site: name `Eminent Hospice Care, Inc`, phone/fax E.164, full North Hollywood address, 5-county `areaServed`, Joint Commission `award`. Domain `eminenthospice.com` confirmed live (the client's existing site).

### Logo for JSON-LD — RESOLVED (2026-06-10)

Logo downloaded from the live site's CDN to `public/images/logo.png` (479×174 PNG, white background) and wired into `OrganizationJsonLd.tsx` + `LocalBusinessJsonLd.tsx`. Favicon (`src/app/icon.png`, 32×32) and apple-touch icon (`src/app/apple-icon.png`, 180×180) generated from the logo mark. The Header keeps the text wordmark — the CDN logo has a white background that clashes with the cream header; request a transparent-background vector/PNG from the client if they want the graphic logo in the header.

## Day 5 — For Families & Caregivers + FAQ pages

### NLM-grounded copy (industry-standard fill where notebook query was unavailable)

The Day 5 plan tried to ground these keys in a live NotebookLM query against Notebook 1 (frag 25–32 for caregiver content, frag 24 for myths/FAQs). The skill's `ask_question.py` script has a `RESPONSE_SELECTORS` bug that returns the Studio summary pane instead of the chat answer (all 4 attempted queries returned the same overview text). The keys below were drafted from hospice industry-standard caregiver guidance + Day 3 fragment citations + the Day 2–4 `messages/en.json` content already sourced from working earlier queries. **Verify and refine against the notebook in a browser before final launch.**

| Key prefix | Source used | NLM fragment to verify against |
|---|---|---|
| `forFamilies.sections.basics.medications.*` | Industry standard (kit-based delivery, never-give-without-instruction) | Notebook 1 frag 25 |
| `forFamilies.sections.basics.oxygen.*` | Industry standard (5 ft / no flames / no flow change without instruction) | Notebook 1 frag 25 |
| `forFamilies.sections.basics.hygiene.*` | Industry standard (2-hour repositioning, mouth care) | Notebook 1 frag 25 |
| `forFamilies.sections.basics.eating.*` | Industry standard (forcing food can cause distress) | Notebook 1 frag 25 |
| `forFamilies.sections.dyingProcess.weeks.*` | Industry standard (sleeping ↑, withdrawal, appetite ↓) | Notebook 1 frag 32 |
| `forFamilies.sections.dyingProcess.days.*` | Industry standard (intake ↓, breathing changes, response changes) | Notebook 1 frag 32 |
| `forFamilies.sections.dyingProcess.hours.*` | Industry standard (irregular breathing, congestion, color, hearing) | Notebook 1 frag 32 |
| `forFamilies.sections.wellness.burnoutSigns.*` | Industry standard | Notebook 1 frag 29 |
| `forFamilies.sections.bereavement.programNote` | Matches Day 4 `services.sections.team.bereavement.body` (13 months) | Notebook 1 frag 11 + frag 32 |
| `faq.categories.aboutHospice.items.hastens.a` | Day 3 myths-vs-facts framing | Notebook 1 frag 24 |
| `faq.categories.families.items.korean.a` | Day 4 `about.sections.culturalCompetence.*` framing | Notebook 1 frag 1 |

**Verified non-placeholders (do not change without re-verifying):**

| Key | Value | Source |
|---|---|---|
| `forFamilies.sections.quickRef.whoToCall.items.lifeline.label` + `.bereavement.whenToSeekHelp.lifelineNumber` | `988 — Suicide & Crisis Lifeline (call or text, free, 24/7)` | [988lifeline.org](https://988lifeline.org/) — federally maintained national hotline |
| `faq.categories.rights.items.complaint.a` | CDPH `(800) 228-1019` + Medicare Ombudsman `1-800-MEDICARE` | Matches Day 3 verified entries |
| `faq.categories.insurance.items.cost.a` | $0 / Medicare Part A / Medi-Cal cross-link | Matches Day 3 `insurance.sections.cost.p1` |

### `lastReviewed` dates

Both Day 5 pages stamp `lastReviewed: 2026-05-21` (today's date — clinical content benefits from a visible recency stamp). Annual re-review reminder: September each year alongside the Day 3 pages.

| Key | Current value | Re-review by |
|---|---|---|
| `forFamilies.lastReviewed` | `2026-05-21` | 2027-09 (annual cadence) |
| `faq.lastReviewed` | `2026-05-21` | 2027-09 |

### Oxygen-safety wording — confirm against Eminent's intake training

The `forFamilies.sections.basics.oxygen.safetyNote` uses the standard 5-foot / no-flames / no-petroleum-products / no-flow-rate-changes-without-instruction wording. Confirm this matches what Eminent's RNs actually teach at admission. If Eminent uses different specifics (e.g., 10-foot distance, different brand of concentrator with brand-specific guidance), update the key in EN + KO together.

## Korean Copy Polish (Day 7)

The Korean translations are drafted from the NotebookLM Korean source. A native-reviewer polish pass is scheduled for Day 7 of the build plan. Particular attention needed on:

- `home.levels.respite.title` (currently `임시 위탁 케어`) — the literal `휴식 케어` does not convey the Medicare regulatory meaning of short-term inpatient relief for the primary caregiver. The current choice is closer in meaning but should be reviewed against industry usage in Korean-American hospice marketing.
- Team role titles (`home.team.roles.*.name`) — confirm Korean professional titles match how the equivalent roles are described by Korean-American healthcare providers in LA County.
- Testimonial Korean — the placeholder above must be matched by a Korean rendering that reads naturally to a Korean-American family.
- **Day 3 regulatory terms** — `understandingHospice.*`, `hospiceLaws.*`, `insurance.*` Korean drafts use the hybrid convention `한국어 (English)` for branded/regulatory terms (Medicare, Medi-Cal, POLST, HIPAA, DPOA-HC, CFR citations). Native review should verify these read naturally and match Korean-American hospice industry usage. Particular attention: 룸 앤 보드 (Room & Board), 다학제 (interdisciplinary), 너싱홈/SNF, 종말기 (terminally ill) phrasing.
- **Day 6 form copy** — `contact.*`, `referral.*`, `common.formErrors.*`, `common.formPrivacyShort.*` Korean drafts use the same `한국어 (English)` convention for HIPAA, BAA, PHI, NPI, SNF, ALF, Medicare, Medi-Cal. Native review for natural reading on the Contact and Referral pages.

## Day 6 — Forms, security headers, vendor

### Environment / operational

`.env.example` lists every variable the Day 6 pipeline reads. The defaults in code keep the site usable without real keys (Resend send is skipped if `RESEND_API_KEY` is missing, Turnstile bypasses with the literal `dev-bypass` token in non-prod). Production deployment must provide real values.

| Env var | Day 6 default | Notes |
|---|---|---|
| `RESEND_API_KEY` | unset | Required for real email delivery. |
| `RESEND_FROM_EMAIL` | `Eminent Hospice <no-reply@example.com>` | Must be a verified Resend sender on a domain the client owns. |
| `CONTACT_TO_EMAIL` | unset | Inbox for Contact submissions. Live site uses `admin@eminenthospice.com` — confirm with client at deploy. |
| `REFERRAL_TO_EMAIL` | unset | Inbox for Referral submissions. Likely also `admin@eminenthospice.com` (only inbox on the live site) — confirm with client. |
| `HAS_BAA` | `false` | Flip to `true` only after a Business Associate Agreement (BAA) is signed with the email vendor. Requires a redeploy on Vercel. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | unset | Public site key for Cloudflare Turnstile. |
| `TURNSTILE_SECRET_KEY` | unset | Server-only secret. In dev only, the literal token `dev-bypass` is accepted when the secret is unset. |
| `PHI_RETENTION_DAYS` | `30` | Interpolated into the Mode B privacy snippet via `{days}`. Set to operational value. |

### Address — RESOLVED (2026-06-10)

Full office address (10999 Riverside Dr Ste 306, North Hollywood, CA 91602) applied to `common.address.*` and `aboutJsonLd.address.*` from the live site's Contact page.

### Rate limit storage

`src/lib/rate-limit.ts` is an in-memory per-process Map. Adequate for single-instance deploys. If the site horizontally scales, swap to Upstash Redis — the exported `checkRateLimit(key)` surface stays the same.

### Audit log sink

`runFormPipeline` logs non-PHI request metadata (opaque request ID + hashed IP + outcome) to `stdout`. Production deploy must route `stdout` to a HIPAA-eligible log sink for §164.312(b) audit trail.

### Forward links that 404 until Day 7

- HIPAA Notice of Privacy Practices link referenced in the Mode B privacy note text — page does not exist yet.
- Footer "Privacy Policy" link — page does not exist yet.

Day 6 deliberately does not include those links in the privacy snippet; once Day 7 ships, add them.

**Resolved Day 7:** the four legal pages (`/privacy`, `/hipaa-notice`, `/accessibility`, `/terms`) all ship today. The HIPAA Notice ships with an honest interim block — the route exists and is reachable, so the Mode B privacy snippet forward-link no longer 404s. Replacing the interim block with the client's final Notice text is a one-key edit in `messages/{en,ko}.json` `hipaaNotice.sections.interim.*` once the legal document is provided.

## Day 7 — SEO, legal pages, system routes

### Production env-var

| Env var | Day 7 default | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Set to the production canonical domain (e.g. `https://www.eminenthospice.com`) before deploy. Used by sitemap, robots, canonical URLs, hreflang, and OG image absolute URLs. Canonical URLs that resolve to `localhost` in production will cause Google Search Console to reject the property. |

### HIPAA Notice client text

The page at `/[locale]/hipaa-notice` ships with an interim block. When the client provides the final HIPAA Notice of Privacy Practices text, replace the `hipaaNotice.sections.interim.*` keys with canonical section keys (`uses`, `disclosures`, `patientRights`, `dutiesOfTheCoveredEntity`, `changesToNotice`, `complaints`, `contact`) in both `en.json` and `ko.json`. The `LongFormPage` shell on the page does not need to change.

### Day 5 NLM-grounded copy — verification status

The Day 5 NotebookLM-flagged keys (`forFamilies.sections.basics.{medications,oxygen,hygiene,eating}`, `forFamilies.sections.dyingProcess.{weeks,days,hours}`, `forFamilies.sections.wellness.burnoutSigns`, `faq.categories.aboutHospice.items.hastens.a`, `faq.categories.families.items.korean.a`) are drafted from industry-standard hospice caregiver guidance + cited Notebook 1 fragments (24, 25, 29, 32) + the Day 3 source attributions. The skill's `RESPONSE_SELECTORS` bug remains and a programmatic re-query was not attempted (would return the same wrong content per the Day 5 audit). **Ship status: launch-acceptable.** Optional pre-launch enhancement: open Notebook 1 in a browser, submit the four queries by hand, and adjust any key whose draft phrasing differs materially from the notebook source.

### Korean copy polish — verification status

The Day 7 polish pass reviewed every key listed in the "Korean Copy Polish (Day 7)" section above:
- `home.levels.respite.title` already uses the regulatory-meaning–correct `임시 위탁 케어`. **No change needed.**
- Team role titles (`home.team.roles.*.name`) use the hybrid `한국어 (English)` convention consistently across Days 2–6. **No change needed.**
- The illustrative testimonial Korean is paired correctly with the EN placeholder — both will be replaced together when the client provides the real, attributed quote.
- Day 3 regulatory terms (`룸 앤 보드`, `다학제`, `너싱홈/SNF`, `종말기`) follow the established hybrid convention. **No change needed.**
- Day 6 form copy (`contact.*`, `referral.*`, `common.formErrors.*`, `common.formPrivacyShort.*` KO) uses the same hybrid convention for HIPAA/BAA/PHI/NPI/SNF/ALF/Medicare/Medi-Cal. **No change needed.**

A formal native-reviewer pass remains available as a pre-launch enhancement — flag any key whose draft sounds machine-translated rather than naturally Korean-American.

### OG image — server-generated via `next/og`

The locale-aware OG image is generated at `/[locale]/opengraph-image` from `src/app/[locale]/opengraph-image.tsx`. It renders a 1200×630 PNG with brand colors and the locale-correct site name + tagline. If the client later delivers a branded OG asset (e.g. with the official logo), drop the PNG at `public/og-default.png` and override via per-page or layout `metadata.openGraph.images`.

### Logo files — RESOLVED (2026-06-10)

Logo pulled from the live site CDN → `public/images/logo.png`, wired into both JSON-LD components; `src/app/icon.png` + `src/app/apple-icon.png` generated from the logo mark. Optional upgrade: ask the client for a higher-resolution, transparent-background original (current file is 479×174 with a white background, fine for structured data and favicons, not ideal for the header).

### Analytics — deferred, gated on client decision

If client picks Plausible or Vercel Analytics (cookieless), wire up via the layout — no CCPA banner needed. If client picks Google Analytics 4, a CCPA banner + "Do Not Sell or Share My Personal Information" link become required, and the Privacy Policy `privacy.sections.dataCollected.cookies` + `privacy.sections.rights.ccpa.*` keys need a small edit to acknowledge the tracker.

### Production deploy checklist (pre-launch)

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production canonical domain.
- [ ] Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `REFERRAL_TO_EMAIL` to client-confirmed values.
- [ ] Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` to real Cloudflare Turnstile keys.
- [ ] Confirm `HAS_BAA` decision with client (default `false` → Mode A; flip to `true` only after BAA signed).
- [ ] Confirm `PHI_RETENTION_DAYS` operational value.
- [ ] Verify production headers via [securityheaders.com](https://securityheaders.com) after first deploy.
- [ ] Submit sitemap to Google Search Console once the production domain is verified.
- [ ] Route stdout to a HIPAA-eligible log sink for §164.312(b) audit trail.
- [ ] Run Lighthouse on each page in production (28 audits) and confirm Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
