import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/terms';

const SECTION_KEYS = [
  'acceptance',
  'useOfSite',
  'notMedicalAdvice',
  'notServiceContract',
  'intellectualProperty',
  'externalLinks',
  'disclaimers',
  'limitationOfLiability',
  'governingLaw',
  'changes',
  'contact',
] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/privacy', labelKey: 'privacy' },
  { href: '/hipaa-notice', labelKey: 'hipaaNotice' },
  { href: '/accessibility', labelKey: 'accessibility' },
  { href: '/contact', labelKey: 'contact' },
];

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'terms' });
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

export default function TermsPage() {
  const t = useTranslations('terms');
  const s = useTranslations('terms.sections');
  const c = useTranslations('common');
  const locale = useLocale();
  const phoneDisplay = c('phone.display');
  const eyebrow = locale === 'ko' ? '이용 약관' : 'Terms of use';

  const anchors: SidebarAnchor[] = SECTION_KEYS.map((k) => ({
    id: k,
    label: s(`${k}.title`),
  }));

  return (
    <LongFormPage
      title={t('pageTitle')}
      eyebrow={eyebrow}
      lastReviewed={t('lastReviewed')}
      introParagraph={t('introParagraph')}
      showDisclaimer={false}
      sidebar={<PageSidebar anchors={anchors} relatedLinks={RELATED_LINKS} />}
    >
      <section id="acceptance" aria-labelledby="h-acceptance">
        <h2 id="h-acceptance" className="font-heading text-2xl text-text-primary mb-3">
          {s('acceptance.title')}
        </h2>
        <p>{s('acceptance.body')}</p>
      </section>

      <section id="useOfSite" aria-labelledby="h-useOfSite">
        <h2 id="h-useOfSite" className="font-heading text-2xl text-text-primary mb-3">
          {s('useOfSite.title')}
        </h2>
        <p className="mb-3">{s('useOfSite.intro')}</p>
        <ul className="list-disc pl-5 space-y-1.5">
          {(s.raw('useOfSite.bullets') as string[]).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      <section id="notMedicalAdvice" aria-labelledby="h-notMedicalAdvice">
        <h2 id="h-notMedicalAdvice" className="font-heading text-2xl text-text-primary mb-3">
          {s('notMedicalAdvice.title')}
        </h2>
        <p>{s('notMedicalAdvice.body')}</p>
      </section>

      <section id="notServiceContract" aria-labelledby="h-notServiceContract">
        <h2 id="h-notServiceContract" className="font-heading text-2xl text-text-primary mb-3">
          {s('notServiceContract.title')}
        </h2>
        <p>{s('notServiceContract.body')}</p>
      </section>

      <section id="intellectualProperty" aria-labelledby="h-intellectualProperty">
        <h2 id="h-intellectualProperty" className="font-heading text-2xl text-text-primary mb-3">
          {s('intellectualProperty.title')}
        </h2>
        <p>{s('intellectualProperty.body')}</p>
      </section>

      <section id="externalLinks" aria-labelledby="h-externalLinks">
        <h2 id="h-externalLinks" className="font-heading text-2xl text-text-primary mb-3">
          {s('externalLinks.title')}
        </h2>
        <p>{s('externalLinks.body')}</p>
      </section>

      <section id="disclaimers" aria-labelledby="h-disclaimers">
        <h2 id="h-disclaimers" className="font-heading text-2xl text-text-primary mb-3">
          {s('disclaimers.title')}
        </h2>
        <p>{s('disclaimers.body')}</p>
      </section>

      <section id="limitationOfLiability" aria-labelledby="h-limitationOfLiability">
        <h2 id="h-limitationOfLiability" className="font-heading text-2xl text-text-primary mb-3">
          {s('limitationOfLiability.title')}
        </h2>
        <p>{s('limitationOfLiability.body')}</p>
      </section>

      <section id="governingLaw" aria-labelledby="h-governingLaw">
        <h2 id="h-governingLaw" className="font-heading text-2xl text-text-primary mb-3">
          {s('governingLaw.title')}
        </h2>
        <p>{s('governingLaw.body')}</p>
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
  );
}
