import { notFound } from "next/navigation";
import type { ProjectSummary } from "@amb/contracts";
import { api } from "@/shared/api";
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
    return await api.projects.get(id);
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
    const decision = await api.preview.decide({ projectId: id });
    return decision.reasonUz;
  } catch {
    return "Preview holati aniqlanmadi.";
  }
}
