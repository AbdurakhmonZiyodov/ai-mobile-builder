import type { Rule } from "../review.types.js";
import { accountDeletion } from "./account-deletion.rule.js";
import { appleSignIn } from "./apple-sign-in.rule.js";
import { completeness } from "./completeness.rule.js";
import { minimumFunctionality } from "./minimum-functionality.rule.js";
import { paymentClause } from "./payment-clause.rule.js";
import { privacyPolicy } from "./privacy-policy.rule.js";
import { uniqueness } from "./uniqueness.rule.js";
import { usageDescriptions } from "./usage-descriptions.rule.js";

/**
 * Barcha qoidalar.
 *
 * Yangi rad etish holati uchragach, shu ro'yxatga yangi qoida qo'shiladi.
 * Rad etishlar korpusi vaqt bilan aynan shu ro'yxatni boyitadi — bu
 * mahsulotning nusxa ko'chirib bo'lmaydigan qismi.
 */
export const ALL_RULES: Rule[] = [
  minimumFunctionality,
  completeness,
  accountDeletion,
  appleSignIn,
  usageDescriptions,
  paymentClause,
  privacyPolicy,
  uniqueness,
];
