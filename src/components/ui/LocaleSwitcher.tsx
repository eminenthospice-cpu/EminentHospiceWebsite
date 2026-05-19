'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const targetLocale = locale === 'en' ? 'ko' : 'en';
  const label = locale === 'en' ? '한국어' : 'English';

  function handleSwitch() {
    startTransition(() => {
      router.replace(pathname, { locale: targetLocale });
    });
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={t('switchLanguage', { lang: label })}
      className="px-3 py-1.5 text-sm font-medium rounded-btn border border-primary-200 text-primary-600
        hover:bg-primary-50 hover:border-primary-400 transition-colors duration-ui
        disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]"
    >
      {label}
    </button>
  );
}
