# Day 1 Implementation Plan — Project Setup & Design System

## Context

Day 1 of the Eminent Hospice Care Inc. website build. Greenfield project — only planning `.md` files exist. Goal: a fully runnable Next.js 14 scaffold with design system, bilingual routing (EN/KO), and shared layout components locked in before page content begins on Day 2.

**Alignment:**
- `instructions.md`: Bilingual EN/KO, clean calming medical-style design, accessible, CMS-friendly → addressed via next-intl translation files and design token system
- `requirements.md`: Responsive, SEO, performance, modern UI/UX → Next.js SSG, next/font, mobile-first Tailwind; logo/brand assets pending from client — Header uses text branding as placeholder
- `notebooklm.md`: Korean content drafts exist in notebooks — `ko.json` placeholders on Day 1, refined with real content on Day 7

**Out of scope for Day 1:** page content, forms, real logo, actual hospice copy (Days 2–6).

---

## Tech Stack

- **Next.js 14.2.35** + TypeScript (App Router, `src/` directory)
- **Tailwind CSS** — design tokens, no raw hex values in components
- **next-intl 4.12.0** — `/en/...` and `/ko/...` URL-based locale routing
- **Google Fonts via `next/font`** — Playfair Display (headings) + Inter (body)

---

## Implementation Order

Do these in sequence — each step depends on the previous.

1. Scaffold the Next.js project
2. Install next-intl
3. Create `src/i18n/routing.ts`
4. Create `src/i18n/request.ts`
5. Create `src/i18n/navigation.ts`
6. Create `src/middleware.ts`
7. Update `next.config.ts`
8. Update `tailwind.config.ts`
9. Update `src/app/globals.css`
10. Create `messages/en.json`
11. Create `messages/ko.json`
12. Create `src/components/ui/LocaleSwitcher.tsx`
13. Create `src/components/layout/Footer.tsx`
14. Create `src/components/layout/Header.tsx`
15. Create `src/components/layout/Layout.tsx`
16. Create `src/app/[locale]/layout.tsx`
17. Create `src/app/[locale]/page.tsx`
18. **Delete** `src/app/layout.tsx` and `src/app/page.tsx` (scaffolded conflicts)

---

## Step 1 — Scaffold

```powershell
cd "C:\Users\super\OneDrive\Desktop\EMINENT_WEBSITE"
npx create-next-app@14.2.35 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

When prompted about Turbopack → answer **No**.

```powershell
npm install next-intl@4.12.0
```

---

## Step 2 — i18n Configuration

### `src/i18n/routing.ts`
```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
```

### `src/i18n/request.ts`
```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'en' | 'ko')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### `src/i18n/navigation.ts`
```typescript
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

### `src/middleware.ts`
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(en|ko)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
```

---

## Step 3 — `next.config.ts`

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

---

## Step 4 — `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C5F8A',
          50:  '#EBF3FA',
          100: '#C8DFF0',
          200: '#A5CBE6',
          300: '#82B7DC',
          400: '#5FA3D2',
          500: '#2C5F8A',
          600: '#245079',
          700: '#1C4168',
          800: '#143257',
          900: '#0C2346',
        },
        secondary: {
          DEFAULT: '#7CB9E8',
          500: '#7CB9E8',
          600: '#5EA8E0',
        },
        neutral: {
          warm:  '#F8F6F2',
          cream: '#FDF9F5',
          100: '#F1EDE8',
          200: '#E2DDD7',
          300: '#C8C2BB',
        },
        success: '#4A9B6F',
        warning: '#C27D2A',
        error:   '#B94040',
        'text-primary':   '#1A2B3C',
        'text-secondary': '#4A5568',
        'text-muted':     '#718096',
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'section-y': '5rem',
        'section-x': '1.5rem',
        'content':   '72rem',
      },
      maxWidth: {
        'content': '72rem',
        'prose':   '65ch',
      },
      borderRadius: {
        'card': '0.75rem',
        'btn':  '0.375rem',
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'header':  '0 1px 0 0 rgb(0 0 0 / 0.06)',
      },
      zIndex: {
        'fixed':   '50',
        'modal':   '100',
        'toast':   '200',
      },
      transitionDuration: {
        'ui': '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Step 5 — `src/app/globals.css`

Replace scaffolded content entirely:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    @apply bg-neutral-warm text-text-primary font-body;
    font-size: 1rem;
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading font-semibold text-text-primary;
    line-height: 1.25;
  }

  :focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
    html { scroll-behavior: auto; }
  }
}

@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
}
```

---

## Step 6 — Translation Files

Place both files at the **project root** (same level as `package.json`), not inside `src/`. These JSON files are the CMS layer — all copy lives here so content updates never require touching component code.

### `messages/en.json`
```json
{
  "nav": {
    "home": "Home",
    "aboutUs": "About Us",
    "hospiceServices": "Hospice Services",
    "understandingHospice": "Understanding Hospice Care",
    "hospiceLaws": "Hospice Laws & Patient Rights",
    "forFamilies": "For Families & Caregivers",
    "insurance": "Insurance & Medicare",
    "faq": "FAQ",
    "contact": "Contact Us",
    "referral": "Referral Form",
    "mainNav": "Main navigation",
    "mobileNav": "Mobile navigation",
    "skipToMain": "Skip to main content",
    "openMenu": "Open navigation menu",
    "closeMenu": "Close navigation menu",
    "homeLinkAriaLabel": "Eminent Hospice Care — go to homepage",
    "switchLanguage": "Switch to {lang}"
  },
  "footer": {
    "tagline": "Providing compassionate, expert hospice care to patients and families throughout Los Angeles County.",
    "footerNav": "Footer navigation",
    "quickLinksHeading": "Quick Links",
    "home": "Home",
    "aboutUs": "About Us",
    "hospiceServices": "Hospice Services",
    "faq": "FAQ",
    "contact": "Contact Us",
    "referral": "Referral Form",
    "contactHeading": "Contact Us",
    "address": "Los Angeles, California",
    "phone": "(XXX) XXX-XXXX",
    "email": "info@eminentHospice.com",
    "hours": "Available 24 hours a day, 7 days a week",
    "copyright": "© {year} Eminent Hospice Care Inc. All rights reserved.",
    "licensedInCalifornia": "Licensed in the State of California"
  },
  "home": {
    "pageTitle": "Compassionate Hospice Care in Los Angeles",
    "heroHeading": "Care With Dignity.\nComfort With Compassion.",
    "heroSubtext": "Eminent Hospice Care provides expert, heartfelt care to patients and families throughout Los Angeles County during life's most challenging moments.",
    "heroCta": "Learn About Hospice",
    "heroCtaSecondary": "Contact Us"
  }
}
```

### `messages/ko.json`
```json
{
  "nav": {
    "home": "홈",
    "aboutUs": "소개",
    "hospiceServices": "호스피스 서비스",
    "understandingHospice": "호스피스 케어 이해하기",
    "hospiceLaws": "호스피스 법률 및 환자 권리",
    "forFamilies": "가족 및 보호자를 위한 정보",
    "insurance": "보험 및 메디케어",
    "faq": "자주 묻는 질문",
    "contact": "문의하기",
    "referral": "의뢰 양식",
    "mainNav": "주요 내비게이션",
    "mobileNav": "모바일 내비게이션",
    "skipToMain": "주요 콘텐츠로 이동",
    "openMenu": "내비게이션 메뉴 열기",
    "closeMenu": "내비게이션 메뉴 닫기",
    "homeLinkAriaLabel": "에미넌트 호스피스 케어 — 홈페이지로 이동",
    "switchLanguage": "{lang}로 전환"
  },
  "footer": {
    "tagline": "LA 카운티 전역의 환자와 가족에게 따뜻하고 전문적인 호스피스 케어를 제공합니다.",
    "footerNav": "푸터 내비게이션",
    "quickLinksHeading": "바로가기",
    "home": "홈",
    "aboutUs": "소개",
    "hospiceServices": "호스피스 서비스",
    "faq": "자주 묻는 질문",
    "contact": "문의하기",
    "referral": "의뢰 양식",
    "contactHeading": "연락처",
    "address": "캘리포니아, 로스앤젤레스",
    "phone": "(XXX) XXX-XXXX",
    "email": "info@eminentHospice.com",
    "hours": "24시간, 주 7일 이용 가능",
    "copyright": "© {year} Eminent Hospice Care Inc. 모든 권리 보유.",
    "licensedInCalifornia": "캘리포니아주 인가 업체"
  },
  "home": {
    "pageTitle": "로스앤젤레스 호스피스 케어",
    "heroHeading": "존엄과 함께하는 케어.\n따뜻한 마음으로 드리는 위안.",
    "heroSubtext": "에미넌트 호스피스 케어는 인생에서 가장 힘든 순간, LA 카운티 전역의 환자와 가족을 위해 전문적이고 진심 어린 케어를 제공합니다.",
    "heroCta": "호스피스 알아보기",
    "heroCtaSecondary": "문의하기"
  }
}
```

---

## Step 7 — Components

### `src/components/ui/LocaleSwitcher.tsx`
```tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const targetLocale = locale === 'en' ? 'ko' : 'en';
  const label = locale === 'en' ? '한국어' : 'English';

  function handleSwitch() {
    startTransition(() => {
      router.replace(pathname, { locale: targetLocale });
    });
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={t('switchLanguage', { lang: label })}
      className="px-3 py-1.5 text-sm font-medium rounded-btn border border-primary-200 text-primary-600
        hover:bg-primary-50 hover:border-primary-400 transition-colors duration-ui
        disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]"
    >
      {label}
    </button>
  );
}
```

### `src/components/layout/Header.tsx`

> **Logo note:** Logo PNG is pending from client (`requirements.md`). When received, replace the text `<span>` brand block with `<Image src="/logo.png" alt="Eminent Hospice Care" />` using `next/image`.

```tsx
'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { key: 'home',                 href: '/' },
    { key: 'aboutUs',              href: '/about' },
    { key: 'hospiceServices',      href: '/services' },
    { key: 'understandingHospice', href: '/understanding-hospice' },
    { key: 'hospiceLaws',          href: '/hospice-laws' },
    { key: 'forFamilies',          href: '/for-families' },
    { key: 'insurance',            href: '/insurance' },
    { key: 'faq',                  href: '/faq' },
    { key: 'contact',              href: '/contact' },
    { key: 'referral',             href: '/referral' },
  ] as const;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-fixed bg-white shadow-header">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2
        focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-btn">
        {t('skipToMain')}
      </a>
      <div className="max-w-content mx-auto px-section-x">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" aria-label={t('homeLinkAriaLabel')} className="flex flex-col leading-tight">
            <span className="font-heading text-xl font-semibold text-primary-500">Eminent Hospice Care</span>
            <span className="text-xs text-text-muted font-body tracking-wide">
              {locale === 'ko' ? '에미넌트 호스피스 케어' : 'A Tradition of Compassion'}
            </span>
          </Link>

          <nav aria-label={t('mainNav')} className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ key, href }) => (
              <Link key={key} href={href} aria-current={isActive(href) ? 'page' : undefined}
                className={`px-3 py-2 text-sm font-medium rounded-btn transition-colors duration-ui
                  focus-visible:ring-2 focus-visible:ring-primary-500
                  ${isActive(href) ? 'text-primary-600 bg-primary-50' : 'text-text-secondary hover:text-primary-600 hover:bg-primary-50'}`}>
                {t(key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <button onClick={() => setMobileOpen((o) => !o)} aria-expanded={mobileOpen}
              aria-controls="mobile-nav" aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
              className="lg:hidden flex flex-col justify-center items-center w-11 h-11 rounded-btn hover:bg-neutral-100 transition-colors duration-ui">
              <span className={`block w-5 h-0.5 bg-text-primary transition-transform duration-ui ${mobileOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`block w-5 h-0.5 bg-text-primary mt-1 transition-opacity duration-ui ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-text-primary mt-1 transition-transform duration-ui ${mobileOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav id="mobile-nav" aria-label={t('mobileNav')} className="lg:hidden border-t border-neutral-200 py-3 pb-4">
            <ul className="flex flex-col gap-0.5">
              {navLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} onClick={() => setMobileOpen(false)} aria-current={isActive(href) ? 'page' : undefined}
                    className={`block px-3 py-2.5 text-sm font-medium rounded-btn transition-colors duration-ui
                      focus-visible:ring-2 focus-visible:ring-primary-500
                      ${isActive(href) ? 'text-primary-600 bg-primary-50' : 'text-text-secondary hover:text-primary-600 hover:bg-primary-50'}`}>
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
```

### `src/components/layout/Footer.tsx`
```tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');

  const quickLinks = [
    { key: 'home',            href: '/' },
    { key: 'aboutUs',         href: '/about' },
    { key: 'hospiceServices', href: '/services' },
    { key: 'faq',             href: '/faq' },
    { key: 'contact',         href: '/contact' },
    { key: 'referral',        href: '/referral' },
  ] as const;

  return (
    <footer className="bg-primary-900 text-white mt-auto">
      <div className="max-w-content mx-auto px-section-x py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <h2 className="font-heading text-lg font-semibold text-white mb-2">Eminent Hospice Care Inc.</h2>
            <p className="text-sm text-primary-200 leading-relaxed">{t('tagline')}</p>
          </div>
          <nav aria-label={t('footerNav')}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-300 mb-3">{t('quickLinksHeading')}</h3>
            <ul className="flex flex-col gap-1.5">
              {quickLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className="text-sm text-primary-100 hover:text-white transition-colors duration-ui">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-300 mb-3">{t('contactHeading')}</h3>
            <address className="not-italic text-sm text-primary-100 space-y-2">
              <p>{t('address')}</p>
              <p><a href="tel:+1XXXXXXXXXX" className="hover:text-white transition-colors duration-ui">{t('phone')}</a></p>
              <p><a href="mailto:info@eminentHospice.com" className="hover:text-white transition-colors duration-ui">{t('email')}</a></p>
              <p className="text-primary-300 text-xs mt-3">{t('hours')}</p>
            </address>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-primary-700 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-400">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <p>{t('licensedInCalifornia')}</p>
        </div>
      </div>
    </footer>
  );
}
```

### `src/components/layout/Layout.tsx`
```tsx
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

---

## Step 8 — `src/app/[locale]/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Layout } from '@/components/layout/Layout';
import '@/app/globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Eminent Hospice Care Inc.', template: '%s | Eminent Hospice Care Inc.' },
  description: 'Compassionate hospice care services in Los Angeles.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as 'en' | 'ko')) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Layout>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## Step 9 — `src/app/[locale]/page.tsx`

```tsx
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'home' });
  return { title: t('pageTitle') };
}

export default function HomePage() {
  const t = useTranslations('home');
  return (
    <div className="bg-neutral-warm">
      <section className="max-w-content mx-auto px-section-x py-section-y text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary-600 mb-6 whitespace-pre-line">
          {t('heroHeading')}
        </h1>
        <p className="text-lg text-text-secondary max-w-prose mx-auto mb-8 leading-relaxed">
          {t('heroSubtext')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/services" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
            bg-primary-500 text-white rounded-btn shadow-card hover:bg-primary-600 transition-colors duration-ui min-h-[44px]">
            {t('heroCta')}
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
            border-2 border-primary-500 text-primary-600 rounded-btn hover:bg-primary-50 transition-colors duration-ui min-h-[44px]">
            {t('heroCtaSecondary')}
          </Link>
        </div>
      </section>
    </div>
  );
}
```

---

## Step 10 — Cleanup

```powershell
Remove-Item "src\app\layout.tsx"
Remove-Item "src\app\page.tsx"
```

---

## Verification

```powershell
npm run dev
```

| Check | Expected |
|---|---|
| `localhost:3000/` | Redirects to `/en` |
| `localhost:3000/en` | English home with Header + Footer |
| `localhost:3000/ko` | Korean home, all nav in Korean |
| Click `한국어` on `/en` | URL switches to `/ko` |
| Click `English` on `/ko` | URL switches back to `/en` |
| Mobile 375px | Hamburger visible, menu opens/closes |
| `localhost:3000/fr` | 404 page |

```powershell
npx tsc --noEmit   # zero errors
npm run lint       # zero errors
```

---

## Common Pitfalls

| Problem | Fix |
|---|---|
| `No intl messages configured` | `messages/` must be at project root, not inside `src/` |
| `/` doesn't redirect to `/en` | Middleware matcher must include `'/'` explicitly |
| `Playfair_Display` not found | Use underscore: `Playfair_Display`, not `PlayfairDisplay` |
| Hydration error (two `<html>`) | Delete `src/app/layout.tsx` — only `[locale]/layout.tsx` should exist |
| `createNavigation` not found | next-intl v4 API; v3 used `createSharedPathnamesNavigation` |
