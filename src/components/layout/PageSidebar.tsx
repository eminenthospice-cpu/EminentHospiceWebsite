import { useTranslations } from 'next-intl';
import { Phone, ArrowRight, ListTree, Link as LinkIcon } from 'lucide-react';
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
      className="lg:sticky lg:top-28 space-y-8 mt-14 lg:mt-0 pt-10 lg:pt-0 border-t lg:border-t-0 border-neutral-200"
    >
      {anchors.length > 0 && (
        <nav aria-label={t('onThisPage')}>
          <h2 className="flex items-center gap-2 text-eyebrow uppercase text-text-muted font-semibold mb-4">
            <ListTree className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {t('onThisPage')}
          </h2>
          <ul className="space-y-1 border-l border-neutral-200">
            {anchors.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  className="flex items-center min-h-11 text-sm text-text-secondary hover:text-primary-700 hover:border-primary-500
                    border-l-2 border-transparent -ml-px px-3 py-2 transition-colors duration-fast
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
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
          <h2 className="flex items-center gap-2 text-eyebrow uppercase text-text-muted font-semibold mb-4">
            <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {t('relatedPages.title')}
          </h2>
          <ul className="space-y-1">
            {relatedLinks.map(({ href, labelKey }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex items-center justify-between gap-2 min-h-11 text-sm text-text-secondary
                    hover:text-primary-700 transition-colors duration-fast py-2 px-1 -mx-1 rounded-sm
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <span>{t(`relatedPages.links.${labelKey}`)}</span>
                  <ArrowRight
                    className="h-3 w-3 text-text-muted opacity-0 -translate-x-1 transition-all duration-fast
                      group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary-600"
                    aria-hidden="true"
                    strokeWidth={2}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="card-paper p-5 bg-primary-50 border-primary-100">
        <div className="flex items-center gap-2 mb-2 text-primary-700">
          <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
          <span className="text-eyebrow uppercase font-semibold">
            {t('sidebarContactTitle')}
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {t('sidebarContactBody')}
        </p>
        <a
          href={`tel:${phoneTel}`}
          className="block font-heading text-2xl font-semibold text-primary-700 hover:text-primary-800
            transition-colors duration-fast leading-none mb-1
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
        >
          {phoneDisplay}
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-fast"
        >
          {t('sidebarContactLinkLabel')}
          <ArrowRight className="h-3 w-3" aria-hidden="true" strokeWidth={2} />
        </Link>
      </div>
    </aside>
  );
}
