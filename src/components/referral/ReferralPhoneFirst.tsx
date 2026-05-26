import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { ReferralCallbackForm } from './ReferralCallbackForm';

export function ReferralPhoneFirst() {
  const tCta = useTranslations('referral.modeA.phoneCta');
  const tWhy = useTranslations('referral.modeA.whyPhone');
  const tPhone = useTranslations('common.phone');
  const phoneDisplay = tPhone('display');
  const phoneTel = tPhone('tel');

  return (
    <div className="space-y-10">
      <a
        href={`tel:${phoneTel}`}
        className="block rounded-card bg-primary-500 text-white p-6 md:p-8 shadow-card-md hover:bg-primary-600 transition-colors duration-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-white/15 p-3 shrink-0">
            <Icon name="phone" className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl mb-1">{tCta('title')}</h2>
            <p className="text-primary-100 mb-3">{tCta('subtitle')}</p>
            <p className="text-xl md:text-2xl font-semibold">
              {tCta('callLabel', { phone: phoneDisplay })}
            </p>
          </div>
        </div>
      </a>

      <section aria-labelledby="why-phone-heading" className="max-w-prose">
        <h3
          id="why-phone-heading"
          className="font-heading text-xl text-text-primary mb-2"
        >
          {tWhy('title')}
        </h3>
        <p className="text-text-secondary leading-relaxed">{tWhy('body')}</p>
      </section>

      <section
        id="callback"
        aria-labelledby="callback-heading"
        className="rounded-card bg-white border border-neutral-200 p-6 lg:p-8 shadow-card"
      >
        <ReferralCallbackForm />
      </section>
    </div>
  );
}
