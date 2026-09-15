# 0009. Shablonda TypeScript 5.9, `expo install --check` esa 6.0.3 so'raydi

| | |
| --- | --- |
| **Holat** | Qabul qilindi · [0018](./0018-typescript-59-monorepoda.md) bilan kengaytirildi |
| **Sana** | 2026-09-14 |
| **Tegishli** | `templates/mobile/package.json` -> `typescript` |
| **Bog'liq qarorlar** | [0003](./0003-expo-sdk-57.md), [0018](./0018-typescript-59-monorepoda.md) |

## Kontekst

Expo 57 `typescript@~6.0.3` ni kutadi va `expo install --check` shuni
so'raydi. Lekin npm'da TypeScript 6 ning **stabil relizi yo'q** — faqat
`6.0.0-beta` va dev build'lar; `latest` esa 7.0.2.

## Qaror

Shablon TypeScript **5.9.3** da qoladi. Unda typecheck toza o'tadi.

## Sabab

Beta kompilyatorga mijoz loyihalarini bog'lab bo'lmaydi. `expo install --check`
ning ogohlantirishi esa faqat tavsiya — u build'ni to'xtatmaydi.

## Oqibatlari

- `expo install --check` shablonda ogohlantirish beradi; bu kutilgan holat,
  xato emas.
- **Qachon qayta ko'riladi:** TypeScript 6 ning stabil relizi chiqqach.
- Monorepo'ning o'zi boshqa versiyada turadi — qarang
  [0018](./0018-typescript-59-monorepoda.md).
