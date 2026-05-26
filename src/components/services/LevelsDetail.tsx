import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';

type LevelKey = 'routine' | 'continuous' | 'gip' | 'respite';

const LEVELS: { key: LevelKey; icon: IconName }[] = [
  { key: 'routine',    icon: 'home' },
  { key: 'continuous', icon: 'heart' },
  { key: 'gip',        icon: 'hospital' },
  { key: 'respite',    icon: 'calendar' },
];

export function LevelsDetail() {
  const t = useTranslations('services.sections.levels');

  return (
    <>
      <p className="mb-6 leading-relaxed">{t('intro')}</p>
      <div className="space-y-6">
        {LEVELS.map(({ key, icon }) => (
          <article
            key={key}
            id={`level-${key}`}
            className="bg-white rounded-card shadow-card p-6 scroll-mt-24"
            aria-labelledby={`level-${key}-h`}
          >
            <div className="flex gap-3 items-start mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex-shrink-0">
                <Icon name={icon} className="w-5 h-5" />
              </span>
              <h3
                id={`level-${key}-h`}
                className="font-heading text-xl font-semibold text-text-primary pt-1"
              >
                {t(`${key}.title`)}
              </h3>
            </div>
            <p className="mb-3 leading-relaxed">{t(`${key}.summary`)}</p>
            <p className="mb-3 leading-relaxed text-text-secondary">
              {t(`${key}.clinical`)}
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              {t(`${key}.atHome`)}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-5 text-sm text-text-muted leading-relaxed">
        <Link
          href="/insurance"
          className="text-primary-600 hover:text-primary-700 underline font-medium"
        >
          {t('costFootnote')}
        </Link>
      </p>
    </>
  );
}
