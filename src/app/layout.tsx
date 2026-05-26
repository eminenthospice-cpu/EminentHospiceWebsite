import type { ReactNode } from 'react';

// Minimal root layout — required by Next.js because the app has a top-level
// `not-found.tsx`. The localized layout at `[locale]/layout.tsx` owns the
// real <html>/<body> chrome and font configuration; this passes through.
//
// This pattern is documented by next-intl for App Router projects with
// localePrefix: 'always'.

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
