import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Icon } from '@/components/ui/Icon';

export function PageBottomCta() {
  const t = useTranslations('common.pageBottomCta');
  const phone = useTranslations('common.phone');
  const phoneDisplay = phone('display');
  const phoneTel = phone('tel');

  return (
    <SectionContainer bg="primary" innerClassName="text-center" >
      <div data-print-hide className="max-w-2xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl mb-3">{t('title')}</h2>
        <p className="text-base md:text-lg text-primary-100 leading-relaxed mb-8">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${phoneTel}`}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-btn bg-white text-primary-700 font-semibold text-base hover:bg-neutral-cream transition-colors duration-ui focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 w-full sm:w-auto"
          >
            <Icon name="phone" className="w-5 h-5" />
            <span>
              {t('call')} {phoneDisplay}
            </span>
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-btn border-2 border-white text-white font-semibold text-base hover:bg-white/10 transition-colors duration-ui focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 w-full sm:w-auto"
          >
            {t('contact')}
          </Link>
          <Link
            href="/referral"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-btn border-2 border-white text-white font-semibold text-base hover:bg-white/10 transition-colors duration-ui focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 w-full sm:w-auto"
          >
            {t('refer')}
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
