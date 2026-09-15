import Link from "next/link";
import type { ProjectSummary } from "@amb/contracts";
import { api, API_URL } from "@/shared/api";
import { PromptBox } from "@/features/project-create/prompt-box";
import { Badge, Card, SectionLabel, SiteHeader } from "@/shared/ui";

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
    <main className="mx-auto max-w-4xl space-y-12 px-6 pb-24">
      <SiteHeader
        links={[
          { href: "/narx", label: "Narx" },
          { href: "/loyihalarim", label: "Loyihalarim" },
        ]}
      />

      <section className="space-y-6 pt-6">
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">Yangi ilova</h1>
        <PromptBox />
      </section>

      {projects === null ? (
        <Card className="p-5 text-sm text-ink-muted">
          Serverga ulanib bo&apos;lmadi. Backend ishlab turibdimi (
          <code className="font-mono text-xs text-ink-faint">{API_URL}</code>)?
        </Card>
      ) : projects.length === 0 ? null : (
        <section className="space-y-5">
          <SectionLabel left="Loyihalarim" right={`${projects.length} ta`} />

          <div className="space-y-2.5">
            {projects.map((project) => (
              <Link key={project.id} href={`/loyiha/${project.id}`} className="block">
                <Card className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-surface-alt hover:border-line-strong">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{project.name}</p>
                    <p className="mt-1 text-sm text-ink-faint">
                      SDK {project.sdk}
                      {project.domainPack ? ` · ${project.domainPack}` : ""}
                    </p>
                  </div>

                  <Badge tone={statusTone(project.status)}>{statusLabelUz(project.status)}</Badge>

                  <span className="label-mono whitespace-nowrap">
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
    const { projects } = await api.projects.list();
    return projects;
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

/** Holat rangi. Matn har doim yonida turadi — faqat rangga tayanilmaydi. */
function statusTone(status: string): "neutral" | "success" | "warning" | "danger" {
  if (status === "ready") return "success";
  if (status === "failed") return "danger";
  if (status === "building") return "warning";
  return "neutral";
}
