import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

const CONDITION_KEYS = ['cancer', 'heart', 'copd', 'dementia', 'als', 'kidney'] as const;

export function EligibilityList() {
  const t = useTranslations('understandingHospice.sections.whoQualifies');
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
      {CONDITION_KEYS.map((key) => (
        <li
          key={key}
          className="flex gap-3 bg-white rounded-card shadow-card p-4"
        >
          <Icon name="check" className="w-5 h-5 mt-0.5 flex-shrink-0 text-success" />
          <div>
            <p className="font-heading font-semibold text-text-primary mb-1">
              {t(`conditions.${key}.name`)}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t(`conditions.${key}.desc`)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
