import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

export type DisclaimerVariant = 'educational' | 'medical';

type Props = {
  /**
   * 'educational' (default) — insurance/Medicare/legal framing, used by Day 3 info pages
   * and the Day 5 FAQ page.
   * 'medical' — clinical-guidance framing for the Day 5 For Families page
   * (medication, oxygen, dying-process content).
   */
  variant?: DisclaimerVariant;
};

const KEY_BY_VARIANT: Record<DisclaimerVariant, 'educationalDisclaimer' | 'medicalDisclaimer'> = {
  educational: 'educationalDisclaimer',
  medical: 'medicalDisclaimer',
};

export function Disclaimer({ variant = 'educational' }: Props) {
  const t = useTranslations('common');
  const messageKey = KEY_BY_VARIANT[variant];
  const message = t(messageKey);
  return (
    <aside
      role="note"
      aria-label={message}
      className="flex gap-3 bg-warning/10 border-l-4 border-warning rounded-r-card px-4 py-3 my-6"
    >
      <Icon name="info" className="w-5 h-5 mt-0.5 flex-shrink-0 text-warning" />
      <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
    </aside>
  );
}
