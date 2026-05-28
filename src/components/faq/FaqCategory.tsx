import { useTranslations } from 'next-intl';
import { FaqItem } from '@/components/faq/FaqItem';
import { Reveal } from '@/components/motion/Reveal';

type Props = {
  /** Category key (gettingStarted / aboutHospice / insurance / families / rights) */
  categoryKey: string;
  /** Ordered list of item keys to render under this category */
  itemKeys: readonly string[];
  /** Index (used for staggered reveal delay) */
  index?: number;
};

/**
 * Renders one FAQ category as a <section> with an editorial eyebrow + h2 heading
 * and a list of FaqItems. Each item gets a stable id="q-{itemKey}" via FaqItem so
 * external pages can deep-link to a specific question.
 */
export function FaqCategory({ categoryKey, itemKeys, index = 0 }: Props) {
  const c = useTranslations(`faq.categories.${categoryKey}`);

  return (
    <Reveal as="section">
      <section
        id={`cat-${categoryKey}`}
        aria-labelledby={`cat-${categoryKey}-h`}
      >
        <p className="eyebrow mb-3">
          <span className="text-text-muted mr-2">{String(index + 1).padStart(2, '0')}</span>
          {c('title')}
        </p>
        <h2
          id={`cat-${categoryKey}-h`}
          className="font-heading text-3xl md:text-display-lg text-text-primary mb-6 leading-tight"
        >
          {c('title')}
        </h2>
        <div className="space-y-3">
          {itemKeys.map((itemKey) => (
            <FaqItem
              key={itemKey}
              itemKey={itemKey}
              question={c(`items.${itemKey}.q`)}
              answer={c(`items.${itemKey}.a`)}
            />
          ))}
        </div>
      </section>
    </Reveal>
  );
}
