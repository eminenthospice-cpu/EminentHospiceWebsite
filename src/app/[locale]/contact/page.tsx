import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { PageBottomCta } from '@/components/info/PageBottomCta';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfoCard } from '@/components/contact/ContactInfoCard';
import { MapCard } from '@/components/contact/MapCard';
import { Reveal } from '@/components/motion/Reveal';
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
  const locale = useLocale();
  const phoneDisplay = phone('display');
  const eyebrow = locale === 'ko' ? '문의하기' : 'Get in touch';

  return (
    <>
      <SectionContainer bg="cream" innerClassName="!py-section-y md:!py-section-2xl">
        <Reveal>
          <header className="max-w-prose-wide mb-12">
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h1 className="font-heading text-display-lg md:text-display-xl text-text-primary leading-tight mb-5">
              {t('pageTitle')}
            </h1>
            <p className="font-prose text-lg md:text-xl text-text-secondary leading-relaxed max-w-prose-wide">
              {t('introParagraph', { phone: phoneDisplay })}
            </p>
          </header>
        </Reveal>

        <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-10">
          <Reveal delay={0.06}>
            <div className="card-paper p-6 lg:p-10 bg-white">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.12} as="aside" className="mt-8 lg:mt-0 space-y-6">
            <ContactInfoCard />
            <MapCard />
          </Reveal>
        </div>
      </SectionContainer>

      <PageBottomCta />
    </>
  );
}
