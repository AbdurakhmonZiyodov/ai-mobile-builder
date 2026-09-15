/**
 * Tipografiya.
 *
 * Inter — quyuq fonda tiniq, o'zbek lotin diakritikalarini (oʻ, gʻ)
 * to'g'ri ko'rsatadi va katta o'lchamlarda siqilgan oraliq bilan
 * «mahsulot» ko'rinishini beradi. Eski IBM Plex tahririy-qog'oz
 * ko'rinishga ega edi — quyuq interfeys uchun mos emas.
 *
 * JetBrains Mono — raqamlar, versiyalar, fayl yo'llari uchun: mono
 * shrift «bu texnik ma'lumot» degan signal beradi va uni oddiy
 * matndan ajratadi.
 */
export const fonts = {
  sans: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", monospace',
} as const;

export const fontSize = {
  /** Mono yorliqlar: «01 — LANDING» */
  label: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 28,
  /** Ekran sarlavhasi */
  display: 40,
  /** Landing sarlavhasi — markazlashgan, katta bo'sh joy bilan */
  hero: 60,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.04,
  snug: 1.25,
  normal: 1.6,
} as const;

export const letterSpacing = {
  /** Mono yorliqlar uchun keng oraliq */
  label: "0.16em",
  /** Katta sarlavhalar uchun siqilgan — quyuq fonda zich matn og'ir ko'rinadi */
  display: "-0.035em",
  normal: "0",
} as const;
