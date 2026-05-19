import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'home' });
  return { title: t('pageTitle') };
}

export default function HomePage() {
  const t = useTranslations('home');
  return (
    <div className="bg-neutral-warm">
      <section className="max-w-content mx-auto px-section-x py-section-y text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary-600 mb-6 whitespace-pre-line">
          {t('heroHeading')}
        </h1>
        <p className="text-lg text-text-secondary max-w-prose mx-auto mb-8 leading-relaxed">
          {t('heroSubtext')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/services" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
            bg-primary-500 text-white rounded-btn shadow-card hover:bg-primary-600 transition-colors duration-ui min-h-[44px]">
            {t('heroCta')}
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
            border-2 border-primary-500 text-primary-600 rounded-btn hover:bg-primary-50 transition-colors duration-ui min-h-[44px]">
            {t('heroCtaSecondary')}
          </Link>
        </div>
      </section>
    </div>
  );
}
