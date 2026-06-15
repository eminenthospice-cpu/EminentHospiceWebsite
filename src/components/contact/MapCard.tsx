import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

export function MapCard() {
  const t = useTranslations('contact.info');
  const addr = useTranslations('common.address');
  const display = addr('displayMultiline');
  const directionsUrl = `https://www.google.com/maps?q=${encodeURIComponent(display.replace(/\n/g, ', '))}`;

  return (
    <div className="rounded-card border border-neutral-200 bg-white p-6 shadow-card">
      <div className="flex items-start gap-3">
        <Icon name="mapPin" className="w-5 h-5 mt-0.5 text-primary-600 shrink-0" />
        <div className="flex-1">
          <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-1">
            {t('addressLabel')}
          </h3>
          <p className="text-text-primary mb-3 whitespace-pre-line">{display}</p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
          >
            {t('getDirectionsLabel')}
            <Icon name="arrowRight" className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
