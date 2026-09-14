# Arxitektura

Spekning 8-bo'limi qaysi paketda yashaydi.

## Qatlamlar

```
                 apps/web  (Next.js)
                     |  HTTP + SSE
                 apps/api  (Hono)
                     |
    +----------------+----------------+
    |                |                |
@amb/agent      @amb/workspace    @amb/db
    |                |
@amb/ai          @amb/verify
    |
@amb/shared  <- @amb/blocks, @amb/domains, @amb/review-checker
```

`@amb/shared` — barcha qatlamlar bog'liq bo'lgan yagona haqiqat manbai:
narx, "o'zgarish" hisobi, preview qarori, SDK reestri, SSE hodisalari, HTTP shartnomalari.

## Nega hisob faqat bitta funksiyada

`decideCharge()` — `packages/shared/src/changes.ts`.

Mahsulotning uchta va'dasi shu funksiyada yashaydi:

| Va'da | Kodda |
| --- | --- |
| Xato tuzatish bepul | `kind: "repair"` -> 0 |
| Tekshiruvdan o'tmasa hisoblanmaydi | `verify === "failed"` -> 0 |
| Bo'sh diff hech qachon hisoblanmaydi | `!producedDiff` -> 0 |
| Savol va noaniq so'rov bepul | `question`, `unclear` -> 0 |

Hisob boshqa hech qayerda hisoblanmaydi. Yangi bepul holat qo'shilsa, faqat shu
jadval o'zgaradi — API, agent va UI tegilmaydi.

## Kontekst byudjeti

`packages/agent/src/context.ts` -> `BUDGET`. Butun repo hech qachon yuborilmaydi.

| Bo'lak | Chegara |
| --- | --- |
| DESIGN.md + PROJECT.md | 1 500 token |
| MAP.md | 1 000 |
| Suhbat (oxirgi 5 to'liq, qolgani xulosa) | 1 500 |
| Tegishli fayllar (qidiruv orqali 3–8) | 15 000 |
| Tool javobi | 4 000 |

`MAP.md` har xabarda qaytadan yasaladi: ekranlar -> marshrutlar, komponentlar,
mantiq fayllari va **300 qatordan oshgan fayllar ro'yxati**.

## Model tier'lari

`packages/ai/src/models.ts`. Env orqali almashtiriladi — model drifti bo'lganda
kod tegilmaydi.

| Tier | Qachon |
| --- | --- |
| `cheap` | Tasniflash — har xabarda ishlaydi |
| `standard` | Kichik va o'rta tahrir, savolga javob |
| `strong` | Katta o'zgarish; va **bir xil xato ikki marta takrorlansa** |

## Xavfsizlik chegaralari

| Chegara | Qayerda |
| --- | --- |
| Har fayl yo'li workspace ichida | `LocalWorkspace.resolve()` |
| Loyiha ID formati | `WorkspaceManager.assertSafeId()` |
| Preview statik fayllari | `apps/api/src/server.ts` — base prefiks tekshiruvi |
| Mijoz kalitlari AES-256-GCM | `packages/db/src/crypto.ts` |
| `service_role` hech qachon qaytarilmaydi | `GET /backend/:id` faqat `hasAnonKey` beradi |
| `service_role` o'chiriladi | `POST /backend/:id/burn-service-role` |

**Hali yo'q:** konteyner izolyatsiyasi (Firecracker / gVisor), tarmoq oq ro'yxati,
KMS. MVP shu mashinaning FS'ida ishlaydi — ishlab chiqarishga tayyor emas.
Spek 16.2 shu bo'limning to'liq ro'yxati.

## Preview qarori

`packages/shared/src/preview.ts` -> `decidePreviewPath()`. Sof funksiya, testlanadi.

```
bloklar dev client talab qiladimi?
  ha  -> Apple akkaunt bormi? -> dev_client : web
  yo'q -> loyiha SDK'si Expo Go'nikidan yuqorimi?
            ha  -> Apple akkaunt bormi? -> eas_go : web
            yo'q -> expo_go
```

Har javob bilan birga **bir jumlalik o'zbekcha sabab** qaytadi — mijoz nima uchun
shunday ekanini doim biladi.
