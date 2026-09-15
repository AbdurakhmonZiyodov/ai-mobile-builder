# 0018. Butun monorepo TypeScript 5.9 da

| | |
| --- | --- |
| **Holat** | Qabul qilindi · avvalgi «TS 7» qarorining o'rnini bosdi (2026-09-15) |
| **Sana** | 2026-09-15 |
| **Tegishli** | `package.json`, `apps/*/package.json`, `packages/*/package.json`, `apps/api/eslint.config.mjs` |
| **Bog'liq qarorlar** | [0009](./0009-typescript-59-shablonda.md), [0015](./0015-nestjs-cli-siz.md), [0019](./0019-global-validationpipe-yoq.md) |

## Kontekst

Dastlab monorepo TypeScript **7.0.2** ga o'tkazilgan edi. Yagona sabab:
`@nestjs/cli` va `@nestjs/schematics` `typescript >= 6.0.0` ni talab
qilardi, TS 6 ning esa barqaror relizi yo'q (npm'da faqat `6.0.0-beta`),
shuning uchun 7 tanlangan.

Keyin [0015](./0015-nestjs-cli-siz.md) da Nest CLI butunlay tashlandi —
u TS 6 ning **dasturiy kompilyator API'sini** talab qiladi, TS 7 esa
faqat `tsc` ni beradi.

Ya'ni TS 7 ni tanlash sababi yo'qoldi. Uning narxi esa keyin ma'lum bo'ldi:

**`typescript-eslint` TS 7 ni qo'llab-quvvatlamaydi.** Barcha versiyalar,
shu jumladan `canary`, `peer: typescript ">=4.8.4 <6.1.0"` talab qiladi.
Ya'ni backend'ni umuman lint qilib bo'lmasdi — `apps/api` da `lint`
skripti bor edi, lekin na konfiguratsiya, na bog'liqlik.

## Qaror

Butun monorepo — **TypeScript 5.9.3**. Expo shabloni ham 5.9 da
([0009](./0009-typescript-59-shablonda.md)), ya'ni endi repoda **bitta**
TypeScript versiyasi.

`apps/api` da haqiqiy ESLint konfiguratsiyasi qo'shildi
(`eslint.config.mjs`, `typescript-eslint` bilan).

## Sabab

- TS 7 ni tanlash sababi (Nest CLI) endi mavjud emas.
- Backend lint'siz qolishi — hujjatda lint qoidalari yozilgan repo uchun
  ziddiyat.
- Bitta versiya: shablon va monorepo bir xil, tuzoq kamayadi.
- TS 7 `baseUrl` ni olib tashlagan edi; 5.9 da u yana mavjud (hozircha
  ishlatilmaydi, nisbiy import'lar qoldi).

## Oqibatlari

- **`consistent-type-imports` qoidasi YOQILMAYDI.** NestJS DI
  `emitDecoratorMetadata` dan chiqadigan `design:paramtypes` ga tayanadi.
  Konstruktor parametri sintaktik jihatdan «faqat tur» bo'lib ko'rinadi,
  qoida uni `import type` ga aylantirishni taklif qiladi va `--fix` shuni
  qiladi. Natijada class chiqish JS'dan o'chadi, metadata `undefined`
  bo'ladi va ilova «Nest can't resolve dependencies» bilan ko'tarilmaydi.
  Buni amalda tekshirilgan: qoida 39 ta «xato» topgan, ularning bir
  qismi aynan DI konstruktorlari edi.
- TS 7 chiqqach qayta ko'riladi — shart: `typescript-eslint` uni
  qo'llab-quvvatlashi.
- Import kengaytmasi qoidasi o'zgarmadi:

| Loyiha | Modul rejimi | Kengaytma |
| --- | --- | --- |
| Backend | `NodeNext` | `.js` **majburiy** |
| `packages/*` | ESM paket | `.js` **majburiy** |
| Frontend | `bundler` | kengaytma **yo'q** |
