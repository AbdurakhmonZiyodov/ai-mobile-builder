/**
 * Dizayn tokenlari.
 * Har mijoz uchun ranglar shu yerda o'zgaradi — 4.3 bandi bo'yicha bizdan chiqqan
 * ilovalar bir-biriga o'xshamasligi kerak (spek 18.1).
 */
export const theme = {
  colors: {
    background: "#FFFFFF",
    surface: "#F8FAFC",
    border: "#E2E8F0",
    text: "#0F172A",
    textMuted: "#64748B",
    primary: "#2563EB",
    primaryText: "#FFFFFF",
    danger: "#DC2626",
    success: "#16A34A",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 20 },
  /** Bosish maydoni 44pt dan kichik bo'lmasin — qulaylik tekshiruvi (spek 12.2). */
  minTouchSize: 44,
  fontSize: { sm: 13, md: 15, lg: 18, xl: 24, xxl: 32 },
} as const;

export type Theme = typeof theme;
