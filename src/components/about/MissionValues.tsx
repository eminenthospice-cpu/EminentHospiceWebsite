import { useTranslations } from 'next-intl';
import { Icon, type IconName } from '@/components/ui/Icon';

type ValueKey = 'compassion' | 'dignity' | 'culturalHumility' | 'clinicalExcellence';

const VALUES: { key: ValueKey; icon: IconName }[] = [
  { key: 'compassion',          icon: 'heart' },
  { key: 'dignity',             icon: 'shield' },
  { key: 'culturalHumility',    icon: 'globe' },
  { key: 'clinicalExcellence',  icon: 'sparkles' },
];

export function MissionValues() {
  const t = useTranslations('about.sections.values');

  return (
    <>
      <p className="mb-6 leading-relaxed">{t('intro')}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VALUES.map(({ key, icon }) => (
          <li
            key={key}
            className="bg-white rounded-card shadow-card p-5 flex gap-4 items-start"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
              <Icon name={icon} className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-heading text-base font-semibold text-text-primary mb-1">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t(`items.${key}.body`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
