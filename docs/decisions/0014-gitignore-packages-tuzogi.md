# 0014. `!packages/` — global gitignore tuzog'i

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `.gitignore` |
| **Bog'liq qarorlar** | [0016](./0016-paket-ikki-istemolchida.md) |

## Kontekst

**Topilgan xato:** birinchi push'dan keyin GitHub'da **butun `packages/`
papkasi yo'q** edi — 41 ta manba fayl, mahsulotning yadrosi. Git hech qanday
ogohlantirish bermadi.

**Sabab:** `~/.gitignore_global` da Swift Package Manager uchun `Packages/`
qoidasi bor. macOS fayl tizimi registrga sezgir emas, shuning uchun git buni
bizning `packages/` ga ham qo'lladi.

## Qaror

Repo `.gitignore` iga `!packages/` qatori qo'shildi — repo qoidalari
global'dan ustun turadi.

Faqat **papkaning o'zi** qayta yoqiladi. `!packages/**` yozilmaydi.

## Sabab

`!packages/**` sinab ko'rildi va noto'g'ri chiqdi: u ichkaridagi `dist/` va
`node_modules/` qoidalarini ham bekor qiladi — natijada commitga **160 ta
ortiqcha fayl** tushdi.

`!packages/` esa faqat papkaga kirishni ochadi; ichkaridagi qoidalar o'z
kuchida qoladi.

## Oqibatlari

- **Diqqat:** bu tuzoq shu mashinadagi **har qanday Node monorepo**'ga
  tegadi. Yangi loyihada birinchi commitdan keyin tekshirish kerak:

  ```
  git ls-files | grep packages/
  ```

- Global gitignore o'zgarsa, bu qator kerak bo'lmay qolishi mumkin, lekin
  uni olib tashlashning foydasi yo'q.
