'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { fullSchema, type FullInput } from '@/lib/referral-schema';
import { FormField } from '@/components/ui/FormField';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { FormSelect } from '@/components/ui/FormSelect';
import { Turnstile } from '@/components/ui/Turnstile';
import { FormPrivacyNotice } from '@/components/ui/FormPrivacyNotice';
import { FormSuccess } from '@/components/ui/FormSuccess';

const RELATIONSHIP_KEYS = ['physician', 'familyMember', 'caseManager', 'other'] as const;
const URGENCY_KEYS = ['routine', 'soon', 'urgent', 'today'] as const;
const LOCATION_KEYS = ['home', 'hospital', 'snf', 'alf', 'other'] as const;
const LANGUAGE_KEYS = ['en', 'ko', 'other'] as const;
const INSURANCE_KEYS = ['medicare', 'medical', 'private', 'other'] as const;

function stripPrefix(key?: string) {
  if (!key) return undefined;
  return key.startsWith('common.formErrors.')
    ? key.slice('common.formErrors.'.length)
    : key;
}

type Props = {
  retentionDays: number;
};

export function ReferralFullForm({ retentionDays }: Props) {
  const t = useTranslations('referral.modeB.fullForm');
  const tReferrer = useTranslations('referral.modeB.fullForm.referrerSection');
  const tRelationship = useTranslations('referral.modeB.fullForm.referrerSection.relationshipOptions');
  const tPatient = useTranslations('referral.modeB.fullForm.patientSection');
  const tUrgency = useTranslations('referral.modeB.fullForm.patientSection.urgencyOptions');
  const tLocation = useTranslations('referral.modeB.fullForm.patientSection.locationOptions');
  const tLanguage = useTranslations('referral.modeB.fullForm.patientSection.languageOptions');
  const tInsurance = useTranslations('referral.modeB.fullForm.insuranceSection');
  const tInsuranceType = useTranslations('referral.modeB.fullForm.insuranceSection.typeOptions');
  const tSuccess = useTranslations('referral.success.modeB');
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
  } = useForm<FullInput>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      mode: 'full',
      referrerName: '',
      referrerPhone: '',
      referrerEmail: '',
      referringPhysician: '',
      referringPhysicianNpi: '',
      referrerRelationship: 'physician',
      patientName: '',
      patientDob: '',
      primaryDiagnosis: '',
      urgency: 'routine',
      currentLocation: 'home',
      preferredLanguage: 'en',
      insuranceType: 'medicare',
      insuranceMemberId: '',
      notes: '',
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

  const onSubmit: SubmitHandler<FullInput> = async (data) => {
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
      <FormSuccess title={tSuccess('title')} body={tSuccess('body')} />
    );
  }

  const relationshipOptions = RELATIONSHIP_KEYS.map((k) => ({ value: k, label: tRelationship(k) }));
  const urgencyOptions = URGENCY_KEYS.map((k) => ({ value: k, label: tUrgency(k) }));
  const locationOptions = LOCATION_KEYS.map((k) => ({ value: k, label: tLocation(k) }));
  const languageOptions = LANGUAGE_KEYS.map((k) => ({ value: k, label: tLanguage(k) }));
  const insuranceTypeOptions = INSURANCE_KEYS.map((k) => ({ value: k, label: tInsuranceType(k) }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <p className="text-text-secondary">{t('intro')}</p>

      <fieldset className="space-y-5">
        <legend className="font-heading text-xl text-text-primary mb-1">
          {tReferrer('title')}
        </legend>
        <FormField<FullInput>
          name="referrerName"
          label={tReferrer('nameLabel')}
          required
          autoComplete="name"
          register={register}
          errorMessage={localized(errors.referrerName?.message)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField<FullInput>
            name="referrerPhone"
            type="tel"
            label={tReferrer('phoneLabel')}
            required
            autoComplete="tel"
            register={register}
            errorMessage={localized(errors.referrerPhone?.message)}
          />
          <FormField<FullInput>
            name="referrerEmail"
            type="email"
            label={tReferrer('emailLabel')}
            required
            autoComplete="email"
            register={register}
            errorMessage={localized(errors.referrerEmail?.message)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField<FullInput>
            name="referringPhysician"
            label={tReferrer('physicianLabel')}
            register={register}
            errorMessage={localized(errors.referringPhysician?.message)}
          />
          <FormField<FullInput>
            name="referringPhysicianNpi"
            label={tReferrer('npiLabel')}
            hint={tReferrer('npiHint')}
            register={register}
            errorMessage={localized(errors.referringPhysicianNpi?.message)}
          />
        </div>
        <FormSelect<FullInput>
          name="referrerRelationship"
          label={tReferrer('relationshipLabel')}
          required
          options={relationshipOptions}
          defaultValue="physician"
          register={register}
          errorMessage={localized(errors.referrerRelationship?.message)}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-heading text-xl text-text-primary mb-1">
          {tPatient('title')}
        </legend>
        <FormField<FullInput>
          name="patientName"
          label={tPatient('nameLabel')}
          required
          register={register}
          errorMessage={localized(errors.patientName?.message)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField<FullInput>
            name="patientDob"
            type="date"
            label={tPatient('dobLabel')}
            hint={tPatient('dobHint')}
            required
            register={register}
            errorMessage={localized(errors.patientDob?.message)}
          />
          <FormSelect<FullInput>
            name="urgency"
            label={tPatient('urgencyLabel')}
            required
            options={urgencyOptions}
            defaultValue="routine"
            register={register}
            errorMessage={localized(errors.urgency?.message)}
          />
        </div>
        <FormTextarea<FullInput>
          name="primaryDiagnosis"
          label={tPatient('diagnosisLabel')}
          rows={3}
          required
          register={register}
          errorMessage={localized(errors.primaryDiagnosis?.message)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormSelect<FullInput>
            name="currentLocation"
            label={tPatient('locationLabel')}
            required
            options={locationOptions}
            defaultValue="home"
            register={register}
            errorMessage={localized(errors.currentLocation?.message)}
          />
          <FormSelect<FullInput>
            name="preferredLanguage"
            label={tPatient('languageLabel')}
            required
            options={languageOptions}
            defaultValue="en"
            register={register}
            errorMessage={localized(errors.preferredLanguage?.message)}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-heading text-xl text-text-primary mb-1">
          {tInsurance('title')}
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormSelect<FullInput>
            name="insuranceType"
            label={tInsurance('typeLabel')}
            required
            options={insuranceTypeOptions}
            defaultValue="medicare"
            register={register}
            errorMessage={localized(errors.insuranceType?.message)}
          />
          <FormField<FullInput>
            name="insuranceMemberId"
            label={tInsurance('memberIdLabel')}
            hint={tInsurance('memberIdHint')}
            register={register}
            errorMessage={localized(errors.insuranceMemberId?.message)}
          />
        </div>
      </fieldset>

      <FormTextarea<FullInput>
        name="notes"
        label={t('notesLabel')}
        hint={t('notesHint')}
        rows={4}
        register={register}
        errorMessage={localized(errors.notes?.message)}
      />

      {/* Honeypot — silent 200 if populated. */}
      <FormField<FullInput>
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

      <FormPrivacyNotice variant="referralModeB" retentionDays={retentionDays} />

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
