import { toolLabelUz, verifyLabelUz, type AgentEvent } from "@amb/contracts";

export type TimelineKind = "user" | "agent" | "step" | "file" | "verify" | "charge" | "error";

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

    default:
      // run.started, run.finished, text, plan, tool.finished — ko'rsatilmaydi
      return null;
  }
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
