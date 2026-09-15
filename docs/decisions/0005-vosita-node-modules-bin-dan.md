# 0005. Workspace ichida vosita `node_modules/.bin` dan chaqiriladi

| | |
| --- | --- |
| **Holat** | Qabul qilindi · [0010](./0010-metro-keshi-loyihada.md) bilan birga kengaytirildi |
| **Sana** | 2026-09-14 (kengaytirildi 2026-09-15) |
| **Tegishli** | `apps/api/src/modules/verify/verify.service.ts`, `apps/api/src/infrastructure/workspace/drivers/local.driver.ts`, `apps/api/src/modules/preview/preview.service.ts` |
| **Bog'liq qarorlar** | [0006](./0006-workspace-symlink.md), [0013](./0013-verify-otkazib-yuborilgan-qadam.md) |

## Kontekst

Verify gate mijoz loyihasi ichida uchta vositani ishga tushiradi: `tsc`,
`eslint`, `expo`. Dastlab bu `npm exec` orqali qilingan edi va ketma-ket
ikkita xato chiqdi.

### Birinchi xato: `--` tushib qolishi

```bash
npm exec eslint . --max-warnings 0
```

npm `--max-warnings 0` ni **o'zining** bayrog'i deb oladi va ESLint «0»
nomli faylni qidiradi. Natijada verify gate soxta xato beradi, agent
tuzata olmaydigan narsani tuzatishga urinadi va uchta bepul urinishni
bekorga sarflaydi.

Vaqtincha yechim `npm exec -- eslint …` edi.

### Ikkinchi xato: reyestrdan begona paket

Bog'liqliklari yo'q workspace'da sinab ko'rilganda ma'lum bo'ldiki,
`npm exec -- tsc` **vositani topmasa, npm reyestridan `tsc` nomli paketni
yuklab ishga tushiradi**. U TypeScript emas — butunlay boshqa paket:

```
This is not the tsc command you are looking for
```

Ya'ni verify gate tasodifiy, biz tanlamagan kodni bajargan bo'lardi.

## Qaror

`npm exec` umuman ishlatilmaydi. Vosita loyihaning o'z
`node_modules/.bin` idan olinadi:

```ts
const bin = await ws.resolveBin("tsc");
if (!bin) {
  // Muhit nosozligi — tekshiruv o'tkazilmadi deb belgilanadi (0013)
}
await ws.exec(bin, ["--noEmit", "--pretty", "false"]);
```

## Sabab

- **Aniqlik.** Faqat loyihada o'rnatilgan vosita ishga tushadi, tarmoqqa
  chiqilmaydi.
- **Xavfsizlik.** Reyestrdan kod yuklab bajarish ehtimoli yo'qoladi.
- **`--` muammosi yo'qoladi.** Bayroqlar to'g'ridan-to'g'ri vositaga boradi.
- **Tezlik.** Vosita yo'q bo'lsa, javob 1 ms da keladi.

## Oqibatlari

- Workspace'ga bog'liqliklar symlink orqali keladi ([0006](./0006-workspace-symlink.md)).
  Symlink buzilsa, `resolveBin` `null` qaytaradi va run halol to'xtaydi.
- Yangi vosita qo'shilsa, u shablonning `package.json` ida bo'lishi shart —
  aks holda `resolveBin` uni topmaydi.
- `preview.service.ts` da ham xuddi shu yo'l ishlatiladi.
