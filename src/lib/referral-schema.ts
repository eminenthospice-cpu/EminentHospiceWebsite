import { z } from 'zod';

const baseFields = {
  companyWebsite: z.string().max(0).optional(),
  turnstileToken: z.string().min(1, 'common.formErrors.turnstileMissing'),
  locale: z.enum(['en', 'ko']),
};

export const callbackSchema = z.object({
  mode: z.literal('callback'),
  referrerName: z
    .string()
    .trim()
    .min(1, 'common.formErrors.required')
    .max(100, 'common.formErrors.tooLong'),
  referrerPhone: z
    .string()
    .trim()
    .min(7, 'common.formErrors.invalidPhone')
    .max(30, 'common.formErrors.tooLong'),
  referrerEmail: z
    .string()
    .trim()
    .email('common.formErrors.invalidEmail')
    .max(254, 'common.formErrors.tooLong')
    .optional()
    .or(z.literal('')),
  bestTimeToCall: z.enum(['morning', 'afternoon', 'evening', 'any']),
  referrerType: z.enum(['physician', 'familyMember', 'caseManager', 'other']),
  ...baseFields,
});

export type CallbackInput = z.infer<typeof callbackSchema>;

export const fullSchema = z.object({
  mode: z.literal('full'),
  // Referrer
  referrerName: z
    .string()
    .trim()
    .min(1, 'common.formErrors.required')
    .max(100, 'common.formErrors.tooLong'),
  referrerPhone: z
    .string()
    .trim()
    .min(7, 'common.formErrors.invalidPhone')
    .max(30, 'common.formErrors.tooLong'),
  referrerEmail: z
    .string()
    .trim()
    .email('common.formErrors.invalidEmail')
    .max(254, 'common.formErrors.tooLong'),
  referringPhysician: z
    .string()
    .trim()
    .max(100, 'common.formErrors.tooLong')
    .optional()
    .or(z.literal('')),
  referringPhysicianNpi: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'common.formErrors.invalidNpi')
    .optional()
    .or(z.literal('')),
  referrerRelationship: z.enum(['physician', 'familyMember', 'caseManager', 'other']),
  // Patient (PHI)
  patientName: z
    .string()
    .trim()
    .min(1, 'common.formErrors.required')
    .max(100, 'common.formErrors.tooLong'),
  patientDob: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'common.formErrors.invalidDate'),
  primaryDiagnosis: z
    .string()
    .trim()
    .min(2, 'common.formErrors.required')
    .max(500, 'common.formErrors.tooLong'),
  urgency: z.enum(['routine', 'soon', 'urgent', 'today']),
  currentLocation: z.enum(['home', 'hospital', 'snf', 'alf', 'other']),
  preferredLanguage: z.enum(['en', 'ko', 'other']),
  // Insurance (PHI)
  insuranceType: z.enum(['medicare', 'medical', 'private', 'other']),
  insuranceMemberId: z
    .string()
    .trim()
    .max(50, 'common.formErrors.tooLong')
    .optional()
    .or(z.literal('')),
  // Notes
  notes: z
    .string()
    .trim()
    .max(2000, 'common.formErrors.tooLong')
    .optional()
    .or(z.literal('')),
  ...baseFields,
});

export type FullInput = z.infer<typeof fullSchema>;

export const referralSchema = z.discriminatedUnion('mode', [callbackSchema, fullSchema]);

export type ReferralInput = z.infer<typeof referralSchema>;
