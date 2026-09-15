/** Oraliq shkalasi — 4 ga karrali. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 96,
} as const;

/**
 * Radiuslar.
 *
 * Quyuq dizaynda burchaklar yumshoqroq: `pill` tugma va chiplar uchun
 * standart, `lg` kartalar uchun. O'tkir burchak quyuq fonda qattiq
 * ko'rinadi.
 */
export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 18,
  /** Telefon ramkasining tashqi burchagi */
  phone: 44,
  pill: 999,
} as const;

/**
 * Bosish maydonining eng kichik o'lchami.
 * E2E tekshiruv agenti qulaylikni aynan shu raqam bo'yicha baholaydi.
 */
export const MIN_TOUCH_SIZE = 44;

/** Matn blokining eng katta kengligi — o'qish qulayligi uchun. */
export const MAX_PROSE_WIDTH = 720;

/**
 * Telefon maketi — iPhone 15 mantiqiy o'lchami.
 *
 * Nisbat saqlanadi, balandlik esa ekranga moslashadi (globals.css dagi
 * `.phone-shell`). Qat'iy 844px 1440×900 ekranda kesilib qolardi.
 */
export const PHONE = { width: 390, height: 844 } as const;
