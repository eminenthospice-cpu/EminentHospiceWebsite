import { useTranslations } from 'next-intl';
import { Icon, type IconName } from '@/components/ui/Icon';

type AdditionalKey = 'oncall' | 'meds' | 'dme' | 'bereavement' | 'volunteer';

const ITEMS: { key: AdditionalKey; icon: IconName }[] = [
  { key: 'oncall',      icon: 'phone' },
  { key: 'meds',        icon: 'document' },
  { key: 'dme',         icon: 'briefcase' },
  { key: 'bereavement', icon: 'chat' },
  { key: 'volunteer',   icon: 'shield' },
];

export function AdditionalServices() {
  const t = useTranslations('services.sections.additional');

  return (
    <>
      <p className="mb-6 leading-relaxed">{t('intro')}</p>
      <dl className="space-y-3">
        {ITEMS.map(({ key, icon }) => (
          <div
            key={key}
            className="bg-white rounded-card shadow-card p-4 flex gap-3 items-start"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
              <Icon name={icon} className="w-4 h-4" />
            </span>
            <div>
              <dt className="font-heading font-semibold text-text-primary mb-1">
                {t(`${key}.title`)}
              </dt>
              <dd className="text-sm text-text-secondary leading-relaxed">
                {t(`${key}.body`)}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </>
  );
}
