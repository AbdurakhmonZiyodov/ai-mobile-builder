import type { WorkspaceDriver } from "./types.js";

/**
 * MAP.md — har xabarda modelga yuboriladigan loyiha xaritasi (spek 8.2, ~1 000 token).
 * Butun repo hech qachon yuborilmaydi; model qayerga qarashni shu xaritadan biladi.
 */
export async function buildProjectMap(ws: WorkspaceDriver): Promise<string> {
  const entries = await ws.tree(400);
  const files = entries.filter((e) => e.type === "file" && isSource(e.path));

  const lines: string[] = ["# MAP.md", "", "Loyiha xaritasi. Avtomatik yaratiladi, qo'lda tahrirlanmaydi.", ""];

  const screens = files.filter((f) => f.path.startsWith("app/"));
  const components = files.filter((f) => f.path.startsWith("components/"));
  const lib = files.filter((f) => f.path.startsWith("lib/") || f.path.startsWith("hooks/"));

  if (screens.length) {
    lines.push("## Ekranlar (app/ — Expo Router)");
    for (const f of screens.slice(0, 60)) {
      lines.push(`- \`${f.path}\` -> ${routeOf(f.path)}`);
    }
    lines.push("");
  }
  if (components.length) {
    lines.push("## Komponentlar");
    for (const f of components.slice(0, 50)) lines.push(`- \`${f.path}\``);
    lines.push("");
  }
  if (lib.length) {
    lines.push("## Mantiq (lib/, hooks/)");
    for (const f of lib.slice(0, 50)) {
      const sym = await topSymbols(ws, f.path);
      lines.push(`- \`${f.path}\`${sym ? ` — ${sym}` : ""}`);
    }
    lines.push("");
  }

  const big = files.filter((f) => (f.size ?? 0) > 12_000);
  if (big.length) {
    lines.push("## Diqqat: katta fayllar (bo'lish kerak, 300 qatordan oshgan)");
    for (const f of big.slice(0, 10)) lines.push(`- \`${f.path}\` (${Math.round((f.size ?? 0) / 1024)} KB)`);
    lines.push("");
  }

  lines.push(`_Jami manba fayllar: ${files.length}_`);
  return lines.join("\n");
}

function isSource(p: string): boolean {
  return /\.(tsx?|jsx?|sql|json)$/.test(p) && !p.includes("node_modules");
}

/** `app/(app)/booking/[id].tsx` -> `/booking/:id` */
function routeOf(p: string): string {
  let r = p.replace(/^app/, "").replace(/\.(tsx|ts|jsx|js)$/, "");
  r = r.replace(/\/\([^)]+\)/g, "");
  r = r.replace(/\[([^\]]+)\]/g, ":$1");
  r = r.replace(/\/index$/, "") || "/";
  if (r.endsWith("_layout")) return `${r.replace(/_layout$/, "")} (layout)`;
  return r || "/";
}

async function topSymbols(ws: WorkspaceDriver, path: string): Promise<string> {
  let content: string;
  try {
    content = await ws.read(path);
  } catch {
    return "";
  }
  const names = [...content.matchAll(/export\s+(?:async\s+)?(?:function|const|class|type|interface)\s+(\w+)/g)]
    .map((m) => m[1])
    .filter((n): n is string => Boolean(n))
    .slice(0, 6);
  return names.join(", ");
}
