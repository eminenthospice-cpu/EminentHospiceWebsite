import type { ReactNode } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Disclaimer, type DisclaimerVariant } from '@/components/ui/Disclaimer';
import { LastReviewed } from '@/components/ui/LastReviewed';
import { Reveal } from '@/components/motion/Reveal';
import { imageSlots, type ImageSlotKey } from '@/lib/imageSlots';

type Props = {
  /** h1 — the page title */
  title: string;
  /** Optional uppercase eyebrow label above the title (e.g. "About us") */
  eyebrow?: string;
  /** ISO date string, e.g. "2026-05-01" */
  lastReviewed?: string;
  /** Optional lead paragraph below h1 */
  introParagraph?: string;
  /** Optional editorial hero photograph above the article header. */
  heroImageKey?: ImageSlotKey;
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
  eyebrow,
  lastReviewed,
  introParagraph,
  heroImageKey,
  showDisclaimer = true,
  disclaimerVariant = 'educational',
  sidebar,
  children,
}: Props) {
  const locale = useLocale();
  const heroSlot = heroImageKey ? imageSlots[heroImageKey] : null;

  return (
    <>
      {heroSlot ? (
        <section
          aria-hidden="true"
          data-print-hide
          className="relative w-full h-[28vh] min-h-[14rem] md:h-[36vh] md:min-h-[18rem] overflow-hidden bg-neutral-100"
        >
          <Image
            src={heroSlot.src}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={heroSlot.blurDataURL}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-paper/0 via-surface-paper/40 to-surface-paper" />
        </section>
      ) : null}

      <SectionContainer
        bg="cream"
        innerClassName={`long-form !py-section-y md:!py-section-2xl ${heroSlot ? '!pt-10 md:!pt-12' : ''}`}
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14 min-w-0">
          <article className="max-w-prose min-w-0">
            <Reveal as="header" className="mb-10">
              {eyebrow ? (
                <p className="eyebrow mb-4">{eyebrow}</p>
              ) : null}
              <h1 className="font-heading text-display-lg md:text-display-xl text-text-primary leading-tight mb-4">
                {title}
              </h1>
              {lastReviewed ? <LastReviewed date={lastReviewed} /> : null}
              {introParagraph ? (
                <p
                  className="mt-6 font-prose text-lg md:text-xl text-text-secondary leading-relaxed max-w-prose-wide"
                  lang={locale}
                >
                  {introParagraph}
                </p>
              ) : null}
            </Reveal>

            {showDisclaimer ? <Disclaimer variant={disclaimerVariant} /> : null}

            <div className="space-y-14 text-text-secondary">{children}</div>
          </article>

          {sidebar}
        </div>
      </SectionContainer>
    </>
  );
}
