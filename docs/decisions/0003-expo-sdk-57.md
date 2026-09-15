# 0003. Expo SDK 57, 56 emas

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-14 |
| **Tegishli** | `packages/core-rules/src/sdk.ts`, `templates/mobile/package.json` |
| **Bog'liq qarorlar** | [0009](./0009-typescript-59-shablonda.md), [0018](./0018-typescript-59-monorepoda.md) |

## Kontekst

Spek bo'yicha `@expo/ui` SDK 56 dan boshlab stabil. Lekin SDK 56 da Hermes
V1 xotira regressiyasi bor; u SDK 57 da tuzatilgan.

## Qaror

Standart SDK — **57**. Reestrda 56 ham qo'llab-quvvatlanadi («bir vaqtda
ko'pi bilan ikkita SDK» qoidasi).

## Sabab

SDK 57 ikkala shartni ham bajaradi: `@expo/ui` bor va Hermes regressiyasi
yo'q. 56 ni tashlab yubormaslik sababi — mavjud loyihalar birdan
majburlanmasligi kerak.

**Amaliy tafsilot:** SDK 55 dan boshlab barcha `expo-*` paketlar SDK bilan
bir xil major versiyada bo'ladi. Ya'ni `expo-router@57.x`, `@7.x` emas.
Shablon shunga moslangan.

## Oqibatlari

- Yangi paket faqat `npx expo install` bilan qo'shiladi — `npm install` mos
  versiyani tanlamaydi va SDK bilan to'qnashadi.
- Bir vaqtda ikkitadan ko'p SDK saqlanmaydi: 58 chiqqanda 56 reestrdan
  chiqariladi.
- Shablonning TypeScript versiyasi ham SDK'ga bog'liq — qarang
  [0009](./0009-typescript-59-shablonda.md).
