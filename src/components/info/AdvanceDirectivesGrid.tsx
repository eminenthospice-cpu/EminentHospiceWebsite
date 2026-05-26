import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

const CARDS: ReadonlyArray<{ key: 'livingWill' | 'dpoa' | 'polst'; icon: IconName }> = [
  { key: 'livingWill', icon: 'document' },
  { key: 'dpoa', icon: 'users' },
  { key: 'polst', icon: 'heart' },
];

export function AdvanceDirectivesGrid() {
  const t = useTranslations('hospiceLaws.sections.advanceDirectives');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CARDS.map(({ key, icon }) => (
        <article
          key={key}
          className="bg-white rounded-card shadow-card p-5 flex flex-col"
        >
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-3">
            <Icon name={icon} className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-text-primary mb-2">
            {t(`${key}.title`)}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t(`${key}.body`)}
          </p>
          {key === 'livingWill' && (
            <p className="text-xs text-text-muted leading-relaxed mt-3 pt-3 border-t border-neutral-200">
              {t('livingWill.caLawNote')}
            </p>
          )}
          {key === 'polst' && (
            <p className="text-xs text-text-muted leading-relaxed mt-3 pt-3 border-t border-neutral-200">
              {t('polst.paperColorNote')}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
