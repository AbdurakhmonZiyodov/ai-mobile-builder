import path from "node:path";

/**
 * `.env` da bo'sh qoldirilgan qator (`AMB_WORKSPACE_ROOT=`) sozlanmagan deb qaraladi.
 * `??` bo'sh satrni o'tkazib yuboradi va standart qiymat ishlamay qoladi.
 */
function read(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

const repoRoot = path.resolve(process.cwd(), "../..");

export const env = {
  port: Number(read("PORT", "4000")),
  databaseUrl: read("DATABASE_URL", "postgres://localhost:5432/amb"),
  /** Har loyiha shu papka ichida izolyatsiyalangan katalog oladi. */
  workspaceRoot: read("AMB_WORKSPACE_ROOT", path.join(repoRoot, "workspaces")),
  templateDir: read("AMB_TEMPLATE_DIR", path.join(repoRoot, "templates/expo-base")),
  webOrigin: read("AMB_WEB_ORIGIN", "http://localhost:3000"),
  /** MVP: bitta demo foydalanuvchi. Auth 15-haftada. */
  demoUserId: "usr_demo",
  demoUserEmail: "demo@amb.local",
} as const;
