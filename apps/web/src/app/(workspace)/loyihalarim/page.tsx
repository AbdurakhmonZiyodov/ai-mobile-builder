import Link from "next/link";
import type { ProjectSummary } from "@amb/contracts";
import { API_URL } from "@/shared/api";
import { PromptBox } from "@/features/project-create/prompt-box";
import { Badge, Card, SectionLabel } from "@/shared/ui";

export const metadata = { title: "Loyihalarim — RIVO" };

/**
 * Loyihalar ro'yxati.
 *
 * Nega prompt maydoni shu yerda ham: mijoz ikkinchi ilovasini boshlash
 * uchun landing'ga qaytishi shart emas. Bo'sh holatda esa u yagona
 * ko'rinadigan narsa bo'ladi.
 */
export default async function ProjectsPage() {
  const projects = await loadProjects();

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-12">
      <header className="flex items-center justify-between border-b-2 border-ink pb-5">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          RIVO
        </Link>
        <Link href="/narx" className="text-sm text-ink-muted hover:text-ink">
          Narx
        </Link>
      </header>

      <PromptBox />

      {projects === null ? (
        <Card className="p-5 text-sm text-ink-muted">
          Serverga ulanib bo&apos;lmadi. Backend ishlab turibdimi
          (<code className="font-mono text-xs">{API_URL}</code>)?
        </Card>
      ) : projects.length === 0 ? null : (
        <section className="space-y-4">
          <SectionLabel left="Loyihalarim" right={`${projects.length} ta`} />
          <div className="space-y-2.5">
            {projects.map((project) => (
              <Link key={project.id} href={`/loyiha/${project.id}`} className="block">
                <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-alt">
                  <div className="flex-1">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-ink-faint">
                      SDK {project.sdk}
                      {project.domainPack ? ` · ${project.domainPack}` : ""}
                    </p>
                  </div>

                  <Badge tone={statusTone(project.status)}>{statusLabelUz(project.status)}</Badge>

                  <span className="label-mono !text-[11px] whitespace-nowrap">
                    qoldiq {Math.max(0, project.balance.included - project.balance.used)} /{" "}
                    {project.balance.included}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/**
 * Backend o'chiq bo'lsa sahifa yiqilmasligi kerak.
 * `null` — «ulanib bo'lmadi», `[]` — «loyiha yo'q». Ikki xil holat,
 * ikki xil xabar.
 */
async function loadProjects(): Promise<ProjectSummary[] | null> {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { projects: ProjectSummary[] };
    return data.projects;
  } catch {
    return null;
  }
}

function statusLabelUz(status: string): string {
  const labels: Record<string, string> = {
    draft: "Qurilmoqda",
    building: "Yig'ilmoqda",
    ready: "Tayyor",
    failed: "Xato",
  };
  return labels[status] ?? status;
}

function statusTone(status: string): "neutral" | "success" | "warning" {
  if (status === "ready") return "success";
  if (status === "failed") return "warning";
  return "neutral";
}
