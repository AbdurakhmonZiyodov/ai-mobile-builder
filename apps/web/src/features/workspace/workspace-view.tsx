"use client";

import { useCallback, useState } from "react";
import type { ProjectSummary } from "@amb/contracts";
import { api, API_URL } from "@/shared/api";
import { ChatOverlay } from "./components/chat-overlay";
import { CodePanel } from "./components/code-panel";
import { DEVICES, DevicePicker, type DeviceId } from "./components/device-picker";
import { PanelTabs } from "./components/panel-tabs";
import { PhoneFrame, PhonePlaceholder } from "./components/phone-frame";
import { ProjectsRail, type RailProject } from "./components/projects-rail";
import { WorkspaceTopBar } from "./components/workspace-top-bar";
import { useAgentRun } from "./hooks/use-agent-run";
import type { TimelineEntry } from "./timeline";

interface WorkspaceViewProps {
  project: ProjectSummary;
  previewReasonUz: string;
  /** Sahifa ochilganda ko'rsatiladigan saqlangan suhbat. */
  initialEntries: TimelineEntry[];
  /** Ilova hali qurilmagan — workspace birinchi qurishni o'zi boshlaydi. */
  needsFirstBuild: boolean;
  /** Yon ustun uchun mijozning boshqa ilovalari. */
  projects: RailProject[];
}

/** Markaziy panelning ikki ko'rinishi. */
type CenterTab = "preview" | "code";

const CENTER_TABS = [
  { id: "preview" as const, labelUz: "Ko'rinish" },
  { id: "code" as const, labelUz: "Kod" },
];

/**
 * Workspace — mahsulotning asosiy ekrani.
 *
 * Tartib: yon ustun (loyihalar) → suhbat → markaziy panel. Markazda
 * ikki ko'rinish almashadi: ILOVA va uning KODI.
 *
 * Nega kod ko'rinishi kerak: ilgari agent kod yozayotganda ekranda faqat
 * matn oqardi va mijoz «u haqiqatan ish qilyaptimi yoki qotib qoldimi?»
 * degan savol bilan qolardi. Endi fayllar paydo bo'lishi va ichidagi kod
 * ko'rinib turadi — jarayon ochiq. Mijoz kodni o'qimasa ham, uning
 * YOZILAYOTGANINI ko'radi va bu kutishni bardoshli qiladi.
 *
 * Nega baribir sukut bo'yicha «Ko'rinish»: mijoz biznes egasi, u ilovasi
 * bilan qiziqadi. Kod — ishonch uchun dalil, maqsad emas.
 */
export function WorkspaceView({
  project,
  previewReasonUz,
  initialEntries,
  needsFirstBuild,
  projects,
}: WorkspaceViewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(project.previewUrl);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [tab, setTab] = useState<CenterTab>("preview");
  const [deviceId, setDeviceId] = useState<DeviceId>("iphone");

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
    initialEntries,
    needsFirstBuild,
    onFinished: refreshPreview,
  });

  const device = DEVICES[deviceId];

  return (
    <div className="flex min-h-screen">
      <ProjectsRail projects={projects} activeId={project.id} />

      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceTopBar
          projectName={project.name}
          versionLabel={`SDK ${project.sdk}`}
          balance={run.balance}
          onOpenOnPhone={() => undefined}
          onPublish={() => undefined}
        />

        <div className="grid min-w-0 flex-1 gap-5 p-5 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]">
          {/* Suhbat — chapda, doim bir xil kenglikda. */}
          <div className="min-w-0 lg:order-1">
            <ChatOverlay entries={run.entries} busy={run.busy} onSend={run.send} />
          </div>

          {/* Markaz: ilova yoki uning kodi. */}
          <div className="panel-tall flex min-w-0 flex-col gap-3 lg:order-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PanelTabs tabs={CENTER_TABS} value={tab} onChange={setTab} />
              {tab === "preview" ? (
                <DevicePicker value={deviceId} onChange={setDeviceId} />
              ) : null}
            </div>

            {tab === "preview" ? (
              /*
                Keng ekranda sabab matni telefonning YONIDA turadi, ostida
                emas. Nega: telefon o'lchamini kenglik emas, BALANDLIK
                cheklaydi — markaziy ustunda yonlarda yuzlab piksel bo'sh
                qolgan holda matn pastdan uch qator o'g'irlardi va butun
                maket shuncha kichrayardi. Tor ekranda esa aksincha: u
                pastga tushadi, chunki u yerda kenglik tanqis.
              */
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 xl:flex-row xl:gap-7">
                {/*
                  Ikki slot ataylab boshqa-boshqa: `children` — MIJOZNING
                  ilovasi, u qurilmaning haqiqiy o'lchamida ochilib keyin
                  kichraytiriladi. `placeholder` — BIZNING matnimiz, u
                  kichraytirilmaydi, aks holda ekranda o'qib bo'lmaydigan
                  8px matn qolardi.
                */}
                <PhoneFrame
                  device={device}
                  busy={previewBusy}
                  statusUz={previewStatusUz(previewBusy, previewUrl)}
                  placeholder={
                    previewUrl ? undefined : (
                      <PhonePlaceholder
                        messageUz={
                          previewError ??
                          "Birinchi o'zgarishni yozing — ilovangiz shu yerda paydo bo'ladi."
                        }
                      />
                    )
                  }
                >
                  {previewUrl ? (
                    <iframe
                      key={previewUrl}
                      src={`${API_URL}${previewUrl}`}
                      title={`${project.name} ko'rinishi`}
                      className="h-full w-full border-0 bg-white"
                    />
                  ) : null}
                </PhoneFrame>

                {/*
                  Preview yo'li va uning SABABI. Mijoz «nega telefonimda
                  ochilmayapti?» deb so'ramasligi kerak — javob oldindan,
                  telefonning yonida turadi.

                  `shrink-0` + `w-64`: matn telefondan joy tortib olmasligi
                  kerak. Ramka o'z o'lchamini qolgan bo'shliqdan oladi va
                  bu ustun suzib yursa, telefon har renderda o'lchamini
                  o'zgartirardi.
                */}
                <aside className="w-full max-w-sm shrink-0 rounded-2xl border border-line bg-surface p-4 xl:w-64">
                  <p className="text-sm font-medium">Telefonda ochish</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    {previewReasonUz}
                  </p>
                </aside>
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-surface">
                <CodePanel
                  projectId={project.id}
                  changedPaths={run.changedPaths}
                  busy={run.busy}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Holat matni — rang emas, SO'Z bilan. Mijoz nima bo'layotganini o'qiydi. */
function previewStatusUz(busy: boolean, url: string | null): string {
  if (busy) return "Ilova yig'ilmoqda…";
  return url ? "Brauzerda ishlayapti" : "Preview hali yig'ilmagan";
}
