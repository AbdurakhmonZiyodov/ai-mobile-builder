import type { VerifyStep } from "./events.js";

/**
 * Texnik atamalarni mijoz tiliga o'girish.
 *
 * Nega shartnomalar paketida: bu matnlar SSE hodisasining `step` va
 * `tool` maydonlariga bog'liq. Ular backend'da ham (log va hisobot),
 * frontend'da ham (suhbat oqimi) kerak bo'ladi.
 *
 * Avval ikkala tomonda alohida nusxa bor edi — backend'dagisi
 * ishlatilmasdi, frontend esa o'zinikini yozgandi. Yangi qadam
 * qo'shilganda bittasi albatta unutilardi.
 */

const VERIFY_LABELS: Record<VerifyStep, string> = {
  typecheck: "Kodni tekshiryapman",
  lint: "Qoidalarga moslikni tekshiryapman",
  bundle: "Ilovani yig'yapman",
};

export function verifyLabelUz(step: VerifyStep): string {
  return VERIFY_LABELS[step];
}

/**
 * Agent tool nomlari.
 *
 * Mijoz «edit_file» degan so'zni hech qachon ko'rmaydi — u builder emas,
 * biznes egasi.
 */
const TOOL_LABELS: Record<string, string> = {
  list_files: "Loyihani ko'ryapman",
  read_file: "Kodni o'qiyapman",
  search_files: "Kerakli joyni qidiryapman",
  edit_file: "Tahrirlayapman",
  create_file: "Yangi ekran yaratyapman",
  delete_file: "Keraksiz faylni olib tashlayapman",
  update_design_note: "Dizayn qaydini yangilayapman",
};

/** Noma'lum tool nomi o'z holicha qaytadi — yo'qolib qolgandan yaxshiroq. */
export function toolLabelUz(tool: string): string {
  return TOOL_LABELS[tool] ?? tool;
}

/**
 * Ish bosqichlari — mijoz jarayonni bosqich sifatida ko'radi.
 *
 * NEGA KERAK. Oqimda «Kodni o'qiyapman…» ketma-ket besh marta, «Loyihani
 * ko'ryapman…» to'rt marta chiqadi. Har biri to'g'ri, lekin ular birgalikda
 * bir xil ko'rinadigan devor hosil qiladi: mijoz na qaysi bosqichda
 * ekanini, na ish tugaganini biladi. Bosqich — o'nlab mayda qadamni
 * mijoz kuzata oladigan beshta katta qadamga yig'adi.
 *
 * NEGA BU YERDA, veb ichida emas: bosqich `tool` nomidan chiqariladi va
 * `TOOL_LABELS` bilan YONMA-YON turishi kerak. Yangi tool qo'shilganda
 * uning yorlig'i va bosqichi bir vaqtda ko'rinadi — ikki faylga bo'linsa,
 * ikkinchisi albatta unutiladi va yangi tool bosqichsiz qoladi.
 */
export const runPhases = [
  "understanding",
  "planning",
  "exploring",
  "writing",
  "verifying",
  "done",
  "failed",
] as const;
export type RunPhase = (typeof runPhases)[number];

/**
 * Tool qaysi bosqichga tegishli.
 *
 * O'qish va qidirish — «o'rganish», fayl o'zgartirish — «yozish». Bu farq
 * mijoz uchun muhim: birinchisida hali hech narsa o'zgarmagan, ikkinchisida
 * uning ilovasi tegib bo'lingan.
 */
const TOOL_PHASES: Record<string, RunPhase> = {
  list_files: "exploring",
  read_file: "exploring",
  search_files: "exploring",
  edit_file: "writing",
  create_file: "writing",
  delete_file: "writing",
  update_design_note: "writing",
};

/** Noma'lum tool «o'rganish» deb hisoblanadi — u hech narsani buzmaydi. */
export function toolPhase(tool: string): RunPhase {
  return TOOL_PHASES[tool] ?? "exploring";
}
