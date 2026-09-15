import type { TaskKind } from "@amb/core-rules";
import type { EditResult } from "../../infrastructure/workspace/drivers/driver.interface.js";
import type { VerifyReport } from "../verify/verify.types.js";
import type { StoredMessage } from "./context-builder.service.js";

export interface RunAgentInput {
  projectId: string;
  prompt: string;
  /** Design mode — kod o'zgarmaydi, hech qachon hisoblanmaydi. */
  designMode: boolean;
  history: StoredMessage[];
}

export interface RunAgentResult {
  runId: string;
  kind: TaskKind;
  units: 0 | 1;
  chargeReasonUz: string;
  /** Git SHA — muvaffaqiyatli tugagan bo'lsa */
  gitSha: string | null;
  verify: VerifyReport | null;
  changedFiles: EditResult[];
  assistantText: string;
  repairAttempts: number;
  /** Bizning ichki xarajat, AQSh sentida */
  costCents: number;
  durationMs: number;
  ok: boolean;
}
