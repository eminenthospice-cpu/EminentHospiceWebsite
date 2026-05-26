import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/privacy';

const SECTION_KEYS = [
  'overview',
  'dataCollected',
  'howWeUse',
  'howWeShare',
  'retention',
  'security',
  'rights',
  'children',
  'changes',
  'contact',
] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/hipaa-notice', labelKey: 'hipaaNotice' },
  { href: '/accessibility', labelKey: 'accessibility' },
  { href: '/terms', labelKey: 'terms' },
  { href: '/contact', labelKey: 'contact' },
];

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'privacy' });
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

function getRetentionDays(): number {
  const v = Number.parseInt(process.env.PHI_RETENTION_DAYS ?? '30', 10);
  return Number.isFinite(v) && v > 0 ? v : 30;
}

export default function PrivacyPage() {
  const t = useTranslations('privacy');
  const s = useTranslations('privacy.sections');
  const c = useTranslations('common');
  const phoneDisplay = c('phone.display');
  const retentionDays = getRetentionDays();

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
        <section id="overview" aria-labelledby="h-overview">
          <h2 id="h-overview" className="font-heading text-2xl text-text-primary mb-3">
            {s('overview.title')}
          </h2>
          <p>{s('overview.body')}</p>
        </section>

        <section id="dataCollected" aria-labelledby="h-dataCollected">
          <h2 id="h-dataCollected" className="font-heading text-2xl text-text-primary mb-3">
            {s('dataCollected.title')}
          </h2>
          <p className="mb-4">{s('dataCollected.intro')}</p>

          <h3 className="font-heading text-xl text-text-primary mt-6 mb-2">
            {s('dataCollected.contactForm.title')}
          </h3>
          <p>{s('dataCollected.contactForm.body')}</p>

          <h3 className="font-heading text-xl text-text-primary mt-6 mb-2">
            {s('dataCollected.referralFormModeA.title')}
          </h3>
          <p>{s('dataCollected.referralFormModeA.body')}</p>

          <h3 className="font-heading text-xl text-text-primary mt-6 mb-2">
            {s('dataCollected.referralFormModeB.title')}
          </h3>
          <p>{s('dataCollected.referralFormModeB.body')}</p>

          <h3 className="font-heading text-xl text-text-primary mt-6 mb-2">
            {s('dataCollected.serverLogs.title')}
          </h3>
          <p>{s('dataCollected.serverLogs.body')}</p>

          <h3 className="font-heading text-xl text-text-primary mt-6 mb-2">
            {s('dataCollected.cookies.title')}
          </h3>
          <p>{s('dataCollected.cookies.body')}</p>
        </section>

        <section id="howWeUse" aria-labelledby="h-howWeUse">
          <h2 id="h-howWeUse" className="font-heading text-2xl text-text-primary mb-3">
            {s('howWeUse.title')}
          </h2>
          <p className="mb-3">{s('howWeUse.body')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            {(s.raw('howWeUse.bullets') as string[]).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>

        <section id="howWeShare" aria-labelledby="h-howWeShare">
          <h2 id="h-howWeShare" className="font-heading text-2xl text-text-primary mb-3">
            {s('howWeShare.title')}
          </h2>
          <p>{s('howWeShare.body')}</p>
        </section>

        <section id="retention" aria-labelledby="h-retention">
          <h2 id="h-retention" className="font-heading text-2xl text-text-primary mb-3">
            {s('retention.title')}
          </h2>
          <p>{s('retention.body', { retentionDays })}</p>
        </section>

        <section id="security" aria-labelledby="h-security">
          <h2 id="h-security" className="font-heading text-2xl text-text-primary mb-3">
            {s('security.title')}
          </h2>
          <p>{s('security.body')}</p>
        </section>

        <section id="rights" aria-labelledby="h-rights">
          <h2 id="h-rights" className="font-heading text-2xl text-text-primary mb-3">
            {s('rights.title')}
          </h2>

          <h3 className="font-heading text-xl text-text-primary mt-6 mb-2">
            {s('rights.ccpa.title')}
          </h3>
          <p className="mb-2">{s('rights.ccpa.body')}</p>
          <p>{s('rights.ccpa.howToExercise', { phone: phoneDisplay })}</p>

          <h3 className="font-heading text-xl text-text-primary mt-6 mb-2">
            {s('rights.hipaa.title')}
          </h3>
          <p>{s('rights.hipaa.body')}</p>
        </section>

        <section id="children" aria-labelledby="h-children">
          <h2 id="h-children" className="font-heading text-2xl text-text-primary mb-3">
            {s('children.title')}
          </h2>
          <p>{s('children.body')}</p>
        </section>

        <section id="changes" aria-labelledby="h-changes">
          <h2 id="h-changes" className="font-heading text-2xl text-text-primary mb-3">
            {s('changes.title')}
          </h2>
          <p>{s('changes.body')}</p>
        </section>

        <section id="contact" aria-labelledby="h-contact">
          <h2 id="h-contact" className="font-heading text-2xl text-text-primary mb-3">
            {s('contact.title')}
          </h2>
          <p className="mb-2">{s('contact.body')}</p>
          <ul className="list-none pl-0 space-y-1">
            <li>
              <span className="font-medium text-text-primary">{s('contact.emailLabel')}: </span>
              <a
                href={`mailto:${s('contact.email')}`}
                className="text-primary-600 hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
              >
                {s('contact.email')}
              </a>
            </li>
            <li>
              <span className="font-medium text-text-primary">{s('contact.phoneLabel')}: </span>
              <a
                href={`tel:${c('phone.tel')}`}
                className="text-primary-600 hover:underline focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
              >
                {phoneDisplay}
              </a>
            </li>
          </ul>
        </section>
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
