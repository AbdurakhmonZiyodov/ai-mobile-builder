import { WorkspaceManager } from "@amb/workspace";
import { getDb } from "@amb/db";
import { env } from "./env.js";

export const workspaces = new WorkspaceManager(env.workspaceRoot, env.templateDir);
export const db = () => getDb();
