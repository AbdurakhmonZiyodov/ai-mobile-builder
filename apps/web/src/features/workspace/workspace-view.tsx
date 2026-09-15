"use client";

import { useCallback, useState } from "react";
import type { ProjectSummary } from "@amb/contracts";
import { api, API_URL } from "@/shared/api";
import { BalanceMeter, Card } from "@/shared/ui";
import { ChatOverlay } from "./components/chat-overlay";
import { PhoneFrame, PhonePlaceholder } from "./components/phone-frame";
import { WorkspaceTopBar } from "./components/workspace-top-bar";
import { useAgentRun } from "./hooks/use-agent-run";

interface WorkspaceViewProps {
  project: ProjectSummary;
  previewReasonUz: string;
}

/**
 * Workspace — mahsulotning asosiy ekrani.
 *
 * Tartib dizayn kanvasidan: ilova markazda, suhbat ustidan qoplama,
 * qoldiq yuqorida. Mijoz ilovasini ko'rib turadi va uni gapirib
 * o'zgartiradi.
 */
export function WorkspaceView({ project, previewReasonUz }: WorkspaceViewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(project.previewUrl);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  /** Har o'zgarishdan keyin preview qayta yig'iladi — mijoz natijani ko'rsin. */
  const refreshPreview = useCallback(async () => {
    setPreviewBusy(true);
    setPreviewError(null);
    try {
      const result = await api.preview.buildWeb(project.id);
      if (result.ok && result.url) {
        // Kesh buzuvchi: bir xil URL bo'lsa brauzer eski sahifani ko'rsatadi.
        setPreviewUrl(`${result.url}?v=${Date.now()}`);
      } else {
        setPreviewError(result.messageUz);
      }
    } catch {
      setPreviewError("Preview yig'ilmadi.");
    } finally {
      setPreviewBusy(false);
    }
  }, [project.id]);

  const run = useAgentRun({
    projectId: project.id,
    initialBalance: project.balance,
    onFinished: refreshPreview,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <WorkspaceTopBar
        projectName={project.name}
        versionLabel={`SDK ${project.sdk}`}
        balance={run.balance}
        onOpenOnPhone={() => undefined}
        onPublish={() => undefined}
      />

      <div className="flex flex-1 gap-6 p-6">
        {/* Chap: suhbat qoplamasi */}
        <div className="shrink-0">
          <ChatOverlay entries={run.entries} busy={run.busy} onSend={run.send} />
        </div>

        {/* Markaz: ilova */}
        <div className="flex flex-1 justify-center">
          <PhoneFrame
            statusUz={
              previewBusy
                ? "Ilova yig'ilmoqda…"
                : previewUrl
                  ? "Brauzerda ishlayapti"
                  : "Preview hali yig'ilmagan"
            }
          >
            {previewUrl ? (
              <iframe
                key={previewUrl}
                src={`${API_URL}${previewUrl}`}
                title={`${project.name} preview`}
                className="h-full w-full border-0"
              />
            ) : (
              <PhonePlaceholder
                messageUz={
                  previewError ??
                  "Birinchi o'zgarishni yozing — ilovangiz shu yerda paydo bo'ladi."
                }
              />
            )}
          </PhoneFrame>
        </div>

        {/* O'ng: holat */}
        <aside className="w-[300px] shrink-0 space-y-4">
          <BalanceMeter balance={run.balance} />

          <Card className="p-3.5 text-sm">
            <p className="font-medium">Telefonda ochish</p>
            <p className="mt-1.5 text-ink-muted">{previewReasonUz}</p>
          </Card>

          {project.blocks.length > 0 ? (
            <Card className="p-3.5 text-sm">
              <p className="font-medium">Bloklar</p>
              <ul className="mt-2 space-y-1 text-ink-muted">
                {project.blocks.map((block) => (
                  <li key={block}>· {block}</li>
                ))}
              </ul>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
