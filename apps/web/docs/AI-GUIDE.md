# AI uchun qo'llanma — frontend

> Bu loyihada ishlaydigan har qanday AI SHU FAYLDAN boshlaydi.

## Nima bu

RIVO Builder'ning veb interfeysi. Mijoz — **texnik bo'lmagan biznes egasi**.
U kod ko'rmaydi, atama bilmaydi va shoshilinch. Har ekran uchta savolga
javob berishi kerak:

1. Qancha turadi?
2. Qachon tayyor bo'ladi?
3. Ishlamasa nima bo'ladi?

## Tuzilish

```
src/
├── app/          FAQAT marshrutlar. Mantiq yo'q, faqat ma'lumot olish va
│                 xususiyat komponentiga uzatish
├── features/     xususiyat bo'yicha ajratilgan — sahifa bo'yicha EMAS
└── shared/       ui (dizayn tizimi), api (tiplangan mijoz), hooks, lib
```

**Nega xususiyat bo'yicha:** «workspace» bitta ekran emas — u telefon
ramkasi, chat qoplamasi, yuqori panel va SSE hook'idan iborat. Ularni
`components/` va `hooks/` papkalariga sochib tashlasak, birini o'zgartirish
uchun uch joyga qarash kerak bo'ladi.

## Yangi kod qayerga

| Nima | Qayerga |
| --- | --- |
| Yangi sahifa | `app/(guruh)/<yo'l>/page.tsx` — faqat ma'lumot olish |
| Sahifa mantiqi | `features/<xususiyat>/<nom>-view.tsx` |
| Qayta ishlatiladigan tugma, karta | `shared/ui/` |
| API chaqiruvi | `shared/api/endpoints.ts` — komponentda `fetch` yozmang |
| Hodisa oqimi mantiqi | `features/workspace/hooks/` |

## Qattiq qoidalar

1. **Texnik atama ishlatmang.** «E2E», «typecheck», «bundle», «RLS»,
   «deploy» — bular mijoz tilida emas. Tarjima jadvali:
   `features/workspace/timeline.ts`.

2. **Qo'lda yozilgan raqam yo'q.** Narx, blok nomi, SDK versiyasi —
   hammasi `@amb/core-rules`, `@amb/blocks` yoki API'dan keladi.

3. **Mock ma'lumot yo'q.** Backend o'chiq bo'lsa, sahifa buni ochiq
   aytadi. Soxta ro'yxat ko'rsatish mijozni chalg'itadi.

4. **Import'da `.js` kengaytmasi YO'Q.** Bu yerda `moduleResolution:
   bundler`. (Backend'da teskarisi.)

5. **Ranglar faqat token orqali:** `bg-surface`, `text-ink-muted`,
   `border-line`. `bg-[#F7F4EE]` yozmang.

6. **Har komponent ustida o'zbekcha izoh** — nega shunday qilinganini
   tushuntiradi.

## Nima qilish TAQIQLANGAN

- `any` turi
- Komponent ichida to'g'ridan-to'g'ri `fetch`
- Yangi UI kutubxona qo'shish (Tailwind + o'z komponentlarimiz yetarli)
- Sahifada ikkita asosiy (`primary`) tugma
- Faqat rangga tayangan holat belgisi — matn ham bo'lsin

## Keyin nimani o'qish

| Savol | Fayl |
| --- | --- |
| Ranglar, shrift, oraliq? | [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) |
| Qaysi komponent qachon? | [`COMPONENTS.md`](./COMPONENTS.md) |
| Ma'lumot qanday oqadi? | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Backend nima beradi? | `../../api/docs/API.md` |
