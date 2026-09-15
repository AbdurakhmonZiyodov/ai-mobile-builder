/**
 * Gradientlar — RIVO identikasining yagona «ovozli» elementi.
 *
 * Qoida: gradient KAM ishlatiladi. Bir sahifada faqat bitta gradient
 * tugma, sarlavhaning bir-ikki so'zi va nozik porlash. Hamma joyda
 * ishlatilsa u aksent bo'lishdan to'xtaydi va shovqinga aylanadi.
 *
 * Uch to'xtash nuqtasi: oltin sariq → amber → marjon. Quyosh chiqishi
 * mantiqi — «ilova ishga tushdi», eski terrakota rangimizning davomi.
 */
export const gradients = {
  /** Asosiy aksent: tugma, sarlavha so'zi, ingichka chiziq */
  accent: {
    from: "#F7E15E",
    via: "#FFA93B",
    to: "#FF6B4A",
    /** Gorizontalga yaqin — matn qatorida rang tekis taqsimlanadi */
    angle: "100deg",
  },
} as const;

/** CSS `linear-gradient(...)` matni — inline style kerak bo'lganda. */
export function accentGradientCss(angle = gradients.accent.angle): string {
  const { from, via, to } = gradients.accent;
  return `linear-gradient(${angle}, ${from} 0%, ${via} 52%, ${to} 100%)`;
}

export type GradientToken = keyof typeof gradients;
