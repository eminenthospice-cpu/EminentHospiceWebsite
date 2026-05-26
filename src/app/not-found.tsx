import Link from 'next/link';

// Root-level 404. Reached when the middleware does not route a request to
// a localized path (for example, /api/foo or any unrouted URL). No locale
// context is available here, so we render a bilingual-neutral page that
// gives the visitor a path into either locale.
//
// Per next-intl with localePrefix: 'always', the root not-found is rendered
// outside the locale layout and therefore must provide its own <html> shell.

export const metadata = {
  title: 'Page not found · 페이지를 찾을 수 없습니다',
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDF9F5',
          color: '#1A2B3C',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          padding: '2rem',
        }}
      >
        <main
          style={{
            maxWidth: '32rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#718096',
              margin: '0 0 0.5rem',
            }}
          >
            404
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              lineHeight: 1.2,
              margin: '0 0 1rem',
              color: '#1A2B3C',
            }}
          >
            Page not found
            <br />
            <span style={{ fontSize: '0.85em', color: '#4A5568' }}>
              페이지를 찾을 수 없습니다
            </span>
          </h1>
          <p style={{ color: '#4A5568', lineHeight: 1.6, margin: '0 0 2rem' }}>
            The page you tried to reach does not exist.
            <br />
            찾으시는 페이지가 존재하지 않습니다.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/en"
              style={{
                display: 'inline-block',
                minHeight: '44px',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                background: '#2C5F8A',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              English Home
            </Link>
            <Link
              href="/ko"
              style={{
                display: 'inline-block',
                minHeight: '44px',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: '2px solid #2C5F8A',
                color: '#2C5F8A',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              한국어 홈
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
