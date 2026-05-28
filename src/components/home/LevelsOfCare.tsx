'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Reveal } from '@/components/motion/Reveal';
import { EditorialFigure } from '@/components/ui/EditorialFigure';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/primitives/Tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/primitives/Accordion';
import type { ImageSlotKey } from '@/lib/imageSlots';
import { spring, ease } from '@/lib/motion';
import { cn } from '@/lib/cn';

type LevelKey = 'routine' | 'continuous' | 'inpatient' | 'respite';

const LEVELS: { key: LevelKey; num: string; slot: ImageSlotKey }[] = [
  { key: 'routine', num: '01', slot: 'homeLevelRoutine' },
  { key: 'continuous', num: '02', slot: 'homeLevelContinuous' },
  { key: 'inpatient', num: '03', slot: 'homeLevelInpatient' },
  { key: 'respite', num: '04', slot: 'homeLevelRespite' },
];

function LevelPreview({ levelKey }: { levelKey: LevelKey }) {
  const t = useTranslations('home.levels');
  const level = LEVELS.find((l) => l.key === levelKey)!;
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={levelKey}
        initial={prefersReducedMotion ? false : { opacity: 1, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 1, y: -6 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.15 }
            : { ...spring.crisp, ease: ease.out }
        }
        className="space-y-6"
      >
        <EditorialFigure
          slot={level.slot}
          aspect="4/3"
          sizes="(min-width: 768px) 42vw, 100vw"
        />
        <p className="font-prose text-lg text-ink-700 leading-relaxed max-w-prose">
          {t(`${levelKey}.desc`)}
        </p>
        <Link
          href="/services"
          className="underline-grow inline-flex items-center gap-1.5 min-h-11 py-2 text-sm font-medium text-primary-700 hover:text-primary-800"
        >
          {t('learnMore')}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

export function LevelsOfCare() {
  const t = useTranslations('home.levels');
  const locale = useLocale();
  const eyebrow = locale === 'ko' ? '네 가지 돌봄 단계' : 'Four levels of care';
  const [active, setActive] = useState<LevelKey>('routine');

  return (
    <SectionContainer bg="white" ariaLabelledBy="levels-heading" innerClassName="!py-section-2xl">
      <Reveal>
        <div className="max-w-prose-wide mb-14">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2
            id="levels-heading"
            className="font-heading text-display-lg text-ink-900 mb-4"
          >
            {t('title')}
          </h2>
          <p className="lead">{t('subtitle')}</p>
        </div>
      </Reveal>

      {/* Desktop: vertical tabs + preview */}
      <div className="hidden md:block">
        <Tabs
          value={active}
          onValueChange={(v) => setActive(v as LevelKey)}
          orientation="vertical"
          className="flex gap-12 lg:gap-16"
        >
          <TabsList className="flex flex-col h-auto w-full max-w-md shrink-0 gap-0 bg-transparent p-0 rounded-none">
            {LEVELS.map(({ key, num }) => (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  'group w-full justify-between gap-4 rounded-none border-b border-line-soft px-0 py-5 min-h-[72px]',
                  'bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                  'data-[state=active]:text-ink-900 data-[state=inactive]:text-ink-500',
                  'hover:text-primary-700 text-left',
                )}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-heading text-2xl tabular-nums text-accent-warm-500 leading-none">
                    {num}
                  </span>
                  <span className="font-heading text-lg font-semibold">{t(`${key}.title`)}</span>
                </span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-fast group-data-[state=active]:translate-x-0.5 group-data-[state=active]:opacity-100"
                  aria-hidden="true"
                />
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 min-w-0">
            {LEVELS.map(({ key }) => (
              <TabsContent key={key} value={key} className="mt-0 focus-visible:ring-offset-0">
                {active === key ? <LevelPreview levelKey={key} /> : null}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Mobile: accordion */}
      <div className="md:hidden border-t border-line-soft">
        <Accordion type="single" collapsible defaultValue="routine">
          {LEVELS.map(({ key, num, slot }) => (
            <AccordionItem key={key} value={key} className="border-line-soft">
              <AccordionTrigger className="gap-4">
                <span className="flex items-baseline gap-3">
                  <span className="font-heading text-xl tabular-nums text-accent-warm-500">
                    {num}
                  </span>
                  <span>{t(`${key}.title`)}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-5 pb-2">
                  <EditorialFigure slot={slot} aspect="4/3" />
                  <p className="text-ink-700 leading-relaxed">{t(`${key}.desc`)}</p>
                  <Link
                    href="/services"
                    className="underline-grow inline-flex items-center gap-1.5 text-sm font-medium text-primary-700"
                  >
                    {t('learnMore')}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
}
