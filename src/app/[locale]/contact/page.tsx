import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfoCard } from '@/components/contact/ContactInfoCard';
import { MapCard } from '@/components/contact/MapCard';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/contact';

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
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

export default function ContactPage() {
  const t = useTranslations('contact');
  const phone = useTranslations('common.phone');
  const phoneDisplay = phone('display');

  return (
    <>
      <SectionContainer bg="cream">
        <header className="max-w-prose mb-10">
          <h1 className="font-heading text-4xl md:text-5xl text-text-primary leading-tight mb-3">
            {t('pageTitle')}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            {t('introParagraph', { phone: phoneDisplay })}
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-10">
          <div className="rounded-card bg-white border border-neutral-200 p-6 lg:p-8 shadow-card">
            <ContactForm />
          </div>

          <aside className="mt-8 lg:mt-0 space-y-6">
            <ContactInfoCard />
            <MapCard />
          </aside>
        </div>
      </SectionContainer>

      <PageBottomCta />
    </>
  );
}
