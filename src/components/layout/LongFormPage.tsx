import type { ReactNode } from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Disclaimer, type DisclaimerVariant } from '@/components/ui/Disclaimer';
import { LastReviewed } from '@/components/ui/LastReviewed';

type Props = {
  /** h1 — the page title */
  title: string;
  /** ISO date string, e.g. "2026-05-01" */
  lastReviewed?: string;
  /** Optional lead paragraph below h1 */
  introParagraph?: string;
  /** Show the educational-content disclaimer (Day 3 info pages). Defaults to true. */
  showDisclaimer?: boolean;
  /**
   * Which disclaimer copy to render when showDisclaimer is true.
   * Defaults to 'educational' (Day 3 info pages + Day 5 FAQ).
   * Day 5 For Families passes 'medical'.
   */
  disclaimerVariant?: DisclaimerVariant;
  /** Sidebar content (PageSidebar) */
  sidebar: ReactNode;
  /** Main content */
  children: ReactNode;
};

export function LongFormPage({
  title,
  lastReviewed,
  introParagraph,
  showDisclaimer = true,
  disclaimerVariant = 'educational',
  sidebar,
  children,
}: Props) {
  return (
    <SectionContainer bg="cream" innerClassName="long-form">
      <div className="lg:grid lg:grid-cols-[1fr_18rem] lg:gap-12">
        <article className="max-w-prose">
          <header className="mb-8">
            <h1 className="font-heading text-4xl md:text-5xl text-text-primary leading-tight mb-3">
              {title}
            </h1>
            {lastReviewed ? <LastReviewed date={lastReviewed} /> : null}
            {introParagraph ? (
              <p className="mt-5 text-lg text-text-secondary leading-relaxed">
                {introParagraph}
              </p>
            ) : null}
          </header>

          {showDisclaimer ? <Disclaimer variant={disclaimerVariant} /> : null}

          <div className="space-y-12 text-text-secondary">{children}</div>
        </article>

        {sidebar}
      </div>
    </SectionContainer>
  );
}
