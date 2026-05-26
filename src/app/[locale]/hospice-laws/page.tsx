import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { PatientRightsList } from '@/components/info/PatientRightsList';
import { AdvanceDirectivesGrid } from '@/components/info/AdvanceDirectivesGrid';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/hospice-laws';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'hospiceLaws',
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

const COMPLAINT_PATHS = ['eminent', 'cdph', 'medicare'] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/understanding-hospice', labelKey: 'understandingHospice' },
  { href: '/insurance', labelKey: 'insurance' },
  { href: '/faq', labelKey: 'faq' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/referral', labelKey: 'referral' },
];

export default function HospiceLawsPage() {
  const t = useTranslations('hospiceLaws');
  const s = useTranslations('hospiceLaws.sections');

  const anchors: SidebarAnchor[] = [
    { id: 'cops', label: s('cops.title') },
    { id: 'patient-rights', label: s('patientRights.title') },
    { id: 'advance-directives', label: s('advanceDirectives.title') },
    { id: 'complaints', label: s('complaints.title') },
    { id: 'hipaa', label: s('hipaa.title') },
  ];

  return (
    <>
      <LongFormPage
        title={t('pageTitle')}
        lastReviewed={t('lastReviewed')}
        introParagraph={t('introParagraph')}
        sidebar={<PageSidebar anchors={anchors} relatedLinks={RELATED_LINKS} />}
      >
        <section id="cops" aria-labelledby="cops-h">
          <h2 id="cops-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('cops.title')}
          </h2>
          <p className="mb-4 leading-relaxed">{s('cops.body')}</p>
          <p>
            <a
              href={s('cops.cmsLinkUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline font-medium"
            >
              {s('cops.cmsLinkLabel')}
            </a>
          </p>
        </section>

        <section id="patient-rights" aria-labelledby="patient-rights-h">
          <h2 id="patient-rights-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('patientRights.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('patientRights.intro')}</p>
          <PatientRightsList />
          <p className="mt-5">
            <a
              href={s('patientRights.linkUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline text-sm font-medium"
            >
              {s('patientRights.linkLabel')}
            </a>
          </p>
        </section>

        <section id="advance-directives" aria-labelledby="advance-directives-h">
          <h2 id="advance-directives-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('advanceDirectives.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('advanceDirectives.intro')}</p>
          <AdvanceDirectivesGrid />
        </section>

        <section id="complaints" aria-labelledby="complaints-h">
          <h2 id="complaints-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('complaints.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('complaints.intro')}</p>
          <dl className="space-y-3">
            {COMPLAINT_PATHS.map((key) => (
              <div key={key} className="bg-white rounded-card shadow-card p-4">
                <dt className="font-heading font-semibold text-text-primary mb-1">
                  {s(`complaints.paths.${key}.name`)}
                </dt>
                <dd className="text-text-secondary leading-relaxed">
                  {s(`complaints.paths.${key}.contact`)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm font-medium text-success bg-success/10 rounded-card px-4 py-3">
            {s('complaints.retaliationProtection')}
          </p>
        </section>

        <section id="hipaa" aria-labelledby="hipaa-h">
          <h2 id="hipaa-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('hipaa.title')}
          </h2>
          <p className="mb-4 leading-relaxed">{s('hipaa.body')}</p>
          <p className="text-sm text-text-muted leading-relaxed italic">
            {s('hipaa.noticeLabel')}
          </p>
        </section>
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
