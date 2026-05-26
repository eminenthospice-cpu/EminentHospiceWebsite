import { useTranslations, useLocale } from 'next-intl';

type Props = {
  /** ISO date string, e.g. "2026-05-01" */
  date: string;
};

export function LastReviewed({ date }: Props) {
  const t = useTranslations('common');
  const locale = useLocale();

  const parsed = new Date(date);
  const formatted = Number.isNaN(parsed.getTime())
    ? date
    : new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
        year: 'numeric',
        month: 'long',
      }).format(parsed);

  return (
    <p className="text-xs uppercase tracking-wider text-text-muted font-medium">
      <span>{t('lastReviewedLabel')}</span>{' '}
      <time dateTime={date}>{formatted}</time>
    </p>
  );
}
