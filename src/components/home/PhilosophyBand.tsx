import { useTranslations, useLocale } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Marginalia } from '@/components/ui/primitives/Marginalia';
import { EditorialFigure } from '@/components/ui/EditorialFigure';
import { Reveal } from '@/components/motion/Reveal';

export function PhilosophyBand() {
  const t = useTranslations('home.philosophy');
  const locale = useLocale();
  const eyebrow = locale === 'ko' ? '우리의 철학' : 'Our Philosophy';

  return (
    <SectionContainer
      bg="cream"
      ariaLabelledBy="philosophy-heading"
      className="bg-surface-canvas overflow-x-clip"
      innerClassName="!py-section-2xl"
    >
      <div className="rule-hair mb-12 md:mb-16" aria-hidden="true" />

      <div className="grid grid-cols-1 min-w-0 lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="lg:col-span-7 min-w-0">
          <Reveal>
            <p className="eyebrow mb-5">{eyebrow}</p>
            <h2
              id="philosophy-heading"
              className="font-heading text-display-lg text-ink-900 mb-8 max-w-full"
            >
              {t('title')}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="lead mb-8">{t('paragraph1')}</p>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="font-prose text-lg text-ink-700 leading-relaxed max-w-prose">
              {t('paragraph2')}
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-10">
          <Reveal delay={0.1}>
            <Marginalia sticky>{t('marginalia')}</Marginalia>
          </Reveal>
          <Reveal delay={0.14}>
            <EditorialFigure
              slot="homePhilosophyPortrait"
              aspect="4/5"
              bleed="right"
              sizes="(min-width: 1024px) 28vw, 85vw"
            />
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
