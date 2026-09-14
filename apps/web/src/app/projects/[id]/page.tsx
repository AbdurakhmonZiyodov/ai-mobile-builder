import { notFound } from "next/navigation";
import { ProjectWorkspace } from "@/components/project-workspace";
import { API_URL } from "@/lib/api";

interface Project {
  id: string;
  name: string;
  status: string;
  sdk: number;
  domainPack: string | null;
  blocks: string[];
  previewPath: string;
  previewUrl: string | null;
  balance: { included: number; used: number; extraPurchased: number; extraUsed: number };
}

interface PreviewDecision {
  path: string;
  reasonUz: string;
  fallback: string;
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [projectRes, previewRes] = await Promise.all([
    fetch(`${API_URL}/projects/${id}`, { cache: "no-store" }).catch(() => null),
    fetch(`${API_URL}/preview/${id}`, { cache: "no-store" }).catch(() => null),
  ]);

  if (!projectRes?.ok) notFound();

  const project = (await projectRes.json()) as Project;
  const preview = previewRes?.ok ? ((await previewRes.json()) as PreviewDecision) : null;

  return <ProjectWorkspace project={project} preview={preview} />;
}
