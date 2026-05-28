import type { Metadata } from 'next';
import { Playfair_Display, Inter, Noto_Sans_KR, Fraunces, Newsreader, Noto_Serif_KR } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Layout } from '@/components/layout/Layout';
import { absoluteUrl, buildAlternates } from '@/lib/seo';
import '@/app/globals.css';

// Editorial display face — variable, optical sizes. Primary heading typeface.
// Axes can only be specified for variable fonts (omit `weight` to load variable).
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
});

// Long-form prose face — Newsreader is calm and highly readable at body sizes.
// `adjustFontFallback: false` skips Next's automatic metric override lookup
// (Newsreader has no built-in override values in next/font/google yet).
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
  adjustFontFallback: false,
});

// Kept as fallback for any legacy components referencing var(--font-playfair).
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

// Korean glyphs — Inter is Latin-only, so we load a Hangul-capable face.
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: false,
});

// Korean serif fallback for editorial Fraunces / Newsreader headings.
const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
  preload: false,
});

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  const meta = await getTranslations({ locale: params.locale, namespace: 'meta' });
  const home = await getTranslations({ locale: params.locale, namespace: 'home' });
  const siteName = meta('siteName');
  return {
    metadataBase: new URL(absoluteUrl('/')),
    title: { default: siteName, template: meta('titleTemplate') },
    description: meta('ogDescription'),
    alternates: buildAlternates('/', params.locale),
    openGraph: {
      type: 'website',
      siteName,
      title: home('pageTitle'),
      description: meta('ogDescription'),
      locale: params.locale === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: home('pageTitle'),
      description: meta('ogDescription'),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as 'en' | 'ko')) notFound();
  const messages = await getMessages();

  const fontVars = [
    fraunces.variable,
    newsreader.variable,
    playfairDisplay.variable,
    inter.variable,
    notoSansKr.variable,
    notoSerifKr.variable,
  ].join(' ');

  return (
    <html lang={locale} className={fontVars}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Layout>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
