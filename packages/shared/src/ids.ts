import { randomUUID } from "node:crypto";

/** Prefiksli ID: `prj_1a2b...`. Logda qaysi obyekt ekani darhol ko'rinadi. */
export function newId(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

export const ID = {
  project: () => newId("prj"),
  session: () => newId("ses"),
  message: () => newId("msg"),
  run: () => newId("run"),
  change: () => newId("chg"),
  version: () => newId("ver"),
  rejection: () => newId("rej"),
  build: () => newId("bld"),
} as const;
