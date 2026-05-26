import { useTranslations } from 'next-intl';

const ROW_KEYS = [
  'coverage',
  'roomBoard',
  'eligibility',
  'election',
  'familyPay',
] as const;

export function CoverageTable() {
  const t = useTranslations('insurance.sections.comparison');

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">{t('tableCaption')}</caption>
        <thead>
          <tr className="border-b-2 border-primary-200 bg-primary-50/60">
            <th scope="col" className="text-left font-heading font-semibold text-text-primary px-4 py-3">
              {t('headers.service')}
            </th>
            <th scope="col" className="text-left font-heading font-semibold text-text-primary px-4 py-3">
              {t('headers.medicare')}
            </th>
            <th scope="col" className="text-left font-heading font-semibold text-text-primary px-4 py-3">
              {t('headers.medical')}
            </th>
            <th scope="col" className="text-left font-heading font-semibold text-text-primary px-4 py-3">
              {t('headers.private')}
            </th>
          </tr>
        </thead>
        <tbody>
          {ROW_KEYS.map((key) => (
            <tr key={key} className="border-b border-neutral-200 last:border-b-0">
              <th scope="row" className="text-left font-semibold text-text-primary px-4 py-3 align-top">
                {t(`rows.${key}.label`)}
              </th>
              <td className="text-text-secondary px-4 py-3 align-top">
                {t(`rows.${key}.medicare`)}
              </td>
              <td className="text-text-secondary px-4 py-3 align-top">
                {t(`rows.${key}.medical`)}
              </td>
              <td className="text-text-secondary px-4 py-3 align-top">
                {t(`rows.${key}.private`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
