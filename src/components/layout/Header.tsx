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
