import { useTranslations } from 'next-intl';
import { Heart, ShieldCheck, Users, ClipboardCheck, Sparkles, type LucideIcon } from 'lucide-react';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

type ValueKey = 'respect' | 'compassion' | 'teamwork' | 'accountability' | 'serviceExcellence';

const VALUES: { key: ValueKey; Icon: LucideIcon; accent: string }[] = [
  { key: 'respect',           Icon: ShieldCheck,    accent: 'bg-primary-50 text-primary-700 ring-primary-100' },
  { key: 'compassion',        Icon: Heart,          accent: 'bg-accent-warm-50 text-accent-warm-700 ring-accent-warm-100' },
  { key: 'teamwork',          Icon: Users,          accent: 'bg-accent-sage-50 text-accent-sage-700 ring-accent-sage-100' },
  { key: 'accountability',    Icon: ClipboardCheck, accent: 'bg-secondary-500/15 text-primary-700 ring-secondary-500/20' },
  { key: 'serviceExcellence', Icon: Sparkles,       accent: 'bg-accent-warm-50 text-accent-warm-700 ring-accent-warm-100' },
];

export function MissionValues() {
  const t = useTranslations('about.sections.values');

  return (
    <>
      <p className="mb-8 leading-relaxed font-prose text-base md:text-lg text-text-secondary">{t('intro')}</p>
      <Stagger as="ul" className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {VALUES.map(({ key, Icon, accent }) => (
          <StaggerItem
            as="li"
            key={key}
            className="card-paper p-6 flex gap-4 items-start hover:shadow-card-md transition-shadow duration-base ease-editorial"
          >
            <span className={`inline-flex items-center justify-center w-11 h-11 rounded-full flex-shrink-0 ring-1 ${accent}`}>
              <Icon className="w-5 h-5" aria-hidden="true" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-1.5">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t(`items.${key}.body`)}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}
