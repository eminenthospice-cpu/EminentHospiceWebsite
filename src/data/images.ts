/**
 * Eminent Hospice — Image slot registry
 * Ported from EminentHospiceWebsite/src/lib/imageSlots.ts
 *
 * Photos are self-hosted under /public/images/photos/<key>.webp.
 * To use real client photography, drop a file at the same path (keep the
 * dimensions). See PLACEHOLDERS.md for the photography brief per slot.
 */

export interface ImageSlot {
  src: string;
  alt: { en: string; ko: string };
  blurDataURL?: string;
  credit?: string;
  width: number;
  height: number;
}

/** Neutral warm-cream 8×8 blur placeholder. Matches surface-paper. */
const DEFAULT_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKgAAB//2Q==';

export const imageSlots = {
  // ── Home ──────────────────────────────────────────────────
  homeHero: {
    src: '/images/photos/homeHero.webp',
    alt: { en: 'Two hands meeting gently on soft linen fabric in warm daylight', ko: '따뜻한 햇살 아래 부드러운 린넨 위에서 맞잡은 두 손' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1500, height: 2000,
  },
  homePhilosophyPortrait: {
    src: '/images/photos/homePhilosophyPortrait.webp',
    alt: { en: 'A sunlit corner of a quiet room with soft natural light', ko: '조용한 방의 햇살 가득한 구석' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1200, height: 1500,
  },
  homeLevelRoutine: {
    src: '/images/photos/homeLevelRoutine.webp',
    alt: { en: 'Hands gently holding a cup of tea in soft natural light', ko: '부드러운 자연광 속에서 차 한 잔을 든 손' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1000, height: 750,
  },
  homeLevelContinuous: {
    src: '/images/photos/homeLevelContinuous.webp',
    alt: { en: 'An open book and reading glasses on a sunlit table', ko: '햇살이 비치는 탁자 위의 펼쳐진 책과 돋보기 안경' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1000, height: 750,
  },
  homeLevelInpatient: {
    src: '/images/photos/homeLevelInpatient.webp',
    alt: { en: 'A sunlit corner of a quiet bedroom with soft curtains', ko: '부드러운 커튼이 있는 조용한 침실의 햇살 가득한 구석' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1000, height: 750,
  },
  homeLevelRespite: {
    src: '/images/photos/homeLevelRespite.webp',
    alt: { en: 'Garden flowers and foliage in late-day sunlight', ko: '늦은 오후 햇살 속 정원의 꽃과 잎' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1000, height: 750,
  },
  // ── About ─────────────────────────────────────────────────
  aboutHero: {
    src: '/images/photos/aboutHero.webp',
    alt: { en: 'A garden pathway lit by warm afternoon sun', ko: '따뜻한 오후 햇살이 비치는 정원 산책로' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
  // ── Services ──────────────────────────────────────────────
  servicesHero: {
    src: '/images/photos/servicesHero.webp',
    alt: { en: 'A serene window with soft natural light filling a quiet room', ko: '조용한 방을 가득 채우는 부드러운 자연광' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
  // ── Families ──────────────────────────────────────────────
  familiesHero: {
    src: '/images/photos/familiesHero.webp',
    alt: { en: 'Three generations sharing a quiet moment at home', ko: '집에서 조용한 시간을 나누는 삼대 가족' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
  // ── Contact ───────────────────────────────────────────────
  contactHero: {
    src: '/images/photos/contactHero.webp',
    alt: { en: 'Welcoming front porch in warm daylight', ko: '따뜻한 햇살이 비치는 환영하는 듯한 현관 입구' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
  // ── Grief Support (new page) ──────────────────────────────
  griefHero: {
    src: '/images/photos/griefHero.webp',
    alt: { en: 'A peaceful garden in soft afternoon light', ko: '부드러운 오후 햇살의 고요한 정원' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
} as const satisfies Record<string, ImageSlot>;

export type ImageSlotKey = keyof typeof imageSlots;

export function getImage(key: ImageSlotKey, lang: 'en' | 'ko' = 'en'): ImageSlot & { altText: string } {
  const slot = imageSlots[key];
  return { ...slot, altText: slot.alt[lang] };
}
