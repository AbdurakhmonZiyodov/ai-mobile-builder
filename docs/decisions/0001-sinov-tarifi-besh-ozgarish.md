# 0001. Sinov tarifi 0 emas, 5 o'zgarish

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-14 |
| **Tegishli** | `packages/core-rules/src/pricing.ts` -> `PLANS.trial.includedChanges` |
| **Bog'liq qarorlar** | [0002](./0002-design-mode-faqat-oqish.md) |

## Kontekst

Spekda sinov tarifi shunday yozilgan:

> «Sinov · $0 · Design mode cheksiz, veb preview, telefonda ko'rish, kod ko'rish. **Build yo'q**».

«Build yo'q» — bu do'konga chiqarish yo'q degani. Lekin uni «0 o'zgarish» deb
o'qisak, mijoz o'z g'oyasini umuman ko'ra olmaydi: birinchi so'rovi ham
bloklanadi.

## Qaror

Sinov tarifiga **5 o'zgarish** beriladi. `canBuild: false` saqlanib qoladi —
EAS build ham, do'konga chiqarish ham yo'q.

## Sabab

Spek «build yo'q» degan, «o'zgarish yo'q» degan emas. Birinchi so'rovni
bloklash mahsulotning ikki asosiy va'dasiga zid:

- «G'oyani bir kunda ko'rish»;
- «birinchi preview < 90 soniya».

Pulsiz mijoz 5 marta ilovasini haqiqatda o'zgartirib ko'radi, lekin do'konga
chiqara olmaydi — pulli tarifga o'tish sababi shu yerda qoladi.

## Oqibatlari

- Har bir sinov mijozi eng ko'pi 5 ta agent tsikli xarajatini keltiradi —
  bu tanish va o'lchanadigan chegara.
- Raqamni o'zgartirish uchun faqat bitta joyga tegiladi:
  `PLANS.trial.includedChanges`. Hisob mantig'i (`decideCharge()`) o'zgarmaydi.
- Qayta ko'rish sababi: sinovdan pulli tarifga o'tish ulushi o'lchanganda
  5 raqami kam yoki ko'p ekani ko'rinadi.
