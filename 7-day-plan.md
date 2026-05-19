# 7-Day Development Plan — Eminent Hospice Care Website

## Tech Stack
- **Next.js 14** (App Router) — SSG/SSR for SEO, file-based routing
- **Tailwind CSS** — utility-first responsive styling
- **next-intl** — bilingual routing (EN / KO)
- **React Hook Form** — contact and referral forms
- **Formspree or Resend** — form email delivery (no backend needed)

---

## Day 1 — Project Setup & Design System
**Goal:** Runnable scaffold with the visual foundation locked in.

- Initialize Next.js 14 with TypeScript + Tailwind
- Install and configure `next-intl` for EN/KO routing (`/en/...` and `/ko/...`)
- Create translation files: `messages/en.json`, `messages/ko.json` (placeholder strings)
- Build shared components: `<Header>` (with EN/한국어 toggle), `<Footer>`, `<Layout>`
- Define design tokens in Tailwind config: calming palette (soft blues, whites, warm grays), serif/sans font pairing
- Verify bilingual toggle works and routes switch correctly

---

## Day 2 — Home Page
**Goal:** The most important page — first impression for patients and families.

- Hero section: compassionate headline, subtext, primary CTA ("Learn About Hospice" + "Contact Us")
- Services overview: icon cards for the 4 levels of care
- Trust section: who we serve, interdisciplinary team callout
- Testimonial/quote block
- Pull content from NotebookLM (hospice philosophy, services overview)

---

## Day 3 — Informational Pages (3 pages)
**Goal:** The educational core — builds trust and authority.

- **Understanding Hospice Care** — what hospice is, myths vs. facts, eligibility, what to expect
- **Hospice Laws & Patient Rights** — Medicare Conditions of Participation, patient rights, advance directives
- **Insurance & Medicare Information** — Medicare Part A, Medi-Cal, FY2026 rates, coverage details

Consistent layout: main content + sidebar (quick links, contact CTA).

---

## Day 4 — About & Services Pages (2 pages)
**Goal:** Build organizational credibility and explain the offering.

- **About Us** — mission, values, founding story, interdisciplinary team profiles, LA County service area
- **Hospice Services** — all services detailed: nursing, social work, chaplain, aide, bereavement; 4 levels of care

---

## Day 5 — Family Resources & FAQ (2 pages)
**Goal:** Support the people making the hardest decisions.

- **For Families & Caregivers** — caregiver guides, what to expect, medication management, burnout prevention, grief support
- **FAQ** — accordion-style Q&A pulled from NotebookLM content

---

## Day 6 — Contact & Referral Forms (2 pages)
**Goal:** Convert visitors into consultations and referrals.

- **Contact Us** — phone, email, address, hours; contact form; Google Maps embed
- **Referral Form** — patient info, diagnosis, referring physician, insurance, urgency; submits to office email
- Validation with React Hook Form + Zod

---

## Day 7 — Korean Translations, SEO & Polish
**Goal:** Production-ready — bilingual, searchable, accessible, fast.

- Fill in all Korean translations in `messages/ko.json`
- Add metadata to every page: title, description, Open Graph tags
- Generate `sitemap.xml` and `robots.txt`
- Audit mobile responsiveness across all 10 pages
- Accessibility pass: alt text, aria-labels, color contrast, keyboard nav
- Performance: image optimization, lazy loading
- Final QA: all forms submit, all language toggles work, all links resolve

---

## Pages Checklist
- [ ] Home
- [ ] About Us
- [ ] Hospice Services
- [ ] Understanding Hospice Care
- [ ] Hospice Laws & Patient Rights
- [ ] For Families & Caregivers
- [ ] Insurance & Medicare Information
- [ ] FAQ
- [ ] Contact Us
- [ ] Referral Form
