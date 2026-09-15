import { allSource, getIn, type Finding, type Rule } from "../review.types.js";

/**
 * Ruxsat so'ralganda `Info.plist` da sabab yozilgan bo'lishi kerak.
 * Ro'yxat: [kalit, o'zbekcha nom, koddagi ishlatilish belgisi].
 */
const PERMISSIONS: Array<[key: string, labelUz: string, usedWhen: RegExp]> = [
  ["NSCameraUsageDescription", "kamera", /expo-camera|useCameraPermissions|launchCameraAsync/],
  ["NSPhotoLibraryUsageDescription", "galereya", /expo-image-picker|launchImageLibraryAsync/],
  ["NSLocationWhenInUseUsageDescription", "joylashuv", /expo-location|getCurrentPositionAsync/],
  ["NSMicrophoneUsageDescription", "mikrofon", /expo-av|Audio\.Recording|useMicrophonePermissions/],
];

/** Juda qisqa sabab «kerak» degan so'zdan iborat bo'ladi — Apple buni qaytaradi. */
const MIN_REASON_LENGTH = 15;

/**
 * 5.1.1 — Ruxsat so'rovlari sababsiz bo'lmasin.
 *
 * Nega tekshiriladi: AI ruxsat talab qiladigan paket qo'shadi, lekin
 * `app.json` ga sabab yozishni unutadi. Ilova ishga tushganda tizim
 * dialogi bo'sh sabab bilan chiqadi va Apple buni rad etadi.
 */
export const usageDescriptions: Rule = (input) => {
  const findings: Finding[] = [];
  const source = allSource(input);
  const infoPlist = getIn(input.appConfig, ["expo", "ios", "infoPlist"]) as
    | Record<string, unknown>
    | undefined;

  for (const [key, labelUz, usedWhen] of PERMISSIONS) {
    if (!usedWhen.test(source)) continue;

    const value = infoPlist?.[key];
    const reason = typeof value === "string" ? value.trim() : "";

    if (reason.length < MIN_REASON_LENGTH) {
      findings.push({
        clause: "5.1.1",
        severity: "blocker",
        titleUz: `${labelUz} ruxsati uchun sabab yozilmagan`,
        detailUz: `Ilova ${labelUz}dan foydalanadi, lekin app.json ichida ${key} yo'q yoki juda qisqa. Apple sababni foydalanuvchi tilida ko'rishni talab qiladi.`,
        files: ["app.json"],
      });
    }
  }

  return findings;
};
