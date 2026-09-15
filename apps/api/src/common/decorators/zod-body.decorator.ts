import { Body } from "@nestjs/common";
import type { ZodType } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe.js";

/**
 * `@ZodBody(createProjectInput) dto: CreateProjectInput`
 *
 * Har controller'da `new ZodValidationPipe(...)` yozib o'tirmaslik uchun.
 */
export function ZodBody<T>(schema: ZodType<T>): ParameterDecorator {
  return Body(new ZodValidationPipe(schema));
}
