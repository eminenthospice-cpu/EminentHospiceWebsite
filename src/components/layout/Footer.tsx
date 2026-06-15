import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, Heart, Languages, Phone, Mail, MapPin, Award } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const phoneHref = `tel:${tCommon('phone.tel')}`;

  const careLinks = [
    { key: 'aboutUs',         href: '/about' },
    { key: 'hospiceServices', href: '/services' },
  ] as const;

  const resourceLinks = [
    { key: 'home',     href: '/' },
    { key: 'faq',      href: '/faq' },
    { key: 'contact',  href: '/contact' },
    { key: 'referral', href: '/referral' },
  ] as const;

  const legalLinks = [
    { key: 'privacy',       href: '/privacy' },
    { key: 'hipaaNotice',   href: '/hipaa-notice' },
    { key: 'accessibility', href: '/accessibility' },
    { key: 'terms',         href: '/terms' },
  ] as const;

  const certifications = [
    { Icon: ShieldCheck, label: locale === 'ko' ? '메디케어 인증' : 'Medicare Certified' },
    { Icon: Award,       label: locale === 'ko' ? '조인트 커미션 인증' : 'Joint Commission Accredited' },
    { Icon: Heart,       label: locale === 'ko' ? '연중무휴 24시간 상담' : '24/7 Care Available' },
    { Icon: Languages,   label: locale === 'ko' ? '이중언어 (영어/한국어)' : 'English & Korean' },
  ];

  return (
    <footer className="bg-primary-900 text-white mt-auto">
      {/* Certification strip */}
      <div className="border-b border-primary-800/60">
        <div className="max-w-content mx-auto px-section-x py-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-primary-100">
            {certifications.map(({ Icon, label }) => (
              <li key={label} className="flex items-center justify-center sm:justify-start gap-2.5">
                <span className="inline-flex items-center justify-center text-accent-warm-200">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
                </span>
                <span className="text-eyebrow font-semibold tracking-[0.12em] uppercase">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-content mx-auto px-section-x py-14 lg:py-16">
        <p className="font-heading italic text-display-lg text-accent-warm-200 mb-10">{t('flourish')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-2xl font-semibold text-white tracking-tight">
              Eminent Hospice Care
            </h2>
            <p className="mt-3 text-sm text-primary-200 leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Care column */}
          <nav aria-label={locale === 'ko' ? '돌봄' : 'Care'}>
            <h3 className="text-eyebrow font-semibold uppercase text-accent-warm-200 mb-4">
              {locale === 'ko' ? '돌봄' : 'Care'}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {careLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="link-target underline-grow text-sm text-primary-100 hover:text-white transition-colors duration-fast
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources column */}
          <nav aria-label={t('footerNav')}>
            <h3 className="text-eyebrow font-semibold uppercase text-accent-warm-200 mb-4">
              {locale === 'ko' ? '자료' : 'Resources'}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {resourceLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="link-target underline-grow text-sm text-primary-100 hover:text-white transition-colors duration-fast
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column */}
          <div>
            <h3 className="text-eyebrow font-semibold uppercase text-accent-warm-200 mb-4">
              {t('contactHeading')}
            </h3>
            <address className="not-italic text-sm text-primary-100 space-y-3">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-300 shrink-0" aria-hidden="true" strokeWidth={2} />
                <span>{t('address')}</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary-300 shrink-0" aria-hidden="true" strokeWidth={2} />
                <a
                  href={phoneHref}
                  className="link-target underline-grow hover:text-white transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  {t('phone')}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary-300 shrink-0" aria-hidden="true" strokeWidth={2} />
                <a
                  href={`mailto:${t('email')}`}
                  className="link-target underline-grow hover:text-white transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm break-all"
                >
                  {t('email')}
                </a>
              </p>
              <p className="text-primary-300 text-xs pt-1">{t('hours')}</p>
            </address>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-12 pt-6 border-t border-primary-800/60 space-y-4">
          <nav aria-label={t('legalLinksHeading')}>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-primary-300">
              {legalLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="link-target underline-grow hover:text-white transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                  >
                    {t(`legalLinks.${key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/sitemap.xml"
                  className="link-target underline-grow hover:text-white transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  {t('legalLinks.sitemap')}
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-400">
            <p>{t('copyright', { year: new Date().getFullYear() })}</p>
            <p>{t('licensedInCalifornia')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
