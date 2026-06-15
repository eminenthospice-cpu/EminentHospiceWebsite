import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Award, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { MissionValues } from '@/components/about/MissionValues';
import { ServiceArea } from '@/components/about/ServiceArea';
import { CulturalCompetence } from '@/components/about/CulturalCompetence';
import { IdgTeamDetail } from '@/components/about/IdgTeamDetail';
import { OrganizationJsonLd } from '@/components/about/OrganizationJsonLd';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/about';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' });
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

const DISTINCTIVES = ['certified', 'sameDay', 'pharmacy', 'oncall', 'bilingual'] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/', labelKey: 'home' },
  { href: '/services', labelKey: 'services' },
  { href: '/understanding-hospice', labelKey: 'understandingHospice' },
  { href: '/faq', labelKey: 'faq' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/referral', labelKey: 'referral' },
];

export default function AboutPage() {
  const t = useTranslations('about');
  const s = useTranslations('about.sections');
  const links = useTranslations('common.relatedPages.links');
  const locale = useLocale();
  const eyebrow = locale === 'ko' ? '저희를 소개합니다' : 'About Eminent';

  const anchors: SidebarAnchor[] = [
    { id: 'mission', label: s('mission.title') },
    { id: 'values', label: s('values.title') },
    { id: 'story', label: s('story.title') },
    { id: 'service-area', label: s('serviceArea.title') },
    { id: 'accreditation', label: s('accreditation.title') },
    { id: 'cultural-competence', label: s('culturalCompetence.title') },
    { id: 'team', label: s('team.title') },
    { id: 'distinctives', label: s('distinctives.title') },
  ];

  return (
    <>
      <OrganizationJsonLd />

      <LongFormPage
        title={t('pageTitle')}
        eyebrow={eyebrow}
        heroImageKey="aboutHero"
        introParagraph={t('introParagraph')}
        showDisclaimer={false}
        sidebar={<PageSidebar anchors={anchors} relatedLinks={RELATED_LINKS} />}
      >
        <section id="mission" aria-labelledby="mission-h">
          <h2 id="mission-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('mission.title')}
          </h2>
          <p className="leading-relaxed">{s('mission.body')}</p>
        </section>

        <section id="values" aria-labelledby="values-h">
          <h2 id="values-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('values.title')}
          </h2>
          <MissionValues />
        </section>

        <section id="story" aria-labelledby="story-h">
          <h2 id="story-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('story.title')}
          </h2>
          <p className="leading-relaxed">{s('story.body')}</p>
        </section>

        <section id="service-area" aria-labelledby="service-area-h">
          <h2 id="service-area-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('serviceArea.title')}
          </h2>
          <ServiceArea />
        </section>

        <section id="accreditation" aria-labelledby="accreditation-h">
          <h2 id="accreditation-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('accreditation.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('accreditation.body')}</p>
          <ul className="space-y-3">
            <li className="bg-white rounded-card shadow-card px-4 py-3 text-sm text-text-secondary flex items-start gap-2">
              <Award className="w-5 h-5 mt-0.5 text-accent-warm-700 shrink-0" aria-hidden="true" strokeWidth={1.75} />
              <span>{s('accreditation.sealLabel')}</span>
            </li>
            <li className="bg-white rounded-card shadow-card px-4 py-3 text-sm text-text-secondary flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 mt-0.5 text-primary-600 shrink-0" aria-hidden="true" strokeWidth={1.75} />
              <span>{s('accreditation.medicareLabel')}</span>
            </li>
          </ul>
        </section>

        <section id="cultural-competence" aria-labelledby="cultural-competence-h">
          <h2 id="cultural-competence-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('culturalCompetence.title')}
          </h2>
          <CulturalCompetence />
        </section>

        <section id="team" aria-labelledby="team-h">
          <h2 id="team-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('team.title')}
          </h2>
          <IdgTeamDetail />
        </section>

        <section id="distinctives" aria-labelledby="distinctives-h">
          <h2 id="distinctives-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('distinctives.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('distinctives.intro')}</p>
          <ul className="space-y-2">
            {DISTINCTIVES.map((key) => (
              <li
                key={key}
                className="flex gap-2 items-start text-text-secondary leading-relaxed"
              >
                <span aria-hidden className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span>{s(`distinctives.items.${key}`)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-text-muted">
            <Link
              href="/hospice-laws"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              {links('hospiceLaws')} →
            </Link>
          </p>
        </section>
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
