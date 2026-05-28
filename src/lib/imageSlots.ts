/**
 * Image slot registry for the Eminent Hospice site.
 *
 * Every photographic slot in the site is registered here so the client can swap
 * placeholders for real photography by editing a single file.
 */

export interface ImageSlot {
  src: string;
  /** English alt text. Empty string = decorative (will set alt="" and aria-hidden). */
  alt: { en: string; ko: string };
  /** Tiny base64 blur preview to prevent CLS. Default is a neutral warm tone. */
  blurDataURL?: string;
  /** Photo credit shown small in the layout. Empty string suppresses. */
  credit?: string;
  /** Suggested intrinsic dimensions (for layout planning). */
  width: number;
  height: number;
}

/** Neutral warm-cream 8×8 placeholder blur. Matches surface.paper. */
const DEFAULT_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKgAAB//2Q==';

/** Mono noise tile for FinalCta filmic warmth (~5% opacity when tiled). */
const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.4"/></svg>`;
const NOISE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}`;

export const imageSlots = {
  // ─── Home ──────────────────────────────────────────────────────────────
  homeHero: {
    // TODO: client photo — hands meeting on linen, 3:4, late-afternoon side-light
    src: 'https://images.unsplash.com/photo-1653370205143-d07cbf28d668?auto=format&fit=crop&w=1500&h=2000&q=80',
    alt: {
      en: 'Two hands meeting gently on soft linen fabric in warm daylight',
      ko: '따뜻한 햇살 아래 부드러운 린넨 위에서 맞잡은 두 손',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1500,
    height: 2000,
  },
  homePhilosophyPortrait: {
    // TODO: client photo — window-lit chair, person from behind, 4:5
    // Temporary: sunlit interior vignette matches the contemplative brief while we wait for real photography.
    src: 'https://images.unsplash.com/photo-1573856631239-eb02c9fd8c1d?auto=format&fit=crop&w=1200&h=1500&q=80',
    alt: {
      en: 'A sunlit corner of a quiet room with soft natural light',
      ko: '조용한 방의 햇살 가득한 구석',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1200,
    height: 1500,
  },
  homeLevelRoutine: {
    // TODO: client photo — hands holding tea, object vignette 4:3
    src: 'https://images.unsplash.com/photo-1454875392665-2ac2c85e8d3e?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: {
      en: 'Hands gently holding a cup of tea in soft natural light',
      ko: '부드러운 자연광 속에서 차 한 잔을 든 손',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1000,
    height: 750,
  },
  homeLevelContinuous: {
    // TODO: client photo — open book and reading glasses, 4:3
    src: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: {
      en: 'An open book and reading glasses on a sunlit table',
      ko: '햇살이 비치는 탁자 위의 펼쳐진 책과 돋보기 안경',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1000,
    height: 750,
  },
  homeLevelInpatient: {
    // TODO: client photo — sunlit bedroom corner, 4:3
    src: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: {
      en: 'A sunlit corner of a quiet bedroom with soft curtains',
      ko: '부드러운 커튼이 있는 조용한 침실의 햇살 가득한 구석',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1000,
    height: 750,
  },
  homeLevelRespite: {
    // TODO: client photo — garden detail, 4:3
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: {
      en: 'Garden flowers and foliage in late-day sunlight',
      ko: '늦은 오후 햇살 속 정원의 꽃과 잎',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1000,
    height: 750,
  },
  homeFinalCtaTexture: {
    src: NOISE_TEXTURE,
    alt: { en: '', ko: '' },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 256,
    height: 256,
  },

  // ─── About ─────────────────────────────────────────────────────────────
  aboutHero: {
    // TODO: replace with founder/team photo when client provides
    src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'A garden pathway lit by warm afternoon sun',
      ko: '따뜻한 오후 햇살이 비치는 정원 산책로',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },

  // ─── Services ──────────────────────────────────────────────────────────
  servicesHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'A serene window with soft natural light filling a quiet room',
      ko: '조용한 방을 가득 채우는 부드러운 자연광',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },

  // ─── Understanding Hospice ─────────────────────────────────────────────
  understandingHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'An open book resting on a sunlit table',
      ko: '햇살이 비치는 탁자 위에 펼쳐진 책',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },

  // ─── Laws ──────────────────────────────────────────────────────────────
  lawsHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'Soft natural fabric folded in still light',
      ko: '고요한 빛 아래 접힌 부드러운 천',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },

  // ─── Families ──────────────────────────────────────────────────────────
  familiesHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'Three generations sharing a quiet moment at home',
      ko: '집에서 조용한 시간을 나누는 삼대 가족',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },
  familiesGarden: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    alt: {
      en: 'Garden flowers in late-day sunlight',
      ko: '늦은 오후 햇살 속 정원의 꽃들',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1200,
    height: 800,
  },

  // ─── Insurance ─────────────────────────────────────────────────────────
  insuranceHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'A neutral desk with papers and a calm light',
      ko: '서류와 차분한 조명이 있는 단정한 책상',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },

  // ─── Contact ───────────────────────────────────────────────────────────
  contactHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'Welcoming front porch in daylight',
      ko: '햇살이 비치는 환영하는 듯한 현관 입구',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },
} as const satisfies Record<string, ImageSlot>;

export type ImageSlotKey = keyof typeof imageSlots;

export function getImageSlot(key: ImageSlotKey): ImageSlot {
  return imageSlots[key];
}
