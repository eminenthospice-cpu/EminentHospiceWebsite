import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

export function PatientRightsList() {
  const t = useTranslations('hospiceLaws.sections.patientRights');
  const items = t.raw('items') as string[];

  return (
    <ul className="space-y-3 list-none p-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <Icon
            name="check"
            className="w-5 h-5 mt-1 flex-shrink-0 text-success"
          />
          <span className="text-text-secondary leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
