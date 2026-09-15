/**
 * Expo SDK boshqaruvi — MVP spek 11.4.
 * Qoida: mijoz loyihasi bitta SDK'da QOTIRILADI. Avtomatik yangilanish mavjud
 * ilovani buzadi. Biz bir vaqtda ko'pi bilan ikki SDK'ni qo'llab-quvvatlaymiz.
 */

export interface SdkRelease {
  version: number;
  status: "supported" | "trial" | "deprecated";
  /** App Store'dagi Expo Go shu SDK'ni qo'llab-quvvatlaydimi */
  inExpoGo: boolean;
  notesUz: string;
}

export const SDK_REGISTRY: SdkRelease[] = [
  {
    version: 57,
    status: "supported",
    inExpoGo: true,
    notesUz: "Standart. SDK 56 dagi Hermes V1 xotira regressiyasi tuzatilgan.",
  },
  {
    version: 56,
    status: "supported",
    inExpoGo: true,
    notesUz: "@expo/ui stabil (native SwiftUI / Jetpack Compose). Hermes V1 xotira regressiyasi bor.",
  },
];

/** Yangi loyiha uchun standart SDK. */
export const DEFAULT_SDK = 57;

/** App Store'dagi Expo Go hozir qaysi SDK'da — buni operatsion tarzda yangilab turamiz. */
export const EXPO_GO_APP_STORE_SDK = 57;

export function isSupported(version: number): boolean {
  return SDK_REGISTRY.some((r) => r.version === version && r.status !== "deprecated");
}

/** Yangi SDK chiqqach 3 oylik sinov davri — spek 11.4. */
export const SDK_TRIAL_PERIOD_DAYS = 90;
