import { toolLabelUz, toolPhase, verifyLabelUz, type AgentEvent, type RunPhase } from "@amb/contracts";

export type TimelineKind =
  | "user"
  | "agent"
  | "step"
  | "file"
  | "verify"
  | "charge"
  | "error"
  | "done";

export interface TimelineEntry {
  id: string;
  kind: TimelineKind;
  text: string;
}

/**
 * Agent hodisasini mijoz o'qiydigan qatorga aylantiradi.
 *
 * Bu qatlam ataylab alohida: BARCHA texnik atamalar shu yerda o'zbek
 * tiliga tarjima qilinadi. Mijoz «edit_file» yoki «typecheck» degan
 * so'zni hech qachon ko'rmaydi — u builder emas, biznes egasi.
 *
 * `text` va `charge` hodisalari bu yerda emas, hook ichida maxsus
 * ishlanadi (matn birlashtiriladi, balans yangilanadi).
 */
export function toTimelineEntry(event: AgentEvent): TimelineEntry | null {
  const id = crypto.randomUUID();

  switch (event.type) {
    case "run.classified":
      return { id, kind: "step", text: event.summaryUz };

    case "clarify":
      return { id, kind: "agent", text: event.questionUz };

    case "tool.started":
      return { id, kind: "step", text: `${toolLabelUz(event.tool)}…` };

    case "file.changed":
      return {
        id,
        kind: "file",
        text: `${event.path} (+${event.added} / −${event.removed})`,
      };

    case "verify.started":
      return { id, kind: "verify", text: `${verifyLabelUz(event.step)}…` };

    case "verify.finished":
      return {
        id,
        kind: event.ok ? "verify" : "error",
        text: verifyResultUz(event.step, event.ok, event.skipped, event.errors),
      };

    case "repair.attempt":
      return {
        id,
        kind: "step",
        text: `Xatoni tuzatyapman (${event.attempt}/${event.max}) — bu bepul`,
      };

    case "repair.gaveUp":
      return { id, kind: "error", text: event.messageUz };

    case "charge":
      return { id, kind: "charge", text: `${event.balanceLabelUz} · ${event.reasonUz}` };

    case "preview.ready":
      return { id, kind: "step", text: event.reasonUz };

    case "error":
      return { id, kind: "error", text: event.messageUz };

    /**
     * Ish tugadi — mijoz uchun eng muhim qator.
     *
     * Ilgari bu hodisa JIMGINA yutilardi: oqim shunchaki to'xtardi va
     * mijoz ekranga qarab «tugadimi yoki qotib qoldimi?» deb o'tirardi.
     * Endi tugash ochiq aytiladi va qancha vaqt ketgani yoziladi —
     * kutish uzoq tuyulmasligi uchun.
     */
    case "run.finished":
      return {
        id,
        kind: event.ok ? "done" : "error",
        text: event.ok
          ? `Tayyor — ${formatDurationUz(event.durationMs)}da bajarildi.`
          : "Ish tugallanmadi.",
      };

    default:
      // run.started, text, plan, tool.finished — ko'rsatilmaydi
      return null;
  }
}

/**
 * Hodisadan ish bosqichini aniqlaydi.
 *
 * `null` — bu hodisa bosqichni o'zgartirmaydi (masalan matn bo'lagi yoki
 * hisob). Bosqich faqat HAQIQATAN yangi bosqich boshlanganda almashadi,
 * aks holda ko'rsatkich oldinga-orqaga sakrab, mijozni chalg'itardi.
 */
export function phaseFor(event: AgentEvent): RunPhase | null {
  switch (event.type) {
    case "run.classified":
    case "clarify":
      return "understanding";

    case "plan":
      return "planning";

    case "tool.started":
      return toolPhase(event.tool);

    case "file.changed":
      return "writing";

    case "verify.started":
    case "verify.finished":
    case "repair.attempt":
      return "verifying";

    case "repair.gaveUp":
    case "error":
      return "failed";

    case "run.finished":
      return event.ok ? "done" : "failed";

    default:
      return null;
  }
}

/**
 * Hozirgi harakatning mijoz o'qiydigan nomi.
 *
 * Bu `toTimelineEntry` dan alohida, chunki tirik qator (`ActivityLine`)
 * tarixga yozilmaydi — u faqat AYNI PAYTDAGI holatni ko'rsatadi va
 * keyingi harakat kelganda o'rniga almashadi.
 */
export function activityLabelUz(event: AgentEvent): string | null {
  if (event.type === "tool.started") return toolLabelUz(event.tool);
  if (event.type === "verify.started") return verifyLabelUz(event.step);
  if (event.type === "repair.attempt") return "Xatoni tuzatyapman";
  return null;
}

/** «45 soniya», «2 daqiqa 5 soniya» — mijoz millisekundni o'qimaydi. */
function formatDurationUz(ms: number): string {
  const total = Math.max(1, Math.round(ms / 1000));
  const min = Math.floor(total / 60);
  const sec = total % 60;

  if (min === 0) return `${sec} soniya`;
  if (sec === 0) return `${min} daqiqa`;
  return `${min} daqiqa ${sec} soniya`;
}

function verifyResultUz(
  step: "typecheck" | "lint" | "bundle",
  ok: boolean,
  skipped: boolean,
  errors: string[],
): string {
  const label = verifyLabelUz(step);

  // O'tkazib yuborilgan qadamni «o'tdi» deb ko'rsatish yolg'on bo'lardi.
  if (skipped) return `${label}: bu o'zgarish uchun kerak emas edi`;
  if (ok) return `${label}: o'tdi`;
  return `${label}: o'tmadi\n${errors.slice(0, 3).join("\n")}`;
}

/**
 * Saqlangan suhbatni ekran qatorlariga aylantiradi.
 *
 * Nega kerak: mijoz sahifani yopib qaytsa yoki loyihani qayta ochsa,
 * o'zi yozgan gaplar ko'rinishi kerak. Avval ular yo'qolardi —
 * mijoz g'oyasini yozgan, ekranda esa bo'sh suhbat turardi.
 */
export function toTimelineHistory(
  messages: Array<{ id: string; role: string; content: string }>,
): TimelineEntry[] {
  return messages.map((m) => ({
    id: m.id,
    kind: m.role === "user" ? "user" : "agent",
    text: m.content,
  }));
}
