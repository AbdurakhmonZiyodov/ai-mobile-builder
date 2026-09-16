import Link from "next/link";
import type { ReactElement } from "react";

/** Rail uchun kerak bo'lgan minimal ma'lumot — to'liq `ProjectSummary` emas. */
export interface RailProject {
  id: string;
  name: string;
  status: string;
}

export interface ProjectsRailProps {
  projects: RailProject[];
  activeId: string;
}

/** Holat so'zi — `loyihalarim` sahifasidagidek: bir xil holat ikki
 *  ekranda ikki xil atalsa, mijoz ularni boshqa narsa deb o'ylaydi. */
const STATUS_LABEL_UZ: Record<string, string> = {
  draft: "Qurilmoqda",
  building: "Yig'ilmoqda",
  ready: "Tayyor",
  failed: "Xato",
};

/** Holat rangi. Rang yolg'iz qolmaydi — rail ochilganda yonida so'z turadi. */
const STATUS_DOT: Record<string, string> = {
  draft: "bg-ink-faint",
  building: "bg-accent",
  ready: "bg-success",
  failed: "bg-danger",
};

/**
 * Loyihalar ustuni — workspace'ning chap chekkasida doim turadi.
 *
 * Nega kerak: ilgari boshqa loyihaga o'tish uchun `/loyihalarim` ga
 * qaytish kerak edi. Mijoz bir nechta ilovani parallel olib boradi.
 *
 * Nega ingichka (56px) va faqat harf: kenglik markazdagi telefon
 * maketidan olinadi. To'liq nom kerak bo'lganda ustun hover'da kengayib
 * ilova USTIGA suriladi — shunda tartib siljimaydi, telefon joyida
 * qoladi. Yon tomonda suzuvchi yorliq ishlamaydi: ro'yxat scroll
 * bo'lishi kerak, `overflow-y: auto` esa gorizontal chiqqan hamma
 * narsani qirqadi — yorliq ko'rinmay qolardi.
 *
 * Nega 1024px dan tor ekranda yo'q: u yerda ustunlar allaqachon ustma-ust
 * tushgan. Logotip o'sha ekranlarda yuqori panelga qaytadi.
 */
export function ProjectsRail({ projects, activeId }: ProjectsRailProps): ReactElement {
  return (
    <nav aria-label="Loyihalarim" className="relative hidden w-14 shrink-0 self-stretch lg:block">
      <div className="absolute inset-y-0 left-0 z-30 flex w-14 flex-col gap-2 overflow-hidden border-r border-line bg-surface p-2 transition-[width] duration-150 focus-within:w-56 hover:w-56">
        <Link href="/loyihalarim" aria-label="Barcha loyihalar" className="group/item flex items-center gap-3">
          <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center">
            <span className="h-3 w-3 rounded-full bg-linear-to-br from-accent-from to-accent-to" />
          </span>
          <span aria-hidden className="w-32 shrink-0 font-semibold tracking-tight">
            RIVO
          </span>
        </Link>

        <span aria-hidden className="h-px shrink-0 bg-line" />

        {/* Uzun ro'yxat kesilmaydi — scroll. `-mx-2 px-2`: konteyner panel
            chetigacha cho'zilmasa aktiv halqani qirqadi. Scrollbar ingichka —
            56px ustunda tizimnikisi doirani siqib qo'yadi. */}
        <ul className="-mx-2 flex flex-1 flex-col gap-1.5 overflow-x-hidden overflow-y-auto px-2 [scrollbar-width:thin]">
          {projects.map((project) => (
            <li key={project.id}>
              <RailItem project={project} active={project.id === activeId} />
            </li>
          ))}
        </ul>

        <span aria-hidden className="h-px shrink-0 bg-line" />

        {/* Yangi ilova prompt maydonidan boshlanadi — u `/loyihalarim` da. */}
        <Link href="/loyihalarim" aria-label="Yangi ilova" className="group/item flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-line text-lg leading-none text-ink-faint transition-colors group-hover/item:border-line-strong group-hover/item:text-ink"
          >
            +
          </span>
          <span
            aria-hidden
            className="w-32 shrink-0 text-sm text-ink-muted transition-colors group-hover/item:text-ink"
          >
            Yangi ilova
          </span>
        </Link>
      </div>
    </nav>
  );
}

/**
 * Bitta loyiha qatori. Nom va holat `aria-label` da to'liq turadi: yopiq
 * ustunda ular ko'rinmaydi, havolaning ma'nosi esa yo'qolmasligi kerak.
 */
function RailItem({ project, active }: { project: RailProject; active: boolean }): ReactElement {
  const statusUz = STATUS_LABEL_UZ[project.status] ?? project.status;

  return (
    <Link
      href={`/loyiha/${project.id}`}
      aria-current={active ? "page" : undefined}
      aria-label={`${project.name} — ${statusUz}`}
      className="group/item flex items-center gap-3"
    >
      <span
        aria-hidden
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
          active
            ? "border-accent bg-accent-surface text-accent-soft ring-2 ring-accent/30"
            : "border-line bg-surface-alt text-ink-muted group-hover/item:border-line-strong group-hover/item:text-ink"
        }`}
      >
        {initials(project.name)}
        <span
          className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface ${
            STATUS_DOT[project.status] ?? "bg-ink-faint"
          }`}
        />
      </span>

      <span aria-hidden className="w-32 shrink-0">
        <span
          className={`block truncate text-sm transition-colors ${
            active ? "text-ink" : "text-ink-muted group-hover/item:text-ink"
          }`}
        >
          {project.name}
        </span>
        <span className="block truncate text-xs text-ink-faint">{statusUz}</span>
      </span>
    </Link>
  );
}

/** Ikki so'zli nomda ikkala bosh harf («Qahva Klub» → «QK»): bitta harf
 *  bilan ro'yxatdagi ikki loyiha bir xil ko'rinib qoladi. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return (words[0].slice(0, 1) + words[1].slice(0, 1)).toUpperCase();
}
