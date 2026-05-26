import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { PhilosophyBand } from '@/components/home/PhilosophyBand';
import { LevelsOfCare } from '@/components/home/LevelsOfCare';
import { TeamCallout } from '@/components/home/TeamCallout';
import { WhoWeServe } from '@/components/home/WhoWeServe';
import { Testimonial } from '@/components/home/Testimonial';
import { FinalCta } from '@/components/home/FinalCta';
import { LocalBusinessJsonLd } from '@/components/home/LocalBusinessJsonLd';
import { buildAlternates, buildOpenGraph } from '@/lib/seo';

const PATH = '/';

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'home' });
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

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <PhilosophyBand />
      <LevelsOfCare />
      <TeamCallout />
      <WhoWeServe />
      <Testimonial />
      <FinalCta />
    </>
  );
}
