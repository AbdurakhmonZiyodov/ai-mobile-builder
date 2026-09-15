# AI mobil ilova builder

Biznes g'oyasi bor odam ilovasini do'konga chiqarsin va **tirik ushlab tursin**.

> Boshqalar tez chiqarish uchun. Biz ishlab turishi uchun.

Dizaynda mahsulot nomi: **RIVO Builder**.

---

## Uchta loyiha

| Loyiha | Stek | Hujjatlar |
| --- | --- | --- |
| [`apps/web`](./apps/web) | Next.js 16 · React 19 · Tailwind v4 | [AI-GUIDE](./apps/web/docs/AI-GUIDE.md) · [DESIGN-SYSTEM](./apps/web/docs/DESIGN-SYSTEM.md) · [COMPONENTS](./apps/web/docs/COMPONENTS.md) |
| [`apps/api`](./apps/api) | NestJS 12 · Drizzle · AI Gateway | [AI-GUIDE](./apps/api/docs/AI-GUIDE.md) · [API](./apps/api/docs/API.md) · [DATABASE](./apps/api/docs/DATABASE.md) |
| [`templates/mobile`](./templates/mobile) | Expo SDK 57 · Expo Router | [AI-GUIDE](./templates/mobile/docs/AI-GUIDE.md) · [STRUCTURE](./templates/mobile/docs/STRUCTURE.md) · [BLOCKS](./templates/mobile/docs/BLOCKS.md) |

Har uchalasida `docs/AI-GUIDE.md` bor — **har qanday AI shu fayldan
boshlaydi** va loyihani tushunib ketadi.

## Umumiy paketlar

Paket faqat **ikki yoki undan ko'p** iste'molchisi bo'lsa yaratiladi.

| Paket | Nima |
| --- | --- |
| `@amb/core-rules` | Narx, o'zgarish hisobi, preview qarori, SDK reestri. **I/O yo'q** |
| `@amb/contracts` | Web ↔ API shartnomasi: zod sxemalar, SSE hodisalari |
| `@amb/blocks` | Bloklar reestri, preview belgisi va do'kon talablari bilan |
| `@amb/domains` | 5 domen paketi: model, oqimlar, eval ro'yxati |
| `@amb/design-tokens` | RIVO palitrasi va tipografiyasi |

`database`, `workspace`, `llm`, `verify`, `review` — paket **emas**, ular
NestJS ichidagi modullar: faqat backend ishlatadi.

---

## Ishga tushirish

### Talablar

| Nima | Versiya | Nega |
| --- | --- | --- |
| Node | **≥ 22** | AI SDK 7 talabi (`.nvmrc` bor: `nvm use`) |
| PostgreSQL | 16+ | Loyihalar, hisob, rad etishlar korpusi |
| git | har qanday | Har o'zgarish commit bo'ladi — Undo shunga tayanadi |

### Qadamlar

```bash
nvm use
npm install

cp .env.example .env
#  AI_GATEWAY_API_KEY va AMB_SECRET_KEY ni to'ldiring

createdb amb
npm run db:push

# Expo shabloni bir marta o'rnatiladi — workspace'lar shunga symlink qiladi
npm --prefix templates/mobile install

npm run dev        # api :4000 · web :3000
npm run dev:app    # yengilroq: faqat api va web
```

**Model kaliti bo'lmasa server ishga tushmaydi** va buni aniq aytadi.
Soxta model ataylab yo'q: u mijozga ilovasi ishlayotgandek ko'rsatadi,
aslida hech narsa yaratilmagan.

---

## Asosiy tsikl

```
Mijoz o'z tilida yozadi: «Sartaroshxonam bor, mijozlar navbat olsin»
  │
  ├─ domen aniqlanadi (booking), bloklar taklif qilinadi
  ├─ workspace shablondan yaratiladi                       ~0,2 s
  │
  └─ har xabar:
       tasniflash (arzon model)
         savol · noaniq · design mode  →  BEPUL, tugadi
       kontekst: DESIGN.md + PROJECT.md + MAP.md + 5 xabar + 3–8 fayl
       bajarish: edit_file — nuqtali diff
       verify gate: typecheck → lint → bundle
         o'tmadi → 3 ta BEPUL tuzatish → halol to'xtash
       git commit = versiya
       hisob: 1 o'zgarish
```

### Nima hisoblanadi

| Holat | Hisob |
| --- | --- |
| Savol, noaniq so'rov, design mode | 0 |
| Xato tuzatish | 0 |
| Verify gate o'tmadi | 0 |
| Diff bo'sh | 0 |
| Kichik / o'rta / katta o'zgarish | **1** |

Qaror bitta funksiyada: `@amb/core-rules` → `decideCharge()`.

---

## Buyruqlar

```bash
npm run dev         npm run build       npm run typecheck
npm run db:push     npm run db:studio
```

## Hujjatlar

| Fayl | Nima uchun |
| --- | --- |
| [`docs/STRUKTURA-TAKLIFI.md`](./docs/STRUKTURA-TAKLIFI.md) | Struktura va uning sabablari |
| [`docs/DECISIONS.md`](./docs/DECISIONS.md) | Qarorlar, spekdan chekinishlar, topilgan xatolar |
| [`docs/MVP-v1.2-spek.md`](./docs/MVP-v1.2-spek.md) | Mahsulot spetsifikatsiyasi |
