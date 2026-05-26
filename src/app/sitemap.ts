import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';
import { routing } from '@/i18n/routing';
import { localizedUrl } from '@/lib/seo';

const HREFLANG: Record<string, string> = { en: 'en-US', ko: 'ko-KR' };

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) =>
    routing.locales.map((loc) => {
      const languages: Record<string, string> = {};
      for (const l of routing.locales) {
        languages[HREFLANG[l] ?? l] = localizedUrl(route.path, l);
      }
      languages['x-default'] = localizedUrl(route.path, routing.defaultLocale);

      return {
        url: localizedUrl(route.path, loc),
        lastModified: route.lastModified ? new Date(route.lastModified) : undefined,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      };
    }),
  );
}
