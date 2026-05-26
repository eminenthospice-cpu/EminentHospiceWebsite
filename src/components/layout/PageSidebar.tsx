import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export type SidebarAnchor = {
  /** id of an in-page <h2> */
  id: string;
  /** Display label */
  label: string;
};

export type RelatedLink = {
  href: string;
  labelKey:
    | 'home'
    | 'about'
    | 'services'
    | 'understandingHospice'
    | 'hospiceLaws'
    | 'insurance'
    | 'forFamilies'
    | 'faq'
    | 'contact'
    | 'referral'
    | 'privacy'
    | 'hipaaNotice'
    | 'accessibility'
    | 'terms';
};

type Props = {
  anchors: SidebarAnchor[];
  relatedLinks: RelatedLink[];
};

export function PageSidebar({ anchors, relatedLinks }: Props) {
  const t = useTranslations('common');
  const phoneDisplay = t('phone.display');
  const phoneTel = t('phone.tel');

  return (
    <aside
      data-print-hide
      aria-label={t('onThisPage')}
      className="lg:sticky lg:top-24 space-y-6 mt-12 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 border-neutral-200"
    >
      {anchors.length > 0 && (
        <nav aria-label={t('onThisPage')}>
          <h2 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-3">
            {t('onThisPage')}
          </h2>
          <ul className="space-y-1.5">
            {anchors.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  className="block text-sm text-text-secondary hover:text-primary-600 hover:underline transition-colors duration-ui focus-visible:ring-2 focus-visible:ring-primary-500 rounded-btn px-1 py-0.5 -mx-1"
                >
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {relatedLinks.length > 0 && (
        <nav aria-label={t('relatedPages.title')}>
          <h2 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-3">
            {t('relatedPages.title')}
          </h2>
          <ul className="space-y-1.5">
            {relatedLinks.map(({ href, labelKey }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block text-sm text-text-secondary hover:text-primary-600 hover:underline transition-colors duration-ui focus-visible:ring-2 focus-visible:ring-primary-500 rounded-btn px-1 py-0.5 -mx-1"
                >
                  {t(`relatedPages.links.${labelKey}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="bg-primary-50 rounded-card p-4">
        <h2 className="font-heading font-semibold text-base text-primary-900 mb-1">
          {t('sidebarContactTitle')}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          {t('sidebarContactBody')}
        </p>
        <a
          href={`tel:${phoneTel}`}
          className="block text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
        >
          {phoneDisplay}
        </a>
        <Link
          href="/contact"
          className="block text-sm text-text-secondary hover:text-primary-600 hover:underline mt-1"
        >
          {t('sidebarContactLinkLabel')} →
        </Link>
      </div>
    </aside>
  );
}
