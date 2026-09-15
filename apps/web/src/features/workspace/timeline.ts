import type { AgentEvent } from "@amb/contracts";

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

/** Tool nomlari mijoz tiliga. */
function toolLabelUz(tool: string): string {
  const labels: Record<string, string> = {
    list_files: "Loyihani ko'ryapman",
    read_file: "Kodni o'qiyapman",
    search_files: "Kerakli joyni qidiryapman",
    edit_file: "Tahrirlayapman",
    create_file: "Yangi ekran yaratyapman",
    delete_file: "Keraksiz faylni olib tashlayapman",
    update_design_note: "Dizayn qaydini yangilayapman",
  };
  return labels[tool] ?? tool;
}

function verifyLabelUz(step: "typecheck" | "lint" | "bundle"): string {
  const labels: Record<string, string> = {
    typecheck: "Kodni tekshiryapman",
    lint: "Qoidalarga moslikni tekshiryapman",
    bundle: "Ilovani yig'yapman",
  };
  return labels[step] ?? step;
}
