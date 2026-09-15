# 0002. Design mode'da agentga tahrir tool'lari berilmaydi

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-14 |
| **Tegishli** | `apps/api/src/modules/agent/tools/tool.types.ts` -> `ToolContext.readOnly` |
| **Bog'liq qarorlar** | [0001](./0001-sinov-tarifi-besh-ozgarish.md) |

## Kontekst

Spekda: «Design mode bepul — ekranlarni ko'rish, fikr o'zgartirish, cheksiz».

Hisob qoidasi design mode'ni 0 deb belgilaydi. Agar agent shu rejimda ham
`edit_file` ni ishlata olsa, mijoz har so'roviga «design mode» belgisini
qo'yib **cheksiz bepul o'zgarish** oladi. Bu to'g'ridan-to'g'ri marja teshigi.

## Qaror

Design mode'da agentga beriladigan tool to'plami cheklanadi: faqat o'qish
tool'lari va `update_design_note` (DESIGN.md ga yozish). Ilova kodiga
tegilmaydi.

## Sabab

Bepul rejimni «hisoblanmaydi» deb belgilashning o'zi yetarli emas — chegara
**imkoniyat darajasida** qo'yilishi kerak. Hisob qoidasiga tayanib qolsak,
rejim nomini so'rovga yozishning o'zi pulli ishni bepul qiladi.

Cheklov agent ishga tushishidan oldin `ToolContext.readOnly` orqali
qo'yiladi — ya'ni agent «yozmaslikka harakat qilmaydi», unga yozish tool'i
umuman berilmaydi.

## Oqibatlari

- Design mode haqiqatan ham cheksiz va bepul bo'la oladi, chunki u hech qachon
  kod o'zgartirmaydi.
- Mijoz design mode'da kelishilgan fikrni ilovaga tushirish uchun oddiy
  rejimga o'tishi va bitta o'zgarish sarflashi kerak — bu kutilgan xatti-harakat.
- Yangi tool qo'shilganda uni design mode'da ham ochish/ochmaslik savoli
  har safar ko'tariladi: standart javob — ochilmaydi.
