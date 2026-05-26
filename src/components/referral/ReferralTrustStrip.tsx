import { useTranslations } from 'next-intl';
import { Icon, type IconName } from '@/components/ui/Icon';

const BADGES: Array<{ key: 'hipaa' | 'tls' | 'baa'; icon: IconName }> = [
  { key: 'hipaa', icon: 'shield' },
  { key: 'tls', icon: 'check' },
  { key: 'baa', icon: 'document' },
];

export function ReferralTrustStrip() {
  const t = useTranslations('referral.modeB.trustBadges');

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8" aria-label="Privacy protections in place">
      {BADGES.map(({ key, icon }) => (
        <li
          key={key}
          className="flex items-center gap-2 rounded-card border border-success/30 bg-success/5 px-3 py-2 text-sm text-text-primary"
        >
          <Icon name={icon} className="w-5 h-5 text-success shrink-0" />
          <span>{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}
