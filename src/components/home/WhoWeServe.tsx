import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Icon, type IconName } from '@/components/ui/Icon';

type TileKey = 'area' | 'languages' | 'coverage';

const TILES: { key: TileKey; icon: IconName }[] = [
  { key: 'area',      icon: 'mapPin' },
  { key: 'languages', icon: 'language' },
  { key: 'coverage',  icon: 'shield' },
];

export function WhoWeServe() {
  const t = useTranslations('home.whoWeServe');

  return (
    <SectionContainer bg="white" ariaLabelledBy="who-we-serve-heading">
      <div className="text-center mb-10">
        <h2
          id="who-we-serve-heading"
          className="font-heading text-3xl md:text-4xl font-semibold text-primary-700"
        >
          {t('title')}
        </h2>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {TILES.map(({ key, icon }) => (
          <li
            key={key}
            className="bg-neutral-cream rounded-card p-6 text-center flex flex-col items-center"
          >
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-700 mb-4">
              <Icon name={icon} className="w-7 h-7" />
            </span>
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
              {t(`${key}.title`)}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t(`${key}.desc`)}
            </p>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
