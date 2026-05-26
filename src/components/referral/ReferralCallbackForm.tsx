'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { callbackSchema, type CallbackInput } from '@/lib/referral-schema';
import { FormField } from '@/components/ui/FormField';
import { FormSelect } from '@/components/ui/FormSelect';
import { Turnstile } from '@/components/ui/Turnstile';
import { FormPrivacyNotice } from '@/components/ui/FormPrivacyNotice';
import { FormSuccess } from '@/components/ui/FormSuccess';

const BEST_TIME_KEYS = ['morning', 'afternoon', 'evening', 'any'] as const;
const REFERRER_TYPE_KEYS = ['physician', 'familyMember', 'caseManager', 'other'] as const;

function stripPrefix(key?: string) {
  if (!key) return undefined;
  return key.startsWith('common.formErrors.')
    ? key.slice('common.formErrors.'.length)
    : key;
}

export function ReferralCallbackForm() {
  const t = useTranslations('referral.modeA.callbackForm');
  const tBestTime = useTranslations('referral.modeA.callbackForm.bestTimeOptions');
  const tReferrerType = useTranslations('referral.modeA.callbackForm.referrerTypeOptions');
  const tSuccess = useTranslations('referral.success.modeA');
  const tErrors = useTranslations('common.formErrors');
  const tPhone = useTranslations('common.phone');
  const locale = useLocale();
  const phoneDisplay = tPhone('display');

  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CallbackInput>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      mode: 'callback',
      referrerName: '',
      referrerPhone: '',
      referrerEmail: '',
      bestTimeToCall: 'any',
      referrerType: 'physician',
      companyWebsite: '',
      turnstileToken: '',
      locale: (locale === 'ko' ? 'ko' : 'en') as 'en' | 'ko',
    },
  });

  const localized = (raw?: string) => {
    const k = stripPrefix(raw);
    if (!k) return undefined;
    try {
      return tErrors(k as Parameters<typeof tErrors>[0], { phone: phoneDisplay });
    } catch {
      return undefined;
    }
  };

  const onSubmit: SubmitHandler<CallbackInput> = async (data) => {
    setServerError(null);
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setSubmitted(true);
        return;
      }
      const errKey = stripPrefix(json.error) ?? 'serverError';
      setServerError(
        tErrors(errKey as Parameters<typeof tErrors>[0], { phone: phoneDisplay }),
      );
    } catch {
      setServerError(tErrors('serverError', { phone: phoneDisplay }));
    }
  };

  if (submitted) {
    return (
      <FormSuccess
        title={tSuccess('title')}
        body={tSuccess('body', { phone: phoneDisplay })}
      />
    );
  }

  const bestTimeOptions = BEST_TIME_KEYS.map((k) => ({ value: k, label: tBestTime(k) }));
  const referrerTypeOptions = REFERRER_TYPE_KEYS.map((k) => ({ value: k, label: tReferrerType(k) }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <header>
        <h2 className="font-heading text-2xl text-text-primary mb-1">{t('title')}</h2>
        <p className="text-text-secondary">{t('intro')}</p>
      </header>

      <FormField<CallbackInput>
        name="referrerName"
        label={t('nameLabel')}
        required
        autoComplete="name"
        register={register}
        errorMessage={localized(errors.referrerName?.message)}
      />
      <FormField<CallbackInput>
        name="referrerPhone"
        type="tel"
        label={t('phoneLabel')}
        required
        autoComplete="tel"
        register={register}
        errorMessage={localized(errors.referrerPhone?.message)}
      />
      <FormField<CallbackInput>
        name="referrerEmail"
        type="email"
        label={t('emailLabel')}
        hint={t('emailHint')}
        autoComplete="email"
        register={register}
        errorMessage={localized(errors.referrerEmail?.message)}
      />
      <FormSelect<CallbackInput>
        name="bestTimeToCall"
        label={t('bestTimeLabel')}
        required
        options={bestTimeOptions}
        defaultValue="any"
        register={register}
        errorMessage={localized(errors.bestTimeToCall?.message)}
      />
      <FormSelect<CallbackInput>
        name="referrerType"
        label={t('referrerTypeLabel')}
        required
        options={referrerTypeOptions}
        defaultValue="physician"
        register={register}
        errorMessage={localized(errors.referrerType?.message)}
      />

      {/* Honeypot — populated value triggers silent 200 with no email sent. */}
      <FormField<CallbackInput>
        name="companyWebsite"
        label="Company website"
        hidden
        register={register}
      />

      <Turnstile
        onVerify={(token) =>
          setValue('turnstileToken', token, { shouldValidate: true })
        }
        onExpire={() => setValue('turnstileToken', '', { shouldValidate: true })}
      />

      <FormPrivacyNotice variant="referralModeA" />

      <div aria-live="polite" className="min-h-[1.25rem]">
        {serverError ? (
          <p className="text-error text-sm" role="alert">
            {serverError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-btn bg-primary-500 text-white font-semibold hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors duration-ui disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        {isSubmitting ? t('submitPendingLabel') : t('submitLabel')}
      </button>
    </form>
  );
}
