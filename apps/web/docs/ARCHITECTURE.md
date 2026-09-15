# Arxitektura — frontend

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript 7

## Ma'lumot oqimi

```
Server komponent (app/…/page.tsx)
   │ fetch(API_URL) — cache: "no-store"
   ▼
Xususiyat komponenti ("use client")
   │ shared/api/endpoints.ts
   ▼
Backend (NestJS :4000)
```

Agent uchun alohida yo'l:

```
useAgentRun (hook)
   │ streamAgent() — POST + SSE
   ▼
toTimelineEntry() — texnik hodisa → o'zbekcha matn
   ▼
ChatOverlay
```

## Nega ma'lumot serverda olinadi

Mijoz sahifani ochganda ilovasi va qoldig'i **darhol** ko'rinadi.
«Yuklanmoqda» holati bo'lmaydi — bu 90 soniyalik birinchi taassurot
byudjetiga kiradi.

## Marshrutlar

| Yo'l | Ekran | Render |
| --- | --- | --- |
| `/` | Landing + prompt | Statik |
| `/narx` | Narx | Statik |
| `/loyihalarim` | Loyihalar ro'yxati | Server |
| `/loyiha/[id]` | Workspace | Server + client |

Guruhlar: `(marketing)` va `(workspace)` — URL'ga ta'sir qilmaydi, faqat
fayllarni ajratadi.

## Nega o'z API mijozimiz

Bizga faqat uchta narsa kerak: GET, POST va SSE oqimi. Kutubxona
keltiradigan kesh va qayta urinish mantiqi bu yerda foyda bermaydi —
agent so'rovlari uzun va takrorlanmaydi.

Endpointlar `shared/api/endpoints.ts` da bitta joyda. Komponent hech qachon
`fetch("/projects")` yozmaydi: endpoint o'zgarsa, TypeScript qolgan
joylarni ko'rsatadi.

## Xato holatlari

Uchta alohida holat, uchta alohida xabar:

| Holat | Xabar |
| --- | --- |
| Backend o'chiq | «Serverga ulanib bo'lmadi» |
| Ma'lumot yo'q | «Hozircha bo'sh» |
| Xato | Backend'ning `messageUz` xabari |

Ularni aralashtirish mijozni chalg'itadi: «bo'sh» va «ulanmadi» — butunlay
boshqa narsa.

## Preview kesh buzuvchisi

```ts
setPreviewUrl(`${result.url}?v=${Date.now()}`);
```

Bir xil URL bo'lsa brauzer eski sahifani ko'rsatadi va mijoz
o'zgarishini ko'rmaydi. Bu amalda uchragan xato.
