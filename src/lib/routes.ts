// Single source of truth for the sitemap. Every locale-agnostic public
// route lives here. Adding a new page = adding one row.
//
// `lastModified` is an ISO date string (YYYY-MM-DD). For content pages it
// matches the `lastReviewed` value in `messages/en.json` so the sitemap
// stamp reflects the content recency declared on the page itself.

export type RouteEntry = {
  path: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

export const ROUTES: RouteEntry[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/understanding-hospice', lastModified: '2026-05-01', changeFrequency: 'yearly', priority: 0.8 },
  { path: '/hospice-laws', lastModified: '2026-05-01', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/insurance', lastModified: '2026-05-01', changeFrequency: 'yearly', priority: 0.8 },
  { path: '/for-families', lastModified: '2026-05-21', changeFrequency: 'yearly', priority: 0.8 },
  { path: '/faq', lastModified: '2026-05-21', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/referral', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/privacy', lastModified: '2026-05-25', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/hipaa-notice', lastModified: '2026-05-25', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/accessibility', lastModified: '2026-05-25', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', lastModified: '2026-05-25', changeFrequency: 'yearly', priority: 0.3 },
];
