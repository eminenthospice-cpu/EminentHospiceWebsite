import { useTranslations, useLocale } from 'next-intl';
import { localizedUrl, absoluteUrl } from '@/lib/seo';

export function LocalBusinessJsonLd() {
  const t = useTranslations('aboutJsonLd');
  const locale = useLocale();

  const streetAddress = t('address.streetAddress');
  const postalCode = t('address.postalCode');

  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: t('address.addressLocality'),
    addressRegion: t('address.addressRegion'),
    addressCountry: t('address.addressCountry'),
  };
  if (streetAddress) address.streetAddress = streetAddress;
  if (postalCode) address.postalCode = postalCode;

  const homeUrl = localizedUrl('/', locale);

  // @type is a union — Google's local-pack recognizes LocalBusiness; the
  // medical context is asserted via MedicalBusiness. Distinct @id from
  // About's MedicalOrganization so both signals coexist without collision.
  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    '@id': homeUrl,
    name: t('name'),
    url: homeUrl,
    logo: absoluteUrl('/images/logo.png'),
    image: absoluteUrl('/images/logo.png'),
    telephone: t('telephone'),
    faxNumber: t('faxNumber'),
    email: t('email'),
    address,
    openingHours: t('openingHours'),
    areaServed: t('areaServed'),
    award: t('award'),
    priceRange: 'Free for Medicare and Medi-Cal beneficiaries',
  };

  // Same XSS-prevention pattern as OrganizationJsonLd.
  const safeJson = JSON.stringify(payload).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
