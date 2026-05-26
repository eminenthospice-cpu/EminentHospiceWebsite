import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

const WHO_TO_CALL_KEYS = ['hospice', 'socialWorker', 'chaplain', 'lifeline', 'nineEleven'] as const;
const HAVE_READY_KEYS = ['1', '2', '3', '4'] as const;

/**
 * Two-block reference: "Who to call" decision list + "Have ready for visits" checklist.
 * Designed to be printable — the global @media print rules in globals.css hide
 * navigation/sidebar/CTAs and expand the page for caregivers who print this for
 * the refrigerator door.
 */
export function CaregiverChecklist() {
  const s = useTranslations('forFamilies.sections.quickRef');
  const phone = useTranslations('common.phone');
  const phoneTel = phone('tel');
  const phoneDisplay = phone('display');

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-white rounded-card shadow-card p-5">
        <h3 className="flex items-center gap-2 font-heading font-semibold text-lg text-text-primary mb-4">
          <Icon name="phone" className="w-5 h-5 text-primary-600" />
          <span>{s('whoToCall.title')}</span>
        </h3>
        <dl className="space-y-3">
          {WHO_TO_CALL_KEYS.map((key) => (
            <div key={key}>
              <dt className="font-semibold text-text-primary text-sm mb-0.5">
                {key === 'hospice' ? (
                  <a
                    href={`tel:${phoneTel}`}
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {s(`whoToCall.items.${key}.label`)} — {phoneDisplay}
                  </a>
                ) : (
                  s(`whoToCall.items.${key}.label`)
                )}
              </dt>
              <dd className="text-sm text-text-secondary leading-relaxed">
                {s(`whoToCall.items.${key}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="bg-white rounded-card shadow-card p-5">
        <h3 className="flex items-center gap-2 font-heading font-semibold text-lg text-text-primary mb-4">
          <Icon name="book" className="w-5 h-5 text-primary-600" />
          <span>{s('haveReady.title')}</span>
        </h3>
        <ul className="space-y-2">
          {HAVE_READY_KEYS.map((key) => (
            <li
              key={key}
              className="flex gap-2 items-start text-sm text-text-secondary leading-relaxed"
            >
              <Icon
                name="check"
                className="w-4 h-4 mt-1 flex-shrink-0 text-success"
              />
              <span>{s(`haveReady.items.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
