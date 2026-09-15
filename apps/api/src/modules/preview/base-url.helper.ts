import type { WorkspaceDriver } from "../../infrastructure/workspace/drivers/driver.interface.js";

/**
 * Veb eksporti uchun `experiments.baseUrl` ni VAQTINCHA qo'yadi.
 *
 * Muammo: Expo statik eksportda skript va uslub yo'llarini ILDIZGA
 * nisbatan yozadi — `/_expo/static/js/web/entry-*.js`. Biz esa preview'ni
 * `/preview/<id>/static/` ostida beramiz. Natijada brauzer bundle'ni
 * `/_expo/...` dan so'raydi, 404 oladi va sahifa server tomonda
 * chizilgan holida qotib qoladi. Konsolda xato ko'rinmaydi, verify gate
 * ham o'tadi — ya'ni nosozlik faqat mijozning ekranida chiqadi.
 *
 * Nega doimiy yozib qo'yilmaydi: `baseUrl` mijozning o'z veb deploy'ini
 * buzadi. U bizning server tuzilishimizga tegishli, mijoz ilovasiga emas.
 *
 * Shuning uchun eksport atrofida qo'yiladi va DOIM qaytariladi.
 */
export async function withPreviewBaseUrl<T>(
  ws: WorkspaceDriver,
  baseUrl: string,
  run: () => Promise<T>,
): Promise<T> {
  const original = await ws.read("app.json");

  try {
    await ws.write("app.json", applyBaseUrl(original, baseUrl));
    return await run();
  } finally {
    // `finally` MAJBURIY: eksport yiqilsa ham mijozning konfiguratsiyasi
    // o'zgargan holda qolmasligi kerak.
    await ws.write("app.json", original);
  }
}

function applyBaseUrl(source: string, baseUrl: string): string {
  const config = JSON.parse(source) as {
    expo?: { experiments?: Record<string, unknown> };
  };

  config.expo ??= {};
  config.expo.experiments = { ...config.expo.experiments, baseUrl };

  return `${JSON.stringify(config, null, 2)}\n`;
}
