# Mijoz ilovasi shabloni

Expo SDK 57 · React Native 0.86 · React 19 · TypeScript strict · Expo Router · New Architecture

Har yangi loyiha shundan nusxa olinadi. **Bu mijozning ilovasi** — u uni
App Store va Google Play'ga chiqaradi.

> Agent bo'lsangiz — [`docs/AI-GUIDE.md`](./docs/AI-GUIDE.md) dan boshlang.
> U yerda **qattiq qoidalar** bor va ular tavsiya emas.

## Ishga tushirish

```bash
npm ci          # yoki: npm install — mavjud bog'liqliklarni o'rnatadi
npx expo start  # QR kod: telefonda Expo Go bilan oching
```

**Yangi paket qo'shish boshqa buyruq:** `npx expo install <paket>`.
`npm install <paket>` **ishlatilmaydi** — sababi [`SDK.md`](./SDK.md) da.

## Tekshiruv (verify gate aynan shu uchtasini yuritadi)

```bash
npx tsc --noEmit --pretty false
npx eslint . --max-warnings 0
npx expo export --platform web --output-dir .amb-bundle
```

Uchalasi `apps/api` dagi verify gate'da shu tartibda ishlaydi: typecheck
yiqilsa lint o'tkazib yuboriladi (bitta tur xatosi o'nlab lint xabarini
keltiradi va modelni chalg'itadi), ikkalasi o'tmasa bundle ishlamaydi.

**Bundle qadami — veb eksporti.** U JS xatosini tutadi, lekin native
tomonni sinamaydi. Ya'ni «verify o'tdi» degani «iOS'da ishlaydi» degani
emas — buni E2E tekshiruv agenti aytadi.

## Tuzilish

```
app/                Expo Router — faqat ekranlar
├── _layout.tsx       ← QOTIRILGAN
├── (app)/_layout.tsx ← QOTIRILGAN
├── (app)/index.tsx
├── (app)/settings.tsx
└── +not-found.tsx
src/
├── components/     button · card · screen · empty-state
├── features/       domen mantiqi: <soha>/use-<narsa>.ts
├── lib/            theme · supabase · format
└── types/
```

`src/blocks/` va `src/hooks/` shablonda yo'q — loyiha yaratilganda hosil
qilinadi. Batafsil: [`docs/STRUCTURE.md`](./docs/STRUCTURE.md).

## Sozlama fayllari — tegilmaydi

| Fayl | Nima qiladi | Tegilsa nima bo'ladi |
| --- | --- | --- |
| `metro.config.js` | Metro keshini loyiha ichida (`.amb-cache`) saqlaydi | Loyihalar bir-birining eski bundle'ini ko'rsatadi |
| `eslint.config.js` | Verify gate'ning lint qadami | Gate o'z qoidasini yo'qotadi |
| `tsconfig.json` | `strict`, `noUncheckedIndexedAccess`, `@/*` taxalluslari | Import yo'llari buziladi |
| `app/_layout.tsx` | Ildiz navigatsiya + URL polyfill | Tarmoq so'rovlari jim ishlamay qoladi |

## Hujjatlar

| Fayl | Nima uchun |
| --- | --- |
| [`docs/AI-GUIDE.md`](./docs/AI-GUIDE.md) | **Agent shu fayldan boshlaydi** — qattiq qoidalar |
| [`docs/STRUCTURE.md`](./docs/STRUCTURE.md) | Kod qayerga yoziladi |
| [`docs/STYLE-GUIDE.md`](./docs/STYLE-GUIDE.md) | Ranglar, oraliq, tipografiya, `@expo/ui` |
| [`docs/BLOCKS.md`](./docs/BLOCKS.md) | Bloklar qanday ishlaydi |
| [`docs/STORE-RULES.md`](./docs/STORE-RULES.md) | Apple va Google talablari — qaysi kod qoplaydi |
| [`SDK.md`](./SDK.md) | Nega SDK qotirilgan, paket qanday qo'shiladi |

> Topshirish paketi yaratilganda bu `README.md` loyihaga moslangan
> variant bilan **qayta yoziladi** (`ARCHITECTURE.md` va `HANDOFF.md`
> bilan birga). Shu sababli bu yerga yagona nusxadagi ma'lumot yozilmaydi.
