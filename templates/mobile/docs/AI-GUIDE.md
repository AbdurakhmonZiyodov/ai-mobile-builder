# AI uchun qo'llanma — mijoz ilovasi

> **Agent shu fayldan boshlaydi.** Bu — mijozning ilovasi, bizning
> mahsulotimiz emas. U buni App Store va Google Play'ga chiqaradi va
> unda buzuq narsa qolsa, pulini biz qaytaramiz.

Expo SDK 57 · React Native 0.86 · TypeScript strict · Expo Router.

## Quyidagi qoidalar tavsiya emas

Har qoidaning ostida sabab bor. Sababni o'qing: shunda chetlab o'tish
kerak bo'lgan holatni ham, o'tmaslik kerak bo'lgan holatni ham farqlaysiz.
Qoida bilan vazifa to'qnashsa — **qoida yutadi**, vazifani boshqacha bajaring.

---

## 1. TEGILMAYDIGAN FAYLLAR

| Fayl | Nega |
| --- | --- |
| `app/_layout.tsx` | Ildiz navigatsiya **va** `react-native-url-polyfill/auto` importi. AI eng ko'p xatoni navigatsiyada qiladi: orqaga qaytish buziladi, ilova yopiladi |
| `app/(app)/_layout.tsx` | Ilova bo'limi navigatsiyasi. Yuqoridagi bilan bir xil sabab |
| `metro.config.js` | Metro keshini `.amb-cache` ga qotiradi. Standart kesh tizim temp'ida — barcha loyihalarga umumiy. Tegilsa: mijoz o'zgarish kiritadi, preview «muvaffaqiyatli» yig'iladi va **eski ilovani** ko'rsatadi |
| `eslint.config.js` | Verify gate'ning lint qadami shu fayl bo'yicha ishlaydi |
| `tsconfig.json` | `strict`, `noUncheckedIndexedAccess`, `@/*` taxalluslari |
| `package.json` → `dependencies` | Qarang: 2-qoida |

Bu fayllarga ekran qo'shish uchun tegish shart emas: Expo Router
**fayl asosida** ishlaydi — `app/(app)/bron.tsx` yaratilsa, `/bron`
marshruti o'zi paydo bo'ladi.

## 2. YANGI PAKET QO'SHILMAYDI

`package.json` ga qator qo'shish **hech narsa o'rnatmaydi**:

- Agentda terminal yo'q — vositalari faqat fayl bilan ishlaydi.
- Har workspace'ning `node_modules` i shablonga **symlink**. Yozilgan
  qator o'rnatilmaydi, import yig'ilishda yiqiladi, verify gate qizil
  bo'ladi va urinish behuda ketadi.

Yangi paket ilovaga **faqat blok orqali** keladi ([`BLOCKS.md`](./BLOCKS.md)).
Kerak bo'lsa — mijozga blok taklif qiling, o'zingiz o'rnatishga urinmang.

Odam qo'lida esa: `npx expo install <paket>`, hech qachon `npm install <paket>`.
Sababi: [`../SDK.md`](../SDK.md).

## 3. MAVJUD PAKETLAR

Faqat shular bor. Boshqasini import qilmang.

| Paket | Nima uchun |
| --- | --- |
| `expo-router` | Navigatsiya (qotirilgan) |
| `react-native` | `View`, `Text`, `FlatList`, `Pressable`, `StyleSheet` |
| `@expo/ui` | Native primitivlar — 8-qoidaga qarang |
| `@supabase/supabase-js` | Baza — faqat `src/lib/supabase.ts` orqali |
| `@react-native-async-storage/async-storage` | Supabase seansi uchun |
| `react-native-safe-area-context` | `useSafeAreaInsets` |
| `expo-constants`, `expo-linking`, `expo-status-bar`, `expo-system-ui` | Platforma yordamchilari |
| `react-native-url-polyfill` | `app/_layout.tsx` da, bir marta |

Yo'q va qo'shib bo'lmaydi: NativeWind, styled-components, axios, lodash,
moment, react-navigation (to'g'ridan-to'g'ri), FlashList, MMKV, Redux.
Uslub uchun `StyleSheet` + `theme`, so'rov uchun `fetch`, sana uchun
`Intl` ishlating.

## 4. RO'YXAT — DOIM `FlatList`

```tsx
<FlatList
  data={items}
  keyExtractor={(item) => item.id}        // majburiy — indeks emas
  renderItem={({ item }) => <Card title={item.title} />}
  ListEmptyComponent={<EmptyState title="Hozircha bo'sh" />}
/>
```

- `ScrollView` + `.map()` — **taqiqlangan**. ESLint buni xato deb
  belgilaydi va verify gate o'tmaydi.
- `<View>{items.map(...)}</View>` ni lint **tutmaydi**, lekin bu ham
  taqiqlangan: 50 tadan ortiq elementda ilova qotib qoladi, chunki
  hamma element birdan render bo'ladi.
- `keyExtractor` da massiv indeksi ishlatilmaydi — ro'yxat o'zgarganda
  React noto'g'ri elementni qayta ishlatadi.
- Element balandligi qat'iy bo'lsa `getItemLayout` qo'shing — RN unda
  o'lchashni o'tkazib yuboradi va uzun ro'yxat sezilarli tez bo'ladi.
- Ro'yxatli ekranda `<Screen scroll={false}>` — aks holda `FlatList`
  `ScrollView` ichida qoladi va virtualizatsiya o'chadi.

## 5. `any` YO'Q

`@typescript-eslint/no-explicit-any` — `error`. `strict` va
`noUncheckedIndexedAccess` yoqilgan.

Tur noma'lum bo'lsa `unknown` oling va toraytiring. Massiv elementi
`T | undefined` bo'lishini hisobga oling — bu xato emas, bu himoya.

## 6. FAYL 300 QATORDAN OSHMAYDI

Uzun faylda model adashadi: noto'g'ri joyni tahrirlaydi, mavjud
funksiyani takrorlaydi. Oshsa — ekran ichidagi qismni
`src/features/<soha>/components/` ga chiqaring.

Loyihada jami ~200 fayl bo'lsin. 400 dan oshsa fayl daraxti **qirqiladi**:
ortiqcha fayllar `MAP.md` ga ham, Review Checker'ga ham ko'rinmay qoladi —
ya'ni o'sha fayllardagi do'kon buzilishi tekshiruvsiz nashrga ketadi.

## 7. `edit_file` — NUQTALI DIFF

To'liq qayta yozish taqiqlangan. 400 qatorli ekranni qayta yozish
~6000 token, nuqtali diff ~200. Avval `search_files` yoki `read_file`
bilan aniq joyni toping, keyin tahrirlang.

Hech qachon «tuzatdim» deb yozmang, agar diff bo'sh bo'lsa.

## 8. `@expo/ui` — QAYSI IMPORT

| Import | iOS | Android | Veb preview |
| --- | --- | --- | --- |
| `@expo/ui` | SwiftUI | Jetpack Compose | ishlaydi (RN fallback) |
| `@expo/ui/swift-ui` | SwiftUI | **yiqiladi** | **yiqiladi** |
| `@expo/ui/jetpack-compose` | **yiqiladi** | Compose | **yiqiladi** |

**Faqat `@expo/ui` (universal) ishlating.** Platformaga bog'langan
importlar modul yuklanishida `requireNativeView` chaqiradi va native
view topilmasa o'sha yerda tashlaydi — ekran oq bo'lib qoladi.

Bu ayniqsa xavfli, chunki verify gate **veb** eksporti bilan bundle
qiladi: u yashil chiqadi, keyin mijozning **birinchi** preview'i (veb,
90 soniya) buzuq ko'rinadi. Bu eng qimmat nosozlik — mijoz shu paytda
ketadi.

## 9. MOCK MA'LUMOT YOZILMAYDI

Ro'yxatlar haqiqiy manbadan keladi (`src/features/*/use-*.ts`). Baza
ulanmagan bo'lsa ekran buni ochiq aytadi — `not-connected` holati.

Soxta yozuvlar mijozga ilovasi ishlayotgandek ko'rsatadi. U haqiqatni
do'konga chiqargandan keyin biladi — eng qimmat payt.

## 10. «TODO» SO'ZI YOZILMAYDI

Review Checker ilova kodida shu naqshni qidiradi va **bloker** beradi:
`Lorem ipsum` · `TODO` · `FIXME` · `Coming soon` · `Tez orada` ·
`placeholder text`. Izohda bo'lsa ham topiladi.

Sababi Apple 2.1 bandi: ko'rikchi ilovani qo'lda ochib ko'radi va
tugallanmagan matn aniq rad etish.

Bo'sh `onPress={() => {}}` ham shu qoidada — tugma ishlamasa, uni
qo'ymang.

## 11. `app.json` — BIRINCHI ISH

Yangi loyihada `name` va `slug` shablonnikicha qoladi:
`"Yangi ilova"` / `"amb-new-app"`. Review Checker `amb-new-app` ni
umumiy nomlar ro'yxatida tutadi va 4.3 (spam/duplicate) ogohlantirishini
beradi.

Loyiha domeni ma'lum bo'lishi bilan o'zgartiring: `name`, `slug`,
`ios.bundleIdentifier`, `android.package`, `scheme`. To'rttasi ham
mijozning brendiga mos bo'lsin.

Ruxsat talab qiladigan paket qo'shilsa, `ios.infoPlist` ga sabab yozish
majburiy — [`STORE-RULES.md`](./STORE-RULES.md).

## 12. HAR EKRAN UCHTA HOLATNI KO'RSATADI

| Holat | Nega |
| --- | --- |
| Yuklanmoqda | Bo'sh oq ekran «ilova qotdi» degan taassurot beradi |
| Bo'sh | «Hozircha bo'sh» + nima qilish kerakligi |
| Xato | Tushunarli matn, texnik xabar emas |

Ro'yxatda `ListEmptyComponent` majburiy. E2E tekshiruv agenti bularni
alohida tekshiradi.

## 13. MATN — O'ZBEK (LOTIN)

Ikkinchi til — rus. Mijozga ko'rinadigan matnda texnik atama yo'q:
«E2E», «typecheck», «bundle», «RLS» — bularni mijoz bilmaydi.

Apostrof («o'zgarish», «yo'q») erkin ishlatiladi:
`react/no-unescaped-entities` qoidasi ataylab o'chirilgan.

---

## Muhit tuzoqlari — bilib turing

| Tuzoq | Haqiqat |
| --- | --- |
| `react-native-url-polyfill/auto` | `app/_layout.tsx` ning **birinchi** importi. Hermes'da `URL` to'liq emas; supabase-js unga tayanadi. Bo'lmasa tarmoq so'rovlari **jimgina** ishlamaydi — xato ham chiqmaydi |
| Supabase seansi | RN'da `localStorage` yo'q. `src/lib/supabase.ts` AsyncStorage adapterini beradi. Adaptersiz foydalanuvchi ilovani har ochganda qaytadan kiradi — veb preview'da **ko'rinmaydi**, faqat qurilmada chiqadi |
| `getSupabase()` dangasa | Klient chaqirilganda yaratiladi, modul yuklanishida emas — shuning uchun polyfill undan oldin ulgurar |
| Metro keshi | `.amb-cache`, loyiha ichida. Shubhali eski natija ko'rsangiz: `npx expo start -c` |
| Veb preview | Native modullar ishlamaydi. Verify gate ham veb bilan bundle qiladi — «o'tdi» degani «qurilmada ishlaydi» degani emas |
| Simulyator | Push bildirishnoma **kelmaydi**, kamera **yo'q**. Bularni E2E'da sinab bo'lmaydi — mijozga «telefonda tekshiring» deyiladi |
| Typed routes | `.expo/types` Metro ishlagandan keyin hosil bo'ladi. Yangi workspace'da marshrut satrini `tsc` tekshirmaydi — noto'g'ri `router.push()` gate'dan o'tib ketishi mumkin |
| New Architecture | Yoqilgan. Uni qo'llab-quvvatlamaydigan eski kutubxonalar ishlamaydi (baribir qo'sha olmaysiz) |
| Expo Go | Faqat Expo SDK ichidagi native modullar. Uchinchi tomon native paket qo'shilishi bilan dev client kerak |

## Keyin nimani o'qish

| Savol | Fayl |
| --- | --- |
| Kod qayerga yoziladi? | [`STRUCTURE.md`](./STRUCTURE.md) |
| Ranglar, oraliq, tipografiya? | [`STYLE-GUIDE.md`](./STYLE-GUIDE.md) |
| Bloklar qanday ishlaydi? | [`BLOCKS.md`](./BLOCKS.md) |
| Do'kon nimani talab qiladi? | [`STORE-RULES.md`](./STORE-RULES.md) |
| SDK nega qotirilgan? | [`../SDK.md`](../SDK.md) |
