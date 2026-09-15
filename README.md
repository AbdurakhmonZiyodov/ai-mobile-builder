# AI mobil ilova builder

Biznes g'oyasi bor odam ilovasini do'konga chiqarsin va **tirik ushlab tursin**.

> Boshqalar tez chiqarish uchun. Biz ishlab turishi uchun.

Spek: [`docs/MVP-v1.2-spek.md`](docs/MVP-v1.2-spek.md) · Qarorlar: [`docs/DECISIONS.md`](docs/DECISIONS.md)

---

## Talablar

| Nima | Versiya | Nega |
| --- | --- | --- |
| Node | **>= 22** | AI SDK 7 shuni talab qiladi (`.nvmrc` bor: `nvm use`) |
| PostgreSQL | 16+ | Loyihalar, xabarlar, hisob, rad etishlar korpusi |
| git | har qanday | Har o'zgarish commit bo'ladi — Undo/Revert shunga tayanadi |

## Ishga tushirish

```bash
nvm use                      # Node 22
npm install
cp .env.example .env         # AMB_SECRET_KEY ni to'ldiring

createdb amb
npm run db:push              # sxemani yuklash

# Expo shabloni bir marta o'rnatiladi — workspace'lar shunga symlink qiladi
npm --prefix templates/expo-base install

npm run dev                  # api :4000 · web :3000
npm run dev:app              # yengilroq: faqat api va web, paketlarni kuzatmasdan
```

Model kaliti bo'lmasa tizim **mock provayderda** ishlaydi: tasniflash, tool chaqirish,
verify gate, git versiya va o'zgarish hisobi — hammasi kalitsiz sinaladi.
Haqiqiy generatsiya uchun `.env` ga `AI_GATEWAY_API_KEY` yoki `ANTHROPIC_API_KEY`
qo'shing va `AMB_MODEL_PROVIDER` ni bo'sh qoldiring.

## Monorepo tuzilishi

```
apps/
  web/              Next.js — chat, preview, fayl daraxti, qoldiq ko'rsatkichi
  api/              Hono — orkestrator, SSE oqimi, workspace boshqaruvi

packages/
  shared/           Narx, "o'zgarish" hisobi, preview qarori, SDK reestri, SSE hodisalari
  db/               Postgres sxemasi (Drizzle) + mijoz kalitlarini shifrlash
  ai/               Model qatlami: generate(messages, tools, tier) + mock provayder
  agent/            Agent yadrosi: tasniflash -> kontekst -> tsikl -> verify -> hisob
  workspace/        Izolyatsiyalangan FS, git versiyalar, MAP.md
  verify/           Verify gate: typecheck, lint, bundle
  blocks/           Bloklar reestri (preview belgisi va do'kon talablari bilan)
  domains/          5 domen paketi: model, oqimlar, eval ro'yxati
  review-checker/   Apple bandlari tekshiruvi (4.2, 4.3, 2.1, 3.1.1, 5.1.1...)

templates/
  expo-base/        Expo SDK 57 shabloni — har loyiha shundan yaratiladi
```

## Asosiy tsikl

```
Mijoz xabari
  -> tasniflash (arzon model): savol | noaniq | kichik | o'rta | katta
  -> noaniq bo'lsa: aniqlashtiruvchi savol — BEPUL, tsikl tugaydi
  -> kontekst: DESIGN.md + PROJECT.md + MAP.md + oxirgi 5 xabar + 3-8 fayl
  -> bajarish: edit_file (nuqtali diff), to'liq qayta yozish TAQIQLANGAN
  -> verify gate: typecheck -> lint -> bundle
  -> o'tmasa: 3 urinish BEPUL tuzatish, keyin halol to'xtash
  -> o'tsa: git commit = versiya
  -> hisob: 1 o'zgarish. Diff bo'sh bo'lsa yoki gate o'tmasa — 0
```

## API

| Marshrut | Nima qiladi |
| --- | --- |
| `POST /projects` | Loyiha yaratadi, domen paketini taxmin qiladi, workspace ochadi |
| `POST /chat` | Agent tsikli — **SSE oqimi** |
| `GET /preview/:id` | Qaysi preview yo'li va **nima uchun** (bir jumlada) |
| `POST /preview/:id/web` | Veb preview yig'adi |
| `GET /review/:id` | Review Checker — do'kon bandlari |
| `POST /handoff/:id` | Dasturchiga topshirish paketi |
| `POST /backend/:id` | Mijozning Supabase/Firebase kalitlari (shifrlangan) |
| `POST /backend/:id/burn-service-role` | `service_role` kalitini o'chirish |
| `GET /projects/:id/usage` | AI xarajati va o'zgarish boshiga narx |
| `GET /catalog/*` | Bloklar, domenlar, narx, preview yo'llari, SDK'lar |

## Buyruqlar

```bash
npm run dev         # hammasi
npm run build       # hammasi
npm run typecheck
npm run db:push     # sxemani yangilash
npm run db:studio
```
