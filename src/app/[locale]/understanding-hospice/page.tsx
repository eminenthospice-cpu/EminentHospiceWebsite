import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { MythsList } from '@/components/info/MythsList';
import { EligibilityList } from '@/components/info/EligibilityList';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/understanding-hospice';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'understandingHospice',
  });
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

const WHERE_OPTIONS = ['home', 'assistedLiving', 'snf', 'inpatient'] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/hospice-laws', labelKey: 'hospiceLaws' },
  { href: '/insurance', labelKey: 'insurance' },
  { href: '/for-families', labelKey: 'forFamilies' },
  { href: '/faq', labelKey: 'faq' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/referral', labelKey: 'referral' },
];

export default function UnderstandingHospicePage() {
  const t = useTranslations('understandingHospice');
  const s = useTranslations('understandingHospice.sections');
  const locale = useLocale();
  const eyebrow = locale === 'ko' ? '호스피스 케어 이해하기' : 'Understanding hospice';

  const anchors: SidebarAnchor[] = [
    { id: 'what-is-hospice', label: s('whatIsHospice.title') },
    { id: 'who-qualifies', label: s('whoQualifies.title') },
    { id: 'myths', label: s('myths.title') },
    { id: 'what-to-expect', label: s('whatToExpect.title') },
    { id: 'where-care-happens', label: s('whereCareHappens.title') },
    { id: 'stopping-hospice', label: s('stoppingHospice.title') },
  ];

  return (
    <>
      <LongFormPage
        title={t('pageTitle')}
        eyebrow={eyebrow}
        lastReviewed={t('lastReviewed')}
        introParagraph={t('introParagraph')}
        sidebar={<PageSidebar anchors={anchors} relatedLinks={RELATED_LINKS} />}
      >
        <section id="what-is-hospice" aria-labelledby="what-is-hospice-h">
          <h2 id="what-is-hospice-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('whatIsHospice.title')}
          </h2>
          <p className="mb-4 leading-relaxed">{s('whatIsHospice.p1')}</p>
          <p className="leading-relaxed">{s('whatIsHospice.p2')}</p>
        </section>

        <section id="who-qualifies" aria-labelledby="who-qualifies-h">
          <h2 id="who-qualifies-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('whoQualifies.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('whoQualifies.intro')}</p>
          <h3 className="font-heading font-semibold text-text-primary mb-3">
            {s('whoQualifies.conditionsHeading')}
          </h3>
          <EligibilityList />
          <p className="mt-5 text-sm text-text-muted leading-relaxed bg-neutral-100 rounded-card px-4 py-3">
            {s('whoQualifies.prognosisNote')}
          </p>
        </section>

        <section id="myths" aria-labelledby="myths-h">
          <h2 id="myths-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('myths.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('myths.intro')}</p>
          <MythsList />
        </section>

        <section id="what-to-expect" aria-labelledby="what-to-expect-h">
          <h2 id="what-to-expect-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('whatToExpect.title')}
          </h2>
          <p className="mb-4 leading-relaxed">{s('whatToExpect.p1')}</p>
          <p className="mb-4 leading-relaxed">{s('whatToExpect.p2')}</p>
          <p className="leading-relaxed">{s('whatToExpect.p3')}</p>
        </section>

        <section id="where-care-happens" aria-labelledby="where-care-happens-h">
          <h2 id="where-care-happens-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('whereCareHappens.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('whereCareHappens.intro')}</p>
          <dl className="space-y-3">
            {WHERE_OPTIONS.map((key) => (
              <div key={key} className="bg-white rounded-card shadow-card p-4">
                <dt className="font-heading font-semibold text-text-primary mb-1">
                  {s(`whereCareHappens.options.${key}.name`)}
                </dt>
                <dd className="text-text-secondary leading-relaxed">
                  {s(`whereCareHappens.options.${key}.desc`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="stopping-hospice" aria-labelledby="stopping-hospice-h">
          <h2 id="stopping-hospice-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('stoppingHospice.title')}
          </h2>
          <p className="leading-relaxed">{s('stoppingHospice.p1')}</p>
        </section>
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
