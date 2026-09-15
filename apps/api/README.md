# @amb/api — orkestrator backend

NestJS 12 · TypeScript 7 · PostgreSQL + Drizzle · Vercel AI Gateway

Mijoz o'z tilida biznesini aytadi → biz Expo ilovasini quramiz, tekshiramiz
va do'konga chiqaramiz. Bu backend kod yozmaydi — **model yozadi**, backend
esa unga kontekst tayyorlaydi, tool beradi, natijani tekshiradi va hisobni
yuritadi.

## Ishga tushirish

```bash
npm run dev      # tsc --watch + node --watch
npm run build
npm run db:push
```

Model kaliti bo'lmasa server **ishga tushmaydi** va buni aniq aytadi.
Soxta (mock) model ataylab yo'q: u mijozga ilovasi ishlayotgandek
ko'rsatadi, aslida hech narsa yaratilmagan.

```
✗ Server ishga tushmadi

Model kaliti yo'q. AI_GATEWAY_API_KEY ni .env ga qo'shing yoki Vercel
loyihasini ulang (`vercel link` + `vercel env pull`).
```

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

## Hujjatlar

| Fayl | Nima uchun |
| --- | --- |
| [`docs/AI-GUIDE.md`](./docs/AI-GUIDE.md) | **AI shu fayldan boshlaydi** |
| [`docs/API.md`](./docs/API.md) | Har endpoint: nima, nega, misol |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Qatlamlar, agent tsikli, byudjet |
| [`docs/DATABASE.md`](./docs/DATABASE.md) | Har jadval nega bor |
| [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md) | Nomlash, izoh, xato, test |

## Nega Nest CLI ishlatilmaydi

`@nestjs/cli` TypeScript 6 ning dasturiy kompilyator API'sini talab
qiladi. TS 7.0 faqat `tsc` ni beradi (API 7.1 da qaytadi), TS 6 ning
esa barqaror relizi yo'q.

Yechim: `tsc` bilan to'g'ridan-to'g'ri quramiz. `tsx` yoki `esbuild`
ishlatilmaydi — ular `emitDecoratorMetadata` ni bermaydi va NestJS'ning
turga asoslangan DI'si buziladi.
