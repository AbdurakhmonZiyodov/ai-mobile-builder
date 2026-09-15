# 0019. Global `ValidationPipe` ishlatilmaydi

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `apps/api/src/common/pipes/zod-validation.pipe.ts`, `apps/api/src/common/pipes/zod-message.uz.ts` |
| **Bog'liq qarorlar** | [0007](./0007-hono-zod-trpc-emas.md), [0015](./0015-nestjs-cli-siz.md) |

## Kontekst

NestJS'ning standart `ValidationPipe` i `class-validator` ni talab qiladi.
Bizda esa validatsiya **zod** bilan va sxemalar `@amb/contracts` da —
frontend ham aynan o'shalarni ishlatadi.

## Qaror

Global `ValidationPipe` o'rniga o'z `ZodValidationPipe` imiz. Kiruvchi
ma'lumot `@amb/contracts` dagi sxema bo'yicha tekshiriladi.

Zod xabarlari `common/pipes/zod-message.uz.ts` da o'zbek tiliga o'giriladi:
«Expected string, received undefined» emas, «To'ldirilishi shart».

## Sabab

`class-validator` ni qo'shsak, bitta shakl uchun **ikkita** tekshiruv
ta'rifi paydo bo'ladi: DTO klassidagi dekoratorlar va zod sxemasi. Ular vaqt
o'tib bir-biridan uzoqlashadi, xato esa ish vaqtida — mijozda — chiqadi.

Xabarlarning o'zbekchaligi alohida sabab: validatsiya xatosi ko'pincha
to'g'ridan-to'g'ri mijozga ko'rinadi.

## Oqibatlari

- Nest'ning DTO klasslariga asoslangan ba'zi qulayliklari (masalan
  `class-transformer` ) ishlatilmaydi.
- Yangi endpoint qo'shilganda sxema avval `@amb/contracts` da yoziladi,
  keyin kontrollerga ulanadi — tartib shu.
- Yangi turdagi zod xatosi chiqsa, uning o'zbekcha matni
  `zod-message.uz.ts` ga qo'shilishi kerak.
