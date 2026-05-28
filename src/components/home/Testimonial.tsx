import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Reveal } from '@/components/motion/Reveal';

export function Testimonial() {
  const t = useTranslations('home.testimonial');

  return (
    <SectionContainer
      bg="white"
      ariaLabel="Family testimonial"
      className="bg-surface-paper"
      innerClassName="!py-section-2xl"
    >
      <Reveal>
        <figure className="max-w-3xl">
          <p className="rule-hair pt-4 text-eyebrow text-ink-500 mb-6">{t('provenance')}</p>
          <blockquote className="font-heading italic text-display-lg text-ink-900 leading-snug mb-8 max-w-prose">
            {t('quote')}
          </blockquote>
          <figcaption className="callout-marginalia max-w-xs">
            <cite className="not-italic text-eyebrow text-ink-500 uppercase tracking-[0.14em]">
              {t('attributionName')}
            </cite>
            <p className="mt-1 italic text-ink-700">{t('attributionRelation')}</p>
          </figcaption>
        </figure>
      </Reveal>
    </SectionContainer>
  );
}
