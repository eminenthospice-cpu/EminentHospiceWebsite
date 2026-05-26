import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/accessibility';

const SECTION_KEYS = [
  'commitment',
  'conformance',
  'features',
  'knownIssues',
  'howToReport',
] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/privacy', labelKey: 'privacy' },
  { href: '/terms', labelKey: 'terms' },
  { href: '/contact', labelKey: 'contact' },
];

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'accessibility' });
  const meta = await getTranslations({ locale: params.locale, namespace: 'meta' });
  const title = t('pageTitle');
  const description = t('metaDescription');
  return {
    title,
    description,
    alternates: buildAlternates(PATH, params.locale),
    ...buildOpenGraph({
      title,
      description,
      path: PATH,
      locale: params.locale,
      siteName: meta('siteName'),
      imageAlt: meta('ogImageAlt'),
    }),
  };
}

export default function AccessibilityPage() {
  const t = useTranslations('accessibility');
  const s = useTranslations('accessibility.sections');
  const c = useTranslations('common');
  const phoneDisplay = c('phone.display');

  const anchors: SidebarAnchor[] = SECTION_KEYS.map((k) => ({
    id: k,
    label: s(`${k}.title`),
  }));

  return (
    <>
      <LongFormPage
        title={t('pageTitle')}
        lastReviewed={t('lastReviewed')}
        introParagraph={t('introParagraph')}
        showDisclaimer={false}
        sidebar={<PageSidebar anchors={anchors} relatedLinks={RELATED_LINKS} />}
      >
        <section id="commitment" aria-labelledby="h-commitment">
          <h2 id="h-commitment" className="font-heading text-2xl text-text-primary mb-3">
            {s('commitment.title')}
          </h2>
          <p>{s('commitment.body')}</p>
        </section>

        <section id="conformance" aria-labelledby="h-conformance">
          <h2 id="h-conformance" className="font-heading text-2xl text-text-primary mb-3">
            {s('conformance.title')}
          </h2>
          <p className="mb-3">{s('conformance.body')}</p>
          <p className="text-sm uppercase tracking-wider font-semibold text-primary-700 bg-primary-50 inline-block px-3 py-1 rounded-btn">
            {s('conformance.level')}
          </p>
        </section>

        <section id="features" aria-labelledby="h-features">
          <h2 id="h-features" className="font-heading text-2xl text-text-primary mb-3">
            {s('features.title')}
          </h2>
          <p className="mb-3">{s('features.intro')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            {(s.raw('features.items') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="knownIssues" aria-labelledby="h-knownIssues">
          <h2 id="h-knownIssues" className="font-heading text-2xl text-text-primary mb-3">
            {s('knownIssues.title')}
          </h2>
          <p className="mb-3">{s('knownIssues.intro')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            {(s.raw('knownIssues.items') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="howToReport" aria-labelledby="h-howToReport">
          <h2 id="h-howToReport" className="font-heading text-2xl text-text-primary mb-3">
            {s('howToReport.title')}
          </h2>
          <p className="mb-3">{s('howToReport.body')}</p>
          <ul className="list-none pl-0 space-y-1 mb-3">
            <li>
              <span className="font-medium text-text-primary">{s('howToReport.emailLabel')}: </span>
              <a
                href={`mailto:${s('howToReport.email')}`}
                className="text-primary-600 hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
              >
                {s('howToReport.email')}
              </a>
            </li>
            <li>
              <span className="font-medium text-text-primary">{s('howToReport.phoneLabel')}: </span>
              <a
                href={`tel:${c('phone.tel')}`}
                className="text-primary-600 hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
              >
                {phoneDisplay}
              </a>
            </li>
          </ul>
          <p className="text-sm text-text-muted">{s('howToReport.responseTime')}</p>
        </section>
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
