import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Icon } from '@/components/ui/Icon';
import { ReferralPhoneFirst } from '@/components/referral/ReferralPhoneFirst';
import { ReferralFullForm } from '@/components/referral/ReferralFullForm';
import { ReferralTrustStrip } from '@/components/referral/ReferralTrustStrip';
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
  const phoneDisplay = tPhone('display');
  const phoneTel = tPhone('tel');

  return (
    <SectionContainer bg="cream">
      <header className="max-w-prose mb-10">
        <h1 className="font-heading text-4xl md:text-5xl text-text-primary leading-tight mb-3">
          {t('pageTitle')}
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          {t('introParagraph', { phone: phoneDisplay })}
        </p>
      </header>

      {HAS_BAA ? (
        <>
          <ReferralTrustStrip />

          <a
            href={`tel:${phoneTel}`}
            className="inline-flex items-center gap-2 mb-8 px-4 py-3 rounded-btn border border-primary-200 bg-white text-primary-700 font-medium hover:bg-primary-50 transition-colors duration-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <Icon name="phone" className="w-5 h-5" />
            <span>
              <span className="text-text-muted text-sm mr-2">
                {tPhoneCta('title')}
              </span>
              <span className="font-semibold">
                {tPhoneCta('callLabel', { phone: phoneDisplay })}
              </span>
            </span>
          </a>

          <div className="rounded-card bg-white border border-neutral-200 p-6 lg:p-8 shadow-card">
            <ReferralFullForm retentionDays={RETENTION_DAYS} />
          </div>
        </>
      ) : (
        <ReferralPhoneFirst />
      )}
    </SectionContainer>
  );
}
