import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';

export function Testimonial() {
  const t = useTranslations('home.testimonial');

  return (
    <SectionContainer
      bg="white"
      ariaLabel="Family testimonial"
      className="bg-primary-50"
      innerClassName="!py-16 md:!py-20"
    >
      <figure className="max-w-3xl mx-auto text-center">
        <span
          aria-hidden="true"
          className="block font-heading text-6xl md:text-7xl leading-none text-primary-300 mb-4 select-none"
        >
          “
        </span>
        <blockquote className="font-heading italic text-xl md:text-2xl text-text-primary leading-relaxed mb-6">
          {t('quote')}
        </blockquote>
        <figcaption>
          <cite className="not-italic text-sm font-medium text-text-secondary tracking-wide">
            {t('attribution')}
          </cite>
        </figcaption>
      </figure>
    </SectionContainer>
  );
}
