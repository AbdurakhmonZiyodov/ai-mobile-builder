/** Oraliq shkalasi — 4 ga karrali. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 72,
} as const;

export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

/**
 * Bosish maydonining eng kichik o'lchami.
 * E2E tekshiruv agenti qulaylikni aynan shu raqam bo'yicha baholaydi.
 */
export const MIN_TOUCH_SIZE = 44;

/** Matn blokining eng katta kengligi — o'qish qulayligi uchun. */
export const MAX_PROSE_WIDTH = 820;
