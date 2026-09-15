# Arxitektura — backend

## Qatlamlar

```
                      HTTP / SSE
                          │
                    ┌─────▼──────┐
                    │ controller │  faqat: so'rovni qabul qilish, javob berish
                    └─────┬──────┘
                          │
                    ┌─────▼──────┐
                    │  service   │  faqat: biznes qoidalari
                    └─────┬──────┘
                          │
              ┌───────────┼───────────┐
        ┌─────▼─────┐          ┌──────▼──────┐
        │ repository│          │infrastructure│
        │  (SQL)    │          │ llm, workspace│
        └───────────┘          └──────────────┘
```

Bog'liqlik **faqat pastga**. `infrastructure` hech qachon `modules` dan
import qilmaydi.

## Modullar

| Modul | Javobgarligi |
| --- | --- |
| `projects` | Loyiha yaratish, ro'yxat, fayllar, versiyalar |
| `agent` | Agent tsikli: tasniflash → kontekst → bajarish → verify |
| `verify` | Verify gate: typecheck, lint, bundle |
| `billing` | O'zgarishlar hisobi |
| `preview` | To'rt yo'lli preview qarori va veb yig'ish |
| `review` | Do'kon bandlari tekshiruvi |
| `backend-connection` | Mijoz Supabase/Firebase kalitlari |
| `handoff` | Dasturchiga topshirish paketi |
| `catalog` | Bloklar, domenlar, narx (o'zgarmas ma'lumot) |
| `health` | Server holati |

## Agent tsikli

```
POST /chat
  │
  ├─ 1. Tasniflash (arzon model)
  │     question | unclear → BEPUL javob, tsikl tugaydi
  │
  ├─ 2. Qoldiq tekshiruvi
  │     qoldiq yo'q → to'xtash (savol va tuzatish baribir bepul)
  │
  ├─ 3. Kontekst yig'ish
  │     DESIGN.md + PROJECT.md + MAP.md + oxirgi 5 xabar + 3–8 fayl
  │     butun repo HECH QACHON yuborilmaydi
  │
  ├─ 4. Bajarish (tool tsikli)
  │     edit_file — nuqtali diff, to'liq qayta yozish taqiqlangan
  │     diff bo'sh → 0 hisoblanadi, tsikl tugaydi
  │
  ├─ 5. Verify gate
  │     typecheck → lint → bundle
  │
  ├─ 6. Tuzatish tsikli (BEPUL, ko'pi bilan 3)
  │     bir xil xato ikki marta → arzon modeldan kuchligiga
  │
  ├─ 7. Uch urinish yetmasa → halol to'xtash, 0 hisoblanadi
  │
  ├─ 8. git commit = versiya
  │
  └─ 9. Hisob: 1 o'zgarish
```

## Kontekst byudjeti

`modules/agent/context-builder.service.ts` → `CONTEXT_BUDGET`

| Bo'lak | Chegara | Nega |
| --- | --- | --- |
| DESIGN.md + PROJECT.md | 1 500 token | Loyihaning maqsadi |
| MAP.md | 1 000 | Qayerga qarashni ko'rsatadi |
| Suhbat | 1 500 | Oxirgi 5 to'liq, qolgani xulosa |
| Tegishli fayllar | 15 000 | Qidiruv natijasi, 3–8 fayl |
| Tool javobi | 4 000 | Oshsa qisqartiriladi |

## Model tier'lari

`infrastructure/llm/model-registry.ts`

| Tier | Model | Narx (1M token) | Qachon |
| --- | --- | --- | --- |
| `cheap` | claude-haiku-4.5 | $1 / $5 | Tasniflash — har xabarda |
| `standard` | claude-sonnet-5 | $2 / $10 | Kundalik tahrir |
| `strong` | claude-opus-5 | $5 / $25 | Katta o'zgarish; qaytalangan xato |

Model ID'lari sozlamadan keladi (`AMB_MODEL_*`). Provayder modelni
yangilasa, kod tegilmaydi.

## Xavfsizlik chegaralari

| Chegara | Qayerda |
| --- | --- |
| Fayl yo'li workspace ichida | `LocalWorkspace.resolve()` |
| Loyiha ID formati | `WorkspaceService.assertSafeId()` |
| Preview statik fayllari | `preview-static.controller.ts` |
| Mijoz kalitlari AES-256-GCM | `infrastructure/crypto/secret-cipher.ts` |
| `service_role` qaytarilmaydi | `backend-connection.service.ts` |
| Sozlama ishga tushishda tekshiriladi | `config/env.schema.ts` |

**Hali yo'q:** konteyner izolyatsiyasi (Firecracker / gVisor), tarmoq
oq ro'yxati, KMS. MVP shu mashinaning fayl tizimida ishlaydi va ishlab
chiqarishga tayyor emas.
