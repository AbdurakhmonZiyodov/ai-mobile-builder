# RIVO Builder — struktura taklifi

Tasdiqlashdan oldin ko'rib chiqish uchun. Kod yozilmagan.

---

## 1. Yuqori daraja

```
rivo-builder/
├── apps/
│   ├── web/                 Next.js 16 — frontend
│   └── api/                 NestJS 12 — backend
├── templates/
│   └── mobile/              Expo SDK 57 — mijoz ilovasi shabloni
├── packages/                faqat BIR NECHTA joyda ishlatiladigan kod
│   ├── contracts/           zod sxemalar + turlar (web <-> api shartnomasi)
│   ├── core-rules/          sof biznes qoidalari (narx, hisob, preview qarori)
│   ├── blocks/              bloklar reestri
│   ├── domains/             domen paketlari
│   └── design-tokens/       RIVO palitrasi va tipografiyasi (web + mobile)
└── docs/                    umumiy hujjatlar
```

**Qoida:** paket faqat **ikki yoki undan ko'p** iste'molchisi bo'lsa yaratiladi.
Bitta joyda ishlatiladigan kod o'sha ilovaning ichida turadi.

Shuning uchun `db`, `workspace`, `ai`, `verify`, `review-checker` — paket emas,
**NestJS ichidagi modullar**. Ularni faqat backend ishlatadi.

---

## 2. Backend — NestJS

```
apps/api/
├── src/
│   ├── main.ts                      kirish nuqtasi
│   ├── app.module.ts                ildiz moduli
│   │
│   ├── config/                      konfiguratsiya
│   │   ├── env.schema.ts            zod bilan env validatsiyasi (ishga tushishda)
│   │   ├── configuration.ts
│   │   └── config.module.ts
│   │
│   ├── common/                      butun ilova bo'ylab umumiy
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts    xatolar o'zbek tilida
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── pipes/
│   │   │   └── zod-validation.pipe.ts
│   │   ├── guards/
│   │   │   └── project-owner.guard.ts      loyiha egasini tekshirish
│   │   └── decorators/
│   │
│   ├── infrastructure/              tashqi dunyo (almashtiriladigan qismlar)
│   │   ├── database/
│   │   │   ├── schema/              drizzle jadvallar, har biri alohida fayl
│   │   │   │   ├── projects.schema.ts
│   │   │   │   ├── messages.schema.ts
│   │   │   │   ├── runs.schema.ts
│   │   │   │   ├── versions.schema.ts
│   │   │   │   ├── rejections.schema.ts
│   │   │   │   └── index.ts
│   │   │   ├── database.module.ts
│   │   │   └── database.service.ts
│   │   ├── crypto/                  mijoz kalitlarini shifrlash (AES-256-GCM)
│   │   ├── workspace/               izolyatsiyalangan FS + git
│   │   │   ├── workspace.service.ts
│   │   │   ├── drivers/
│   │   │   │   ├── local.driver.ts
│   │   │   │   └── driver.interface.ts   (keyin: docker.driver.ts)
│   │   │   └── project-map.builder.ts
│   │   └── llm/                     model qatlami
│   │       ├── llm.service.ts       generate(messages, tools, tier)
│   │       ├── providers/
│   │       └── model-registry.ts
│   │
│   └── modules/                     biznes modullari
│       ├── projects/
│       │   ├── projects.module.ts
│       │   ├── projects.controller.ts     HTTP
│       │   ├── projects.service.ts        biznes mantiq
│       │   ├── projects.repository.ts     baza bilan ishlash
│       │   ├── dto/
│       │   │   ├── create-project.dto.ts
│       │   │   └── project-summary.dto.ts
│       │   └── README.md                  ← modul hujjati
│       ├── agent/                   agent tsikli
│       │   ├── agent.controller.ts        SSE oqimi
│       │   ├── agent.service.ts           orkestratsiya
│       │   ├── classifier.service.ts      so'rov tasnifi
│       │   ├── context-builder.service.ts kontekst byudjeti
│       │   ├── tools/                     har tool alohida fayl
│       │   │   ├── read-file.tool.ts
│       │   │   ├── edit-file.tool.ts
│       │   │   ├── search-files.tool.ts
│       │   │   └── tool.registry.ts
│       │   ├── prompts/                   har prompt alohida fayl
│       │   └── README.md
│       ├── verify/                  verify gate
│       ├── preview/                 to'rt yo'lli preview
│       ├── billing/                 o'zgarish hisobi
│       ├── review/                  do'kon bandlari tekshiruvi
│       ├── backend-connection/      mijoz Supabase/Firebase kalitlari
│       ├── handoff/                 dasturchiga topshirish paketi
│       └── catalog/                 bloklar, domenlar, narx
│
└── docs/
    ├── ARCHITECTURE.md              qatlamlar, bog'liqlik yo'nalishi
    ├── API.md                       HAR BIR endpoint: nima, nega, misol
    ├── DATABASE.md                  har jadval va ustun nega bor
    ├── CONVENTIONS.md               nomlash, xato qaytarish, log qoidalari
    └── AI-GUIDE.md                  AI shu fayldan boshlaydi
```

**Bog'liqlik yo'nalishi bitta tomonga:**
`modules → infrastructure → common`. Teskarisi taqiqlanadi.
`modules` bir-birini faqat **service** orqali chaqiradi, repository orqali emas.

**Har fayl bitta ish qiladi.** Controller faqat HTTP, service faqat mantiq,
repository faqat baza. 200 qatordan oshgan fayl bo'linadi.

---

## 3. Frontend — Next.js

Xususiyat bo'yicha ajratish (feature-sliced), sahifa bo'yicha emas.

```
apps/web/
├── src/
│   ├── app/                         faqat marshrutlar, mantiq yo'q
│   │   ├── (marketing)/
│   │   │   ├── page.tsx             01 — Landing
│   │   │   └── narx/page.tsx        08 — To'lov
│   │   ├── (workspace)/
│   │   │   ├── loyihalarim/page.tsx 02 — Loyihalarim
│   │   │   └── loyiha/[id]/
│   │   │       ├── page.tsx         04 — Workspace
│   │   │       ├── dizayn/page.tsx  05 — Design Mode
│   │   │       ├── tekshiruv/       06 — Tekshiruv
│   │   │       ├── backend/         10 — Backend
│   │   │       └── chiqarish/       11 — Publish
│   │   └── layout.tsx
│   │
│   ├── features/                    har xususiyat mustaqil
│   │   ├── project-create/          prompt kiritish -> ekranlar
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   └── README.md
│   │   ├── workspace/               ilova markazda, chat qoplama
│   │   │   ├── components/
│   │   │   │   ├── phone-frame.tsx
│   │   │   │   ├── chat-overlay.tsx
│   │   │   │   ├── top-bar.tsx
│   │   │   │   └── side-rail.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-agent-stream.ts   SSE
│   │   │   └── README.md
│   │   ├── blocks-picker/           03 — Bloklar
│   │   ├── verify-report/           06 — Tekshiruv
│   │   ├── billing/                 09 — Nima bitta o'zgarish
│   │   └── publish/                 07, 11
│   │
│   └── shared/
│       ├── ui/                      dizayn tizimi (RIVO)
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── badge.tsx
│       │   ├── balance-meter.tsx
│       │   └── README.md
│       ├── api/                     tiplangan HTTP mijoz
│       ├── hooks/
│       └── lib/
│
└── docs/
    ├── DESIGN-SYSTEM.md             ranglar, shrift, oraliq, holatlar
    ├── COMPONENTS.md                har komponent: qachon ishlatiladi
    ├── ARCHITECTURE.md              features qoidasi, ma'lumot oqimi
    └── AI-GUIDE.md
```

**RIVO dizayn tokenlari** (dizayndan olingan):

| Token | Qiymat | Ishlatilishi |
| --- | --- | --- |
| `--paper` | `#E7E1D5` | sahifa foni |
| `--surface` | `#F7F4EE` | kartalar |
| `--surface-2` | `#EDE7DB` | ichki bloklar |
| `--ink` | `#151510` | asosiy matn |
| `--ink-muted` | `#4A4840` | ikkinchi darajali matn |
| `--ink-faint` | `#5F5B52` | yorliqlar, mono |
| `--line` | `#C9C2B3` | chegaralar |
| `--accent` | `#B03A18` | asosiy amal (terrakota) |
| `--success` | `#155C3E` | o'tdi, tayyor |
| `--warn` | `#F0A483` | ogohlantirish |
| Shrift | IBM Plex Sans / IBM Plex Mono | |

Dizayndagi mobil ekranlar chizmalar — **mobil UI ular bo'yicha qurilmaydi**.
Telefon uchun alohida, native primitivlarga tayangan tartib bo'ladi.

---

## 4. Mobil shablon — Expo

```
templates/mobile/
├── app/                             Expo Router — faqat ekranlar
│   ├── _layout.tsx                  QOTIRILGAN, agent tegmaydi
│   ├── (app)/
│   └── (auth)/
├── src/
│   ├── components/                  UI qismlari
│   ├── features/                    domen bo'yicha (bron, katalog, ...)
│   ├── blocks/                      tayyor bloklar (auth, data, to'lov)
│   ├── lib/
│   │   ├── theme.ts                 @rivo/design-tokens dan
│   │   ├── supabase.ts
│   │   └── format.ts                so'm, sana
│   └── types/
└── docs/
    ├── STRUCTURE.md                 qaysi kod qayerga yoziladi
    ├── STYLE-GUIDE.md               ranglar, oraliq, tipografiya, holatlar
    ├── BLOCKS.md                    har blok: nima beradi, qanday sozlanadi
    ├── STORE-RULES.md               Apple/Google talablari va ular qayerda
    └── AI-GUIDE.md                  agent shu fayldan boshlaydi
```

---

## 5. Hujjatlar qoidasi

Har uchala loyihada `docs/AI-GUIDE.md` bor. Har qanday AI (Claude, Codex, boshqa)
shu fayldan boshlaydi va quyidagilarni biladi:

- loyiha nima qiladi va qaysi qatlamdan iborat
- yangi kod qayerga yoziladi (aniq papka)
- nomlash qoidalari
- nima qilish TAQIQLANGAN
- qaysi hujjatni keyin o'qish kerak

**Kod ichida:** har controller metodi va har muhim funksiya ustida **o'zbek tilida
qisqa izoh** — nima qilishini emas, **nega borligini** tushuntiradi.

```ts
/**
 * Loyihaning o'zgarishlar qoldig'ini qaytaradi.
 *
 * Nega alohida endpoint: mijoz workspace'da har amaldan keyin qoldiqni ko'rishi
 * kerak. Butun loyihani qayta yuklash o'rniga faqat shu raqamni olamiz.
 */
@Get(':id/balance')
```

---

## 6. Mock ma'lumot bo'lmaydi

| Hozir bor | O'rniga |
| --- | --- |
| `MockProvider` (kalitsiz soxta model) | Haqiqiy model. Kalit yo'q bo'lsa — aniq xato |
| Shablonda «Birinchi yozuv» namunalari | Bo'sh holat, keyin haqiqiy Supabase ma'lumoti |
| Landing'da qo'lda yozilgan raqamlar | `@rivo/core-rules` dan narx, API'dan statistika |
| Dizayndagi «Barber Studio · v14» | Dizayn uchun matn, kodga ko'chirilmaydi |

---

## 7. Boshlanishi — promptdan ilovagacha

Dizayndagi oqim:

```
Landing — «Qanday ilova kerak?» maydoni
   ↓ mijoz o'z tilida yozadi
Domen aniqlanadi + bloklar taklif qilinadi (preview belgisi bilan)
   ↓ bitta tugma: «Ekranlarni ko'rsat» — bepul
Design mode: ekranlar ko'rinadi, kod yo'q
   ↓ «Ilovani qurish»
Workspace: ilova markazda, ~90 soniyada birinchi preview
```

Mijozdan **hech qanday texnik savol so'ralmaydi**. Blok, SDK, backend — hammasi
taklif qilinadi va sababi bir jumlada aytiladi.
