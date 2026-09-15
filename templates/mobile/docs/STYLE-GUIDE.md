# Uslub qo'llanmasi — mobil

> **Diqqat:** builder'ning veb dizayni (issiq qog'oz palitrasi) mijoz
> ilovasiga **ko'chirilmaydi**. Ular ikki xil mahsulot: biri bizning
> ishchi stolimiz, ikkinchisi mijozning brendi.
>
> Dizayn kanvasidagi telefon ekranlari ham chizmalar, andoza emas.

## Ranglar — `src/lib/theme.ts`

Har mijoz uchun **alohida** palitra. Apple 4.3 bandi bo'yicha bizdan
chiqqan ilovalar bir-biriga o'xshamasligi kerak: 50 ta bir xil ilova
naqsh sifatida aniqlanadi va hammasi rad etilishi mumkin.

```ts
theme.colors.primary      // brend rangi — mijozdan olinadi
theme.colors.background   theme.colors.surface   theme.colors.border
theme.colors.text         theme.colors.textMuted
theme.colors.danger       theme.colors.success
```

Rangni to'g'ridan-to'g'ri yozmang: `color: "#2563EB"` emas,
`color: theme.colors.primary`. Sabab texnik: mijoz «rangni qizil qil»
deganda agent bitta faylni o'zgartiradi. Ranglar ekranlarga sochilgan
bo'lsa, u har birini topishi kerak va bittasini albatta o'tkazib yuboradi.

Shablon palitrasi ko'k (`#2563EB`) — u **boshlang'ich qiymat**, saqlanib
qolishi kerak emas. Loyiha brendi ma'lum bo'lishi bilan o'zgartiring.

## Asosiy rang ko'rinib turishi SHART

Bosh ekranda kamida bitta `primary` rangdagi element bo'lsin.

Sabab: mijoz «rangni qizil qil» deganda agent `theme.ts` ni to'g'ri
o'zgartiradi, tekshiruvdan o'tadi, 1 o'zgarish hisoblanadi — lekin
ekranda **farq ko'rinmasa**, u uchun bu «pul oldi, hech narsa qilmadi»
degani. Bu amalda uchragan muammo.

## Oraliq — `theme.spacing`

`xs: 4 · sm: 8 · md: 16 · lg: 24 · xl: 32`

Aralash raqam yozmang: `marginTop: 14` emas, `theme.spacing.md`.

Oraliq uchun `gap` ishlating — `marginBottom` ni oxirgi elementdan
olib tashlash kerak bo'ladi va model buni unutadi.

## Bosish maydoni

`theme.minTouchSize` = **44pt**. Undan kichik bosiladigan element
bo'lmaydi. E2E tekshiruv agenti qulaylikni aynan shu raqam bo'yicha
baholaydi; Apple ham ko'rikda shunga qaraydi.

Ikonka kichik bo'lsa, `Pressable` ni `minHeight`/`minWidth` bilan
kattalashtiring — ikonkani emas.

## Tipografiya — `theme.fontSize`

| Token | px | Qachon |
| --- | --- | --- |
| `sm` | 13 | Yordamchi matn |
| `md` | 15 | Asosiy matn |
| `lg` | 18 | Karta sarlavhasi |
| `xl` | 24 | Ekran sarlavhasi |
| `xxl` | 32 | Bosh sarlavha |

## Pul formati

```ts
import { formatUzs } from "@/lib/format";
formatUzs(150000)   // "150 000 so'm"
```

Uch xonali bo'linma majburiy: o'zbek bozorida summalar katta va
`150000` o'qilmaydi.

## Native primitivlar — `@expo/ui`

| Import | iOS | Android | Veb preview |
| --- | --- | --- | --- |
| `@expo/ui` | SwiftUI | Jetpack Compose | ishlaydi (RN fallback) |
| `@expo/ui/swift-ui` | SwiftUI | **yiqiladi** | **yiqiladi** |
| `@expo/ui/jetpack-compose` | **yiqiladi** | Compose | **yiqiladi** |

**Faqat `@expo/ui`** — universal eksport. U iOS'da SwiftUI, Android'da
Compose, vebda esa oddiy React Native fallback beradi.

Platformaga bog'langan importlar modul yuklanishida `requireNativeView`
chaqiradi va native view topilmasa o'sha yerda tashlaydi. Verify gate
**veb** eksporti bilan bundle qilgani uchun bunday xato gate'dan o'tib
ketadi va mijozning birinchi preview'ida oq ekran bo'lib chiqadi.

`@expo/ui` komponentlari `theme.colors.primary` ni **avtomatik olmaydi** —
brend rangi `Host` ning `seedColor` i orqali beriladi:

```tsx
import { Host, Button } from "@expo/ui";
import { theme } from "@/lib/theme";

<Host seedColor={theme.colors.primary} matchContents>
  <Button onPress={onSave} label="Saqlash" />
</Host>
```

`seedColor` iOS'da SwiftUI tint'iga, Android'da Material 3 palitrasiga,
vebda CSS o'zgaruvchilariga aylanadi. Berilmasa har platforma **o'z**
standart rangini oladi va mijozning brendi yo'qoladi.

Oddiy tugma va karta uchun `src/components/` dagi tayyorlari yetadi —
ular `theme` ga bog'langan va uch platformada bir xil ko'rinadi.

## Ro'yxatlar

Doim `FlatList`, `keyExtractor` bilan. `ScrollView` + `.map()` ni ESLint
xato deb belgilaydi va verify gate o'tmaydi. `View` ichidagi `.map()` ni
lint tutmaydi, lekin u ham taqiqlangan — sabab
[`AI-GUIDE.md`](./AI-GUIDE.md) 4-qoidasida.

Ro'yxatli ekranda `<Screen scroll={false}>`.

## Bo'sh va xato holatlari

Har ro'yxatda `ListEmptyComponent` bo'lishi shart:

```tsx
ListEmptyComponent={<EmptyState title="Hozircha bron yo'q" hint="Xizmat tanlang." />}
```

Matn foydalanuvchi tilida bo'lsin. `hint` ga texnik xabar
(`PGRST116`, `Network request failed`) tushmasin — mijoz uni tushunmaydi
va qo'ng'iroq qiladi.

## Apostrof haqida

O'zbek lotin yozuvida apostrof har qadamda: «o'zgarish», «yo'q».
`react/no-unescaped-entities` qoidasi `eslint.config.js` da **ataylab
o'chirilgan** — u har apostrofni xato deb belgilaydi va agentning uchta
bepul tuzatish urinishini bekorga yeb qo'yadi.

Ya'ni JSX ichida `'` ni `&apos;` ga aylantirish **shart emas** va
kerak emas.
