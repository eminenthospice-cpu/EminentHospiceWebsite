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
