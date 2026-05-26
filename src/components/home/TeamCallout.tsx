import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Icon, type IconName } from '@/components/ui/Icon';

type RoleKey =
  | 'physician'
  | 'rn'
  | 'lvn'
  | 'msw'
  | 'chaplain'
  | 'aide'
  | 'bereavement'
  | 'volunteer';

const ROLES: { key: RoleKey; icon: IconName }[] = [
  { key: 'physician',   icon: 'briefcase' },
  { key: 'rn',          icon: 'heart' },
  { key: 'lvn',         icon: 'handHeart' },
  { key: 'msw',         icon: 'users' },
  { key: 'chaplain',    icon: 'sparkles' },
  { key: 'aide',        icon: 'sun' },
  { key: 'bereavement', icon: 'chat' },
  { key: 'volunteer',   icon: 'shield' },
];

export function TeamCallout() {
  const t = useTranslations('home.team');

  return (
    <SectionContainer bg="warm" ariaLabelledBy="team-heading">
      <div className="text-center max-w-prose mx-auto mb-12">
        <h2
          id="team-heading"
          className="font-heading text-3xl md:text-4xl font-semibold text-primary-700 mb-4"
        >
          {t('title')}
        </h2>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed">
          {t('intro')}
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
        {ROLES.map(({ key, icon }) => (
          <li key={key} className="flex gap-4 items-start">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
              <Icon name={icon} className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading text-base font-semibold text-text-primary mb-1">
                {t(`roles.${key}.name`)}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t(`roles.${key}.desc`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
