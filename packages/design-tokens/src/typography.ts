/**
 * Tipografiya.
 *
 * IBM Plex Sans — o'zbek lotin diakritikalarini to'g'ri ko'rsatadi va
 * bepul. IBM Plex Mono — raqamlar, versiyalar, fayl yo'llari uchun:
 * mono shrift «bu texnik ma'lumot» degan signal beradi va uni oddiy
 * matndan ajratadi.
 */
export const fonts = {
  sans: '"IBM Plex Sans", system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, "SF Mono", monospace',
} as const;

export const fontSize = {
  /** Mono yorliqlar: «01 — LANDING» */
  label: 12,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 26,
  /** Ekran sarlavhasi */
  display: 34,
  /** Landing sarlavhasi */
  hero: 44,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.05,
  snug: 1.25,
  normal: 1.55,
} as const;

export const letterSpacing = {
  /** Mono yorliqlar uchun keng oraliq */
  label: "0.14em",
  /** Katta sarlavhalar uchun siqilgan */
  display: "-0.02em",
  normal: "0",
} as const;
