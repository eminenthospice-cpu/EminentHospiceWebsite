import { useTranslations } from 'next-intl';
import { FaqItem } from '@/components/faq/FaqItem';

type Props = {
  /** Category key (gettingStarted / aboutHospice / insurance / families / rights) */
  categoryKey: string;
  /** Ordered list of item keys to render under this category */
  itemKeys: readonly string[];
};

/**
 * Renders one FAQ category as a <section> with an h2 heading and a list of FaqItems.
 * Each item gets a stable id="q-{itemKey}" via FaqItem so external pages can deep-link
 * to a specific question.
 */
export function FaqCategory({ categoryKey, itemKeys }: Props) {
  const c = useTranslations(`faq.categories.${categoryKey}`);

  return (
    <section
      id={`cat-${categoryKey}`}
      aria-labelledby={`cat-${categoryKey}-h`}
    >
      <h2
        id={`cat-${categoryKey}-h`}
        className="font-heading text-2xl md:text-3xl text-text-primary mb-5"
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
  );
}
