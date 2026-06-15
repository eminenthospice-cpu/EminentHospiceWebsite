import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

const REGIONS = ['losAngeles', 'orange', 'sanBernardino', 'riverside', 'ventura'] as const;

export function ServiceArea() {
  const t = useTranslations('about.sections.serviceArea');

  return (
    <>
      <p className="mb-6 leading-relaxed">{t('body')}</p>

      <h3 className="font-heading font-semibold text-text-primary mb-3 flex items-center gap-2">
        <Icon name="mapPin" className="w-5 h-5 text-primary-600" />
        {t('regionsHeading')}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {REGIONS.map((key) => (
          <li
            key={key}
            className="bg-white rounded-card shadow-card px-4 py-3 text-sm text-text-secondary"
          >
            {t(`regions.${key}`)}
          </li>
        ))}
      </ul>

      <p className="text-sm text-text-muted leading-relaxed bg-neutral-100 rounded-card px-4 py-3 flex items-start gap-2">
        <Icon name="calendar" className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" />
        <span>{t('hoursNote')}</span>
      </p>
    </>
  );
}
