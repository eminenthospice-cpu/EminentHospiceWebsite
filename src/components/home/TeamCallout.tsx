import { useTranslations, useLocale } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Reveal } from '@/components/motion/Reveal';

type RoleKey =
  | 'physician'
  | 'rn'
  | 'lvn'
  | 'msw'
  | 'chaplain'
  | 'aide'
  | 'bereavement'
  | 'volunteer';

const ROLES: RoleKey[] = [
  'physician',
  'rn',
  'lvn',
  'msw',
  'chaplain',
  'aide',
  'bereavement',
  'volunteer',
];

export function TeamCallout() {
  const t = useTranslations('home.team');
  const locale = useLocale();
  const eyebrow = locale === 'ko' ? '학제간 팀' : 'Interdisciplinary team';

  return (
    <SectionContainer
      bg="warm"
      ariaLabelledBy="team-heading"
      innerClassName="!py-section-2xl"
      className="bg-gradient-paper"
    >
      <Reveal>
        <div className="max-w-prose-wide mb-14 lg:mb-16">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-4 min-w-0">
            <span className="font-heading text-display-xl sm:text-display-2xl text-accent-warm-300 leading-none shrink-0" aria-hidden="true">
              &
            </span>
            <h2 id="team-heading" className="font-heading text-display-lg text-ink-900 min-w-0 flex-1">
              {t('title')}
            </h2>
          </div>
          <p className="lead">{t('intro')}</p>
        </div>
      </Reveal>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
        {ROLES.map((key) => (
          <li key={key} className="py-5 border-b border-line-soft">
            <p className="text-eyebrow text-ink-500 mb-2 uppercase tracking-[0.16em]">
              {t(`roles.${key}.name`)}
            </p>
            <p className="font-prose text-base text-ink-700 leading-relaxed">
              {t(`roles.${key}.desc`)}
            </p>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
