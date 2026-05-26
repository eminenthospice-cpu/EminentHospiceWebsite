import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Icon, type IconName } from '@/components/ui/Icon';

type LevelKey = 'routine' | 'continuous' | 'inpatient' | 'respite';

const LEVELS: { key: LevelKey; icon: IconName }[] = [
  { key: 'routine',    icon: 'home' },
  { key: 'continuous', icon: 'heart' },
  { key: 'inpatient',  icon: 'hospital' },
  { key: 'respite',    icon: 'calendar' },
];

export function LevelsOfCare() {
  const t = useTranslations('home.levels');

  return (
    <SectionContainer bg="white" ariaLabelledBy="levels-heading">
      <div className="text-center max-w-prose mx-auto mb-12">
        <h2
          id="levels-heading"
          className="font-heading text-3xl md:text-4xl font-semibold text-primary-700 mb-4"
        >
          {t('title')}
        </h2>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {LEVELS.map(({ key, icon }) => (
          <li
            key={key}
            className="group bg-white rounded-card shadow-card p-6 flex flex-col
              hover:shadow-card-md transition-shadow duration-ui
              focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-4">
              <Icon name={icon} className="w-6 h-6" />
            </span>
            <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">
              {t(`${key}.title`)}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
              {t(`${key}.desc`)}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600
                hover:text-primary-700 transition-colors duration-ui self-start"
            >
              {t('learnMore')}
              <Icon name="arrowRight" className="w-4 h-4 transition-transform duration-ui group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
