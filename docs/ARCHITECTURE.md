# Arxitektura — umumiy xarita

Bu yuqori darajadagi xarita. Tafsilot har loyihaning **o'z** hujjatida:

| Loyiha | Hujjat |
| --- | --- |
| Backend | [`apps/api/docs/ARCHITECTURE.md`](../apps/api/docs/ARCHITECTURE.md) |
| Frontend | [`apps/web/docs/ARCHITECTURE.md`](../apps/web/docs/ARCHITECTURE.md) |
| Mobil shablon | [`templates/mobile/docs/STRUCTURE.md`](../templates/mobile/docs/STRUCTURE.md) |

Bu yerdagi tanlovlarning sabablari — [`docs/decisions/`](./decisions/README.md).

---

## Qismlar

```
        ┌──────────────┐
        │   apps/web   │  Next.js — mijoz ishlaydigan interfeys
        └──────┬───────┘
               │ HTTP + SSE
        ┌──────▼───────┐
        │   apps/api   │  NestJS — orkestrator
        └──────┬───────┘
               │
       ┌───────┼────────────────┐
       │       │                │
  ┌────▼───┐ ┌─▼──────────┐ ┌───▼──────────────┐
  │Postgres│ │ AI Gateway │ │ workspaces/<id>/ │
  │        │ │  (model)   │ │  Expo loyihasi   │
  └────────┘ └────────────┘ └──────────────────┘
                                     ▲
                                     │ nusxa
                            ┌────────┴─────────┐
                            │ templates/mobile │
                            └──────────────────┘
```

Backend **kod yozmaydi** — model yozadi. Backend model uchun kontekst
tayyorlaydi, tool beradi, natijani tekshiradi va hisobni yuritadi.

## Umumiy paketlar

Paket faqat **ikki yoki undan ko'p** iste'molchisi bo'lsa yaratiladi.

| Paket | Kim ishlatadi | Nima |
| --- | --- | --- |
| `@amb/core-rules` | api + web | Narx, hisob, preview qarori, SDK reestri. **I/O yo'q** |
| `@amb/contracts` | api + web | Zod sxemalar va SSE hodisalari |
| `@amb/blocks` | api + web | Bloklar reestri |
| `@amb/domains` | api + web | 5 domen paketi |
| `@amb/design-tokens` | web + mobil | RIVO palitrasi va tipografiyasi |

Bitta iste'molchili kod paket bo'lmaydi: `database`, `workspace`, `llm`,
`verify`, `review` — bular NestJS ichidagi modullar.

## Mahsulot qoidalari qayerda yashaydi

| Qoida | Fayl |
| --- | --- |
| Nima hisoblanadi | `packages/core-rules/src/changes.ts` → `decideCharge()` |
| Narx va tariflar | `packages/core-rules/src/pricing.ts` |
| Qaysi preview yo'li | `packages/core-rules/src/preview.ts` → `decidePreviewPath()` |
| Qaysi SDK qo'llab-quvvatlanadi | `packages/core-rules/src/sdk.ts` |
| Blok Expo Go'da ishlaydimi | `packages/blocks/src/registry.ts` |
| Soha uchun «tayyor» nima | `packages/domains/src/packs/*.ts` → `evals` |
| Do'kon rad etish sabablari | `apps/api/src/modules/review/rules/*.ts` |

Bular **sof funksiyalar va ma'lumot** — I/O yo'q, shuning uchun bazasiz
testlanadi va frontend ham aynan o'shalarni ko'rsatadi.

## Ma'lumot oqimi — bitta o'zgarish

```
web: ChatOverlay → streamAgent() ──POST /chat──▶ api: AgentController
                                                      │
                                    ClassifierService ─┤ arzon model
                                  ContextBuilderService┤ MAP.md + 3–8 fayl
                                         LlmService ───┤ tool tsikli
                                       WorkspaceService┤ edit_file → git
                                        VerifyService ─┤ tsc, eslint, bundle
                                        RepairService ─┤ 3 bepul urinish
                                       BillingService ─┘ hisob
                                                      │
web: timeline.ts ◀────────SSE hodisalari──────────────┘
     (texnik atama → o'zbekcha matn)
```
