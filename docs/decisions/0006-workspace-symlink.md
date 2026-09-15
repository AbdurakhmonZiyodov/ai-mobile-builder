# 0006. Workspace bog'liqliklari — symlink

| | |
| --- | --- |
| **Holat** | Qabul qilindi (MVP uchun vaqtinchalik) |
| **Sana** | 2026-09-14 |
| **Tegishli** | `apps/api/src/infrastructure/workspace/drivers/local.driver.ts` |
| **Bog'liq qarorlar** | [0010](./0010-metro-keshi-loyihada.md) |

## Kontekst

Spekda: «Isitilgan hovuz 1-haftada», «sovuq start 3 daqiqadan oshsa
mijozning yarmi ketadi».

Yangi loyiha yaratilganda unga `node_modules` qayerdan keladi degan savol
bor. Uchta variant o'lchandi:

| Yondashuv | Vaqt |
| --- | --- |
| `npm install` | 36 s |
| APFS clone (`COPYFILE_FICLONE`) bilan nusxalash | 9.8 s |
| Symlink | **0 ms** |

## Qaror

MVP'da shablonning `node_modules` iga **symlink** qo'yiladi. Loyiha yaratish
jarayoni 0.2 s da tugaydi.

## Sabab

Sovuq start vaqti mahsulotning o'lim ko'rsatkichi. 36 soniya ham, 10 soniya
ham «birinchi preview < 90 soniya» byudjetining katta qismini yeydi —
symlink esa uni umuman yemaydi.

## Oqibatlari

**Cheklovi:** bog'liqliklar shablon bilan **umumiy**. Workspace ichida yangi
paket o'rnatishdan oldin `isolateDependencies()` chaqirilishi **shart** —
aks holda bitta mijozning o'rnatgan paketi hammaga tarqaladi.

Yon ta'sir: umumiy holat faqat `node_modules` bilan cheklanmaydi. Metro keshi
ham tizim bo'ylab umumiy bo'lgani sababli boshqa loyihaning bundle'i
ko'rsatilib qolgan edi — qarang [0010](./0010-metro-keshi-loyihada.md).

**Qachon qayta ko'riladi:** ishlab chiqarishda symlink o'rnini Docker obrazi
qatlami egallaydi — o'shanda bu qaror kuchdan qoladi.
