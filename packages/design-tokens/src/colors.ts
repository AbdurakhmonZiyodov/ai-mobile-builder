/**
 * RIVO palitrasi — quyuq fon, iliq gradient aksent.
 *
 * Nega quyuq: mahsulot ekrani soatlab ochiq turadi va uning markazida
 * mijozning ILOVASI bo'ladi. Quyuq fon ilovani ramkadan ajratadi va
 * unga e'tiborni qaratadi — oq fon esa telefon ekrani bilan qo'shilib
 * ketadi.
 *
 * Nega iliq aksent: sovuq ko'k-binafsha «dasturchi vositasi» degan
 * signal beradi, bizning mijoz esa dasturchi emas. Iliq oltin-marjon
 * eski terrakota identikamizning davomi.
 *
 * Har qiymat WCAG AA (4.5:1) bo'yicha tekshirilgan — DESIGN-SYSTEM.md
 * dagi jadvalga qarang.
 */
export const colors = {
  /** Sahifa foni — eng chuqur qatlam */
  paper: "#0B0B0D",
  /** Kartalar va panellar */
  surface: "#141416",
  /** Ichki bloklar, input fon, kartaning ichidagi karta */
  surfaceAlt: "#1B1B1E",
  /** Hover, progress trek, bosilgan holat */
  surfaceHigh: "#24242A",

  /** Asosiy matn — sof oq emas, biroz iliq: quyuq fonda ko'z charchamaydi */
  ink: "#F4F3F1",
  /** Ikkinchi darajali matn, tavsiflar */
  inkMuted: "#ABA9A5",
  /** Mono yorliqlar, uchinchi daraja */
  inkFaint: "#918F8A",

  /** Odatdagi chegara — deyarli ko'rinmaydi, faqat qatlamni ajratadi */
  line: "#26262B",
  /** Fokus, tanlangan karta */
  lineStrong: "#3A3A42",

  /** Gradientning o'rtasi — bitta rang kerak bo'lganda (ikona, chiziq) */
  accent: "#FFA93B",
  /** Gradient ustidagi matn — quyuq, chunki gradient yorug' */
  accentInk: "#0A0A0B",
  /** Aksent foni: ogohlantirish kartasi */
  accentSurface: "#2A1C0D",
  /** Aksent foni ustidagi matn */
  accentSoft: "#FFC77A",

  /** Muvaffaqiyat: tekshiruvdan o'tdi, do'konda */
  success: "#4ADE94",
  successSurface: "#10261D",

  /** Xato: tekshiruv o'tmadi, ulanish uzildi */
  danger: "#FF7A6B",
  dangerSurface: "#2A1512",
} as const;

export type ColorToken = keyof typeof colors;
