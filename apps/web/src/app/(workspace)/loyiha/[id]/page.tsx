import { notFound } from "next/navigation";
import type { ProjectSummary } from "@amb/contracts";
import { API_URL } from "@/shared/api";
import type { RailProject } from "@/features/workspace/components/projects-rail";
import { WorkspaceView } from "@/features/workspace/workspace-view";
import type { TimelineEntry } from "@/features/workspace/timeline";
import { toTimelineHistory } from "@/features/workspace/timeline";

interface StoredMessage {
  id: string;
  role: string;
  content: string;
}

/**
 * Loyiha workspace'i.
 *
 * Ma'lumot serverda olinadi: mijoz sahifani ochganda ilovasi, suhbati va
 * qoldig'i darhol ko'rinadi — «yuklanmoqda» holati bo'lmaydi.
 */
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, previewReasonUz, history, versionCount, projects] = await Promise.all([
    loadProject(id),
    loadPreviewReason(id),
    loadHistory(id),
    loadVersionCount(id),
    loadProjects(),
  ]);

  if (!project) notFound();

  return (
    <WorkspaceView
      project={project}
      previewReasonUz={previewReasonUz}
      initialEntries={history}
      // Versiya yo'q — ilova hali qurilmagan, workspace o'zi boshlaydi.
      needsFirstBuild={versionCount === 0}
      projects={projects}
    />
  );
}

/**
 * Yon ustundagi loyihalar ro'yxati.
 *
 * Nega u ham shu sahifada olinadi: mijoz ilovalar o'rtasida o'tib turadi
 * va har safar ro'yxat sahifasiga qaytish ishni uzib qo'yadi. Ro'yxat
 * serverda olingani uchun ustun darhol to'la ko'rinadi — «yuklanmoqda»
 * holati yo'q.
 *
 * Xato bo'lsa bo'sh ro'yxat qaytadi: yon ustun ikkinchi darajali, uning
 * ishlamasligi mijozning ASOSIY ishini — ilovasini ko'rishni — to'xtatib
 * qo'ymasligi kerak.
 */
async function loadProjects(): Promise<RailProject[]> {
  const data = await fetchJson<{ projects: ProjectSummary[] }>("/projects");
  return (data?.projects ?? []).map((p) => ({ id: p.id, name: p.name, status: p.status }));
}

async function loadProject(id: string): Promise<ProjectSummary | null> {
  return fetchJson<ProjectSummary>(`/projects/${id}`);
}

/**
 * Saqlangan suhbat.
 *
 * Mijozning birinchi jumlasi loyiha yaratilganda yoziladi — u shu yerdan
 * ekranga chiqadi va mijoz nima so'raganini ko'rib turadi.
 */
async function loadHistory(id: string): Promise<TimelineEntry[]> {
  const data = await fetchJson<{ messages: StoredMessage[] }>(`/projects/${id}/messages`);
  return data ? toTimelineHistory(data.messages) : [];
}

/** Versiyalar soni — ilova qurilganmi yoki yo'qligini shundan bilamiz. */
async function loadVersionCount(id: string): Promise<number> {
  const data = await fetchJson<{ versions: unknown[] }>(`/projects/${id}/versions`);
  return data?.versions.length ?? 0;
}

/**
 * Preview yo'li va uning SABABI.
 *
 * Mijoz «nega telefonimda ochilmayapti?» deb so'ramasligi kerak — javob
 * ekranda, oldindan turadi.
 */
async function loadPreviewReason(id: string): Promise<string> {
  const data = await fetchJson<{ reasonUz: string }>(`/preview/${id}`);
  return data?.reasonUz ?? "Preview holati aniqlanmadi.";
}

/** Backend o'chiq bo'lsa sahifa yiqilmasligi kerak. */
async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}
