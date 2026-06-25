/**
 * Service areas — the cities Eminent Hospice Care serves, used to generate
 * local "Hospice Care in [City]" landing pages. Each entry is its own page and
 * its own local-search signal. Keep names accurate; the slug becomes the URL.
 *
 * Mirrors SERVICE_AREAS in site-config.ts (which feeds structured data).
 */
export interface ServiceArea {
  slug: string;
  name: { en: string; ko: string };
  /** Broader region the city sits in — used in body copy. */
  region: { en: string; ko: string };
}

const VALLEY = { en: 'San Fernando Valley', ko: '샌퍼낸도 밸리' };
const SGV = { en: 'San Gabriel Valley', ko: '샌가브리엘 밸리' };
const GREATER_LA = { en: 'greater Los Angeles area', ko: '광역 로스앤젤레스 지역' };

export const SERVICE_AREAS: ServiceArea[] = [
  { slug: 'north-hollywood', name: { en: 'North Hollywood', ko: '노스할리우드' }, region: VALLEY },
  { slug: 'burbank',         name: { en: 'Burbank',         ko: '버뱅크' },       region: GREATER_LA },
  { slug: 'glendale',        name: { en: 'Glendale',        ko: '글렌데일' },     region: GREATER_LA },
  { slug: 'sherman-oaks',    name: { en: 'Sherman Oaks',    ko: '셔먼 오크스' },   region: VALLEY },
  { slug: 'studio-city',     name: { en: 'Studio City',     ko: '스튜디오 시티' }, region: VALLEY },
  { slug: 'van-nuys',        name: { en: 'Van Nuys',        ko: '밴 나이스' },     region: VALLEY },
  { slug: 'pasadena',        name: { en: 'Pasadena',        ko: '패서디나' },      region: SGV },
  { slug: 'los-angeles',     name: { en: 'Los Angeles',     ko: '로스앤젤레스' },  region: GREATER_LA },
];

export function getServiceArea(slug: string): ServiceArea | undefined {
  return SERVICE_AREAS.find((a) => a.slug === slug);
}
