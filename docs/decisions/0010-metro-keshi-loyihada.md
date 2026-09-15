# 0010. Metro keshi har loyihada alohida

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `templates/mobile/metro.config.js` |
| **Bog'liq qarorlar** | [0006](./0006-workspace-symlink.md), [0013](./0013-verify-otkazib-yuborilgan-qadam.md) |

## Kontekst

**Topilgan xato (ishga tushirish paytida):** mijoz o'zgarish kiritadi,
preview «muvaffaqiyatli» yig'iladi (1.3 s), lekin **eski ilovani** ko'rsatadi.

**Sabab:** Metro keshi tizim temp papkasida — `$TMPDIR/metro-cache` — ya'ni
barcha loyihalarga umumiy. Bu [0006](./0006-workspace-symlink.md) dagi
symlink yechimining yon ta'siri: workspace'lar bir-biridan to'liq ajralmagan.

**Nega jiddiy:** bu mahsulotning eng yomon nosozlik turi — «AI tuzatdim dedi,
hech narsa o'zgarmadi». Spek aynan shuni taqiqlaydi (8.3-band). Bundan
tashqari bir mijozning bundle'i boshqasiga tushishi mumkin edi — bu
allaqachon xavfsizlik masalasi.

## Qaror

`metro.config.js` kesh papkasini loyihaning o'ziga — `.amb-cache` ga —
qo'yadi. Yo'l `__dirname` dan quriladi, u esa har workspace uchun boshqa,
demak kesh ham ajralgan.

## Sabab

Keshni butunlay o'chirish (`--clear`) muammoni yechardi, lekin har
o'zgarishga sekundlar qo'shardi. Keshni **ajratish** esa ikkala maqsadni
ham beradi.

Tekshirildi: o'zgarish `--clear` siz ham **1.7 s** da chiqadi.

## Oqibatlari

- Har workspace o'z kesh papkasini saqlaydi — disk sarfi loyihalar soniga
  qarab o'sadi; workspace o'chirilganda kesh ham u bilan ketadi.
- Shablonning `metro.config.js` iga tegilganda bu sozlama saqlanishi shart.
- Konteyner izolyatsiyasiga o'tilganda bu qaror kerak bo'lmay qolishi mumkin,
  lekin zarar ham qilmaydi.
