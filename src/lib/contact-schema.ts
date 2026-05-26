import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'common.formErrors.required')
    .max(100, 'common.formErrors.tooLong'),
  email: z
    .string()
    .trim()
    .email('common.formErrors.invalidEmail')
    .max(254, 'common.formErrors.tooLong'),
  phone: z
    .string()
    .trim()
    .max(30, 'common.formErrors.tooLong')
    .optional()
    .or(z.literal('')),
  subject: z.enum(['general', 'insurance', 'volunteer', 'career', 'other']),
  message: z
    .string()
    .trim()
    .min(10, 'common.formErrors.tooShort')
    .max(2000, 'common.formErrors.tooLong'),
  // Honeypot: a populated value indicates a bot — must be empty.
  companyWebsite: z.string().max(0).optional(),
  turnstileToken: z.string().min(1, 'common.formErrors.turnstileMissing'),
  locale: z.enum(['en', 'ko']),
});

export type ContactInput = z.infer<typeof contactSchema>;
