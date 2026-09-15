import { Injectable } from "@nestjs/common";
import {
  balanceLabelUz,
  decideCharge,
  remaining,
  type Balance,
  type ChargeDecision,
  type TaskKind,
  type VerifyStatus,
} from "@amb/core-rules";
import type { Project } from "../../infrastructure/database/schema/index.js";
import { BillingRepository } from "./billing.repository.js";

export interface ChargeContext {
  kind: TaskKind;
  verify: VerifyStatus;
  /** Agent diff yozdimi. Bo'sh diff hech qachon hisoblanmaydi. */
  producedDiff: boolean;
}

export interface ChargeOutcome extends ChargeDecision {
  remaining: number;
  balanceLabelUz: string;
}

/**
 * O'zgarishlar hisobi.
 *
 * Mahsulotning uchta va'dasi shu yerda yashaydi va boshqa hech qayerda
 * hisob yuritilmaydi:
 *   · xato tuzatish bepul
 *   · tekshiruvdan o'tmasa hisoblanmaydi
 *   · savol va noaniq so'rov bepul
 *
 * Qaror `@amb/core-rules` dagi sof funksiyada — u I/O bilmaydi va testlash
 * oson. Bu servis faqat qarorni bazaga yozadi.
 */
@Injectable()
export class BillingService {
  constructor(private readonly repository: BillingRepository) {}

  balanceOf(project: Project): Balance {
    return {
      included: project.includedChanges,
      used: project.usedChanges,
      extraPurchased: project.extraPurchased,
      extraUsed: project.extraUsed,
    };
  }

  /** Qoldiq qolmaganda hisoblanadigan ish boshlanmaydi. */
  hasRemaining(project: Project): boolean {
    return remaining(this.balanceOf(project)) > 0;
  }

  /**
   * Qarorni hisoblaydi, LEKIN yozmaydi.
   * Agent tsikli natijani mijozga darhol ko'rsatishi kerak, yozish esa
   * run tugagach bitta joyda bo'ladi.
   */
  decide(project: Project, context: ChargeContext): ChargeOutcome {
    const decision = decideCharge(context);
    const projected: Balance = {
      ...this.balanceOf(project),
      used: project.usedChanges + decision.units,
    };

    return {
      ...decision,
      remaining: remaining(projected),
      balanceLabelUz: balanceLabelUz(projected),
    };
  }

  /**
   * Hisobni bazaga yozadi.
   *
   * Qaytadi: hisob amalga oshdimi. `false` bo'lsa — qoldiq tugagan
   * (masalan ikki so'rov bir vaqtda kelgan). Bunda mijozdan pul
   * olinmaydi: kamroq olganimiz ortiqcha olganimizdan yaxshi.
   */
  async commit(projectId: string, units: 0 | 1): Promise<boolean> {
    if (units === 0) return true;
    return this.repository.consumeOneChange(projectId);
  }
}
