# @amb/api — orkestrator backend

NestJS 12 · TypeScript 7 · PostgreSQL + Drizzle · Vercel AI Gateway

Mijoz o'z tilida biznesini aytadi → biz Expo ilovasini quramiz, tekshiramiz
va do'konga chiqaramiz. Bu backend kod yozmaydi — **model yozadi**, backend
esa unga kontekst tayyorlaydi, tool beradi, natijani tekshiradi va hisobni
yuritadi.

---

## Ishga tushirish

```bash
npm run dev        # tsc --watch + node --watch (concurrently)
npm run build      # tsc -p tsconfig.json
npm run typecheck  # tsc --noEmit
npm run start      # node dist/main.js

npm run db:push      # sxemani bazaga yuklash (dev)
npm run db:generate  # migratsiya fayli
npm run db:studio    # brauzerda ko'rish
```

Talablar: **Node ≥ 22** (AI SDK 7 talabi), PostgreSQL, `git`.

Majburiy muhit o'zgaruvchilari: `DATABASE_URL`, `AMB_SECRET_KEY` (kamida 32
belgi) va model kaliti — `AI_GATEWAY_API_KEY` yoki `VERCEL_OIDC_TOKEN`.
To'liq ro'yxat: repo ildizidagi `.env.example`.

Model kaliti bo'lmasa server **ishga tushmaydi** va buni aniq aytadi.
Soxta (mock) model ataylab yo'q: u mijozga ilovasi ishlayotgandek
ko'rsatadi, aslida hech narsa yaratilmagan.

```
✗ Server ishga tushmadi

Model kaliti yo'q. AI_GATEWAY_API_KEY ni .env ga qo'shing yoki Vercel
loyihasini ulang (`vercel link` + `vercel env pull`).
```

---

## Tuzilish

```
src/
├── config/            sozlama — ishga tushishda zod bilan tekshiriladi
├── common/            filtr, pipe, interceptor, dekorator
├── infrastructure/    tashqi dunyo: database, crypto, workspace, llm
└── modules/           biznes: projects, agent, verify, billing, preview,
                       review, backend-connection, handoff, catalog, health
```

Bog'liqlik **faqat pastga**: `modules → infrastructure → common`.

---

## Hujjatlar

| Fayl | Nima uchun |
| --- | --- |
| [`docs/AI-GUIDE.md`](./docs/AI-GUIDE.md) | **AI shu fayldan boshlaydi** — qattiq qoidalar va taqiqlar |
| [`docs/API.md`](./docs/API.md) | Har endpointning so'rov va javob shakli |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Qatlamlar, agent tsikli, verify gate, byudjet |
| [`docs/DATABASE.md`](./docs/DATABASE.md) | Har jadval va ustun: nega bor |
| [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md) | Nomlash, izoh, xato, log, test |
| [`src/modules/agent/README.md`](./src/modules/agent/README.md) | Agent tsikli, tool'lar, promptlar |
| [`src/modules/billing/README.md`](./src/modules/billing/README.md) | Nima hisoblanadi, nima bepul |
| [`src/modules/review/README.md`](./src/modules/review/README.md) | Do'kon bandlari tekshiruvi |

---

## Uch qattiq qoida

Boshqalari `docs/AI-GUIDE.md` da. Bular — eng ko'p buziladiganlari.

| Qoida | Nega |
| --- | --- |
| **Mock ma'lumot yozilmaydi** | Soxta natija mijozga ilovasi tayyor deb ko'rsatadi. Bu mahsulotdagi eng qimmat xato turi |
| **Tekshiruvdan o'tmagan ish hisoblanmaydi** | Verify gate o'tmasa hisob 0 va o'zgarishlar bekor qilinadi. Bu mahsulotning markaziy va'dasi |
| **Vosita `node_modules/.bin` dan olinadi** | `npm exec` vosita topilmasa reyestrdan shu nomli paketni yuklab bajaradi — `tsc` uchun bu begona paket bo'lib chiqdi |

---

## Nega Nest CLI ishlatilmaydi

`@nestjs/cli` TypeScript 6 ning dasturiy kompilyator API'sini talab qiladi.
TS 7.0 faqat `tsc` ni beradi (API 7.1 da qaytadi), TS 6 ning esa barqaror
relizi yo'q.

Yechim: `tsc` bilan to'g'ridan-to'g'ri quramiz. `tsx` yoki `esbuild`
ishlatilmaydi — ular `emitDecoratorMetadata` ni bermaydi va NestJS'ning
turga asoslangan DI'si buziladi.

---

## Holati

MVP. Ishlab chiqarishga tayyor **emas**: autentifikatsiya yo'q
(`CurrentUser` doim `usr_demo` qaytaradi), agent kodi shu mashinada
konteynersiz ishlaydi, kalitlar uchun KMS yo'q, test yozilmagan.

To'liq ro'yxat: [`docs/AI-GUIDE.md`](./docs/AI-GUIDE.md) → «Hali
tugallanmagan joylar».
