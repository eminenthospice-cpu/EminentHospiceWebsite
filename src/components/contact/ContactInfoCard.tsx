import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

export function ContactInfoCard() {
  const t = useTranslations('contact.info');
  const phone = useTranslations('common.phone');
  const fax = useTranslations('common.fax');
  const phoneDisplay = phone('display');
  const phoneTel = phone('tel');
  const faxDisplay = fax('display');
  const emailValue = t('emailValue');

  return (
    <div className="rounded-card border border-neutral-200 bg-white p-6 shadow-card">
      <h2 className="font-heading text-2xl text-text-primary mb-4">{t('heading')}</h2>
      <dl className="space-y-4 text-text-secondary">
        <div className="flex items-start gap-3">
          <Icon name="phone" className="w-5 h-5 mt-0.5 text-primary-600 shrink-0" />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t('phoneLabel')}
            </dt>
            <dd>
              <a
                href={`tel:${phoneTel}`}
                className="text-text-primary font-semibold hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
              >
                {phoneDisplay}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="printer" className="w-5 h-5 mt-0.5 text-primary-600 shrink-0" />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t('faxLabel')}
            </dt>
            <dd className="text-text-primary">{faxDisplay}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="mail" className="w-5 h-5 mt-0.5 text-primary-600 shrink-0" />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t('emailLabel')}
            </dt>
            <dd>
              <a
                href={`mailto:${emailValue}`}
                className="text-text-primary hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm break-all"
              >
                {emailValue}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="calendar" className="w-5 h-5 mt-0.5 text-primary-600 shrink-0" />
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t('hoursLabel')}
            </dt>
            <dd className="text-text-primary">{t('hoursValue')}</dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
