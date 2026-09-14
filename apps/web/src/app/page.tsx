import Link from "next/link";
import { NewProjectForm } from "@/components/new-project-form";
import { PricingTable } from "@/components/pricing-table";
import { API_URL } from "@/lib/api";

interface ProjectRow {
  id: string;
  name: string;
  status: string;
  domainPack: string | null;
  balance: { included: number; used: number; extraPurchased: number; extraUsed: number };
}

async function loadProjects(): Promise<ProjectRow[]> {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { projects: ProjectRow[] };
    return data.projects;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const projects = await loadProjects();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">AI mobil ilova builder</h1>
        <p className="text-[color:var(--color-muted)]">
          Boshqalar tez chiqarish uchun. Biz ishlab turishi uchun.
        </p>
      </header>

      <NewProjectForm />

      {projects.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Loyihalaringiz</h2>
          <ul className="divide-y divide-[color:var(--color-line)] rounded-xl border border-[color:var(--color-line)]">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[color:var(--color-surface)]"
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-[color:var(--color-muted)]">
                    {p.balance.included} tadan {p.balance.used} tasi ishlatildi
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <PricingTable />
    </main>
  );
}
