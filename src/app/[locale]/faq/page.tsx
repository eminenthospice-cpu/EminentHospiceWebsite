import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { FaqCategory } from '@/components/faq/FaqCategory';
import { FaqPageJsonLd } from '@/components/faq/FaqPageJsonLd';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/faq';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'faq' });
  const meta = await getTranslations({ locale: params.locale, namespace: 'meta' });
  const title = t('pageTitle');
  const description = t('metaDescription');
  return {
    title,
    description,
    alternates: buildAlternates(PATH, params.locale),
    ...buildOpenGraph({
      title, description, path: PATH, locale: params.locale,
      siteName: meta('siteName'), imageAlt: meta('ogImageAlt'),
    }),
  };
}

/**
 * Single source of truth for category × item ordering.
 * Used by both the visible page (via FaqCategory) and the JSON-LD payload
 * (via FaqPageJsonLd), so the structured data is guaranteed to mirror
 * the visible content.
 */
const FAQ_CATEGORIES = [
  {
    key: 'gettingStarted',
    itemKeys: ['whenConsider', 'howStart', 'howQuickly', 'keepDoctor', 'ifImprove'] as const,
  },
  {
    key: 'aboutHospice',
    itemKeys: ['whatIncludes', 'whereCare', 'twentyFourSeven', 'sedated', 'hastens'] as const,
  },
  {
    key: 'insurance',
    itemKeys: ['cost', 'medicare', 'medical', 'private', 'uninsured'] as const,
  },
  {
    key: 'families',
    itemKeys: ['familyRole', 'cantCareAtHome', 'bereavement', 'cultural', 'korean'] as const,
  },
  {
    key: 'rights',
    itemKeys: ['stopAnytime', 'disagreeCarePlan', 'complaint', 'palliative', 'advanceDirective'] as const,
  },
] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/', labelKey: 'home' },
  { href: '/understanding-hospice', labelKey: 'understandingHospice' },
  { href: '/insurance', labelKey: 'insurance' },
  { href: '/hospice-laws', labelKey: 'hospiceLaws' },
  { href: '/for-families', labelKey: 'forFamilies' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/referral', labelKey: 'referral' },
];

export default function FaqPage() {
  const t = useTranslations('faq');
  const c = useTranslations('faq.categories');

  // Sidebar lists the 5 categories, not all 25 questions (too noisy).
  // Individual questions remain deep-linkable via /faq#q-{itemKey}.
  const anchors: SidebarAnchor[] = FAQ_CATEGORIES.map((cat) => ({
    id: `cat-${cat.key}`,
    label: c(`${cat.key}.title`),
  }));

  return (
    <>
      <LongFormPage
        title={t('pageTitle')}
        lastReviewed={t('lastReviewed')}
        introParagraph={t('introParagraph')}
        sidebar={<PageSidebar anchors={anchors} relatedLinks={RELATED_LINKS} />}
      >
        <FaqPageJsonLd categories={FAQ_CATEGORIES} />

        {FAQ_CATEGORIES.map((cat) => (
          <FaqCategory key={cat.key} categoryKey={cat.key} itemKeys={cat.itemKeys} />
        ))}
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
