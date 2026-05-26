import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LongFormPage } from '@/components/layout/LongFormPage';
import { PageSidebar, type SidebarAnchor, type RelatedLink } from '@/components/layout/PageSidebar';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { DyingProcessTimeline } from '@/components/families/DyingProcessTimeline';
import { CaregiverChecklist } from '@/components/families/CaregiverChecklist';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/for-families';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'forFamilies' });
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

const FIRST_HOURS_KEYS = ['adminVisit', 'carePlan', 'medsDme', 'oncallLine', 'idgCadence'] as const;
const BASICS_KEYS = ['medications', 'oxygen', 'equipment', 'hygiene', 'eating'] as const;
const WHEN_TO_CALL_KEYS = ['1', '2', '3', '4', '5', '6', '7'] as const;
const BURNOUT_KEYS = ['1', '2', '3', '4', '5', '6'] as const;

const RELATED_LINKS: RelatedLink[] = [
  { href: '/', labelKey: 'home' },
  { href: '/services', labelKey: 'services' },
  { href: '/understanding-hospice', labelKey: 'understandingHospice' },
  { href: '/faq', labelKey: 'faq' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/referral', labelKey: 'referral' },
];

export default function ForFamiliesPage() {
  const t = useTranslations('forFamilies');
  const s = useTranslations('forFamilies.sections');

  const anchors: SidebarAnchor[] = [
    { id: 'expect', label: s('expect.title') },
    { id: 'basics', label: s('basics.title') },
    { id: 'dying-process', label: s('dyingProcess.title') },
    { id: 'symptoms', label: s('symptoms.title') },
    { id: 'wellness', label: s('wellness.title') },
    { id: 'bereavement', label: s('bereavement.title') },
    { id: 'quick-ref', label: s('quickRef.title') },
  ];

  return (
    <>
      <LongFormPage
        title={t('pageTitle')}
        lastReviewed={t('lastReviewed')}
        introParagraph={t('introParagraph')}
        disclaimerVariant="medical"
        sidebar={<PageSidebar anchors={anchors} relatedLinks={RELATED_LINKS} />}
      >
        <section id="expect" aria-labelledby="expect-h">
          <h2 id="expect-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('expect.title')}
          </h2>
          <p className="mb-4 leading-relaxed">{s('expect.body1')}</p>
          <p className="mb-5 leading-relaxed">{s('expect.body2')}</p>

          <div className="bg-white rounded-card shadow-card p-5">
            <h3 className="font-heading font-semibold text-lg text-text-primary mb-3">
              {s('expect.firstHours.title')}
            </h3>
            <ul className="space-y-2">
              {FIRST_HOURS_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-2 items-start text-text-secondary leading-relaxed"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0"
                  />
                  <span>{s(`expect.firstHours.items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="basics" aria-labelledby="basics-h">
          <h2 id="basics-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('basics.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('basics.intro')}</p>

          <div className="space-y-4">
            {BASICS_KEYS.map((key) => (
              <div key={key} className="bg-white rounded-card shadow-card p-5">
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
                  {s(`basics.${key}.title`)}
                </h3>
                <p className="leading-relaxed">{s(`basics.${key}.body`)}</p>
                {key === 'medications' ? (
                  <p className="mt-3 pt-3 border-t border-neutral-200 text-sm text-text-secondary italic leading-relaxed">
                    {s('basics.medications.neverGiveNote')}
                  </p>
                ) : null}
                {key === 'oxygen' ? (
                  <>
                    <p className="mt-3 pt-3 border-t border-neutral-200 text-sm bg-warning/10 border-l-4 border-warning rounded-r-card px-3 py-2 leading-relaxed">
                      {s('basics.oxygen.safetyNote')}
                    </p>
                    <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                      {s('basics.oxygen.powerOutageNote')}
                    </p>
                    <p className="mt-3 text-sm text-text-muted italic leading-relaxed">
                      {s('basics.oxygen.bedsideTeachingNote')}
                    </p>
                  </>
                ) : null}
                {key === 'eating' ? (
                  <p className="mt-3 pt-3 border-t border-neutral-200 text-sm text-text-secondary italic leading-relaxed">
                    {s('basics.eating.gentleNote')}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section id="dying-process" aria-labelledby="dying-process-h">
          <h2 id="dying-process-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('dyingProcess.title')}
          </h2>
          <p className="mb-3 leading-relaxed">{s('dyingProcess.intro')}</p>
          <p className="mb-5 text-sm text-text-muted italic leading-relaxed">
            {s('dyingProcess.gentleNote')}
          </p>
          <DyingProcessTimeline />
          <p className="mt-5 leading-relaxed">{s('dyingProcess.variabilityNote')}</p>
        </section>

        <section id="symptoms" aria-labelledby="symptoms-h">
          <h2 id="symptoms-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('symptoms.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('symptoms.body')}</p>

          <div className="bg-white rounded-card shadow-card p-5 mb-4">
            <h3 className="font-heading font-semibold text-lg text-text-primary mb-3">
              {s('symptoms.whenToCall.title')}
            </h3>
            <ul className="space-y-2">
              {WHEN_TO_CALL_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-2 items-start text-text-secondary leading-relaxed"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0"
                  />
                  <span>{s(`symptoms.whenToCall.items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm leading-relaxed bg-warning/10 border-l-4 border-warning rounded-r-card px-4 py-3">
            {s('symptoms.do_not_911_note')}
          </p>
        </section>

        <section id="wellness" aria-labelledby="wellness-h">
          <h2 id="wellness-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('wellness.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('wellness.body')}</p>

          <div className="bg-white rounded-card shadow-card p-5 mb-5">
            <h3 className="font-heading font-semibold text-lg text-text-primary mb-3">
              {s('wellness.burnoutSigns.title')}
            </h3>
            <ul className="space-y-2">
              {BURNOUT_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-2 items-start text-text-secondary leading-relaxed"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0"
                  />
                  <span>{s(`wellness.burnoutSigns.items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
            {s('wellness.askForHelp.title')}
          </h3>
          <p className="mb-3 leading-relaxed">{s('wellness.askForHelp.body')}</p>
          <ul className="space-y-2 mb-3">
            <li className="flex gap-2 items-start text-text-secondary leading-relaxed">
              <span
                aria-hidden
                className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0"
              />
              <Link
                href="/services#level-respite"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                {s('wellness.askForHelp.respiteLinkLabel')}
              </Link>
            </li>
            <li className="flex gap-2 items-start text-text-secondary leading-relaxed">
              <span
                aria-hidden
                className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0"
              />
              <Link
                href="/services#role-volunteer"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                {s('wellness.askForHelp.volunteerLinkLabel')}
              </Link>
            </li>
          </ul>
          <p className="text-sm text-text-secondary leading-relaxed">
            {s('wellness.askForHelp.socialWorkerNote')}
          </p>
        </section>

        <section id="bereavement" aria-labelledby="bereavement-h">
          <h2 id="bereavement-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('bereavement.title')}
          </h2>
          <p className="mb-4 leading-relaxed">{s('bereavement.body')}</p>
          <p className="mb-5 leading-relaxed bg-primary-50 border-l-4 border-primary-500 rounded-r-card px-4 py-3">
            {s('bereavement.programNote')}{' '}
            <Link
              href="/services#role-bereavement"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              →
            </Link>
          </p>

          <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
            {s('bereavement.griefIs.title')}
          </h3>
          <p className="mb-5 leading-relaxed">{s('bereavement.griefIs.body')}</p>

          <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
            {s('bereavement.whenToSeekHelp.title')}
          </h3>
          <p className="mb-4 leading-relaxed">{s('bereavement.whenToSeekHelp.body')}</p>
          <p className="text-sm leading-relaxed bg-warning/10 border-l-4 border-warning rounded-r-card px-4 py-3">
            <strong className="block mb-1">{s('bereavement.whenToSeekHelp.lifelineLabel')}</strong>
            {s('bereavement.whenToSeekHelp.lifelineNumber')}
          </p>
        </section>

        <section id="quick-ref" aria-labelledby="quick-ref-h">
          <h2 id="quick-ref-h" className="font-heading text-2xl md:text-3xl text-text-primary mb-4">
            {s('quickRef.title')}
          </h2>
          <p className="mb-5 leading-relaxed">{s('quickRef.intro')}</p>
          <CaregiverChecklist />
          <p className="mt-5 text-sm text-text-muted italic leading-relaxed">
            {s('quickRef.printNote')}
          </p>
        </section>
      </LongFormPage>

      <PageBottomCta />
    </>
  );
}
