import { useTranslations } from 'next-intl';
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

export function TeamDisciplinesDetail() {
  const t = useTranslations('services.sections.team');

  return (
    <>
      <p className="mb-6 leading-relaxed">{t('intro')}</p>
      <div className="space-y-5">
        {ROLES.map(({ key, icon }) => (
          <article
            key={key}
            id={`role-${key}`}
            className="bg-white rounded-card shadow-card p-5 scroll-mt-24"
            aria-labelledby={`role-${key}-h`}
          >
            <div className="flex gap-3 items-start mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
                <Icon name={icon} className="w-5 h-5" />
              </span>
              <h3
                id={`role-${key}-h`}
                className="font-heading text-lg font-semibold text-text-primary pt-1"
              >
                {t(`${key}.role`)}
              </h3>
            </div>
            <p className="leading-relaxed text-text-secondary">
              {t(`${key}.body`)}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
