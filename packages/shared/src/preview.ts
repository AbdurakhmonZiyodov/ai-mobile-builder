import { z } from "zod";

/**
 * Preview arxitekturasi — MVP spek 10-bo'lim.
 * Bitta yo'lga bog'lanib qolish Rork'ning asosiy muammosi bo'lgan: Expo Go
 * App Store'da qolib ketsa, mijoz ilovasini telefonida ko'ra olmaydi va biz
 * buni tuzata olmaymiz. Shuning uchun to'rt yo'l.
 */

export const previewPaths = ["web", "expo_go", "eas_go", "dev_client"] as const;
export type PreviewPath = (typeof previewPaths)[number];
export const previewPathSchema = z.enum(previewPaths);

export interface PreviewPathInfo {
  id: PreviewPath;
  labelUz: string;
  whenUz: string;
  /** Kim boshqaradi: biz, Expo/Apple */
  controlledByUz: string;
  limitUz: string;
  needsAppleAccount: boolean;
  /** Taxminiy tayyorlanish vaqti, soniya */
  etaSeconds: number;
}

export const PREVIEW_PATHS: Record<PreviewPath, PreviewPathInfo> = {
  web: {
    id: "web",
    labelUz: "Veb preview",
    whenUz: "Har doim birinchi, darhol",
    controlledByUz: "Biz",
    limitUz: "Native modullar ishlamaydi",
    needsAppleAccount: false,
    etaSeconds: 20,
  },
  expo_go: {
    id: "expo_go",
    labelUz: "Expo Go",
    whenUz: "Oddiy ilovalar, tez ko'rish",
    controlledByUz: "Expo va Apple",
    limitUz: "Faqat Expo SDK modullari; SDK versiyasi Expo Go'nikiga bog'liq",
    needsAppleAccount: false,
    etaSeconds: 30,
  },
  eas_go: {
    id: "eas_go",
    labelUz: "eas go (o'z Expo Go build'ingiz)",
    whenUz: "Expo Go ishlamasa yoki SDK mos kelmasa",
    controlledByUz: "Biz — mijozning TestFlight'ida",
    limitUz: "Apple Developer akkaunti kerak",
    needsAppleAccount: true,
    etaSeconds: 900,
  },
  dev_client: {
    id: "dev_client",
    labelUz: "Dev client",
    whenUz: "Uchinchi tomon native modul kerak bo'lganda",
    controlledByUz: "Biz",
    limitUz: "EAS build 5–15 daqiqa",
    needsAppleAccount: true,
    etaSeconds: 900,
  },
};

export interface PreviewDecisionInput {
  /** Tanlangan bloklarning eng yuqori preview talabi */
  requiresDevClient: boolean;
  /** Loyihaning Expo SDK versiyasi */
  projectSdk: number;
  /** App Store'dagi Expo Go qaysi SDK'ni qo'llab-quvvatlaydi */
  expoGoSdk: number;
  hasAppleAccount: boolean;
}

export interface PreviewDecision {
  path: PreviewPath;
  /** Mijozga BIR JUMLADA sabab — spek 10.4 */
  reasonUz: string;
  /** Darhol ochiladigan zaxira yo'l */
  fallback: PreviewPath;
}

/**
 * Qaror mantig'i — spek 10.4.
 * Har holatda mijozga nima uchun shunday ekani bir jumlada tushuntiriladi.
 */
export function decidePreviewPath(input: PreviewDecisionInput): PreviewDecision {
  if (input.requiresDevClient) {
    return {
      path: input.hasAppleAccount ? "dev_client" : "web",
      reasonUz: input.hasAppleAccount
        ? "Tanlagan bloklaringiz uchinchi tomon native modul ishlatadi, shuning uchun Expo Go emas, dev client yig'amiz (5–15 daqiqa)."
        : "Tanlagan bloklaringiz dev client talab qiladi — buning uchun Apple Developer akkaunti kerak. Hozircha veb preview'da ko'rsatamiz.",
      fallback: "web",
    };
  }

  if (input.projectSdk > input.expoGoSdk) {
    return {
      path: input.hasAppleAccount ? "eas_go" : "web",
      reasonUz: input.hasAppleAccount
        ? `App Store'dagi Expo Go hali SDK ${input.expoGoSdk} da, sizning ilovangiz SDK ${input.projectSdk} da. Shuning uchun sizning akkauntingizda o'z Expo Go build'ingizni yasaymiz.`
        : `App Store'dagi Expo Go hali SDK ${input.expoGoSdk} da, sizning ilovangiz SDK ${input.projectSdk} da. Telefonda ko'rish uchun Apple akkaunt kerak; hozircha veb preview.`,
      fallback: "web",
    };
  }

  return {
    path: "expo_go",
    reasonUz: "Ilovangiz faqat Expo SDK modullarini ishlatadi — telefoningizda Expo Go orqali darhol ochiladi.",
    fallback: "web",
  };
}
