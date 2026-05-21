# 7-Day Development Plan — Eminent Hospice Care Website

## Tech Stack (locked-in versions)
- **Next.js 14.2.35** (App Router) — SSG/SSR for SEO, file-based routing
- **TypeScript 5**, **Tailwind CSS 3.4**
- **next-intl 4.12.0** — bilingual routing (`/en/…`, `/ko/…`), URL-based locale, file-based message catalogs
- **React Hook Form + Zod** (Day 6) — typed form validation, server-side schema reuse
- **Form delivery — DECISION REQUIRED** (see Day 6): default plan is **Resend with a signed BAA** (HIPAA-compliant transactional email). Formspree free tier is **not HIPAA-compliant** and is unacceptable for the Referral form because it transmits PHI. If client cannot sign a BAA with any provider before Day 6, the Referral form must either (a) require phone-only intake instead, or (b) collect *only* non-PHI (name + contact) and route caregivers to call back for the rest.

---

## Security, Privacy & Compliance (read before Day 6)

Hospice = a HIPAA-covered entity. Anything that collects diagnosis, condition, medication, insurance ID, or other identifiable health data is **PHI**. The website is the front door — design accordingly.

**Non-negotiables (cross-cutting, allocated across days):**

1. **HIPAA path for Referral form** (Day 6) — BAA in place with the email/form vendor, encrypted transit (TLS 1.2+), minimum-necessary data, audit log retained per HIPAA §164.312. Confirm with client which entity signs the BAA before Day 6 starts.
2. **Security headers in `next.config.mjs`** (Day 1 add-on or Day 7) — CSP (script-src self + Google Fonts + form vendor), `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, HSTS in production headers.
3. **Bot / abuse protection on forms** (Day 6) — Cloudflare Turnstile (free, privacy-friendly) **or** hCaptcha; plus honeypot field; plus rate limit (Vercel middleware or Upstash Redis).
4. **Server-side validation only** (Day 6) — Zod schema validates on the form action route; never trust client.
5. **Secrets** — `.env.local` (gitignored) for keys; production secrets in deploy host's env-var vault. Verify `.gitignore` covers `.env*` (Day 1 retro-check).
6. **Legal / disclosure pages** (Day 6 or 7) — Privacy Policy, HIPAA Notice of Privacy Practices (client-provided), Accessibility Statement, Terms of Use. Link from Footer.
7. **Educational-content disclaimer** (Days 3, 4) — Insurance/eligibility pages display: "This information is general education, not legal or insurance advice. Coverage decisions are made by Medicare/Medi-Cal and your physician."
8. **California-resident notice** (Day 7) — CCPA/CPRA "Do Not Sell or Share My Personal Information" link (only if any tracking/analytics is added; if site is fully cookie-free, document that fact in Privacy Policy).
9. **Email address verification** — `info@eminentHospice.com` (camelCase) in Day 1 footer is unusual; confirm correct value with client before Day 6 form-target wiring.

---

## Documentation & Source Alignment

- `instructions.md` defines the 10 core pages and bilingual EN/KO requirement.
- `requirements.md` proposed-sitemap lists 6 pages — this plan **intentionally expands to 10** to satisfy the hospice-specific educational mandate in `instructions.md` (Patient Rights, Family Resources, Insurance, etc.).
- `notebooklm.md` notebook 1 (Website & Educational Content) feeds page copy; notebook 2 (Regulations & Medicare) feeds the legal/insurance pages.
- `day1-plan.md` and `day2-plan.md` are the executed implementation specs for those days.

---

## Day 1 — Project Setup & Design System ✅ COMPLETE
**Goal:** Runnable scaffold with the visual foundation locked in.

- ✅ Initialize Next.js 14.2.35 with TypeScript + Tailwind
- ✅ Install and configure `next-intl@4.12.0` for EN/KO routing (`/en/…` and `/ko/…`)
- ✅ Create translation files: `messages/en.json`, `messages/ko.json` (placeholder strings)
- ✅ Build shared components: `<Header>` (with EN/한국어 toggle), `<Footer>`, `<Layout>`
- ✅ Define design tokens in `tailwind.config.ts`: calming palette (soft blues, whites, warm grays), Playfair Display + Inter font pairing
- ✅ Verify bilingual toggle works and routes switch correctly

**Day 1 retro-checks to add early in Day 2:**
- Verify `.gitignore` covers `.env*`, `.next/`, `node_modules/`, `.vercel/`.
- Add security headers to `next.config.mjs` now (rather than waiting for Day 7) — they're trivial to add and immediately protect the dev domain.

---

## Day 2 — Home Page  *(detailed plan in `day2-plan.md`)*
**Goal:** The most important page — first impression for patients and families.

- 7-section narrative: Hero → Philosophy → 4 Levels of Care → IDG Team → Who We Serve → Testimonial → Final CTA
- Source copy from NotebookLM notebook 1 (philosophy, levels of care, IDG composition)
- **KO drafted same day** alongside EN — quality polish on Day 7
- Build `SectionContainer` + `Icon` primitives for reuse Days 3–6
- **Add security headers to `next.config.mjs` here** (pulled forward from Day 7)
- Track placeholder copy (testimonial, phone) in `messages/PLACEHOLDERS.md`

---

## Day 3 — Informational Pages (3 pages)
**Goal:** The educational core — builds trust and authority.

- **Understanding Hospice Care** — what hospice is, myths vs. facts, eligibility (physician certification + ≤6-month prognosis), what to expect
- **Hospice Laws & Patient Rights** — Medicare Conditions of Participation, patient rights, advance directives (Living Will, DPOA)
- **Insurance & Medicare Information** — Medicare Part A, Medi-Cal, FY2026 rates, coverage details
- Source content from NotebookLM notebook 2 (Hospice Regulations, Medicare & Compliance)
- **All three pages display the educational-content disclaimer** (see Security & Compliance §7)
- **FY2026 payment rates** are time-sensitive — cite source date and link to CMS, plan a yearly review reminder
- Build a `LongFormPage` layout component (main + sidebar) — reused by Day 4 + Day 5 pages
- KO copy drafted same day; quality polish on Day 7
- **Day 3 is the heaviest content day** — if time pressure, ship Understanding + Insurance first, push Laws & Patient Rights to Day 4 morning

---

## Day 4 — About & Services Pages (2 pages)
**Goal:** Build organizational credibility and explain the offering.

- **About Us** — mission, values, founding story, interdisciplinary team profiles, LA County service area, **bilingual cultural-competence statement** (English / 한국어 / Korean-American community)
- **Hospice Services** — all services detailed: nursing, social work, chaplain, aide, bereavement, volunteer; 4 levels of care (cross-link to Day 2 cards)
- Reuse `LongFormPage` from Day 3
- KO copy drafted same day
- About Us is also where to embed JSON-LD `Organization` structured data (full address, phone, opening hours) — search engines use this for local-pack ranking

---

## Day 5 — Family Resources & FAQ (2 pages)
**Goal:** Support the people making the hardest decisions.

- **For Families & Caregivers** — caregiver guides, what to expect during the dying process, medication management, oxygen-concentrator basics, burnout prevention, grief / bereavement support (source: NotebookLM frag 25–32)
- **FAQ** — accordion-style Q&A pulled from NotebookLM myth-busting content (frag 24); use `<details>`/`<summary>` for native a11y or a headless-UI disclosure with proper aria
- Embed JSON-LD `FAQPage` structured data on the FAQ page — Google may surface answers as rich results
- KO copy drafted same day
- **Client copy-review checkpoint** — at end of Day 5, all content pages have draft EN+KO copy; send to client for sign-off before Day 6 starts so Day 7 polish isn't blocked

---

## Day 6 — Contact & Referral Forms (2 pages)
**Goal:** Convert visitors into consultations and referrals — *without breaking HIPAA*.

- **Contact Us** — phone, email, address, hours; contact form (name + email + phone + message — **no PHI**); Google Maps embed (use `<iframe>` with `loading="lazy"` and `referrerpolicy="no-referrer-when-downgrade"`; consider Maps Static API to avoid embedding cookies).
- **Referral Form** — patient info, diagnosis, referring physician, insurance, urgency — **this collects PHI** and is the HIPAA-critical surface.

**HIPAA-compliant referral implementation:**
1. **Vendor with signed BAA** (default: Resend with BAA, or Twilio SendGrid with BAA, or a HIPAA-eligible AWS SES setup). Formspree free tier is **not acceptable** here.
2. **TLS-only transmission**, encrypted-at-rest at vendor.
3. **Server-side Zod validation** in a Next.js Route Handler (`app/api/referral/route.ts`) — never trust client.
4. **Minimum-necessary fields** — drop anything the office doesn't actually use.
5. **CAPTCHA** (Cloudflare Turnstile recommended — free, no cookie) + **honeypot field** + **per-IP rate limit** (Vercel Edge Middleware or Upstash Redis).
6. **No PHI in logs** — strip body before any `console.log` or error-reporter capture; configure Sentry/etc. with `beforeSend` scrubbing if used.
7. **Confirmation page does NOT echo PHI back** — show "Referral received, we'll be in touch within 24h" only.
8. **Retention** — vendor retention policy ≤ what HIPAA §164.530(j) requires; document.

**Fallback if no BAA available by Day 6:** ship Referral as "Call (XXX) XXX-XXXX to refer a patient" + a non-PHI contact form to schedule a callback. Better than illegal PHI transmission.

**Both forms:**
- React Hook Form + Zod, shared schema between client and server.
- Submit buttons disabled while pending, success/error states announced via `aria-live="polite"`.
- All fields keyboard-reachable, labeled, error messages associated via `aria-describedby`.

---

## Day 7 — SEO, Polish, Legal & Launch Prep
**Goal:** Production-ready — bilingual, searchable, accessible, fast, and legally sound.

**Korean polish (not first-draft)** — KO was drafted per page on Days 2–6; today is native-reviewer pass / consistency cleanup. Pay special attention to hospice-regulatory terminology (e.g. Respite Care = "임시 위탁 케어" not literal "휴식 케어").

**SEO:**
- Per-page metadata: `<title>`, description, Open Graph tags, Twitter cards — all locale-specific via `generateMetadata`.
- **hreflang tags** on every page: `en-US`, `ko-KR`, `x-default` — critical for bilingual SEO; otherwise Google may merge or wrong-language-index.
- `sitemap.xml` (use `next-sitemap` or `app/sitemap.ts`) covering both `/en/*` and `/ko/*` URLs.
- `robots.txt` allowing crawl, pointing to sitemap.
- **JSON-LD structured data**: `MedicalOrganization` / `LocalBusiness` on Home + About; `FAQPage` on FAQ.

**Accessibility:**
- WCAG 2.1 AA pass: alt text, aria-labels, color contrast ≥ 4.5:1 body / 3:1 large text, keyboard navigation, focus order, skip-link works.
- Axe DevTools / Lighthouse a11y ≥ 95 per page.
- Korean text rendering check on Windows/Android (some fonts lack Hangul coverage).

**Performance budget:**
- LCP < 2.5s on 4G, INP < 200ms, CLS < 0.1.
- Image optimization via `next/image`, `priority` only on hero, `loading="lazy"` elsewhere.
- Bundle size cap: First Load JS < 200 KB per route.

**UX safety nets:**
- `app/not-found.tsx` — bilingual 404.
- `app/error.tsx` — bilingual error boundary.
- `app/loading.tsx` — skeleton/spinner for slow nav.
- Favicon, `apple-touch-icon.png`, `og-default.png` (1200×630).

**Legal pages (linked from Footer):**
- Privacy Policy (must cover CCPA/CPRA, what data is collected, retention, contact for requests).
- HIPAA Notice of Privacy Practices (client provides text; we render).
- Accessibility Statement.
- Terms of Use.

**Deployment:**
- Confirm hosting target with client (`requirements.md` §3.5: "Eminent will provide"). Recommended: Vercel (free SSL, edge caching, env-var vault).
- Production env-vars set: form vendor API key, Turnstile site/secret keys.
- Verify security headers active in production (test via `securityheaders.com`).

**Final QA checklist (manual):**
- [ ] All 10 pages render in EN and KO without console errors
- [ ] Contact form submits → email received → success page shown
- [ ] Referral form submits → email received via HIPAA-compliant channel → success page shown (no PHI echo)
- [ ] Language toggle persists section structure across all pages
- [ ] All footer legal links resolve
- [ ] Tab order is logical on every page
- [ ] Mobile (375px), tablet (768px), desktop (1280px) all render clean
- [ ] Robots.txt + sitemap.xml accessible
- [ ] Lighthouse scores: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95

---

## Pages Checklist (10 core + 4 legal/utility)
**Core (per `instructions.md`):**
- [ ] Home  *(Day 2)*
- [ ] About Us  *(Day 4)*
- [ ] Hospice Services  *(Day 4)*
- [ ] Understanding Hospice Care  *(Day 3)*
- [ ] Hospice Laws & Patient Rights  *(Day 3)*
- [ ] For Families & Caregivers  *(Day 5)*
- [ ] Insurance & Medicare Information  *(Day 3)*
- [ ] FAQ  *(Day 5)*
- [ ] Contact Us  *(Day 6)*
- [ ] Referral Form  *(Day 6)*

**Legal / utility (Day 7):**
- [ ] Privacy Policy
- [ ] HIPAA Notice of Privacy Practices  *(client-provided copy)*
- [ ] Accessibility Statement
- [ ] Terms of Use
- [ ] `not-found.tsx`, `error.tsx`, `loading.tsx`

---

## Open Questions for Client (resolve before Day 6 starts)

1. **HIPAA**: who signs the BAA for the form vendor — Eminent or the developer? Which vendor is approved?
2. **Office phone number** — real `tel:` URL and display format (currently `(XXX) XXX-XXXX` placeholder).
3. **Office email** — confirm `info@eminentHospice.com` (the camelCase is unusual; verify spelling).
4. **Office address** — full mailing address for Footer + JSON-LD structured data.
5. **Logo files (PNG/SVG)** — pending per `requirements.md` §3.2.
6. **Photography** — staff photos for About, hero imagery for Home (or approval to use stock).
7. **HIPAA Notice of Privacy Practices** — client must provide final text (legal document).
8. **Real testimonial quotes** — with patient/family consent in writing (HIPAA marketing rules apply even for testimonials).
9. **Hosting target** — Vercel (recommended) or other? Required before Day 7 deploy step.
10. **Analytics preference** — Google Analytics 4, Plausible (cookieless), Vercel Analytics, or none?

---

## Risks (highest-impact first)

| Risk | Impact | Mitigation |
|---|---|---|
| **Referral form ships without BAA** | Legal liability (HIPAA violations $100–$50K per record; willful neglect up to $1.5M/year) | Day 6 hard-gate: no PHI form goes live without signed BAA. Fallback: phone-only intake. |
| KO copy quality below native-speaker bar | User trust loss in Korean-American community | Draft KO per page Days 2–6, native review Day 7. Don't defer all KO to one day. |
| FY2026 Medicare rates change after publish | Outdated/incorrect insurance info | Cite source + date; add a 12-month review reminder; mark page with "Last reviewed: YYYY-MM". |
| Client copy not approved by Day 6 | Day 7 polish blocked | Send Days 2–5 drafts for review at end of Day 5 (built into Day 5 plan). |
| Hosting/deployment target unconfirmed | Day 7 launch slips | Surface in Open Questions; force decision by end of Day 5. |
| Logo / photography never arrives | Site looks placeholder at launch | Hero gradient placeholder structured for 1-line swap; site is launchable without — text branding works. |
| Form vendor downtime | Lost referrals | Display office phone prominently on both form pages; consider Edge function with retry. |
