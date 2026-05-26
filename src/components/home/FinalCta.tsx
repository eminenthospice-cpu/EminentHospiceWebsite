import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Icon } from '@/components/ui/Icon';

export function FinalCta() {
  const t = useTranslations('home.finalCta');
  const phoneTel = t('phoneNumberTel');
  const phoneDisplay = t('phoneNumberDisplay');

  return (
    <SectionContainer bg="primary" ariaLabelledBy="final-cta-heading">
      <div className="text-center max-w-2xl mx-auto">
        <h2
          id="final-cta-heading"
          className="font-heading text-3xl md:text-4xl font-semibold text-white mb-4"
        >
          {t('title')}
        </h2>
        <p className="text-base md:text-lg text-primary-100 leading-relaxed mb-8">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center items-stretch sm:items-center">
          <a
            href={`tel:${phoneTel}`}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 text-lg font-semibold
              bg-white text-primary-700 rounded-btn shadow-card-md
              hover:bg-primary-50 transition-colors duration-ui min-h-[52px]"
          >
            <Icon name="phone" className="w-5 h-5" />
            <span>{t('call')}</span>
            <span className="text-sm font-normal text-primary-600 ml-1">
              {phoneDisplay}
            </span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
              border-2 border-white text-white rounded-btn
              hover:bg-white/10 transition-colors duration-ui min-h-[44px]"
          >
            {t('contact')}
          </Link>

          <Link
            href="/referral"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
              border-2 border-white text-white rounded-btn
              hover:bg-white/10 transition-colors duration-ui min-h-[44px]"
          >
            {t('refer')}
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
