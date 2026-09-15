import { allSource, type Rule } from "../review.types.js";

/**
 * Maxfiylik siyosati.
 *
 * App Store Connect havolani talab qiladi va u ISHLASHI kerak — ko'rikchi
 * uni ochib ko'radi. Buzilgan havola rad etish sababi.
 *
 * Nega «warning», «blocker» emas: havola ilova ichida bo'lmasligi ham
 * mumkin, u faqat App Store Connect'da to'ldirilsa yetarli. Lekin ilovada
 * ham bo'lgani yaxshi.
 */
export const privacyPolicy: Rule = (input) => {
  const source = allSource(input) + JSON.stringify(input.appConfig);
  if (/privacy|maxfiylik/i.test(source)) return [];

  return [
    {
      clause: "Privacy",
      severity: "warning",
      titleUz: "Maxfiylik siyosati havolasi topilmadi",
      detailUz:
        "App Store Connect maxfiylik siyosati havolasini talab qiladi va u ishlashi kerak. Ilova ichida ham havola bo'lgani yaxshi.",
      files: [],
    },
  ];
};
