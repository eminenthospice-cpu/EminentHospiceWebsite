'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Icon } from '@/components/ui/Icon';

// App Router requires error boundaries to be Client Components. This
// catches uncaught render errors in the locale subtree and surfaces a
// friendly recovery path. We never log PHI or request body content here.

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations('error');
  const phone = useTranslations('common.phone');
  const phoneDisplay = phone('display');
  const phoneTel = phone('tel');

  useEffect(() => {
    // Log only the opaque digest + message — no request body, no PHI.
    if (error.digest) {
      console.error(`[error.tsx] digest=${error.digest} msg=${error.message}`);
    }
  }, [error]);

  return (
    <SectionContainer bg="cream" innerClassName="text-center">
      <div className="max-w-prose mx-auto py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 mb-4">
          <Icon name="info" className="w-8 h-8 text-error" />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl text-text-primary leading-tight mb-4">
          {t('heading')}
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed mb-8">
          {t('body', { phone: phoneDisplay })}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-btn bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors duration-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {t('ctaReload')}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-btn border-2 border-primary-500 text-primary-600 font-semibold hover:bg-primary-50 transition-colors duration-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Icon name="home" className="w-5 h-5" />
            {t('ctaHome')}
          </Link>
          <a
            href={`tel:${phoneTel}`}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-btn border-2 border-primary-500 text-primary-600 font-semibold hover:bg-primary-50 transition-colors duration-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Icon name="phone" className="w-5 h-5" />
            {t('ctaPhone', { phone: phoneDisplay })}
          </a>
        </div>
      </div>
    </SectionContainer>
  );
}
