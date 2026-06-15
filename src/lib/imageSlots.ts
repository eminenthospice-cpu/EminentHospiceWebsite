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
      en: 'A caregiver gently holding a patient’s hand in comfort',
      ko: '환자의 손을 따뜻하게 감싸 쥔 보호자의 손',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1500,
    height: 2000,
  },
  homePhilosophyPortrait: {
    // TODO: client photo — window-lit chair, person from behind, 4:5
    // Temporary: warm armchair in late-day window light matches the contemplative brief while we wait for real photography.
    src: 'https://images.unsplash.com/photo-1723804685588-b8e95b2044f3?auto=format&fit=crop&w=1200&h=1500&q=80',
    alt: {
      en: 'A warm armchair in soft late-afternoon window light',
      ko: '늦은 오후 창가의 부드러운 빛이 비치는 안락의자',
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
      en: 'An elderly person’s hands folded gently in their lap',
      ko: '무릎 위에 가지런히 모은 어르신의 두 손',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1000,
    height: 750,
  },
  homeLevelContinuous: {
    // TODO: client photo — open book and reading glasses, 4:3
    src: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: {
      en: 'Reading glasses resting on a closed book',
      ko: '책 위에 놓인 돋보기 안경',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1000,
    height: 750,
  },
  homeLevelInpatient: {
    // TODO: client photo — sunlit bedroom corner, 4:3
    src: 'https://images.unsplash.com/photo-1703783010857-9bd7a7b97c50?auto=format&fit=crop&w=1000&h=750&q=80',
    alt: {
      en: 'A quiet bedroom with a warm lamp glowing beside the bed',
      ko: '침대 곁 따뜻한 조명이 켜진 조용한 침실',
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
    src: 'https://images.unsplash.com/photo-1728066909157-b9697e3822d2?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'A garden pathway winding through flowers and greenery',
      ko: '꽃과 푸른 나무 사이로 이어지는 정원 산책로',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },

  // ─── Services ──────────────────────────────────────────────────────────
  servicesHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'Two hands clasped warmly in sunlight, one holding the other in comfort',
      ko: '햇살 아래 서로를 따뜻하게 감싸 쥔 두 손',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },

  // ─── Understanding Hospice ─────────────────────────────────────────────
  understandingHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1518461845661-a2640bd93759?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'An open book with pages turning in soft outdoor light',
      ko: '부드러운 빛 속에 책장이 넘어가는 펼쳐진 책',
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
      en: 'A statue of Lady Justice holding balanced scales',
      ko: '균형 잡힌 저울을 든 정의의 여신상',
    },
    blurDataURL: DEFAULT_BLUR,
    credit: '',
    width: 1600,
    height: 1000,
  },

  // ─── Families ──────────────────────────────────────────────────────────
  familiesHero: {
    // TODO: replace
    src: 'https://images.unsplash.com/photo-1609260840244-22b52bfc6664?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'Three generations of a family gathered together at home',
      ko: '집 앞에 함께 모인 삼대 가족',
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
    src: 'https://images.unsplash.com/photo-1714836982299-7a3b6930e2f5?auto=format&fit=crop&w=1600&q=80',
    alt: {
      en: 'A welcoming front porch with blossoming shrubs in daylight',
      ko: '꽃나무가 어우러진 환영하는 듯한 현관 입구',
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
