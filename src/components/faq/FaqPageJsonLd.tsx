import { useTranslations } from 'next-intl';

type CategoryDef = {
  key: string;
  itemKeys: readonly string[];
};

type Props = {
  /**
   * Ordered list of categories and their item keys. MUST mirror the order
   * the FAQ page renders so the JSON-LD content matches what users see
   * (a Google requirement for FAQPage structured data).
   */
  categories: readonly CategoryDef[];
};

/**
 * Server-only component that emits a <script type="application/ld+json">
 * containing FAQPage structured data. Reads from the same `faq.categories.*.items.*.q/a`
 * keys that <FaqItem> reads, so the JSON-LD answer text is byte-for-byte
 * identical to the visible answer — no risk of drift.
 *
 * Note: Google restricted FAQPage rich-result eligibility to authoritative/
 * government sites in August 2023, so visible rich snippets are unlikely on a
 * private hospice site. The structured data is still valid, improves topical
 * understanding, and may regain eligibility — cheap and worth keeping.
 */
export function FaqPageJsonLd({ categories }: Props) {
  const t = useTranslations('faq');
  const c = useTranslations('faq.categories');

  const mainEntity = categories.flatMap((cat) =>
    cat.itemKeys.map((itemKey) => ({
      '@type': 'Question',
      name: c(`${cat.key}.items.${itemKey}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: c(`${cat.key}.items.${itemKey}.a`),
      },
    })),
  );

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: t('jsonLdName'),
    mainEntity,
  };

  // React escapes JSX text children inside <script>, which produces HTML-encoded
  // JSON that crawlers cannot parse. Use dangerouslySetInnerHTML so the raw JSON
  // string ends up in the DOM. JSON.stringify produces pure JSON (no HTML), and
  // the `</` → `<\/` replacement prevents </script> injection if any translated
  // text were to contain it. See https://nextjs.org/docs/app/guides/json-ld
  const safeJson = JSON.stringify(payload).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
