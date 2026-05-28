'use client';

import { useTranslations } from 'next-intl';
import { Stat } from '@/components/ui/primitives/Stat';
import { ScaleIn } from '@/components/motion/ScaleIn';

const STAT_KEYS = ['stat1', 'stat2', 'stat3'] as const;

export function ByTheNumbers() {
  const t = useTranslations('home.byTheNumbers');

  return (
    <section
      aria-label={t('ariaLabel')}
      className="bg-surface-paper border-y border-line-soft"
    >
      <div className="max-w-content mx-auto px-section-x py-10 md:py-12">
        <ul className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-line-soft divide-y sm:divide-y-0 divide-line-soft">
          {STAT_KEYS.map((key, index) => (
            <li key={key} className="px-0 sm:px-8 py-8 sm:py-0 first:pt-0 last:pb-0 sm:first:pl-0 sm:last:pr-0">
              <ScaleIn origin="bottom center" delay={index * 0.08}>
                <Stat
                  value={t(`${key}.value`)}
                  label={t(`${key}.label`)}
                  align="center"
                  className="sm:items-center sm:text-center"
                />
              </ScaleIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
