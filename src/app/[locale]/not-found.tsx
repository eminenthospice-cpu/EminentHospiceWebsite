import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Icon } from '@/components/ui/Icon';

// Locale-aware 404. Triggered by `notFound()` calls from inside a localized
// route. Inherits the locale layout chrome (Header + Footer), so this
// component just renders the page body.

export default function LocaleNotFound() {
  const t = useTranslations('notFound');
  const phone = useTranslations('common.phone');
  const phoneDisplay = phone('display');

  return (
    <SectionContainer bg="cream" innerClassName="text-center">
      <div className="max-w-prose mx-auto py-16">
        <p className="text-sm uppercase tracking-widest text-text-muted mb-3">404</p>
        <h1 className="font-heading text-4xl md:text-5xl text-text-primary leading-tight mb-4">
          {t('heading')}
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed mb-8">
          {t('body', { phone: phoneDisplay })}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-btn bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors duration-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Icon name="home" className="w-5 h-5" />
            {t('ctaHome')}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-btn border-2 border-primary-500 text-primary-600 font-semibold hover:bg-primary-50 transition-colors duration-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {t('ctaContact')}
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
