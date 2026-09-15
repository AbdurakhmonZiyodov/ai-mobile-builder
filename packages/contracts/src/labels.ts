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
