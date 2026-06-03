/**
 * Eminent Hospice — Centralized Site Configuration
 *
 * All org-specific placeholders live here.
 * Update these values before going live.
 * See also: PLACEHOLDERS.md (ported from Next.js app)
 */

export const SITE = {
  name:     'Eminent Hospice Care',
  legalName:'Eminent Hospice Care, Inc.',
  tagline:  'Comfort. Dignity. Compassion.',
  url:      'https://www.eminenthospice.com',       // TODO: confirm production domain
  locale:   'en-US',
} as const;

export const CONTACT = {
  phone: {
    display: '(818) 824-3702',
    tel:     '+18188243702',
  },
  email:   'eminenthospice@gmail.com',
  address: {
    street:   '10999 Riverside Dr., Ste 306',
    city:     'North Hollywood',
    state:    'CA',
    zip:      '91602',
    country:  'US',
    display:  '10999 Riverside Dr., Ste 306, North Hollywood, CA 91602',
  },
  hours:   'Available 24 hours a day, 7 days a week',
  regions: 'Los Angeles County, CA',               // TODO: confirm full service area
} as const;

export const BRAND = {
  logo:          '/images/logo.svg',
  favicon:       '/favicon.svg',
  ogImageDefault:'/og-default.png',
} as const;

export const FORMS = {
  /**
   * Formspree endpoint placeholder.
   * 1. Create a free form at https://formspree.io
   * 2. Replace both values with your real endpoint IDs.
   */
  contactEndpoint:  'https://formspree.io/f/REPLACE_ME_CONTACT',
  referralEndpoint: 'https://formspree.io/f/REPLACE_ME_REFERRAL',
  careersEndpoint:  'https://formspree.io/f/REPLACE_ME_CAREERS',
} as const;

export const ACCREDITATIONS = [
  'Medicare Certified',
  'Available 24/7',
  'English & Korean',
] as const;

export const SOCIAL = {
  // Add when social profiles are created
} as const;
