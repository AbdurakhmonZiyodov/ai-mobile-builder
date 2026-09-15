export interface FileEntry {
  path: string;
  type: "file" | "dir";
  size?: number;
}

export interface EditResult {
  path: string;
  added: number;
  removed: number;
  action: "create" | "edit" | "delete";
}

export interface ExecResult {
  code: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
}

/**
 * Workspace drayveri.
 * MVP'da LocalDriver (shu mashinaning FS'i). Ishlab chiqarishda Firecracker
 * microVM yoki Docker + gVisor — interfeys bir xil qoladi (spek 8, 16.2).
 */
export interface WorkspaceDriver {
  readonly root: string;
  create(templateDir: string): Promise<void>;
  exists(): Promise<boolean>;
  destroy(): Promise<void>;

  list(dir?: string): Promise<FileEntry[]>;
  tree(maxEntries?: number): Promise<FileEntry[]>;
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<EditResult>;
  /** Nuqtali diff. To'liq qayta yozish taqiqlangan (spek 17.3). */
  edit(path: string, oldText: string, newText: string): Promise<EditResult>;
  remove(path: string): Promise<EditResult>;
  search(query: string, opts?: { glob?: string; max?: number }): Promise<Array<{ path: string; line: number; text: string }>>;

  exec(cmd: string, args: string[], opts?: { timeoutMs?: number; cwd?: string }): Promise<ExecResult>;

  /**
   * Loyihaning `node_modules/.bin` idagi vositani topadi.
   *
   * Yo'q bo'lsa `null` — bu muhit nosozligi va tekshiruv uni shunday
   * xabar qiladi. `npm exec` ishlatilmaydi: u vosita topilmasa REYESTRDAN
   * shu nomli paketni yuklab ishga tushiradi. Amalda `tsc` uchun bu
   * TypeScript'ga aloqasi yo'q begona paketni bajardi.
   */
  resolveBin(name: string): Promise<string | null>;

  /** Har xabardan keyin git commit — ma'lumot yo'qolmasin. */
  commit(message: string): Promise<string | null>;
  revertTo(versionId: string): Promise<void>;

  /**
   * Commit qilinmagan o'zgarishlarni tashlab yuboradi.
   *
   * Verify gate o'tmaganda MAJBURIY: aks holda buzuq fayllar diskda qoladi,
   * preview ulardan qayta yig'iladi va keyingi muvaffaqiyatli run'ning
   * `git add -A` si ularni begona versiyaga qo'shib yuboradi.
   */
  discardUncommitted(): Promise<void>;
}
