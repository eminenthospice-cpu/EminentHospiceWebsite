import { useTranslations, useLocale } from 'next-intl';
import { Phone, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Reveal } from '@/components/motion/Reveal';

export function PageBottomCta() {
  const t = useTranslations('common.pageBottomCta');
  const phone = useTranslations('common.phone');
  const locale = useLocale();
  const phoneDisplay = phone('display');
  const phoneTel = phone('tel');
  const eyebrow = locale === 'ko' ? '저희에게 연락하세요' : 'Ready to talk?';

  return (
    <SectionContainer
      bg="primary"
      innerClassName="!py-section-2xl relative overflow-hidden text-center"
    >
      {/* Atmospheric overlays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-12 w-72 h-72 rounded-full
          bg-secondary-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-12 w-64 h-64 rounded-full
          bg-accent-warm-400/15 blur-3xl"
      />

      <Reveal className="relative">
        <div data-print-hide className="max-w-2xl mx-auto">
          <p className="eyebrow text-accent-warm-200 mb-5">{eyebrow}</p>
          <h2 className="font-heading text-display-lg text-white mb-5 leading-tight">
            {t('title')}
          </h2>
          <p className="font-prose text-lg text-primary-100 leading-relaxed mb-10 max-w-prose-narrow mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch justify-center gap-3 sm:gap-4">
            <a
              href={`tel:${phoneTel}`}
              className="group inline-flex items-center justify-center gap-2 min-h-[52px] px-7 py-4 rounded-btn
                bg-white text-primary-700 font-semibold text-base shadow-card-lg
                hover:bg-accent-warm-50 hover:text-primary-800 transition-colors duration-fast
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              <Phone className="w-5 h-5 transition-transform duration-fast group-hover:scale-110" aria-hidden="true" strokeWidth={2} />
              <span>{t('call')} {phoneDisplay}</span>
            </a>
            <Link
              href="/referral"
              className="group inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3.5 rounded-btn
                border-2 border-white/40 text-white font-medium text-base
                hover:bg-white/10 hover:border-white transition-colors duration-fast
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              {t('refer')}
              <ArrowRight className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5" aria-hidden="true" strokeWidth={2} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3.5 rounded-btn
                text-primary-100 hover:text-white font-medium text-base transition-colors duration-fast
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              {t('contact')}
            </Link>
          </div>
        </div>
      </Reveal>
    </SectionContainer>
  );
}
