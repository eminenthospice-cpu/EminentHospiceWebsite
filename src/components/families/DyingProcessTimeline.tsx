import { useTranslations } from 'next-intl';

const TIERS = [
  { key: 'weeks', signKeys: ['1', '2', '3', '4'] as const },
  { key: 'days', signKeys: ['1', '2', '3', '4', '5'] as const },
  { key: 'hours', signKeys: ['1', '2', '3', '4', '5'] as const },
] as const;

/**
 * 3-card timeline showing common signs in the weeks / days / hours ahead.
 * Cards are visual peers (not progressive disclosure) — readers benefit
 * from seeing all three at once. Mobile stacks vertically.
 *
 * Source: hospice industry-standard caregiver guidance. See PLACEHOLDERS.md
 * for the NLM fragment to verify against (Notebook 1 frag 32).
 */
export function DyingProcessTimeline() {
  const s = useTranslations('forFamilies.sections.dyingProcess');

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <div
          key={tier.key}
          className="bg-white rounded-card shadow-card p-5 border-t-4 border-primary-300"
        >
          <h3 className="font-heading font-semibold text-lg text-text-primary mb-3">
            {s(`${tier.key}.title`)}
          </h3>
          <ul className="space-y-2">
            {tier.signKeys.map((sk) => (
              <li
                key={sk}
                className="flex gap-2 items-start text-sm text-text-secondary leading-relaxed"
              >
                <span
                  aria-hidden
                  className="mt-2 inline-block w-1 h-1 rounded-full bg-primary-400 flex-shrink-0"
                />
                <span>{s(`${tier.key}.signs.${sk}`)}</span>
              </li>
            ))}
          </ul>
          {tier.key === 'hours' ? (
            <p className="mt-4 pt-3 border-t border-neutral-200 text-sm text-text-secondary italic leading-relaxed">
              {s('hours.hearingNote')}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
