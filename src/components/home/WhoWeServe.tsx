import { useTranslations, useLocale } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Reveal } from '@/components/motion/Reveal';

type ItemKey = 'area' | 'languages' | 'coverage';

const ITEMS: { key: ItemKey; num: string }[] = [
  { key: 'area', num: '01' },
  { key: 'languages', num: '02' },
  { key: 'coverage', num: '03' },
];

export function WhoWeServe() {
  const t = useTranslations('home.whoWeServe');
  const locale = useLocale();
  const eyebrow = locale === 'ko' ? '우리가 돕는 분들' : 'Who we serve';

  return (
    <SectionContainer bg="white" ariaLabelledBy="who-we-serve-heading" innerClassName="!py-section-2xl">
      <Reveal>
        <div className="mb-10 max-w-prose-wide">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2
            id="who-we-serve-heading"
            className="font-heading text-display-lg text-ink-900 mb-4"
          >
            {t('title')}
          </h2>
        </div>
      </Reveal>

      <div className="border-t border-line-soft pt-6">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {ITEMS.map(({ key, num }) => (
            <li key={key} className="text-left">
              <p className="font-heading text-2xl tabular-nums text-accent-warm-500 leading-none mb-3">
                {num}
              </p>
              <h3 className="font-heading text-xl text-ink-900 mb-2">{t(`${key}.title`)}</h3>
              <p className="font-prose text-base text-ink-700 leading-relaxed">{t(`${key}.desc`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
