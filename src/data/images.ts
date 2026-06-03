/**
 * Eminent Hospice — Image slot registry
 * Ported from EminentHospiceWebsite/src/lib/imageSlots.ts
 *
 * Swap src values with real photography URLs before launch.
 * See PLACEHOLDERS.md for the photography brief per slot.
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
    // TODO: client photo — hands meeting on linen, 3:4, late-afternoon side-light
    src: 'https://images.unsplash.com/photo-1653370205143-d07cbf28d668?auto=format&fit=crop&w=1500&h=2000&q=80',
    alt: { en: 'Two hands meeting gently on soft linen fabric in warm daylight', ko: '따뜻한 햇살 아래 부드러운 린넨 위에서 맞잡은 두 손' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1500, height: 2000,
  },
  homePhilosophyPortrait: {
    // TODO: client photo — window-lit chair, person from behind, 4:5
    src: 'https://images.unsplash.com/photo-1573856631239-eb02c9fd8c1d?auto=format&fit=crop&w=1200&h=1500&q=80',
    alt: { en: 'A sunlit corner of a quiet room with soft natural light', ko: '조용한 방의 햇살 가득한 구석' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1200, height: 1500,
  },
  homeLevelRoutine: {
    src: 'https://images.unsplash.com/photo-1454875392665-2ac2c85e8d3e?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: { en: 'Hands gently holding a cup of tea in soft natural light', ko: '부드러운 자연광 속에서 차 한 잔을 든 손' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1000, height: 750,
  },
  homeLevelContinuous: {
    src: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: { en: 'An open book and reading glasses on a sunlit table', ko: '햇살이 비치는 탁자 위의 펼쳐진 책과 돋보기 안경' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1000, height: 750,
  },
  homeLevelInpatient: {
    src: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: { en: 'A sunlit corner of a quiet bedroom with soft curtains', ko: '부드러운 커튼이 있는 조용한 침실의 햇살 가득한 구석' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1000, height: 750,
  },
  homeLevelRespite: {
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: { en: 'Garden flowers and foliage in late-day sunlight', ko: '늦은 오후 햇살 속 정원의 꽃과 잎' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1000, height: 750,
  },
  // ── About ─────────────────────────────────────────────────
  aboutHero: {
    src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=80',
    alt: { en: 'A garden pathway lit by warm afternoon sun', ko: '따뜻한 오후 햇살이 비치는 정원 산책로' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
  // ── Services ──────────────────────────────────────────────
  servicesHero: {
    src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80',
    alt: { en: 'A serene window with soft natural light filling a quiet room', ko: '조용한 방을 가득 채우는 부드러운 자연광' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
  // ── Families ──────────────────────────────────────────────
  familiesHero: {
    src: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1600&q=80',
    alt: { en: 'Three generations sharing a quiet moment at home', ko: '집에서 조용한 시간을 나누는 삼대 가족' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
  // ── Contact ───────────────────────────────────────────────
  contactHero: {
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
    alt: { en: 'Welcoming front porch in warm daylight', ko: '따뜻한 햇살이 비치는 환영하는 듯한 현관 입구' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
  // ── Grief Support (new page) ──────────────────────────────
  griefHero: {
    // TODO: client photo — garden in soft light, peaceful setting
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80',
    alt: { en: 'A peaceful garden in soft afternoon light', ko: '부드러운 오후 햇살의 고요한 정원' },
    blurDataURL: DEFAULT_BLUR, credit: '', width: 1600, height: 1000,
  },
} as const satisfies Record<string, ImageSlot>;

export type ImageSlotKey = keyof typeof imageSlots;

export function getImage(key: ImageSlotKey, lang: 'en' | 'ko' = 'en'): ImageSlot & { altText: string } {
  const slot = imageSlots[key];
  return { ...slot, altText: slot.alt[lang] };
}
