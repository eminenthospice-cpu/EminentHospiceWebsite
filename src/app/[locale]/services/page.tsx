import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { Icon } from '@/components/ui/Icon';
import { LevelsDetail } from '@/components/services/LevelsDetail';
import { TeamDisciplinesDetail } from '@/components/services/TeamDisciplinesDetail';
import { AdditionalServices } from '@/components/services/AdditionalServices';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/services';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'services' });
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

const STEPS = ['1', '2', '3'] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/', labelKey: 'home' },
  { href: '/about', labelKey: 'about' },
  { href: '/understanding-hospice', labelKey: 'understandingHospice' },
  { href: '/insurance', labelKey: 'insurance' },
  { href: '/for-families', labelKey: 'forFamilies' },
  { href: '/faq', labelKey: 'faq' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/referral', labelKey: 'referral' },
];

export default function ServicesPage() {
  const t = useTranslations('services');
  const s = useTranslations('services.sections');
  const phone = useTranslations('common.phone');

  const anchors: SidebarAnchor[] = [
    { id: 'offer', label: s('offer.title') },
    { id: 'levels', label: s('levels.title') },
    { id: 'team', label: s('team.title') },
    { id: 'additional', label: s('additional.title') },
    { id: 'how-to-start', label: s('howToStart.title') },
  ];

  const phoneTel = phone('tel');

  return (
    <>
      <LongFormPage
        title={t('pageTitle')}
        introParagraph={t('introParagraph')}
        showDisclaimer={false}
        sidebar={<PageSidebar anchors={anchors} relatedLinks={RELATED_LINKS} />}
      >
        <section id="offer" aria-labelledby="offer-h">
          <h2 id="offer-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('offer.title')}
          </h2>
          <p className="mb-3 leading-relaxed">{s('offer.body')}</p>
          <p>
            <Link
              href="/understanding-hospice"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              {s('offer.linkToUnderstanding')}
            </Link>
          </p>
        </section>

        <section id="levels" aria-labelledby="levels-h">
          <h2 id="levels-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('levels.title')}
          </h2>
          <LevelsDetail />
        </section>

        <section id="team" aria-labelledby="team-h">
          <h2 id="team-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('team.title')}
          </h2>
          <TeamDisciplinesDetail />
        </section>

        <section id="additional" aria-labelledby="additional-h">
          <h2 id="additional-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('additional.title')}
          </h2>
          <AdditionalServices />
        </section>

        <section id="how-to-start" aria-labelledby="how-to-start-h">
          <h2 id="how-to-start-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('howToStart.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('howToStart.intro')}</p>
          <ol className="space-y-3 mb-6">
            {STEPS.map((n, i) => (
              <li
                key={n}
                className="flex gap-3 items-start bg-white rounded-card shadow-card p-4"
              >
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white font-heading font-semibold text-sm flex-shrink-0"
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed text-text-secondary pt-0.5">
                  {s(`howToStart.steps.${n}`)}
                </span>
              </li>
            ))}
          </ol>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${phoneTel}`}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-btn bg-primary-500 text-white font-semibold text-base hover:bg-primary-600 transition-colors duration-ui focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 w-full sm:w-auto"
            >
              <Icon name="phone" className="w-5 h-5" />
              <span>{s('howToStart.callCta')}</span>
            </a>
            <Link
              href="/referral"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-btn border-2 border-primary-500 text-primary-600 font-semibold text-base hover:bg-primary-50 transition-colors duration-ui focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 w-full sm:w-auto"
            >
              {s('howToStart.referCta')}
            </Link>
          </div>
        </section>
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
