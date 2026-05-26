import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <SectionContainer bg="warm" ariaLabelledBy="hero-heading" innerClassName="!py-16 md:!py-24 lg:!py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <h1
            id="hero-heading"
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-600 mb-6 whitespace-pre-line leading-tight"
          >
            {t('heading')}
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-prose mb-8 leading-relaxed">
            {t('subtext')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/understanding-hospice"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
                bg-primary-500 text-white rounded-btn shadow-card
                hover:bg-primary-600 transition-colors duration-ui min-h-[44px]"
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
                border-2 border-primary-500 text-primary-600 rounded-btn
                hover:bg-primary-50 transition-colors duration-ui min-h-[44px]"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative hidden lg:flex items-center justify-center min-h-[24rem] rounded-card overflow-hidden
            bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-500/30"
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-secondary-500/40 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-primary-200/60 blur-3xl" />
          <div className="relative w-40 h-40 rounded-full bg-white/70 backdrop-blur-sm shadow-card-md" />
        </div>
      </div>
    </SectionContainer>
  );
}
