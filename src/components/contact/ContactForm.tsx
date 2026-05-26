'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { contactSchema, type ContactInput } from '@/lib/contact-schema';
import { FormField } from '@/components/ui/FormField';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { FormSelect } from '@/components/ui/FormSelect';
import { Turnstile } from '@/components/ui/Turnstile';
import { FormPrivacyNotice } from '@/components/ui/FormPrivacyNotice';
import { FormSuccess } from '@/components/ui/FormSuccess';

const SUBJECT_KEYS = ['general', 'insurance', 'volunteer', 'career', 'other'] as const;

function stripPrefix(key?: string) {
  if (!key) return undefined;
  return key.startsWith('common.formErrors.')
    ? key.slice('common.formErrors.'.length)
    : key;
}

export function ContactForm() {
  const t = useTranslations('contact.form');
  const tSubject = useTranslations('contact.form.subjectOptions');
  const tSuccess = useTranslations('contact.success');
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
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      message: '',
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

  const onSubmit: SubmitHandler<ContactInput> = async (data) => {
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
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

  const subjectOptions = SUBJECT_KEYS.map((k) => ({ value: k, label: tSubject(k) }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <h2 className="font-heading text-2xl text-text-primary">{t('heading')}</h2>

      <FormField<ContactInput>
        name="name"
        label={t('nameLabel')}
        required
        autoComplete="name"
        placeholder={t('namePlaceholder')}
        register={register}
        errorMessage={localized(errors.name?.message)}
      />
      <FormField<ContactInput>
        name="email"
        type="email"
        label={t('emailLabel')}
        required
        autoComplete="email"
        placeholder={t('emailPlaceholder')}
        register={register}
        errorMessage={localized(errors.email?.message)}
      />
      <FormField<ContactInput>
        name="phone"
        type="tel"
        label={t('phoneLabel')}
        hint={t('phoneHint')}
        autoComplete="tel"
        register={register}
        errorMessage={localized(errors.phone?.message)}
      />
      <FormSelect<ContactInput>
        name="subject"
        label={t('subjectLabel')}
        required
        options={subjectOptions}
        defaultValue="general"
        register={register}
        errorMessage={localized(errors.subject?.message)}
      />
      <FormTextarea<ContactInput>
        name="message"
        label={t('messageLabel')}
        required
        placeholder={t('messagePlaceholder')}
        register={register}
        errorMessage={localized(errors.message?.message)}
      />

      {/* Honeypot — invisible to humans and screen readers. A populated value
          returns 200 silently from the server so bots get no oracle. */}
      <FormField<ContactInput>
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

      <FormPrivacyNotice variant="contact" />

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
