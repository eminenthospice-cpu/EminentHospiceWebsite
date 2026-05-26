import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';

export function PhilosophyBand() {
  const t = useTranslations('home.philosophy');

  return (
    <SectionContainer bg="cream" ariaLabelledBy="philosophy-heading">
      <div className="max-w-prose mx-auto text-center">
        <h2
          id="philosophy-heading"
          className="font-heading text-3xl md:text-4xl font-semibold text-primary-700 mb-6"
        >
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed mb-4">
          {t('paragraph1')}
        </p>
        <p className="text-lg text-text-secondary leading-relaxed">
          {t('paragraph2')}
        </p>
      </div>
    </SectionContainer>
  );
}
