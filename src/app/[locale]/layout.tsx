import type { Metadata } from 'next';
import { Playfair_Display, Inter, Noto_Sans_KR } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Layout } from '@/components/layout/Layout';
import { absoluteUrl, buildAlternates } from '@/lib/seo';
import '@/app/globals.css';

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
// Set on <html> alongside Inter so it serves as the Hangul fallback.
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
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

  return (
    <html
      lang={locale}
      className={`${playfairDisplay.variable} ${inter.variable} ${notoSansKr.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <Layout>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
