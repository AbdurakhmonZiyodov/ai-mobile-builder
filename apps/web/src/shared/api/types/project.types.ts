import type { CreateProjectInput, FileNode, ProjectSummary } from "@amb/contracts";
import type { Balance, PreviewDecision } from "@amb/core-rules";

/**
 * Loyiha resursining so'rov va javob turlari.
 *
 * Nega so'rov va javob ALOHIDA turlar: ular bir xil ko'rinsa ham, bir xil
 * narsa emas. Backend javobga maydon qo'shsa, so'rov o'zgarmaydi. Ular
 * bitta turda bo'lsa, har qo'shimcha maydon so'rovni ham buzardi.
 *
 * Nega `CreateProjectInput` bu yerda qayta yozilmaydi: u `@amb/contracts`
 * dagi zod sxemasidan kelib chiqadi va backend ham AYNAN shuni tekshiradi.
 * Nusxa olsak, ikki tomon albatta bir-biridan uzoqlashadi.
 */

// --- So'rovlar ---------------------------------------------------------

export type CreateProjectRequest = CreateProjectInput;

export interface ReadProjectFileRequest {
  projectId: string;
  /** Workspace ildiziga nisbatan yo'l: `app/(tabs)/index.tsx` */
  path: string;
}

export interface RevertProjectRequest {
  projectId: string;
  versionId: string;
}

// --- Javoblar ----------------------------------------------------------

/** Blokning preview turi mijozga TANLASHDAN OLDIN ko'rsatiladi. */
export interface ProjectBlockInfo {
  id: string;
  nameUz: string;
  preview: string;
}

export interface CreateProjectResponse {
  projectId: string;
  domainPack: string | null;
  blocks: string[];
  /** Qaysi preview yo'li va NEGA — bir jumlada. */
  preview: PreviewDecision;
  blockInfo: ProjectBlockInfo[];
}

export interface ListProjectsResponse {
  projects: ProjectSummary[];
}

export type GetProjectResponse = ProjectSummary;

export interface ListProjectFilesResponse {
  files: FileNode[];
}

export interface ReadProjectFileResponse {
  path: string;
  content: string;
}

export interface ProjectMessage {
  id: string;
  projectId: string;
  role: "user" | "assistant";
  content: string;
  /** JSON orqali kelgani uchun ISO matn, `Date` emas. */
  createdAt: string;
}

export interface ListProjectMessagesResponse {
  messages: ProjectMessage[];
}

export interface ChangedFile {
  path: string;
  added: number;
  removed: number;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  gitSha: string;
  /** Mijozga git SHA emas, o'zi yozgan so'rov matni ko'rsatiladi. */
  label: string;
  filesChanged: ChangedFile[];
  createdAt: string;
}

export interface ListProjectVersionsResponse {
  versions: ProjectVersion[];
}

export interface RevertProjectResponse {
  ok: boolean;
  revertedToUz: string;
}

export interface ProjectUsageResponse {
  runs: number;
  chargedUnits: number;
  totalCostCents: number;
  /** Bir o'zgarishning tannarxi — marja shu raqamga bog'liq. */
  avgCostPerChangeCents: number;
  balance: Balance;
}
