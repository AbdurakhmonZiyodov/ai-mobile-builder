import type { Balance } from "@amb/core-rules";
import type { Project } from "../../../infrastructure/database/schema/index.js";

/**
 * Loyihaning mijozga ko'rsatiladigan ko'rinishi.
 *
 * Nega alohida shakl: baza qatorida ichki maydonlar bor (`userId`,
 * `updatedAt`) va ular tashqariga chiqmasligi kerak. Bu qatlam
 * «nima ko'rinadi» degan savolga yagona javob beradi.
 */
export interface ProjectSummaryDto {
  id: string;
  name: string;
  status: string;
  sdk: number;
  domainPack: string | null;
  blocks: string[];
  sells: string;
  plan: string;
  previewPath: string;
  previewUrl: string | null;
  balance: Balance;
  createdAt: string;
}

export function toProjectSummary(project: Project): ProjectSummaryDto {
  return {
    id: project.id,
    name: project.name,
    status: project.status,
    sdk: project.sdk,
    domainPack: project.domainPack,
    blocks: project.blocks,
    sells: project.sells,
    plan: project.plan,
    previewPath: project.previewPath,
    previewUrl: project.previewUrl,
    balance: {
      included: project.includedChanges,
      used: project.usedChanges,
      extraPurchased: project.extraPurchased,
      extraUsed: project.extraUsed,
    },
    createdAt: project.createdAt.toISOString(),
  };
}
