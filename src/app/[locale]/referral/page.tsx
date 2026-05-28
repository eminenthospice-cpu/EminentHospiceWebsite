import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Phone } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { ReferralPhoneFirst } from '@/components/referral/ReferralPhoneFirst';
import { ReferralFullForm } from '@/components/referral/ReferralFullForm';
import { ReferralTrustStrip } from '@/components/referral/ReferralTrustStrip';
import { Reveal } from '@/components/motion/Reveal';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/referral';

// Read once at module load — flipping HAS_BAA requires a server restart /
// redeploy, which is intentional: it pairs the runtime change with a
// deliberate operational act (verify the BAA is on file).
const HAS_BAA = process.env.HAS_BAA === 'true';
const RETENTION_DAYS = Number.parseInt(process.env.PHI_RETENTION_DAYS ?? '30', 10) || 30;

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'referral' });
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

export default function ReferralPage() {
  const t = useTranslations('referral');
  const tPhoneCta = useTranslations('referral.modeB.phoneCta');
  const tPhone = useTranslations('common.phone');
  const locale = useLocale();
  const phoneDisplay = tPhone('display');
  const phoneTel = tPhone('tel');
  const eyebrow = locale === 'ko' ? '환자 의뢰' : 'Make a referral';

  return (
    <SectionContainer bg="cream" innerClassName="!py-section-y md:!py-section-2xl">
      <div className="space-y-10 md:space-y-12">
      <Reveal>
        <header className="max-w-prose-wide">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="font-heading text-display-lg md:text-display-xl text-text-primary leading-tight mb-5">
            {t('pageTitle')}
          </h1>
          <p className="font-prose text-lg md:text-xl text-text-secondary leading-relaxed">
            {t('introParagraph', { phone: phoneDisplay })}
          </p>
        </header>
      </Reveal>

      {HAS_BAA ? (
        <>
          <Reveal delay={0.06}>
            <ReferralTrustStrip />
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={`tel:${phoneTel}`}
              className="group inline-flex items-center gap-3 min-h-11 px-5 py-4 rounded-card
                card-paper bg-white text-primary-700 font-medium hover:shadow-card-md transition-all duration-fast
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                <Phone className="w-5 h-5" aria-hidden="true" strokeWidth={2} />
              </span>
              <span>
                <span className="block text-text-muted text-xs uppercase tracking-wide font-semibold">
                  {tPhoneCta('title')}
                </span>
                <span className="block font-heading text-lg font-semibold text-primary-700">
                  {tPhoneCta('callLabel', { phone: phoneDisplay })}
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="card-paper p-6 lg:p-10 bg-white">
              <ReferralFullForm retentionDays={RETENTION_DAYS} />
            </div>
          </Reveal>
        </>
      ) : (
        <Reveal delay={0.06}>
          <ReferralPhoneFirst />
        </Reveal>
      )}
      </div>
    </SectionContainer>
  );
}
