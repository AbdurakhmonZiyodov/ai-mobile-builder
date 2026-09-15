import { notFound } from "next/navigation";
import type { ProjectSummary } from "@amb/contracts";
import { API_URL } from "@/shared/api";
import { WorkspaceView } from "@/features/workspace/workspace-view";

/**
 * Loyiha workspace'i.
 *
 * Ma'lumot serverda olinadi: mijoz sahifani ochganda ilovasi va qoldig'i
 * darhol ko'rinadi, «yuklanmoqda» holati bo'lmaydi.
 */
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, preview] = await Promise.all([loadProject(id), loadPreviewReason(id)]);
  if (!project) notFound();

  return <WorkspaceView project={project} previewReasonUz={preview} />;
}

async function loadProject(id: string): Promise<ProjectSummary | null> {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ProjectSummary;
  } catch {
    return null;
  }
}

/**
 * Preview yo'li va uning SABABI.
 *
 * Mijoz «nega telefonimda ochilmayapti?» deb so'ramasligi kerak — javob
 * ekranda, oldindan turadi.
 */
async function loadPreviewReason(id: string): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/preview/${id}`, { cache: "no-store" });
    if (!res.ok) return "Preview holati aniqlanmadi.";
    const data = (await res.json()) as { reasonUz: string };
    return data.reasonUz;
  } catch {
    return "Preview holati aniqlanmadi.";
  }
}
