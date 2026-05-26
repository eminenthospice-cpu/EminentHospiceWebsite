import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

type Variant = 'contact' | 'referralModeA' | 'referralModeB';

type Props = {
  variant: Variant;
  retentionDays?: number;
};

export function FormPrivacyNotice({ variant, retentionDays }: Props) {
  const t = useTranslations('common.formPrivacyShort');
  const message =
    variant === 'referralModeB' ? t(variant, { days: retentionDays ?? 30 }) : t(variant);

  return (
    <div className="rounded-card border border-neutral-200 bg-neutral-cream/60 p-3 text-sm text-text-secondary flex items-start gap-2">
      <Icon name="shield" className="w-5 h-5 mt-0.5 shrink-0 text-primary-600" />
      <p>{message}</p>
    </div>
  );
}
