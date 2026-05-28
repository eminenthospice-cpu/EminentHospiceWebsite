'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Phone, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, usePathname } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/primitives/Dialog';
import { Button } from '@/components/ui/primitives/Button';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/cn';

type NavKey =
  | 'home'
  | 'aboutUs'
  | 'hospiceServices'
  | 'understandingHospice'
  | 'hospiceLaws'
  | 'forFamilies'
  | 'insurance'
  | 'faq'
  | 'contact'
  | 'referral';

type NavLink = { key: NavKey; href: string };

export function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const phoneDisplay = tCommon('phone.display');
  const phoneHref = `tel:${tCommon('phone.tel')}`;
  const locale = useLocale();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [utilityVisible, setUtilityVisible] = useState(true);
  const [mainCompact, setMainCompact] = useState(false);

  const primaryNavLinks: NavLink[] = [
    { key: 'home',            href: '/' },
    { key: 'aboutUs',         href: '/about' },
    { key: 'hospiceServices', href: '/services' },
  ];

  const resourceLinks: NavLink[] = [
    { key: 'understandingHospice', href: '/understanding-hospice' },
    { key: 'hospiceLaws',          href: '/hospice-laws' },
    { key: 'forFamilies',          href: '/for-families' },
    { key: 'insurance',            href: '/insurance' },
    { key: 'faq',                  href: '/faq' },
  ];

  const trailingNavLinks: NavLink[] = [
    { key: 'contact', href: '/contact' },
  ];

  // Mobile drawer keeps everything flat so nothing is hidden behind a dropdown on touch.
  const mobileNavLinks: NavLink[] = [
    ...primaryNavLinks,
    ...resourceLinks,
    ...trailingNavLinks,
    { key: 'referral', href: '/referral' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isResourcesActive = resourceLinks.some((link) => isActive(link.href));

  // Scroll-shrink: hide utility bar past 80px scroll.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (prefersReducedMotion) {
      setUtilityVisible(true);
      return;
    }
    setUtilityVisible(y < 80);
    setMainCompact(y >= 80);
  });

  // Close mobile drawer on route change. (Radix DropdownMenu closes itself on item click.)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const referLabel = locale === 'ko' ? '환자 의뢰' : 'Refer a Patient';
  const availableLabel = locale === 'ko' ? '연중무휴 24시간 상담 가능' : '24/7 Care Available';

  return (
    <header className="sticky top-0 z-fixed bg-surface-elevated/95 backdrop-blur-sm shadow-header">
      <a href="#main-content" className="skip-link">
        {t('skipToMain')}
      </a>

      {/* Utility bar — collapses past scroll threshold for a calmer scrolled state */}
      <motion.div
        aria-hidden={!utilityVisible}
        initial={false}
        animate={prefersReducedMotion ? { height: 'auto', opacity: 1 } : { height: utilityVisible ? 'auto' : 0, opacity: utilityVisible ? 1 : 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden bg-primary-900 text-primary-100"
      >
        <div className="max-w-content-wide mx-auto px-section-x 2xl:px-8">
          <div className="flex items-center justify-between gap-4 py-2 text-xs min-h-11">
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 min-h-11 py-2 font-medium text-white hover:text-accent-warm-200
                transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              <span className="tracking-[0.05em]">{phoneDisplay}</span>
              <span className="hidden sm:inline text-primary-300">·</span>
              <span className="hidden sm:inline text-primary-200">{availableLabel}</span>
            </a>
            <Link
              href="/referral"
              className="inline-flex items-center gap-1.5 min-h-11 py-2 font-medium text-accent-warm-200 hover:text-white
                transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            >
              {referLabel}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main nav bar */}
      <div className="max-w-content-wide mx-auto px-section-x 2xl:px-8">
        <motion.div
          className="flex items-center justify-between gap-4 lg:gap-8 overflow-visible"
          initial={false}
          animate={{ minHeight: mainCompact ? '4rem' : '5.5rem' }}
          transition={prefersReducedMotion ? { duration: 0 } : spring.snap}
        >
          <Link
            href="/"
            aria-label={t('homeLinkAriaLabel')}
            className="flex shrink-0 flex-col leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
          >
            <span className="font-heading text-xl lg:text-2xl font-semibold text-primary-700 tracking-tight whitespace-nowrap">
              Eminent Hospice Care
            </span>
            <span className="text-[0.7rem] text-text-muted font-body tracking-[0.18em] uppercase">
              {locale === 'ko' ? '에미넌트 호스피스 케어' : 'A Tradition of Compassion'}
            </span>
          </Link>

          <nav
            aria-label={t('mainNav')}
            className="hidden lg:flex flex-1 items-center justify-center gap-1 min-w-0"
          >
            {primaryNavLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={cn(
                  'relative underline-grow whitespace-nowrap px-3 py-2.5 min-h-11 text-sm font-medium rounded-btn transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  isActive(href)
                    ? 'text-primary-700'
                    : 'text-text-secondary hover:text-primary-700',
                )}
              >
                {t(key)}
                {isActive(href) ? (
                  prefersReducedMotion ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-500" />
                  ) : (
                    <motion.span
                      layoutId="header-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )
                ) : null}
              </Link>
            ))}

            {/* Resources dropdown — groups educational/informational content */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                aria-label={t('resourcesAriaLabel')}
                className={cn(
                  'group relative inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 min-h-11 text-sm font-medium rounded-btn transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'data-[state=open]:text-primary-700',
                  isResourcesActive
                    ? 'text-primary-700'
                    : 'text-text-secondary hover:text-primary-700',
                )}
              >
                {t('resources')}
                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform duration-fast ease-editorial group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                  strokeWidth={2}
                />
                {isResourcesActive ? (
                  prefersReducedMotion ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-500" />
                  ) : (
                    <motion.span
                      layoutId="header-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )
                ) : null}
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="center"
                  sideOffset={8}
                  className={cn(
                    'z-fixed min-w-[18rem] rounded-organic border border-line-soft bg-surface-paper p-2',
                    'shadow-float',
                    'data-[state=open]:animate-fade-in',
                    'focus:outline-none',
                  )}
                >
                  {resourceLinks.map(({ key, href }) => (
                    <DropdownMenu.Item key={key} asChild>
                      <Link
                        href={href}
                        aria-current={isActive(href) ? 'page' : undefined}
                        className={cn(
                          'block w-full px-3 py-3 text-sm font-medium rounded-btn transition-colors duration-fast cursor-pointer',
                          'focus:outline-none focus:bg-tint-ivory focus:text-primary-700',
                          'data-[highlighted]:bg-tint-ivory data-[highlighted]:text-primary-700',
                          isActive(href)
                            ? 'text-primary-700 bg-tint-ivory'
                            : 'text-text-secondary hover:text-primary-700 hover:bg-tint-ivory',
                        )}
                      >
                        {t(key)}
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {trailingNavLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={cn(
                  'relative underline-grow whitespace-nowrap px-3 py-2.5 min-h-11 text-sm font-medium rounded-btn transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  isActive(href)
                    ? 'text-primary-700'
                    : 'text-text-secondary hover:text-primary-700',
                )}
              >
                {t(key)}
                {isActive(href) ? (
                  prefersReducedMotion ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-500" />
                  ) : (
                    <motion.span
                      layoutId="header-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button asChild size="sm" className="hidden lg:inline-flex">
              <Link href="/referral">
                {referLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              </Link>
            </Button>
            <LocaleSwitcher />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={t('openMenu')}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-btn
                text-text-primary hover:bg-primary-50 transition-colors duration-fast
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile drawer — full-screen editorial */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          showCloseButton={false}
          className="!max-w-full !w-full !h-[100dvh] !rounded-none !left-0 !top-0 !translate-x-0 !translate-y-0
            !grid-rows-[auto_1fr_auto] !p-0 !gap-0"
        >
          <div className="flex items-center justify-between px-section-x h-16 lg:h-20 border-b border-neutral-200">
            <span className="font-heading text-xl font-semibold text-primary-700">{t('mainNav')}</span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label={t('closeMenu')}
              className="inline-flex items-center justify-center w-11 h-11 rounded-btn text-text-primary
                hover:bg-primary-50 transition-colors duration-fast
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <DialogTitle className="sr-only">{t('mainNav')}</DialogTitle>
          <DialogDescription className="sr-only">{t('mobileNav')}</DialogDescription>
          <nav aria-label={t('mobileNav')} className="overflow-y-auto px-section-x py-6">
            <ul className="flex flex-col gap-1">
              {mobileNavLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between px-3 py-4 font-heading text-xl rounded-btn',
                      'transition-colors duration-fast',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      isActive(href)
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-text-primary hover:text-primary-700 hover:bg-primary-50',
                    )}
                  >
                    <span>{t(key)}</span>
                    <ArrowRight className="h-4 w-4 text-text-muted" aria-hidden="true" strokeWidth={2} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-neutral-200 bg-surface-paper px-section-x py-5">
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 min-h-11 py-2 text-base font-medium text-primary-700 hover:text-primary-800"
            >
              <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              {phoneDisplay}
            </a>
            <p className="mt-1 text-sm text-text-muted">{availableLabel}</p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
