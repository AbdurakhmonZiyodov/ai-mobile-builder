# 0015. Backend NestJS 12, lekin Nest CLI'siz

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `apps/api/package.json`, `apps/api/tsconfig.json` |
| **Bog'liq qarorlar** | [0007](./0007-hono-zod-trpc-emas.md), [0018](./0018-typescript-59-monorepoda.md), [0019](./0019-global-validationpipe-yoq.md) |

## Kontekst

Backend NestJS 12 ga ko'chirildi. Lekin `@nestjs/cli` TypeScript 6 ning
**dasturiy kompilyator API'sini** talab qiladi:

- TS 7.0 faqat `tsc` ni beradi — API 7.1 da qaytadi;
- TS 6 ning barqaror relizi yo'q, npm'da faqat `6.0.0-beta`.

Ya'ni Nest CLI bizdagi TypeScript versiyasi bilan ishlay olmaydi.

## Qaror

Nest CLI ishlatilmaydi — build to'g'ridan-to'g'ri `tsc` bilan bajariladi.
Dev rejimi: `tsc --watch` + `node --watch`.

## Sabab

Nest CLI faqat qulaylik qatlami; uning o'rniga `tsc` ni to'g'ridan-to'g'ri
chaqirish bir necha skript qatoriga tushadi. Kompilyator versiyasini CLI
tufayli orqaga surish esa butun monorepo'ga ta'sir qilardi.

**Diqqat:** `tsx` yoki `esbuild` ishlatilmaydi — ular `emitDecoratorMetadata`
ni bermaydi va NestJS'ning turga asoslangan DI'si buziladi.

Tekshirildi: `design:paramtypes` metadata TS 7 da chiqadi, DI ishlaydi.

## Oqibatlari

- `nest generate` kabi buyruqlar yo'q — modul/servis qo'lda yaratiladi.
- Dev rejimi ikki jarayondan iborat; `tsc --watch` yiqilsa `node --watch`
  eski `dist` bilan ishlashda davom etadi.
- **Qachon qayta ko'riladi:** TypeScript 7.1 kompilyator API'sini qaytargach,
  Nest CLI'ga qaytish mumkin bo'ladi.
