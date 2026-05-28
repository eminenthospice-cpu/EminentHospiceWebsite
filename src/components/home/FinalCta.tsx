import { useTranslations, useLocale } from 'next-intl';
import { Phone, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { Button } from '@/components/ui/primitives/Button';
import { imageSlots } from '@/lib/imageSlots';

export function FinalCta() {
  const t = useTranslations('home.finalCta');
  const locale = useLocale();
  const phoneTel = t('phoneNumberTel');
  const phoneDisplay = t('phoneNumberDisplay');
  const eyebrow = locale === 'ko' ? '저희에게 연락하세요' : 'Reach out today';

  return (
    <SectionContainer
      bg="primary"
      ariaLabelledBy="final-cta-heading"
      innerClassName="!py-section-2xl relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] bg-repeat"
        style={{ backgroundImage: `url(${imageSlots.homeFinalCtaTexture.src})`, backgroundSize: '256px 256px' }}
      />

      <Reveal className="relative">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow text-accent-warm-200 mb-5">{eyebrow}</p>
          <Parallax distance={8}>
            <h2
              id="final-cta-heading"
              className="font-heading text-display-2xl text-white mb-5 leading-tight"
            >
              <span className="italic">{t('title').split(' ')[0]}</span>{' '}
              {t('title').split(' ').slice(1).join(' ')}
            </h2>
          </Parallax>
          <p className="font-prose text-lg text-primary-100 leading-relaxed mb-10 max-w-prose-narrow mx-auto">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center items-stretch sm:items-center">
            <a
              href={`tel:${phoneTel}`}
              className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-btn shadow-float
                bg-white text-primary-700 hover:bg-accent-warm-50 hover:text-primary-800 transition-[transform,background-color,color] duration-fast
                min-h-[52px] press-tap
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              <Phone className="w-5 h-5 transition-transform duration-fast group-hover:scale-110" aria-hidden="true" strokeWidth={2} />
              <span className="font-medium">{t('call')}</span>
              <span className="text-display-lg font-heading tabular-nums tracking-tight leading-none">
                {phoneDisplay}
              </span>
            </a>

            <Button asChild variant="secondary" size="lg" className="border-white/50 text-white hover:bg-white/10 hover:text-white">
              <Link href="/referral">
                {t('refer')}
                <ArrowRight className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5" aria-hidden="true" strokeWidth={2} />
              </Link>
            </Button>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium
                text-primary-100 hover:text-white rounded-btn transition-colors duration-fast min-h-[48px]
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
