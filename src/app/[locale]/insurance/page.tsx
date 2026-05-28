import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { CoverageTable } from '@/components/info/CoverageTable';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/insurance';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'insurance',
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

const LEVEL_KEYS = ['rhc', 'chc', 'gip', 'irc'] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/understanding-hospice', labelKey: 'understandingHospice' },
  { href: '/hospice-laws', labelKey: 'hospiceLaws' },
  { href: '/faq', labelKey: 'faq' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/referral', labelKey: 'referral' },
];

export default function InsurancePage() {
  const t = useTranslations('insurance');
  const s = useTranslations('insurance.sections');
  const steps = s.raw('election.steps') as string[];
  const locale = useLocale();
  const eyebrow = locale === 'ko' ? '보험 및 메디케어' : 'Insurance & Medicare';

  const anchors: SidebarAnchor[] = [
    { id: 'cost', label: s('cost.title') },
    { id: 'medicare', label: s('medicare.title') },
    { id: 'levels', label: s('levels.title') },
    { id: 'medical', label: s('medical.title') },
    { id: 'comparison', label: s('comparison.title') },
    { id: 'election', label: s('election.title') },
    { id: 'help', label: s('help.title') },
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
        <section id="cost" aria-labelledby="cost-h">
          <h2 id="cost-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('cost.title')}
          </h2>
          <p className="text-lg leading-relaxed bg-success/10 border-l-4 border-success rounded-r-card px-4 py-3 mb-4">
            {s('cost.p1')}
          </p>
          <p className="text-sm leading-relaxed text-text-muted">{s('cost.footnote')}</p>
        </section>

        <section id="medicare" aria-labelledby="medicare-h">
          <h2 id="medicare-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('medicare.title')}
          </h2>
          <p className="mb-4 leading-relaxed">{s('medicare.eligibility')}</p>
          <p className="mb-4 leading-relaxed">{s('medicare.covered')}</p>
          <p className="leading-relaxed">{s('medicare.notCovered')}</p>
        </section>

        <section id="levels" aria-labelledby="levels-h">
          <h2 id="levels-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('levels.title')}
          </h2>
          <p className="mb-3 leading-relaxed">{s('levels.intro')}</p>
          <p className="text-sm text-text-muted mb-5 leading-relaxed italic">
            {s('levels.fy2026Note')}
          </p>

          <dl className="space-y-3 mb-6">
            {LEVEL_KEYS.map((key) => (
              <div key={key} className="bg-white rounded-card shadow-card p-4">
                <dt className="font-heading font-semibold text-text-primary mb-1">
                  {s(`levels.${key}.name`)}
                </dt>
                <dd className="text-text-secondary leading-relaxed">
                  {s(`levels.${key}.desc`)}
                </dd>
                <p className="text-sm text-text-muted leading-relaxed mt-2 pt-2 border-t border-neutral-200">
                  {s(`levels.${key}.rateNote`)}
                </p>
              </div>
            ))}
          </dl>

          <aside
            aria-label={s('levels.aggregateCap.label')}
            className="bg-primary-50 border-l-4 border-primary-500 rounded-r-card px-4 py-3 mb-4"
          >
            <p className="text-xs uppercase tracking-wider text-primary-700 font-semibold mb-1">
              {s('levels.aggregateCap.label')}
            </p>
            <p className="font-heading text-xl text-primary-900 mb-1">
              {s('levels.aggregateCap.value')}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {s('levels.aggregateCap.desc')}
            </p>
          </aside>

          <p className="text-xs text-text-muted leading-relaxed italic">
            {s('levels.sourceNote')}
          </p>
        </section>

        <section id="medical" aria-labelledby="medical-h">
          <h2 id="medical-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('medical.title')}
          </h2>
          <p className="mb-4 leading-relaxed">{s('medical.body')}</p>
          <p className="leading-relaxed bg-neutral-100 rounded-card px-4 py-3 text-sm">
            {s('medical.roomAndBoardNote')}
          </p>
        </section>

        <section id="comparison" aria-labelledby="comparison-h">
          <h2 id="comparison-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('comparison.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('comparison.intro')}</p>
          <CoverageTable />
        </section>

        <section id="election" aria-labelledby="election-h">
          <h2 id="election-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('election.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('election.intro')}</p>
          <ol className="space-y-3 list-none p-0">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white font-semibold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <p className="leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-text-muted leading-relaxed italic">
            {s('election.revocationNote')}
          </p>
        </section>

        <section id="help" aria-labelledby="help-h">
          <h2 id="help-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('help.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('help.body')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-btn bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors duration-ui focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {s('help.ctaLabel')} →
          </Link>
        </section>
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
