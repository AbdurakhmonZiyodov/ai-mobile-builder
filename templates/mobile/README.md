# Mijoz ilovasi shabloni

Expo SDK 57 · TypeScript strict · Expo Router · @expo/ui

Har yangi loyiha shundan nusxa olinadi. **Bu mijozning ilovasi** — u uni
App Store va Google Play'ga chiqaradi.

## Ishga tushirish

```bash
npm install
npx expo start
```

## Tekshiruv (verify gate shu uchtasini yuritadi)

```bash
npx tsc --noEmit
npx eslint . --max-warnings 0
npx expo export --platform web --output-dir .amb-web
```

## Tuzilish

```
app/      Expo Router — faqat ekranlar
src/
├── components/   UI qismlari
├── features/     domen mantiqi
├── blocks/       tayyor bloklar
├── lib/          theme, supabase, format
└── types/
```

## Hujjatlar

| Fayl | Nima uchun |
| --- | --- |
| [`docs/AI-GUIDE.md`](./docs/AI-GUIDE.md) | **Agent shu fayldan boshlaydi** |
| [`docs/STRUCTURE.md`](./docs/STRUCTURE.md) | Kod qayerga yoziladi |
| [`docs/STYLE-GUIDE.md`](./docs/STYLE-GUIDE.md) | Ranglar, oraliq, tipografiya |
| [`docs/BLOCKS.md`](./docs/BLOCKS.md) | Bloklar qanday ishlaydi |
| [`docs/STORE-RULES.md`](./docs/STORE-RULES.md) | Apple va Google talablari |
| [`SDK.md`](./SDK.md) | Nega SDK qotirilgan |
