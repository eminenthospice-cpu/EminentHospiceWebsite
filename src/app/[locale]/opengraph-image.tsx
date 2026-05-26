import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';
export const alt = 'Eminent Hospice Care';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Locale-aware Open Graph image. Rendered at build time per locale via the
// `[locale]` segment. Crawlers cache the result, so per-page cost is amortized.
export default async function Image({ params }: { params: { locale: string } }) {
  const meta = await getTranslations({ locale: params.locale, namespace: 'meta' });
  const home = await getTranslations({ locale: params.locale, namespace: 'home' });

  const siteName = meta('siteName');
  const tagline = meta('ogDescription');
  // Trim tagline for the OG canvas — long Korean text needs the canvas to wrap.
  const trimmed = tagline.length > 140 ? tagline.slice(0, 137) + '…' : tagline;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #2C5F8A 0%, #1C4168 100%)',
          color: '#FDF9F5',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#A5CBE6',
              fontWeight: 500,
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.15,
              wordBreak: 'keep-all',
            }}
          >
            {home('pageTitle')}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: '#C8DFF0',
              maxWidth: '880px',
              wordBreak: 'keep-all',
            }}
          >
            {trimmed}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: '#A5CBE6',
          }}
        >
          <div>Los Angeles County · {params.locale === 'ko' ? '24시간 응대' : 'Available 24/7'}</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>EN</span>
            <span>·</span>
            <span>한국어</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
