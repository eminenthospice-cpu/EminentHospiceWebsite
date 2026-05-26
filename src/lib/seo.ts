import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

// Locale-tag mapping for hreflang. Schema.org / Google use BCP 47 tags.
const HREFLANG: Record<string, string> = {
  en: 'en-US',
  ko: 'ko-KR',
};

const DEFAULT_LOCALE = routing.defaultLocale;

/**
 * Resolve the production site URL. Falls back to localhost in dev.
 * Vercel automatically sets the deployment URL but we prefer an
 * explicit env var so canonical URLs never point at a preview deploy.
 */
function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw && raw.length > 0) return raw.replace(/\/$/, '');
  return 'http://localhost:3000';
}

/**
 * Build an absolute URL for any locale-agnostic path (no /en or /ko prefix).
 * Pass paths like '/', '/about', '/privacy'.
 */
export function absoluteUrl(path: string): string {
  const base = siteUrl();
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/**
 * Build a locale-prefixed absolute URL: `/about` + 'en' → 'https://…/en/about'.
 */
export function localizedUrl(path: string, locale: string): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return absoluteUrl(`/${locale}${clean}`);
}

/**
 * Build the canonical + alternates block for a page. The canonical is the
 * **localized** URL (not the un-localed root) — Google prefers this for
 * multilingual sites with localePrefix: 'always'.
 */
export function buildAlternates(
  path: string,
  currentLocale: string,
): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    const tag = HREFLANG[loc] ?? loc;
    languages[tag] = localizedUrl(path, loc);
  }
  // x-default points at the default-locale variant per Google guidance.
  languages['x-default'] = localizedUrl(path, DEFAULT_LOCALE);

  return {
    canonical: localizedUrl(path, currentLocale),
    languages,
  };
}

/**
 * Build the Open Graph + Twitter card metadata. Per-page generateMetadata
 * passes page title + description; this helper fills the boilerplate.
 */
export function buildOpenGraph(args: {
  title: string;
  description: string;
  path: string;
  locale: string;
  siteName: string;
  imageAlt: string;
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const url = localizedUrl(args.path, args.locale);
  // Note: we don't set `images` here. Next.js auto-wires the locale-scoped
  // `opengraph-image.tsx` (and a `twitter-image.tsx` if present) into the
  // resolved metadata. Setting an explicit images override here would beat
  // the file-convention images and we want the locale-aware variant to win.
  return {
    openGraph: {
      type: 'website',
      url,
      title: args.title,
      description: args.description,
      siteName: args.siteName,
      locale: args.locale === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: args.title,
      description: args.description,
    },
  };
}
