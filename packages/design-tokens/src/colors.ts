/**
 * RIVO palitrasi — dizayn kanvasidan olingan.
 *
 * Nega issiq qog'oz rangi: mahsulot texnik vosita emas, biznes egasining
 * ishchi stoli. Sovuq kulrang SaaS palitrasi «dasturchi vositasi» degan
 * signal beradi, bizning mijoz esa dasturchi emas.
 */
export const colors = {
  /** Sahifa foni */
  paper: "#E7E1D5",
  /** Kartalar va panellar */
  surface: "#F7F4EE",
  /** Ichki bloklar, kartaning ichidagi karta */
  surfaceAlt: "#EDE7DB",
  /** Bosilgan yoki tanlangan holat */
  surfaceSunken: "#DCD5C8",

  /** Asosiy matn */
  ink: "#151510",
  /** Ikkinchi darajali matn */
  inkMuted: "#4A4840",
  /** Yorliqlar, mono matn, uchinchi daraja */
  inkFaint: "#5F5B52",

  /** Chegaralar */
  line: "#C9C2B3",
  lineStrong: "#151510",

  /** Asosiy amal — terrakota */
  accent: "#B03A18",
  accentSoft: "#F0A483",

  /** Muvaffaqiyat: tekshiruvdan o'tdi, do'konda */
  success: "#155C3E",
  successAlt: "#1D6B4A",
  successSurface: "#E4F0E8",
} as const;

export type ColorToken = keyof typeof colors;
