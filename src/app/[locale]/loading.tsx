import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';

// Brief skeleton shown during slow navigations. Replaces the page body
// while a Server Component is streaming.

export default function LocaleLoading() {
  const t = useTranslations('loading');

  return (
    <SectionContainer bg="cream">
      <div
        role="status"
        aria-label={t('srLabel')}
        className="max-w-prose mx-auto py-12 space-y-4"
      >
        <div className="h-10 bg-neutral-200 rounded-card animate-pulse w-3/4" />
        <div className="h-6 bg-neutral-100 rounded-card animate-pulse w-full" />
        <div className="h-6 bg-neutral-100 rounded-card animate-pulse w-5/6" />
        <div className="h-6 bg-neutral-100 rounded-card animate-pulse w-4/6" />
        <div className="h-32 bg-neutral-100 rounded-card animate-pulse w-full mt-6" />
        <span className="sr-only">{t('srLabel')}</span>
      </div>
    </SectionContainer>
  );
}
