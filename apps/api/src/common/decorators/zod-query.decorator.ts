import { Query } from "@nestjs/common";
import type { ZodType } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe.js";

/**
 * `@ZodQuery(schema) query: T` — so'rov qatorini zod bilan tekshiradi.
 *
 * `@Body` uchun `ZodBody` bor edi, `@Query` uchun yo'q edi — natijada
 * so'rov parametrlari tekshirilmay pastga tushardi va 500 berardi.
 */
export function ZodQuery<T>(schema: ZodType<T>): ParameterDecorator {
  return Query(new ZodValidationPipe(schema));
}
