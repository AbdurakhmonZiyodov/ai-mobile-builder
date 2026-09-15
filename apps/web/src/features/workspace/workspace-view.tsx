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
 * Tartib: chapda suhbat, markazda ilova, o'ngda holat. Uch ustun
 * qat'iy kenglikda emas — chap va o'ng panel o'z o'lchamini oladi,
 * markaz esa qolganini. Shunda telefon har doim aniq o'rtada turadi
 * va ekran kengaygan sari faqat u kattalashadi.
 *
 * 1024px dan tor ekranda ustunlar bir-birining ostiga tushadi:
 * telefon tepada, suhbat pastda — mijoz avval natijani ko'radi.
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

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 justify-center gap-6 p-6 lg:grid-cols-[minmax(300px,380px)_auto_minmax(280px,320px)]">
        {/* Markaz: ilova. Tor ekranda birinchi bo'lib ko'rinadi. */}
        <div className="flex justify-center lg:order-2">
          <PhoneFrame statusUz={previewStatusUz(previewBusy, previewUrl)}>
            {previewUrl ? (
              <iframe
                key={previewUrl}
                src={`${API_URL}${previewUrl}`}
                title={`${project.name} preview`}
                className="h-full w-full border-0 bg-white"
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

        {/* Chap: suhbat */}
        <div className="min-w-0 lg:order-1">
          <ChatOverlay entries={run.entries} busy={run.busy} onSend={run.send} />
        </div>

        {/* O'ng: holat */}
        <aside className="min-w-0 space-y-4 lg:order-3">
          <BalanceMeter balance={run.balance} />

          <Card className="p-4 text-sm">
            <p className="font-medium">Telefonda ochish</p>
            <p className="mt-2 leading-relaxed text-ink-muted">{previewReasonUz}</p>
          </Card>

          {project.blocks.length > 0 ? (
            <Card className="p-4 text-sm">
              <p className="font-medium">Bloklar</p>
              <ul className="mt-2.5 space-y-1.5 text-ink-muted">
                {project.blocks.map((block) => (
                  <li key={block} className="flex gap-2">
                    <span aria-hidden className="text-accent">
                      ·
                    </span>
                    {block}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

/** Holat matni — rang emas, SO'Z bilan. Mijoz nima bo'layotganini o'qiydi. */
function previewStatusUz(busy: boolean, url: string | null): string {
  if (busy) return "Ilova yig'ilmoqda…";
  return url ? "Brauzerda ishlayapti" : "Preview hali yig'ilmagan";
}
