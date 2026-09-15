import type { CreateProjectInput, ProjectSummary } from "@amb/contracts";
import { apiGet, apiPost } from "./client";

/**
 * Backend endpointlarining tiplangan ro'yxati.
 *
 * Nega bitta faylda: komponentlar `fetch("/projects")` yozmasligi kerak.
 * Endpoint o'zgarsa, o'zgarish shu yerda tugaydi va TypeScript qolgan
 * joylarni ko'rsatadi.
 */

export interface CreatedProjectResponse {
  projectId: string;
  domainPack: string | null;
  blocks: string[];
  preview: { path: string; reasonUz: string; fallback: string };
  blockInfo: Array<{ id: string; nameUz: string; preview: string }>;
}

export interface FileNode {
  path: string;
  type: "file" | "dir";
  size?: number;
}

export const api = {
  projects: {
    list: () => apiGet<{ projects: ProjectSummary[] }>("/projects"),
    get: (id: string) => apiGet<ProjectSummary>(`/projects/${id}`),
    create: (input: CreateProjectInput) => apiPost<CreatedProjectResponse>("/projects", input),
    files: (id: string) => apiGet<{ files: FileNode[] }>(`/projects/${id}/files`),
    file: (id: string, path: string) =>
      apiGet<{ path: string; content: string }>(
        `/projects/${id}/file?path=${encodeURIComponent(path)}`,
      ),
    versions: (id: string) =>
      apiGet<{ versions: Array<{ id: string; label: string; createdAt: string }> }>(
        `/projects/${id}/versions`,
      ),
    revert: (id: string, versionId: string) =>
      apiPost<{ ok: boolean; revertedToUz: string }>(`/projects/${id}/revert`, { versionId }),
  },

  preview: {
    decide: (id: string, hasAppleAccount = false) =>
      apiGet<{ path: string; reasonUz: string; fallback: string }>(
        `/preview/${id}${hasAppleAccount ? "?apple=1" : ""}`,
      ),
    buildWeb: (id: string) =>
      apiPost<{ ok: boolean; url: string | null; durationMs: number; messageUz: string }>(
        `/preview/${id}/web`,
      ),
  },

  review: {
    check: (id: string) =>
      apiGet<{
        ok: boolean;
        passLikelihood: number;
        findings: Array<{
          clause: string;
          severity: "blocker" | "warning" | "info";
          titleUz: string;
          detailUz: string;
        }>;
      }>(`/review/${id}`),
  },

  catalog: {
    blocks: () =>
      apiGet<{ blocks: Array<{ id: string; nameUz: string; descriptionUz: string; preview: string }> }>(
        "/catalog/blocks",
      ),
    pricing: () => apiGet<unknown>("/catalog/pricing"),
  },
} as const;
