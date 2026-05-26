import { useTranslations } from 'next-intl';

type MythItem = { myth: string; fact: string };

export function MythsList() {
  const t = useTranslations('understandingHospice.sections.myths');
  const items = t.raw('items') as MythItem[];

  return (
    <ol className="space-y-5 list-none p-0">
      {items.map((item, i) => (
        <li
          key={i}
          className="bg-white rounded-card shadow-card p-5 border-l-4 border-primary-300"
        >
          <p className="font-heading font-semibold text-text-primary text-lg mb-2">
            <span className="text-text-muted text-sm uppercase tracking-wider mr-2">
              {t('mythLabel')}
            </span>
            {item.myth}
          </p>
          <p className="text-text-secondary leading-relaxed">
            <span className="text-primary-700 text-sm uppercase tracking-wider font-semibold mr-2">
              {t('factLabel')}
            </span>
            {item.fact}
          </p>
        </li>
      ))}
    </ol>
  );
}
