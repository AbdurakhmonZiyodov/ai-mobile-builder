import { allSource, type Rule } from "../review.types.js";

const EXTERNAL_PAY = /payme|click\.uz|uzum|paynet|checkout\.stripe|openURL\(.*pay/i;
const IN_APP_PURCHASE = /react-native-purchases|expo-in-app-purchases|Purchases\./i;

/**
 * 3.1.1 — In-App Purchase.
 *
 * Eng qimmat xato, chunki u ilovani butunlay qayta qurishga majbur qiladi:
 *
 *   · Raqamli kontent (obuna, premium funksiya, kursga kirish, virtual
 *     tovar) — FAQAT In-App Purchase orqali. Tashqi to'lov havolasi
 *     aniq rad etish.
 *   · Jismoniy tovar va real dunyo xizmati (yetkazib berish, taksi,
 *     sartaroshxona broni) — tashqi to'lov RUXSAT ETILADI va bu yerda
 *     IAP'ning 30% komissiyasini to'lash shart emas.
 *
 * O'zbekiston bozori uchun bu hal qiluvchi: Payme, Click va Uzum faqat
 * ikkinchi toifada ishlatilishi mumkin.
 */
export const paymentClause: Rule = (input) => {
  const source = allSource(input);
  const hasExternal = EXTERNAL_PAY.test(source);
  const hasIap = IN_APP_PURCHASE.test(source);

  if (input.sells === "digital" && hasExternal && !hasIap) {
    return [
      {
        clause: "3.1.1",
        severity: "blocker",
        titleUz: "Raqamli mahsulot tashqi to'lov bilan sotilyapti",
        detailUz:
          "Kursga kirish, obuna va premium funksiya — raqamli kontent. Apple buni faqat In-App Purchase orqali sotishga ruxsat beradi. Payme yoki Click bilan qoldirilsa, ilova aniq rad etiladi.",
        files: [],
      },
    ];
  }

  if (input.sells === "physical_or_service" && hasIap && !hasExternal) {
    return [
      {
        clause: "3.1.1",
        severity: "info",
        titleUz: "In-App Purchase shart emas",
        detailUz:
          "Siz jismoniy tovar yoki real xizmat sotasiz. Apple bunda In-App Purchase'ni talab qilmaydi — Payme yoki Click ishlatib, 30% komissiyani to'lamasligingiz mumkin.",
        files: [],
      },
    ];
  }

  return [];
};
