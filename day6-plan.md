# Day 6 Implementation Plan — Contact Us & Referral Form (2 pages + form pipeline)

> **File location note:** After approval, copy this file to `C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE\day6-plan.md` to match the `day1-plan.md` … `day5-plan.md` convention.

---

## Context

Days 1–5 are complete: scaffold + design system (Day 1), Home (Day 2), the three educational pages — Understanding Hospice, Hospice Laws, Insurance — (Day 3), the two organizational pages — About + Services — (Day 4), and the two family-support pages — For Families + FAQ — (Day 5). Eight of the ten core pages now ship.

Day 6 closes the conversion layer: the **two pages a visitor lands on when they have decided to act** — Contact Us (for questions and general inquiry) and Referral Form (for clinicians and family members starting an admission). It is the **first day that touches the network in both directions** — until now the site has been pure SSG/SSR with zero outbound traffic.

**Pages built today:**
1. **Contact Us** — `/[locale]/contact` — phone / email / hours / address, a non-PHI contact form (name + email + phone + message), text-card directions block linking out to Google Maps. **No PHI**, no BAA gate.
2. **Referral Form** — `/[locale]/referral` — the HIPAA-sensitive intake surface. Ships in one of two modes depending on whether a BAA is in place at implementation time:
   - **Mode A (no BAA, default):** phone-first design + a non-PHI "request a callback" form (referrer name, referrer phone, referrer email, best time to call). No diagnosis, no patient identifiers, no insurance IDs collected online.
   - **Mode B (BAA signed):** the full referral intake — patient info, diagnosis, referring physician, insurance, urgency — gated behind a server-side feature flag (`HAS_BAA=true`).
   - Mode is selected at runtime by a single env var, so flipping when the BAA arrives is a config change, not a redeploy of new code.

**Source alignment:**
- **`7-day-plan.md` Day 6:** Locks in React Hook Form + Zod, BAA-gated vendor (default Resend, alternatives SendGrid / SES), TLS-only, server-side Zod validation in `app/api/referral/route.ts`, Cloudflare Turnstile + honeypot + rate limit, no PHI in logs, retention policy documented, confirmation page does not echo PHI. Explicit fallback: "if no BAA by Day 6, ship Referral as phone-only / callback-form intake."
- **`7-day-plan.md` Security & Compliance §2:** security headers in `next.config.mjs` were scheduled for **Day 1 add-on or Day 2** but are **still absent** as of 2026-05-21. Day 6 picks this up — forms ride on the headers so they belong together.
- **`instructions.md`:** core pages 9 and 10 — both shipped today. "Easy integration of contact forms, referral requests, and consultation scheduling" is named explicitly under Design Direction.
- **`requirements.md` §3.4:** "Inquiry form (required fields and workflow)" is the only functional requirement on the document.
- **`day1-plan.md` … `day5-plan.md`:** established `LongFormPage`, `PageSidebar`, `Disclaimer`, `Icon`, `SectionContainer`, `PageBottomCta`, the `common.phone.*` keys, the `common.relatedPages.links.contact` and `.referral` keys, and the Header/Footer nav entries `/contact` and `/referral` that **currently 404**. Day 6 lights them up.

**Reuse from Days 1–5 (do not re-create):**
- `@/i18n/navigation` — `Link`, `usePathname`, `useRouter`, `redirect`
- `useTranslations` (sync, server) and `getTranslations` (async, only inside `generateMetadata`)
- `@/components/ui/SectionContainer` (Day 2)
- `@/components/ui/Icon` — 23-icon registry (`phone`, `mapPin`, `check`, `shield`, `info`, `chat`, `users`, `arrowRight`, `document`, `calendar` all already present; **add 1 new icon `mail`** for the contact-info card)
- `@/components/ui/Disclaimer` (Day 5 — `variant` prop; not used on Day 6 because forms don't carry the educational disclaimer)
- `@/components/info/PageBottomCta` (Day 3) — reused at the bottom of Contact but **not Referral** (Referral is itself a conversion surface; a second CTA below would dilute focus)
- All Tailwind tokens — `primary-*`, `neutral-warm/cream`, `success`, `warning`, `error`, `text-primary/secondary/muted`, `max-w-content/prose`, `px-section-x`, `py-section-y`, `rounded-card/btn`, `shadow-card/header`, `transitionDuration: ui`
- `common.phone.{display, tel}` — single source for office phone (still a placeholder per `messages/PLACEHOLDERS.md`)
- `<Header>` / `<Footer>` — `/contact` and `/referral` are already in both nav arrays

**Out of scope for Day 6 (defer to Day 7):**
- Privacy Policy, HIPAA Notice of Privacy Practices, Accessibility Statement, Terms of Use (full pages). Day 6 ships **inline form-data privacy notices** inside the Contact and Referral pages that cover the data those specific forms collect. The full legal pages, footer legal links, and a global Privacy Policy land on Day 7.
- `app/not-found.tsx`, `app/error.tsx`, `app/loading.tsx`
- `hreflang`, `sitemap.xml`, `robots.txt`, `MedicalOrganization` JSON-LD on Home, `LocalBusiness` JSON-LD
- Native Korean reviewer polish (Day 7)
- Real photography / hero imagery
- Analytics / tracking — site remains cookie-free through Day 6
- CCPA "Do Not Sell or Share" link — only needed if tracking is added; site remains cookie-free
- The Day 7 cleanup item that consolidates `home.finalCta.phoneNumber*` / `footer.phone` / `common.phone.*` into one source (tracked in `PLACEHOLDERS.md`)

---

## Goals & Acceptance Criteria

A visitor opening either Day 6 page sees:
1. A clear, locale-correct `<h1>` and `<meta description>` (Lighthouse SEO ≥ 95).
2. A focused single-column layout (not the two-column long-form pattern from Days 3–5) — these pages exist to drive an action, not to be read.
3. **Phone first.** Both pages put the office phone number above the fold as a tappable `tel:` link — calling is always a valid alternative to the form. For Referral Mode A this is the **primary** action.
4. An **inline form-privacy snippet** above the submit button explaining: what is collected, where it is sent, how long it is retained, that submission does not establish a hospice relationship, and (Referral only) the PHI handling commitment when applicable.
5. Cross-page navigation: each page links to the other, plus Home and the most relevant upstream content page (Insurance from Contact, Services from Referral).
6. Full EN + KO translations; both routes (`/en/...` and `/ko/...`) render correctly.
7. **No PHI in URLs**, no PHI in `console.log`, no PHI in network DevTools `GET` parameters — every PHI transit is `POST application/json` over TLS.
8. **Working submit pipeline** end-to-end:
   - Client validates with Zod via React Hook Form
   - Submit POSTs to `app/api/{contact|referral}/route.ts`
   - Route handler verifies Turnstile token + honeypot + per-IP rate limit, re-validates the same Zod schema (single source of truth), sends email via vendor
   - JSON success response triggers a confirmation view; JSON error response surfaces a non-PHI error message via `aria-live="polite"`
   - **No page navigation on success** — the form unmounts and a confirmation block mounts in its place (preserves URL, no risk of stale form data in browser back/forward)

**Pass criteria:**
- Zero TypeScript / lint errors (`npx tsc --noEmit`, `npm run lint`).
- Exactly one `<h1>` per page; section headings start at `<h2>`.
- All copy lives in `messages/*.json`; no inline English in `.tsx`. Zod schemas use translated error messages via the `common.formErrors.*` keys.
- Tailwind tokens only; no raw hex.
- Mobile-first at 375 / 768 / 1280 widths; form fields are full-width on mobile, two-column where it makes sense on tablet+.
- All form fields ≥ 44 × 44 px tappable, with visible focus ring (`focus-visible:ring-2 focus-visible:ring-primary-500 ring-offset-2`).
- Every input has an associated `<label>` (not placeholder-as-label); errors are announced via `aria-describedby` pointing at a `role="alert"` message; the form submit state is announced via `aria-live="polite"`.
- Submit button is `disabled` while pending and visually distinct from its normal state.
- **No new client-component boundaries beyond the two form bodies and the Turnstile widget.** Everything else stays server-rendered.
- Lighthouse a11y ≥ 95 per page.
- Header nav highlights `/contact` and `/referral` correctly when active.
- Security headers present on every response (verified via `curl -I` and securityheaders.com once deployed).
- Forms cannot be submitted without a valid Turnstile token (server checks Turnstile API; failure returns 400 with non-PHI error).
- Honeypot field is hidden from sighted + screen-reader users; a populated honeypot returns 200 silently (no error — denies bots an oracle) while not actually sending email. Document this in code via a one-line comment so a future reviewer knows the silence is intentional.
- Rate limit is per-IP, 5 requests / 10 min (configurable); exceeding returns 429 with `Retry-After` header.

---

## Architecture Decisions

Recorded in the plan so the implementer does not need to re-deliberate.

### 1. Form library: **React Hook Form + Zod**

Per `7-day-plan.md` Day 6 lock-in. Single schema lives in `src/lib/{contact|referral}-schema.ts` and is imported by both the client form component and the server route handler. RHF's `zodResolver` handles client-side; the route handler calls `schema.safeParse(await req.json())` on the same schema.

**Why a shared file (not a Zod schema defined inline in each):** if a field is added to the client form but not the server validator (or vice versa), the type system catches it because both import the same `InferType` / `z.infer`. Defining schemas in `src/lib/` (not inside the page or the route) prevents accidental tree-shaking surprises and gives both server bundle and client bundle a single place to import from.

### 2. Form-submission delivery: **POST to a Next.js Route Handler** (not a Server Action)

`app/api/contact/route.ts` and `app/api/referral/route.ts` are Next.js Route Handlers (App Router). Reasons over Server Actions:
- Server Actions in 14.2.x require `'use server'` and ship more client-side glue. Route handlers are leaner for `application/json` form submissions.
- Route Handlers can return explicit `Response` objects with custom headers (`Retry-After` on rate-limit, `Cache-Control: no-store` on confirmation) — easier to reason about.
- The 7-day plan explicitly names `app/api/referral/route.ts`.

**Inside the handler:**
1. Check `Content-Type: application/json` — reject otherwise.
2. Parse body; if JSON parse fails, return 400 with generic error.
3. Check honeypot — if populated, return 200 with `{ ok: true }` but **do not** send email.
4. Per-IP rate-limit check (see §5).
5. Verify Turnstile token (see §6).
6. Re-validate body against the same Zod schema the client used.
7. Send email via vendor (see §3).
8. Return `{ ok: true }` on success or `{ ok: false, error: <i18n key> }` on failure.
9. **Never log the body.** Catch errors with a `catch` that logs `error.message` and an opaque request ID only.

### 3. Email vendor: **Resend (default)** with signed BAA

Per `7-day-plan.md`. Resend offers BAA on its Pro plan. Alternatives: Twilio SendGrid (also BAA on Pro), AWS SES (HIPAA-eligible). The implementation hides the vendor behind `src/lib/mail.ts` so swapping vendors is a one-file change.

**Day 6 ships the Resend integration path.** If the client cannot complete a BAA with any vendor before implementation, Mode A (no-BAA fallback) is the default and the email send for Referral is replaced with a "best time to call back" handoff that does **not** transmit PHI. The Contact form (which never carries PHI) can use Resend's free tier without a BAA — but in practice, having one Resend account on the Pro+BAA plan covers both forms cleanly.

**Env vars (set in `.env.local` for dev, in deploy host vault for prod):**

```
RESEND_API_KEY=re_…
CONTACT_TO_EMAIL=info@eminentHospice.com
REFERRAL_TO_EMAIL=referrals@eminentHospice.com   # may be the same address; client confirms
HAS_BAA=false                                     # flip to true when BAA signed
TURNSTILE_SITE_KEY=…                              # public, exposed via NEXT_PUBLIC_*
NEXT_PUBLIC_TURNSTILE_SITE_KEY=…                  # same value, public exposure
TURNSTILE_SECRET_KEY=…                            # server-only
```

**Email content:**
- Contact email subject: `New website inquiry — {name}` (no quoted user data in subject).
- Referral email subject (Mode B): `New referral — {patient initials}` (initials only, not full name, to keep email subject auditable without PHI bleeding into mail logs).
- Body: plain-text + minimal HTML; PHI fields rendered inside a `<table>` with explicit `aria-` not needed for email.
- `From:` address is a verified domain Resend identity; `Reply-To:` is the submitter's email so the office can reply directly.

### 4. Bot / abuse protection: **Cloudflare Turnstile + honeypot + per-IP rate limit**

- **Turnstile** — free, privacy-friendly (no cookies until interaction), invisible mode by default. Renders via a Turnstile React wrapper. **Site key is public** (exposed via `NEXT_PUBLIC_TURNSTILE_SITE_KEY`); **secret key stays server-only**.
- **Honeypot** — a text input named `companyWebsite` (a field a human would not fill but a naive bot will). Hidden via `aria-hidden`, `tabIndex={-1}`, off-screen via `position: absolute; left: -9999px`. If populated, server returns 200 silently.
- **Rate limit** — 5 requests / 10 minutes per IP. Day 6 ships an **in-memory map** (`src/lib/rate-limit.ts`) keyed by IP, with TTL eviction. This works on a single Vercel serverless instance; if the project scales beyond one instance, swap to Upstash Redis (one-file change). Document the upgrade path in a code comment.

### 5. Map embed: **text-card + external Google Maps link** (no iframe, no cookies)

The 7-day plan suggests `<iframe>` with `loading="lazy"` and `referrerpolicy="no-referrer-when-downgrade"`, but notes the Maps Static API alternative. Day 6 chooses the **simplest cookie-free option**:

```
[address text + Get directions →] → opens https://www.google.com/maps?q=<URL-encoded address>
```

No iframe, no script, no cookies. The user clicks through to Google Maps in a new tab when they want directions. This keeps the site **fully cookie-free** through Day 6, which means CCPA-§8 of the 7-day plan ("Do Not Sell or Share" link) is not yet required.

**If client later insists on an embedded map:** swap `MapCard.tsx` to use Maps Static API (server-rendered PNG, no script, no cookies — small per-request cost via API key) or the iframe option. The plan's `MapCard.tsx` is the only file that would change.

### 6. Confirmation behavior: **inline state swap, not navigation**

On successful submit, the form unmounts and a confirmation block mounts in its place. Reasons:
- **No PHI in URL.** A `redirect('/contact/thank-you?name=John')` style flow leaks data into browser history and analytics.
- **Refresh-safe.** The user can refresh the page after submission without re-posting.
- **a11y.** Confirmation block has `role="status"` and is the first focusable element so screen readers announce completion.

The confirmation does **not echo back PHI**. It reads (Contact): "Thank you — we've received your message and will be in touch within one business day." For Referral Mode A: "Thank you — we've received your callback request. A care coordinator will call within one business day." For Referral Mode B: "Thank you — the referral has been securely transmitted to our admissions team. A coordinator will follow up within 24 hours."

### 7. Layout: **inline, not `LongFormPage`**

Days 3–5 used `LongFormPage` because the pages were prose. Day 6's pages are **forms with surrounding context** — different layout needs. Each page composes `SectionContainer` + an `<h1>` + a 2-column desktop grid (form on the left, info card on the right) that collapses to 1 column on mobile. No new shell primitive needed.

---

## Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| `package.json` | **Edit** — add `react-hook-form`, `@hookform/resolvers`, `zod`, `resend` | Install runtime deps |
| `messages/en.json` | **Edit** — add `contact`, `referral` namespaces; `common.formErrors`; `common.formPrivacyShort`; `common.formSuccess.*` | All Day 6 copy |
| `messages/ko.json` | **Edit** — mirror in Korean (drafts; Day 7 polish) | Bilingual parity |
| `messages/PLACEHOLDERS.md` | **Edit** — append Day 6 entries (BAA status, vendor choice, real `info@`/`referrals@` emails, retention period number) | Track for client |
| `next.config.mjs` | **Edit** — add `headers()` exporting CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS (prod only) | **Overdue from Day 2** + needed for forms |
| `.env.example` | **Create** | Document required env vars (no real secrets) |
| `src/components/ui/Icon.tsx` | **Edit** — add `mail` icon | Contact info card |
| `src/lib/contact-schema.ts` | **Create** | Zod schema — shared client/server |
| `src/lib/referral-schema.ts` | **Create** | Zod schema with Mode A / Mode B discriminated union |
| `src/lib/rate-limit.ts` | **Create** | In-memory per-IP rate limiter |
| `src/lib/turnstile.ts` | **Create** | Server-side Turnstile verify |
| `src/lib/mail.ts` | **Create** | Resend wrapper; PHI-scrubbed error helper |
| `src/lib/form-pipeline.ts` | **Create** | Shared `runFormPipeline({ honeypot, turnstileToken, ip, schema, body, send })` |
| `src/components/ui/FormField.tsx` | **Create** | Server component — label + input + error + `aria-describedby` glue |
| `src/components/ui/FormTextarea.tsx` | **Create** | Same as above for `<textarea>` |
| `src/components/ui/FormSelect.tsx` | **Create** | Same for `<select>` (urgency, referrer type, etc.) |
| `src/components/ui/Turnstile.tsx` | **Create** | `'use client'` — Cloudflare widget wrapper, lazy-loads script |
| `src/components/ui/FormPrivacyNotice.tsx` | **Create** | Server — inline privacy snippet above submit |
| `src/components/ui/FormSuccess.tsx` | **Create** | Server — confirmation block with `role="status"` |
| `src/components/contact/ContactForm.tsx` | **Create** | `'use client'` — RHF + Zod, calls `/api/contact` |
| `src/components/contact/ContactInfoCard.tsx` | **Create** | Server — phone / email / hours / address column |
| `src/components/contact/MapCard.tsx` | **Create** | Server — address + external Google Maps link |
| `src/components/referral/ReferralPhoneFirst.tsx` | **Create** | Server — Mode A primary block (big phone CTA + non-PHI callback form mounted client-side beneath) |
| `src/components/referral/ReferralCallbackForm.tsx` | **Create** | `'use client'` — Mode A non-PHI form, POSTs to `/api/referral` |
| `src/components/referral/ReferralFullForm.tsx` | **Create** | `'use client'` — Mode B full PHI form, POSTs to `/api/referral` |
| `src/components/referral/ReferralTrustStrip.tsx` | **Create** | Server — HIPAA / BAA / TLS reassurance badges (visible only in Mode B) |
| `src/app/api/contact/route.ts` | **Create** | POST handler — pipeline + send |
| `src/app/api/referral/route.ts` | **Create** | POST handler — branches on `HAS_BAA` for which schema/email to dispatch |
| `src/app/[locale]/contact/page.tsx` | **Create** | Route + `generateMetadata` |
| `src/app/[locale]/referral/page.tsx` | **Create** | Route + `generateMetadata`; reads `HAS_BAA` at module top |

**Folder convention:**
- `src/components/contact/` and `src/components/referral/` — **new** for Day 6
- `src/lib/` — **new** for Day 6 (first need for server-only modules used outside `components/`)
- `src/app/api/` — **new** for Day 6 (first network endpoints)

---

## Security Headers (overdue from Day 2)

**File:** `next.config.mjs`

Add an `async headers()` export. Headers apply to every response.

```js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // HSTS only in production — preload + 1-year max-age. Skipped in dev so a local cert mistake doesn't lock the dev domain.
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
  // CSP — locked-down. Allow Tailwind inline styles, Google Fonts CSS+font origins, Turnstile, and the Resend ingest (form POSTs are same-origin).
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "frame-src https://challenges.cloudflare.com",
      "connect-src 'self' https://challenges.cloudflare.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

// In nextConfig:
async headers() {
  return [{ source: '/:path*', headers: securityHeaders }];
}
```

**Notes:**
- `'unsafe-inline'` on `script-src` is required for Next.js's inlined route hydration data. Investigated nonce-based CSP for App Router — feasible but adds a per-request middleware that breaks SSG caching. Defer nonce migration to Day 7 or post-launch.
- `'unsafe-inline'` on `style-src` is required for Tailwind's hashed class strings + Next inline `<style>` injections.
- `frame-ancestors 'none'` duplicates `X-Frame-Options: DENY` for older browsers.
- If a map iframe is added later, `frame-src` needs `https://www.google.com`.

**Verification:** after `npm run dev`, `curl -sI http://localhost:3000/en | findstr -i "csp policy frame referrer"`.

---

## Page 1 — Contact Us

**Route:** `/[locale]/contact`
**Disclaimer:** none (forms do not carry the educational disclaimer).
**Last reviewed:** not stamped (not regulatory content).

### Section outline

1. **`<h1>` + intro paragraph** — "Have a question? We're here to listen." A reassuring 2-sentence intro that surfaces phone as a valid alternative ("Call us 24/7 at {phone} or send a message below").

2. **Two-column desktop / one-column mobile body** —
   - **Left (form, 60% on `lg`):**
     - `<ContactForm />` — fields: full name, email, phone (optional), subject (select: General question / Insurance question / Volunteer / Career / Other), message (textarea). Honeypot field (`companyWebsite`). Turnstile widget. Privacy snippet. Submit button.
     - On success → `<FormSuccess />` block mounts in place.
   - **Right (info card, 40% on `lg`):**
     - `<ContactInfoCard />` — phone (`tel:` link), email (`mailto:` link), hours ("Available 24/7"), address (text only — no map yet).
     - `<MapCard />` — address block + "Get directions →" external link to `https://www.google.com/maps?q=<encoded address>`. Address pulls from `common.address.*` (new keys).

3. **`<PageBottomCta />`** — same as Days 3–5. Cross-link to Referral page reinforces that distinct intent path.

### Form schema (`src/lib/contact-schema.ts`)

```ts
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'common.formErrors.required').max(100, 'common.formErrors.tooLong'),
  email: z.string().trim().email('common.formErrors.invalidEmail').max(254),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  subject: z.enum(['general', 'insurance', 'volunteer', 'career', 'other']),
  message: z.string().trim().min(10, 'common.formErrors.tooShort').max(2000, 'common.formErrors.tooLong'),
  // Anti-bot
  companyWebsite: z.string().max(0).optional(), // honeypot — must be empty
  turnstileToken: z.string().min(1),
  locale: z.enum(['en', 'ko']),
});
export type ContactInput = z.infer<typeof contactSchema>;
```

Server adds `ipHash` (SHA-256 of IP + a daily salt, for rate-limit accounting only — never stored).

### Translation keys (top-level: `contact`)

```
contact
├── pageTitle, metaDescription, introParagraph
├── form.{
│     nameLabel, namePlaceholder,
│     emailLabel, emailPlaceholder,
│     phoneLabel, phoneHint,
│     subjectLabel,
│     subjectOptions.{general, insurance, volunteer, career, other},
│     messageLabel, messagePlaceholder,
│     submitLabel, submitPendingLabel
│   }
├── info.{
│     phoneLabel, emailLabel, hoursLabel, hoursValue,
│     addressLabel, getDirectionsLabel
│   }
└── success.{title, body}
```

---

## Page 2 — Referral Form

**Route:** `/[locale]/referral`
**Disclaimer:** none.
**Last reviewed:** not stamped.

**The page renders one of two layouts depending on `process.env.HAS_BAA` read at module level** (so the choice is build-time / restart-time, not per-request — avoids hydration mismatch). Both modes share the same `<h1>`, intro, info-card column, and security headers.

### Mode A — No BAA (default)

Layout:
1. **Above the fold:** giant phone CTA card — phone number + "Call to refer a patient — 24/7" with `<Icon name="phone" />`. Tap target ≥ 64 × 64 px. Below it: "Or schedule a callback ↓" anchor link to the callback form.
2. **Why phone:** a 2-sentence explainer — "Sharing patient health information online requires extra protections we are currently finalizing. In the meantime, please call us so we can take the referral directly — it is the fastest path."
3. **Callback form** (`<ReferralCallbackForm />`) — collects ONLY:
   - Referrer name
   - Referrer phone
   - Referrer email (optional)
   - Best time to call (select: morning / afternoon / evening / any)
   - Referrer type (select: physician / family member / case manager / other)
   - **No** patient name, **no** diagnosis, **no** insurance — these are PHI and require the BAA.
4. Same honeypot + Turnstile + Zod + rate-limit pipeline as Contact.
5. Privacy snippet emphasizes: "We are not collecting any patient health information on this form. We will call you to take the referral by phone."
6. Confirmation: "Thank you — a care coordinator will call within one business day."

### Mode B — BAA signed

Layout:
1. Trust strip at top (`<ReferralTrustStrip />`) — three small badges: "HIPAA-compliant intake", "Encrypted in transit (TLS 1.2+)", "BAA in place with {vendor name}". Visible only in Mode B because Mode A truthfully cannot make these claims.
2. Phone CTA card — same as Mode A but visually smaller; sits as one option among two.
3. Full form (`<ReferralFullForm />`) — fields:
   - **Referrer section** — referrer name, referrer phone, referrer email, referring physician name + NPI (optional), referrer relationship to patient (select)
   - **Patient section** — patient legal name, date of birth, primary diagnosis (text), urgency (select: routine / soon / urgent / today), current location (select: home / hospital / SNF / ALF / other), preferred language (select: English / Korean / other)
   - **Insurance section** — insurance type (select: Medicare / Medi-Cal / Private / Other), member ID (optional, treated as PHI)
   - **Notes** — open textarea for additional context
4. Honeypot + Turnstile + Zod + rate-limit pipeline.
5. Privacy snippet emphasizes: "We treat this submission as protected health information under HIPAA. It is transmitted encrypted to our admissions team via a vendor with whom we have a Business Associate Agreement. Retention: {N} days, then deleted from vendor and email systems."
6. Confirmation: "Thank you — the referral has been securely transmitted to our admissions team. A coordinator will follow up within 24 hours."

### Mode-switch boundary

The page file reads `process.env.HAS_BAA === 'true'` at the top, before any component renders, and chooses between `<ReferralPhoneFirst />` and the Mode B layout. Both modes share the same `<h1>` and intro so the route's SEO / meta does not change.

The route handler `app/api/referral/route.ts` similarly branches: if `HAS_BAA !== 'true'`, it validates against the callback schema (non-PHI) — if a client sends the full PHI schema, the validation **rejects with 400** (defense in depth against a stale client or attacker).

### Form schema (`src/lib/referral-schema.ts`)

A Zod discriminated union over `mode`:

```ts
const callbackSchema = z.object({
  mode: z.literal('callback'),
  referrerName: z.string().trim().min(1).max(100),
  referrerPhone: z.string().trim().min(7).max(30),
  referrerEmail: z.string().trim().email().max(254).optional().or(z.literal('')),
  bestTimeToCall: z.enum(['morning', 'afternoon', 'evening', 'any']),
  referrerType: z.enum(['physician', 'familyMember', 'caseManager', 'other']),
  // Anti-bot
  companyWebsite: z.string().max(0).optional(),
  turnstileToken: z.string().min(1),
  locale: z.enum(['en', 'ko']),
});

const fullSchema = z.object({
  mode: z.literal('full'),
  // Referrer
  referrerName: z.string().trim().min(1).max(100),
  referrerPhone: z.string().trim().min(7).max(30),
  referrerEmail: z.string().trim().email().max(254),
  referringPhysician: z.string().trim().max(100).optional().or(z.literal('')),
  referringPhysicianNpi: z.string().trim().regex(/^\d{10}$/).optional().or(z.literal('')),
  referrerRelationship: z.enum(['physician', 'familyMember', 'caseManager', 'other']),
  // Patient (PHI)
  patientName: z.string().trim().min(1).max(100),
  patientDob: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  primaryDiagnosis: z.string().trim().min(2).max(500),
  urgency: z.enum(['routine', 'soon', 'urgent', 'today']),
  currentLocation: z.enum(['home', 'hospital', 'snf', 'alf', 'other']),
  preferredLanguage: z.enum(['en', 'ko', 'other']),
  // Insurance (PHI)
  insuranceType: z.enum(['medicare', 'medical', 'private', 'other']),
  insuranceMemberId: z.string().trim().max(50).optional().or(z.literal('')),
  // Notes
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
  // Anti-bot
  companyWebsite: z.string().max(0).optional(),
  turnstileToken: z.string().min(1),
  locale: z.enum(['en', 'ko']),
});

export const referralSchema = z.discriminatedUnion('mode', [callbackSchema, fullSchema]);
```

### Translation keys (top-level: `referral`)

```
referral
├── pageTitle, metaDescription, introParagraph
├── modeA.{
│     phoneCta.{title, subtitle, callLabel},
│     whyPhone.{title, body},
│     callbackForm.{
│       title, intro,
│       nameLabel, phoneLabel, emailLabel, emailHint,
│       bestTimeLabel, bestTimeOptions.{morning, afternoon, evening, any},
│       referrerTypeLabel, referrerTypeOptions.{physician, familyMember, caseManager, other},
│       submitLabel, submitPendingLabel
│     },
│     privacyNote
│   }
├── modeB.{
│     trustBadges.{hipaa, tls, baa},
│     phoneCta.{title, callLabel},
│     fullForm.{
│       referrerSection.{title, nameLabel, phoneLabel, emailLabel,
│                        physicianLabel, npiLabel, npiHint,
│                        relationshipLabel, relationshipOptions.{…}},
│       patientSection.{title, nameLabel, dobLabel, dobHint,
│                       diagnosisLabel, urgencyLabel, urgencyOptions.{…},
│                       locationLabel, locationOptions.{…},
│                       languageLabel, languageOptions.{…}},
│       insuranceSection.{title, typeLabel, typeOptions.{…},
│                         memberIdLabel, memberIdHint},
│       notesLabel, notesHint,
│       submitLabel, submitPendingLabel
│     },
│     privacyNote
│   }
└── success.{modeA, modeB}.{title, body}
```

---

## Shared Translation Keys (additions only)

| Key | EN draft |
|---|---|
| `common.formErrors.required` | "This field is required." |
| `common.formErrors.invalidEmail` | "Please enter a valid email address." |
| `common.formErrors.tooShort` | "Please add a little more detail." |
| `common.formErrors.tooLong` | "This is longer than we can accept. Please shorten it." |
| `common.formErrors.invalidPhone` | "Please enter a valid phone number." |
| `common.formErrors.invalidDate` | "Please enter a date in YYYY-MM-DD format." |
| `common.formErrors.invalidNpi` | "NPI must be 10 digits." |
| `common.formErrors.turnstileMissing` | "Please complete the security check." |
| `common.formErrors.turnstileFailed` | "The security check failed. Please reload and try again." |
| `common.formErrors.rateLimited` | "You have submitted several requests already. Please call us at {phone} or try again later." |
| `common.formErrors.serverError` | "Something went wrong. Please call us at {phone}." |
| `common.formPrivacyShort.contact` | "We use your information only to respond to your inquiry. We do not sell your data." |
| `common.formPrivacyShort.referralModeA` | "This form does not collect patient health information. We will call you to take the referral by phone." |
| `common.formPrivacyShort.referralModeB` | "This form transmits protected health information (PHI) encrypted in transit. Submissions are routed to our admissions team via a HIPAA-eligible vendor under a Business Associate Agreement. Retention: {days} days." |
| `common.formSuccess.heading` | "Thank you" |
| `common.address.street` | "(client confirms)" — placeholder |
| `common.address.locality` | "Los Angeles" |
| `common.address.region` | "CA" |
| `common.address.postalCode` | "(client confirms)" — placeholder |
| `common.address.country` | "US" |
| `common.address.displayMultiline` | "(empty until street + ZIP confirmed)" — placeholder |

KO drafts follow the same shape; native polish on Day 7.

---

## Implementation Conventions (carried forward from Days 1–5)

1. **`useTranslations` vs `getTranslations`** — `getTranslations` only inside `async` `generateMetadata`. All other server components use sync `useTranslations('namespace')`.
2. **`params` in Next.js 14.2.x** — synchronous, not a Promise. Do not `await params`.
3. **Korean term policy** — for branded/regulatory English terms (HIPAA, BAA, NPI, PHI), Korean translation followed by parenthesized English on first use, English-only on subsequent mentions.
4. **Tailwind tokens only** — no raw hex.
5. **No PHI in comments** — review all `.tsx` for accidental sample-data PHI.
6. **No `console.log(body)` anywhere.** Catch blocks log `error.message` + an opaque request ID generated via `crypto.randomUUID()`.
7. **Server components by default** — only the three form bodies and the Turnstile wrapper carry `'use client'`.
8. **Single Zod schema source** — `src/lib/*-schema.ts` imported by both client form and route handler.

---

## Step-by-Step Implementation Order

1. **Install deps** — `npm install react-hook-form @hookform/resolvers zod resend`. Lock versions in `package.json`.
2. **Edit `next.config.mjs`** — add `securityHeaders` and `async headers()` export (overdue from Day 2; do this first so all subsequent dev-server responses ride on it).
3. **Create `.env.example`** — list required keys with empty values + a comment per key. **Do not commit `.env.local`.**
4. **Edit `src/components/ui/Icon.tsx`** — add `mail` (Heroicons outline envelope path) to the `IconName` union and `PATHS` map.
5. **Create `src/lib/contact-schema.ts`** and **`src/lib/referral-schema.ts`** (per "Form schema" sections above).
6. **Create `src/lib/rate-limit.ts`** — in-memory `Map<string, { count: number; resetAt: number }>` keyed by IP hash; export `checkRateLimit(ip): { ok: boolean; retryAfterSeconds?: number }`.
7. **Create `src/lib/turnstile.ts`** — server function `verifyTurnstile(token, ip): Promise<boolean>` that POSTs to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret + token + remoteip`. Returns false on any error.
8. **Create `src/lib/mail.ts`** — wraps `new Resend(process.env.RESEND_API_KEY)`. Exports `sendContactEmail(input)` and `sendReferralEmail(input)`. Both build the email body in a local function; **no body content is logged**.
9. **Create `src/lib/form-pipeline.ts`** — generic `runFormPipeline<T>({ schema, body, ip, sender }): Promise<{ status: number; payload: object }>` that does honeypot → rate-limit → turnstile → zod → sender, returning JSON-friendly results.
10. **Edit `messages/en.json`** — add `contact`, `referral`, `common.formErrors`, `common.formPrivacyShort`, `common.formSuccess`, `common.address`. Draft copy per the keys above and the "Hot Copy Examples" section.
11. **Mirror in `messages/ko.json`** — Korean drafts (Day 7 polish).
12. **Edit `messages/PLACEHOLDERS.md`** — append Day 6 entries (BAA status flag, real `info@` / `referrals@` emails, vendor confirmation, address street + ZIP).
13. **Create `src/components/ui/FormField.tsx`, `FormTextarea.tsx`, `FormSelect.tsx`** — server-renderable input wrappers that bind `<label>`, `<input>`, and `<p role="alert">` with `aria-describedby`. They take a `name`, a `label`, a `register` function, and an optional `error` object from RHF. Visually: full-width on mobile; consistent height ≥ 44px; focus ring matches site tokens.
14. **Create `src/components/ui/Turnstile.tsx`** — `'use client'`; mounts the Cloudflare Turnstile JS, exposes `onVerify(token: string)` callback. Reads `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Renders a small wrapper that takes up no layout space until challenged.
15. **Create `src/components/ui/FormPrivacyNotice.tsx`** — server; renders one of three privacy snippets based on a `variant: 'contact' | 'referralModeA' | 'referralModeB'` prop. Uses `useTranslations` to pull from `common.formPrivacyShort.*`. The retention-period number for Mode B is interpolated via ICU placeholder `{days}` — defaults to a placeholder integer until client confirms.
16. **Create `src/components/ui/FormSuccess.tsx`** — server; renders `<div role="status" tabIndex={-1} ref={focusRef}>` with a heading + body. The parent form-component focuses it on mount.
17. **Create `src/components/contact/ContactInfoCard.tsx`** — server; phone (tel link, large), email (mailto), hours, address text.
18. **Create `src/components/contact/MapCard.tsx`** — server; address block + "Get directions →" external link (`target="_blank" rel="noopener noreferrer"`).
19. **Create `src/components/contact/ContactForm.tsx`** — `'use client'`; React Hook Form with `zodResolver(contactSchema)`. Renders five `FormField`s + a `FormSelect` + a `FormTextarea` + `Turnstile` + `FormPrivacyNotice variant="contact"` + submit button. On submit, POST to `/api/contact` with `Content-Type: application/json`. On success, swap to `<FormSuccess />`. On error, render the error message via `aria-live="polite"`.
20. **Create `src/app/api/contact/route.ts`** — `export async function POST(req)`. Extracts IP from `req.headers.get('x-forwarded-for')` (Vercel) with fallback to `req.headers.get('x-real-ip')`. Calls `runFormPipeline({ schema: contactSchema, ... })`. Returns `Response.json(...)` with appropriate status.
21. **Create `src/components/referral/ReferralPhoneFirst.tsx`** — server; renders Mode A layout (giant phone CTA + why-phone explainer). Mounts `<ReferralCallbackForm />` below the explainer.
22. **Create `src/components/referral/ReferralCallbackForm.tsx`** — `'use client'`; RHF + `zodResolver(callbackSchema)`. POSTs to `/api/referral` with `mode: 'callback'`.
23. **Create `src/components/referral/ReferralTrustStrip.tsx`** — server; three small badges with `<Icon name="shield" />`, `<Icon name="check" />`, `<Icon name="document" />`. Visible only in Mode B (rendered conditionally by the page).
24. **Create `src/components/referral/ReferralFullForm.tsx`** — `'use client'`; RHF + `zodResolver(fullSchema)`. Renders fieldsets per "Referrer / Patient / Insurance / Notes" section. POSTs to `/api/referral` with `mode: 'full'`.
25. **Create `src/app/api/referral/route.ts`** — branches on `process.env.HAS_BAA`:
    - If `HAS_BAA !== 'true'`: validate against `callbackSchema` only. If client sends `mode: 'full'`, reject with 400.
    - If `HAS_BAA === 'true'`: validate against the full discriminated union. Both modes are accepted (user can opt for the callback even when full form is available).
    - Sender chosen based on validated `mode`.
26. **Create `src/app/[locale]/contact/page.tsx`** — composes `SectionContainer` + h1 + a 2-column grid (ContactForm | ContactInfoCard + MapCard) + `<PageBottomCta />`. `generateMetadata` from `contact.pageTitle` + `metaDescription`.
27. **Create `src/app/[locale]/referral/page.tsx`** — reads `process.env.HAS_BAA` at module top. Renders either `<ReferralPhoneFirst />` or `<ReferralTrustStrip /> + <ReferralFullForm />`. **No** `<PageBottomCta />` (this page is itself the CTA). `generateMetadata` from `referral.pageTitle` + `metaDescription`.
28. **Verify Header / Footer nav** — `/contact` and `/referral` entries already exist; confirm they no longer 404 and that `isActive` highlights work.
29. **Visual QA at 375 / 768 / 1280** for both pages and both locales. Verify:
    - Mobile: form fields are full-width, ≥ 44 px tall, focus ring visible on tab.
    - Tablet: 2-col grid kicks in at `lg:` (1024px).
    - Desktop: form occupies left, info card / map card stack on the right.
30. **Submit pipeline end-to-end test** in dev with a real Resend test key:
    - Contact submit → 200 OK → check inbox.
    - Referral Mode A submit → 200 OK → check inbox (no PHI in body).
    - Toggle `HAS_BAA=true` in `.env.local`, restart `npm run dev`, Referral Mode B submit → 200 OK → check inbox.
    - Toggle back to `HAS_BAA=false`, try to POST `mode: 'full'` body via `curl` → expect 400.
31. **Bot / abuse tests:**
    - Honeypot — `curl -X POST http://localhost:3000/api/contact -d '{"companyWebsite": "spam.com", ...}'` → expect 200 silent.
    - Rate limit — 6 rapid `curl` POSTs from same IP → 6th returns 429 with `Retry-After`.
    - Turnstile — submit form with `turnstileToken: 'fake'` → expect 400 with `turnstileFailed` error.
32. **Security-header smoke test** — `curl -sI http://localhost:3000/en/contact` → confirm CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy headers present.
33. **Type + lint pass** — `npx tsc --noEmit`, `npm run lint`.
34. **Production build smoke test** — `npm run build`. Confirm 4 new routes (contact + referral × 2 locales) and 2 new API routes appear; no missing-translation warnings.

---

## Hot Copy Examples (drafts — with provenance)

| Key | EN draft | Source / rationale |
|---|---|---|
| `contact.pageTitle` | "Contact Us" | Conventional |
| `contact.introParagraph` | "Have a question or want to speak with our care team? Call us 24/7 at {phone}, or send a message below — we typically reply within one business day." | Mirror Day 3 "speak with our team" tone |
| `contact.form.submitLabel` | "Send Message" | Action-verb + object |
| `contact.success.title` | "Thank you" | Universal |
| `contact.success.body` | "We've received your message and will be in touch within one business day. For anything urgent, please call us at {phone}." | Surfaces phone as the backstop |
| `referral.pageTitle` | "Make a Referral" | Matches Header nav label |
| `referral.modeA.phoneCta.title` | "Call to refer a patient — 24/7" | Phone-first |
| `referral.modeA.whyPhone.body` | "Sharing patient health information online requires extra protections we are currently finalizing. In the meantime, please call us so we can take the referral directly — it is the fastest path." | Honest, doesn't promise PHI handling that isn't yet in place |
| `referral.modeA.callbackForm.title` | "Or schedule a callback" | Anchor target from the phone CTA |
| `referral.modeB.trustBadges.hipaa` | "HIPAA-compliant intake" | Only shown when actually true |
| `referral.modeB.trustBadges.tls` | "Encrypted in transit (TLS 1.2+)" | Standard, verifiable |
| `referral.modeB.trustBadges.baa` | "Business Associate Agreement with {vendor}" | Interpolates vendor name |
| `referral.modeB.privacyNote` | "We treat this submission as protected health information (PHI) under HIPAA. It is transmitted encrypted to our admissions team via a vendor with whom we have signed a Business Associate Agreement (BAA). Submissions are retained for {days} days, then deleted." | Plain-English HIPAA explanation |
| `referral.success.modeB.body` | "The referral has been securely transmitted to our admissions team. A coordinator will follow up within 24 hours. We have not sent a copy of this submission to your email — for your privacy, please retain your own records." | Explicit no-echo |
| `common.formErrors.rateLimited` | "You have submitted several requests already. Please call us at {phone} or try again later." | Friendly, surfaces phone |
| `common.formErrors.turnstileFailed` | "The security check failed. Please reload and try again — or call us at {phone}." | Friendly, surfaces phone |

Full strings drafted during implementation; structures above are the contract.

---

## Verification

```powershell
# Dev server
npm run dev

# /en/contact
#   - h1 + intro paragraph render in EN
#   - left column: form (name / email / phone / subject / message + Turnstile + submit)
#   - right column: phone (tel link), email (mailto), hours, address, "Get directions →" external link
#   - submit empty form → all required fields show inline errors; Turnstile error
#   - fill valid data → submit → spinner on button → success block mounts (no nav)
#   - inbox: email received with submitter's name/message
# /ko/contact — same, Korean throughout

# /en/referral with HAS_BAA=false (default)
#   - h1 + intro
#   - giant phone CTA card with tel: link, large icon
#   - "Why phone" explainer
#   - callback form (referrer name / phone / email / best time / referrer type) — NO patient fields
#   - submit valid → success → email received (no PHI)
# /ko/referral — same, Korean

# Flip HAS_BAA=true in .env.local, restart dev
# /en/referral
#   - trust strip at top (3 badges)
#   - smaller phone CTA
#   - full form: referrer / patient / insurance / notes
#   - submit valid → success → email received (PHI present)

# Anti-bot tests (curl from another terminal)
curl -X POST http://localhost:3000/api/contact `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"t@t.com\",\"subject\":\"general\",\"message\":\"hello hello\",\"companyWebsite\":\"spam\",\"turnstileToken\":\"x\",\"locale\":\"en\"}'
#   → 200 OK with { ok: true } but NO email sent (honeypot tripped, silent)

# Rate limit — 6 rapid identical POSTs
1..6 | ForEach-Object { curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '...valid body...' }
#   → 6th call returns 429 with Retry-After header

# Security headers
curl -sI http://localhost:3000/en/contact | findstr -i "csp policy x-frame referrer permissions"
#   → all 4 headers present

# Type + lint
npx tsc --noEmit       # zero errors
npm run lint           # zero errors
npm run build          # 4 new routes + 2 API routes; no missing-translation warnings

# JSON-LD pages from earlier days unaffected
curl -s http://localhost:3000/en/about | findstr "application/ld+json"
#   → still emits MedicalOrganization JSON-LD (no regression from header changes)
```

**Content correctness spot-check:**
- Contact form does not collect anything that could be classified as PHI (no diagnosis, no patient info).
- Referral Mode A form does not collect patient name, diagnosis, or any patient identifier.
- Referral Mode B trust strip is only shown when `HAS_BAA=true`; flipping the flag does not require code changes elsewhere.
- Submit confirmation does not echo back PHI (Referral Mode B success message is generic).
- Honeypot field is `aria-hidden`, off-screen, and `tabIndex={-1}` — invisible to humans and assistive tech.
- Rate-limit error surfaces the phone number as a backstop (not a dead-end UX).
- Turnstile failure surfaces the phone number as a backstop.
- Privacy snippet wording for Mode B explicitly names BAA + TLS + retention period — not vague "we take security seriously" filler.
- The `Do not call 911` / `educational disclaimer` patterns from Days 3–5 do **not** appear here — Day 6 pages are conversion surfaces, not educational pages.
- `MapCard` opens Google Maps externally; no map embed on the page; no cookies set by Day 6 pages.

**Lighthouse target per page:** Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## HIPAA, Privacy & Retention (Day 6 specific)

| Concern | Day 6 handling |
|---|---|
| **PHI in URLs** | Forms POST `application/json` only. Confirmation does not navigate. No PHI ever in URL. |
| **PHI in logs** | Route handlers wrap business logic in `try/catch`. On error, log only `error.message` + a `crypto.randomUUID()` request ID. **Never log `req.json()` result.** |
| **PHI in emails** | Mode B email body contains PHI by design (that is the purpose). Vendor has BAA. Recipient mailbox must be on the BAA-covered domain. |
| **PHI in email subject** | Mode B subject uses **patient initials only** (e.g., `New referral — J.D.`). |
| **PHI at rest** | Vendor encrypts at rest per BAA. Day 6 ships no application database — no app-side at-rest PHI. |
| **PHI retention** | Set vendor retention to the minimum that supports operations. Default proposal: 30 days at vendor + 90 days in the recipient mailbox, then delete. Document the chosen value in `messages/PLACEHOLDERS.md` and interpolate via `{days}`. |
| **Audit trail** | Route handler can log non-PHI fields (timestamp, mode, success/failure, request ID, IP hash) to a structured log for HIPAA §164.312(b) audit. Day 6 ships this to `stdout` only — production deploy should pipe `stdout` to a HIPAA-eligible log sink. Note in `PLACEHOLDERS.md`. |
| **CCPA** | Site remains cookie-free through Day 6. No "Do Not Sell" link required yet. |
| **Privacy Policy** | Full Privacy Policy is Day 7. Day 6 ships **inline form-privacy snippets** above each submit button. Footer "Privacy Policy" link still 404s until Day 7. |
| **HIPAA Notice of Privacy Practices** | Client-provided text, Day 7. Day 6 references it in the Mode B privacy snippet ("see our HIPAA Notice of Privacy Practices") with a forward-link that will 404 until Day 7 — note in `PLACEHOLDERS.md`. |
| **BAA presence** | Tracked in `PLACEHOLDERS.md`. `HAS_BAA` env var is the runtime switch. |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Referral Mode B ships before BAA is actually signed** | `HAS_BAA` env var defaults to `false`. Code defaults to Mode A. Flipping the flag is a deliberate operational act — paired with a one-time check that the BAA is on file. **Pre-launch checklist row**: "BAA signed? Y/N → if Y, set HAS_BAA=true; if N, leave at false." |
| **Resend BAA cost gates adoption** | Resend Pro is ~$20/mo. If client wants free, SendGrid free tier is **not BAA-eligible** — must upgrade SendGrid Pro (similar price) or use AWS SES with the HIPAA-eligible config. Either is a one-file change in `src/lib/mail.ts`. |
| **Form vendor downtime loses referrals** | Pages display office phone prominently. Even if the route handler returns 500, the visible phone CTA is the backstop. Add a Vercel deployment-health check that pings `/api/contact?healthcheck=1` (route handler returns 200 OK if env is wired). |
| **Turnstile blocks legitimate users with privacy extensions** | Turnstile's invisible mode degrades to a managed challenge instead of failing closed. If a user still cannot pass, the visible phone number is the alternative. `turnstileFailed` error message surfaces phone. |
| **Rate-limit storage is per-process on Vercel** | At low traffic, single-instance is fine. If site sees > 100 req/s for any sustained period, swap `src/lib/rate-limit.ts` to Upstash Redis (one-file change). Document in `PLACEHOLDERS.md`. |
| **CSP `'unsafe-inline'` weakens script-src** | Required for App Router hydration data. Nonce-based CSP is a Day 7+ task. CSP is still significantly stronger than no CSP. |
| **CSP breaks Turnstile** | `script-src` includes `https://challenges.cloudflare.com`; `frame-src` includes the same; `connect-src` includes the same. Verified in the security-header config. |
| **CSP breaks Google Fonts** | `style-src` includes `https://fonts.googleapis.com`; `font-src` includes `https://fonts.gstatic.com`. Verified. |
| **Email subject leaks PHI in mail headers** | Mode B subject uses initials only. Reviewed and codified in `src/lib/mail.ts`. |
| **An attacker brute-forces the discriminated-union to send `mode: 'full'` when `HAS_BAA=false`** | Route handler validates the runtime flag first and rejects `mode: 'full'` with 400 when `HAS_BAA !== 'true'`. Defense in depth: even if the client somehow renders Mode B UI, the server refuses to accept it. |
| **Cross-locale form posts send EN to KO recipient or vice versa** | `locale` field is part of every schema. Email template renders strings via `getTranslations({ locale: input.locale })` so the office receives the email in the language the submitter saw — useful for Korean-speaking referrals to the right coordinator. |
| **Honeypot field tabbable / readable by AT** | `tabIndex={-1}`, `aria-hidden="true"`, `autocomplete="off"`, absolute-positioned off-screen. Reviewed against WCAG 2.1 SC 1.3.1. |
| **Submit button rapid-fire double-clicks send duplicate emails** | RHF's `formState.isSubmitting` is bound to `disabled`. Submit handler also guards against re-entry with a local `useRef`. |
| **`process.env.HAS_BAA` read at module level not picked up on Vercel deploys** | Vercel injects env vars at build time for Server Components and at runtime for Route Handlers. Document in `PLACEHOLDERS.md`: flipping `HAS_BAA` requires a redeploy (or use Vercel "Edit Environment Variables → Redeploy"). |
| **Map external link looks unsafe** | Use `rel="noopener noreferrer"` and `target="_blank"`. Visually styled the same as in-site links so user trust transfers. |
| **Day 7 Privacy Policy slips, leaving "Privacy Policy" footer link 404** | Day 6 adds the inline privacy snippet on each form; footer Privacy Policy link is unchanged (404 today, fixed Day 7). Acceptable interim state because the forms carry their own privacy disclosure. |
| **Korean translations of HIPAA/PHI/BAA are awkward** | Use English term in parens after Korean rendering on first use per page (matches Day 3 regulatory-term convention). Native review Day 7. |

---

## Out of Scope (defer to Day 7)

- Full Privacy Policy page (`/[locale]/privacy`) and footer wire-up
- HIPAA Notice of Privacy Practices page (client provides text)
- Accessibility Statement, Terms of Use pages
- `app/not-found.tsx`, `app/error.tsx`, `app/loading.tsx`
- `hreflang`, `sitemap.xml`, `robots.txt`
- `MedicalOrganization` JSON-LD on Home (About already has it from Day 4)
- Native Korean reviewer polish
- Real photography
- Analytics / tracking (if added, CCPA "Do Not Sell" link becomes required and requires Day 7 work)
- Swapping in-memory rate limit for Upstash Redis
- Nonce-based CSP (removing `'unsafe-inline'`)
- Unified phone-number translation source (still tracked in `PLACEHOLDERS.md` for Day 7)
- Maps Static API or iframe embed (text card + external link is the Day 6 default)
- Server-side audit-log sink (Day 6 ships to stdout; production wiring is Day 7 deploy)
- Re-using vendor BAA for transactional email beyond forms (e.g., bereavement program follow-ups) — Day 6 scope is form intake only
