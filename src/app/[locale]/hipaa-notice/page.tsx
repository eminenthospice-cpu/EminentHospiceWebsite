import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { Icon } from '@/components/ui/Icon';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/hipaa-notice';

const SECTION_KEYS = ['overview', 'interim'] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/privacy', labelKey: 'privacy' },
  { href: '/hospice-laws', labelKey: 'hospiceLaws' },
  { href: '/contact', labelKey: 'contact' },
];

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'hipaaNotice' });
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

export default function HipaaNoticePage() {
  const t = useTranslations('hipaaNotice');
  const s = useTranslations('hipaaNotice.sections');
  const c = useTranslations('common');
  const phoneDisplay = c('phone.display');
  const phoneTel = c('phone.tel');

  const anchors: SidebarAnchor[] = SECTION_KEYS.map((k) => ({
    id: k,
    label: s(`${k}.title`),
  }));

  return (
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

      <section
        id="interim"
        aria-labelledby="h-interim"
        className="rounded-card border border-warning/40 bg-warning/5 p-6"
      >
        <h2 id="h-interim" className="font-heading text-2xl text-text-primary mb-3 flex items-center gap-2">
          <Icon name="info" className="w-6 h-6 text-warning shrink-0" />
          {s('interim.title')}
        </h2>
        <p className="mb-4">{s('interim.body', { phone: phoneDisplay })}</p>
        <a
          href={`tel:${phoneTel}`}
          className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-btn bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors duration-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <Icon name="phone" className="w-5 h-5" />
          {s('interim.callToObtain', { phone: phoneDisplay })}
        </a>
      </section>
    </LongFormPage>
  );
}
