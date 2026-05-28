/**
 * Custom next/image loader.
 *
 * Why: every photographic slot in the site is hosted on the Unsplash CDN,
 * which already supports per-request resizing and format negotiation via
 * its `?w=…&q=…&auto=format` query params. Routing those requests through
 * Next.js's optimizer (`/_next/image`) re-fetches the upstream bytes,
 * re-encodes them, and re-serves them — which adds a multi-second round
 * trip on cold dev hits (Windows is particularly slow) and offers no real
 * payload win since Unsplash is already returning AVIF/WebP. Going direct
 * lets the browser request the exact width it needs straight from a
 * geo-distributed CDN, so the first paint of every image happens almost
 * immediately.
 *
 * Non-Unsplash URLs (data URIs, SVG noise textures, future local assets)
 * pass through untouched.
 */

type LoaderArgs = { src: string; width: number; quality?: number };

const UNSPLASH_HOST = 'images.unsplash.com';

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (src.startsWith('data:') || src.startsWith('blob:')) return src;

  if (!src.includes(UNSPLASH_HOST)) {
    return src;
  }

  try {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality ?? 70));
    if (!url.searchParams.has('auto')) url.searchParams.set('auto', 'format');
    if (!url.searchParams.has('fit')) url.searchParams.set('fit', 'crop');
    return url.toString();
  } catch {
    return src;
  }
}
