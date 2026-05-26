import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
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

export function IdgTeamDetail() {
  const t = useTranslations('about.sections.team');
  const r = useTranslations('home.team.roles');

  return (
    <>
      <p className="mb-5 leading-relaxed">{t('intro')}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {ROLES.map(({ key, icon }) => (
          <li key={key}>
            <Link
              href={`/services#role-${key}`}
              className="group block bg-white rounded-card shadow-card p-4
                hover:shadow-card-md transition-shadow duration-ui
                focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <div className="flex gap-3 items-start">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
                  <Icon name={icon} className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-text-primary text-sm mb-0.5">
                    {r(`${key}.name`)}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {r(`${key}.desc`)}
                  </p>
                </div>
                <Icon
                  name="arrowRight"
                  className="w-4 h-4 mt-1 text-primary-600 transition-transform duration-ui group-hover:translate-x-0.5 flex-shrink-0"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          {t('viewServicesLink')}
        </Link>
      </p>
    </>
  );
}
