import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import type { EditResult, ExecResult, FileEntry, WorkspaceDriver } from "./types.js";

const IGNORED = new Set([
  "node_modules",
  ".git",
  ".expo",
  "dist",
  "build",
  ".turbo",
  "ios",
  "android",
  ".amb-web",
  ".amb-bundle",
  ".amb-cache",
]);

/** Ilova hajmi nazorati: loyiha ~200 fayldan oshmasin (spek 17.2). */
const MAX_PROJECT_FILES = 400;

export class LocalWorkspace implements WorkspaceDriver {
  readonly root: string;

  constructor(root: string) {
    this.root = path.resolve(root);
  }

  /**
   * Har bir yo'l workspace ichida qolishini kafolatlaydi.
   * Agent generatsiya qilgan yo'lga hech qachon ishonmaymiz.
   */
  private resolve(rel: string): string {
    const clean = rel.replace(/^[/\\]+/, "");
    const abs = path.resolve(this.root, clean);
    const rootWithSep = this.root.endsWith(path.sep) ? this.root : this.root + path.sep;
    if (abs !== this.root && !abs.startsWith(rootWithSep)) {
      throw new Error(`Yo'l workspace tashqarisida: ${rel}`);
    }
    return abs;
  }

  async exists(): Promise<boolean> {
    try {
      const st = await fs.stat(this.root);
      return st.isDirectory();
    } catch {
      return false;
    }
  }

  async create(templateDir: string): Promise<void> {
    await fs.mkdir(this.root, { recursive: true });
    await fs.cp(templateDir, this.root, {
      recursive: true,
      filter: (src) => !src.split(path.sep).some((seg) => IGNORED.has(seg)),
    });
    await this.linkDependencies(templateDir);
    await this.exec("git", ["init", "-q"]);
    await this.exec("git", ["config", "user.email", "agent@amb.local"]);
    await this.exec("git", ["config", "user.name", "AMB Agent"]);
    await this.commit("Boshlang'ich shablon");
  }

  /**
   * "Isitilgan hovuz" — spek 16.1 (sovuq start 3 daqiqadan oshsa mijozning yarmi ketadi).
   *
   * Shablonning `node_modules` iga symlink qo'yamiz: 0 ms, nusxa ko'chirish esa
   * APFS clone bilan ham ~10 s (o'lchandi). Bu MVP yechimi.
   *
   * Cheklovi: bog'liqliklar SHABLON bilan umumiy. Workspace ichida yangi paket
   * o'rnatishdan OLDIN `isolateDependencies()` chaqirilishi shart, aks holda
   * o'rnatish shablonni o'zgartiradi va boshqa loyihalarga ta'sir qiladi.
   * Ishlab chiqarishda buning o'rnini Docker obrazi qatlami egallaydi.
   */
  private async linkDependencies(templateDir: string): Promise<void> {
    const source = path.join(templateDir, "node_modules");
    try {
      await fs.stat(source);
    } catch {
      return; // shablonda bog'liqliklar o'rnatilmagan — verify gate buni aytadi
    }
    const target = path.join(this.root, "node_modules");
    await fs.rm(target, { recursive: true, force: true });
    await fs.symlink(source, target, "dir");
  }

  /** Symlink'ni haqiqiy nusxaga aylantiradi. Yangi paket o'rnatishdan oldin majburiy. */
  async isolateDependencies(): Promise<void> {
    const target = path.join(this.root, "node_modules");
    let link: string;
    try {
      link = await fs.readlink(target);
    } catch {
      return; // allaqachon mustaqil
    }
    await fs.rm(target, { force: true });
    await fs.cp(link, target, { recursive: true, verbatimSymlinks: true });
  }

  async destroy(): Promise<void> {
    await fs.rm(this.root, { recursive: true, force: true });
  }

  async list(dir = "."): Promise<FileEntry[]> {
    const abs = this.resolve(dir);
    const items = await fs.readdir(abs, { withFileTypes: true });
    const out: FileEntry[] = [];
    for (const it of items) {
      if (IGNORED.has(it.name)) continue;
      const rel = path.relative(this.root, path.join(abs, it.name));
      if (it.isDirectory()) {
        out.push({ path: rel, type: "dir" });
      } else {
        const st = await fs.stat(path.join(abs, it.name));
        out.push({ path: rel, type: "file", size: st.size });
      }
    }
    return out.sort((a, b) =>
      a.type === b.type ? a.path.localeCompare(b.path) : a.type === "dir" ? -1 : 1,
    );
  }

  async tree(maxEntries = MAX_PROJECT_FILES): Promise<FileEntry[]> {
    const out: FileEntry[] = [];
    const walk = async (dir: string): Promise<void> => {
      if (out.length >= maxEntries) return;
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const it of items) {
        if (out.length >= maxEntries) return;
        if (IGNORED.has(it.name)) continue;
        const abs = path.join(dir, it.name);
        const rel = path.relative(this.root, abs);
        if (it.isDirectory()) {
          out.push({ path: rel, type: "dir" });
          await walk(abs);
        } else {
          const st = await fs.stat(abs);
          out.push({ path: rel, type: "file", size: st.size });
        }
      }
    };
    await walk(this.root);
    return out;
  }

  async read(rel: string): Promise<string> {
    return fs.readFile(this.resolve(rel), "utf8");
  }

  async write(rel: string, content: string): Promise<EditResult> {
    const abs = this.resolve(rel);
    let before = "";
    let action: EditResult["action"] = "create";
    try {
      before = await fs.readFile(abs, "utf8");
      action = "edit";
    } catch {
      action = "create";
    }
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content, "utf8");
    const { added, removed } = countDiff(before, content);
    return { path: rel, added, removed, action };
  }

  async edit(rel: string, oldText: string, newText: string): Promise<EditResult> {
    const abs = this.resolve(rel);
    const before = await fs.readFile(abs, "utf8");

    const occurrences = before.split(oldText).length - 1;
    if (occurrences === 0) {
      throw new Error(
        `"${rel}" ichida qidirilgan matn topilmadi. Avval read_file bilan aniq nusxasini oling.`,
      );
    }
    if (occurrences > 1) {
      throw new Error(
        `"${rel}" ichida bu matn ${occurrences} marta uchraydi. Ko'proq kontekst qo'shib, yagona qiling.`,
      );
    }

    const after = before.replace(oldText, newText);
    await fs.writeFile(abs, after, "utf8");
    const { added, removed } = countDiff(before, after);
    return { path: rel, added, removed, action: "edit" };
  }

  async remove(rel: string): Promise<EditResult> {
    const abs = this.resolve(rel);
    const before = await fs.readFile(abs, "utf8").catch(() => "");
    await fs.rm(abs, { force: true });
    return { path: rel, added: 0, removed: before.split("\n").length, action: "delete" };
  }

  async search(
    query: string,
    opts: { glob?: string; max?: number } = {},
  ): Promise<Array<{ path: string; line: number; text: string }>> {
    const max = opts.max ?? 40;
    const files = (await this.tree()).filter((f) => f.type === "file");
    const needle = query.toLowerCase();
    const hits: Array<{ path: string; line: number; text: string }> = [];

    for (const f of files) {
      if (hits.length >= max) break;
      if (opts.glob && !matchGlob(f.path, opts.glob)) continue;
      if ((f.size ?? 0) > 400_000) continue;
      let content: string;
      try {
        content = await fs.readFile(this.resolve(f.path), "utf8");
      } catch {
        continue;
      }
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        if (line.toLowerCase().includes(needle)) {
          hits.push({ path: f.path, line: i + 1, text: line.trim().slice(0, 200) });
          if (hits.length >= max) break;
        }
      }
    }
    return hits;
  }

  exec(
    cmd: string,
    args: string[],
    opts: { timeoutMs?: number; cwd?: string } = {},
  ): Promise<ExecResult> {
    const timeoutMs = opts.timeoutMs ?? 120_000;
    const started = Date.now();

    return new Promise((resolve) => {
      const child = spawn(cmd, args, {
        cwd: opts.cwd ? this.resolve(opts.cwd) : this.root,
        env: { ...process.env, CI: "1", NO_COLOR: "1", FORCE_COLOR: "0" },
        shell: false,
      });

      let stdout = "";
      let stderr = "";
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill("SIGKILL");
      }, timeoutMs);

      child.stdout.on("data", (d: Buffer) => {
        stdout += d.toString();
        if (stdout.length > 1_000_000) stdout = stdout.slice(-500_000);
      });
      child.stderr.on("data", (d: Buffer) => {
        stderr += d.toString();
        if (stderr.length > 1_000_000) stderr = stderr.slice(-500_000);
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        resolve({
          code: 127,
          stdout,
          stderr: `${stderr}\n${err.message}`,
          timedOut,
          durationMs: Date.now() - started,
        });
      });

      child.on("close", (code) => {
        clearTimeout(timer);
        resolve({
          code: code ?? 1,
          stdout,
          stderr,
          timedOut,
          durationMs: Date.now() - started,
        });
      });
    });
  }

  async commit(message: string): Promise<string | null> {
    await this.exec("git", ["add", "-A"]);
    const status = await this.exec("git", ["status", "--porcelain"]);
    if (status.stdout.trim() === "") return null; // bo'sh commit yasamaymiz
    const res = await this.exec("git", ["commit", "-q", "-m", message]);
    if (res.code !== 0) return null;
    const sha = await this.exec("git", ["rev-parse", "HEAD"]);
    return sha.stdout.trim() || null;
  }

  async revertTo(versionId: string): Promise<void> {
    const res = await this.exec("git", ["reset", "--hard", versionId]);
    if (res.code !== 0) throw new Error(`Qaytarib bo'lmadi: ${res.stderr}`);
  }
}

function countDiff(before: string, after: string): { added: number; removed: number } {
  const b = before === "" ? [] : before.split("\n");
  const a = after === "" ? [] : after.split("\n");
  const counts = new Map<string, number>();
  for (const line of b) counts.set(line, (counts.get(line) ?? 0) + 1);

  let added = 0;
  for (const line of a) {
    const n = counts.get(line) ?? 0;
    if (n > 0) counts.set(line, n - 1);
    else added++;
  }
  let removed = 0;
  for (const n of counts.values()) removed += n;
  return { added, removed };
}

const GLOB_STAR_TOKEN = "__AMB_DOUBLESTAR__";

function matchGlob(p: string, glob: string): boolean {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, GLOB_STAR_TOKEN)
    .replace(/\*/g, "[^/]*")
    .replace(new RegExp(GLOB_STAR_TOKEN, "g"), ".*");
  return new RegExp(`^${escaped}$`).test(p);
}
