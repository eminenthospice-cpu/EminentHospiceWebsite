import { useTranslations } from 'next-intl';

export function OrganizationJsonLd() {
  const t = useTranslations('aboutJsonLd');

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

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': t('url'),
    name: t('name'),
    url: t('url'),
    telephone: t('telephone'),
    address,
    openingHours: t('openingHours'),
    areaServed: t('areaServed'),
    sameAs: [] as string[],
  };

  // React escapes JSX text children inside <script>, which produces HTML-encoded
  // JSON that crawlers cannot parse. Use dangerouslySetInnerHTML so the raw JSON
  // string ends up in the DOM. The `</` → `<\/` replacement prevents </script>
  // injection if any translated text were to contain it.
  const safeJson = JSON.stringify(payload).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
