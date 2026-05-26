import { useTranslations, useLocale } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

const BULLETS = ['bilingual', 'koreanStaff', 'traditions', 'chaplainCoord'] as const;

export function CulturalCompetence() {
  const t = useTranslations('about.sections.culturalCompetence');
  const locale = useLocale();

  return (
    <div className="bg-primary-50 rounded-card p-6 border-l-4 border-primary-500">
      {locale === 'en' ? (
        <p
          lang="ko"
          className="text-sm text-primary-900/80 mb-3 leading-relaxed"
        >
          {t('koreanIntro')}
        </p>
      ) : null}
      <p className="mb-5 leading-relaxed text-text-primary">{t('intro')}</p>
      <ul className="space-y-3 mb-5">
        {BULLETS.map((key) => (
          <li key={key} className="flex gap-3 items-start">
            <Icon
              name="check"
              className="w-5 h-5 mt-0.5 text-primary-600 flex-shrink-0"
            />
            <span className="text-sm text-text-secondary leading-relaxed">
              {t(`bullets.${key}`)}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-text-muted leading-relaxed italic">
        {t('note')}
      </p>
    </div>
  );
}
