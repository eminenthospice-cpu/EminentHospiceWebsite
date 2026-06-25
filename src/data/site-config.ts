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
  url:      'https://eminenthospicewebsite.pages.dev', // Cloudflare Pages URL (swap to custom domain when acquired)
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
  regions: 'North Hollywood and the greater Los Angeles area',
} as const;

export const BRAND = {
  logo:          '/images/logo.png',
  favicon:       '/favicon.svg',
  ogImageDefault:'/og-default.png',
} as const;

/**
 * Approximate geo-coordinates of the office. Used in LocalBusiness structured
 * data to strengthen local ("near me") search signals.
 * TODO: replace with the exact lat/long from the Google Business Profile pin.
 */
export const GEO = {
  latitude:  34.1564,
  longitude: -118.3692,
} as const;

/**
 * Cities/areas served, as discrete entries for structured data and on-page
 * local content. Each name is an individual local-search signal — keep these
 * specific (city names), not regions.
 */
export const SERVICE_AREAS = [
  'North Hollywood',
  'Burbank',
  'Glendale',
  'Sherman Oaks',
  'Studio City',
  'Van Nuys',
  'Pasadena',
  'Los Angeles',
] as const;

/**
 * Analytics. Leave blank to disable. Set one (or both) to enable measurement:
 *  - ga4Id:          Google Analytics 4 Measurement ID, e.g. 'G-XXXXXXXXXX'
 *  - plausibleDomain: your bare domain for Plausible, e.g. 'eminenthospicecare.com'
 * The Analytics component renders nothing until a value is present.
 */
export const ANALYTICS = {
  ga4Id:           '',
  plausibleDomain: '',
} as const;

export const FORMS = {
  contactEndpoint:  'https://formspree.io/f/mqevkdog',
  referralEndpoint: 'https://formspree.io/f/mlgyewka',
} as const;

export const TURNSTILE = {
  /**
   * Cloudflare Turnstile site key (public, safe to commit).
   *
   * Production uses the real widget key below. Also set the matching secret on
   * the Pages project (NOT committed):
   *   npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name=eminenthospicewebsite
   * The server-side check lives in functions/api/submit.js.
   */
  siteKey: '0x4AAAAAADpPbjFtS1-557HJ',
} as const;

export const ACCREDITATIONS = [
  'Medicare Certified',
  'Available 24/7',
  'English & Korean',
] as const;

export const SOCIAL = {
  // Add when social profiles are created
} as const;
