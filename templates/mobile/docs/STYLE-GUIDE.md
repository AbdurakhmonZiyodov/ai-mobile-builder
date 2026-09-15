# Uslub qo'llanmasi — mobil

> **Diqqat:** builder'ning veb dizayni (issiq qog'oz palitrasi) mijoz
> ilovasiga **ko'chirilmaydi**. Ular ikki xil mahsulot: biri bizning
> ishchi stolimiz, ikkinchisi mijozning brendi.
>
> Dizayn kanvasidagi telefon ekranlari ham chizmalar, andoza emas.

## Ranglar — `src/lib/theme.ts`

Har mijoz uchun **alohida** palitra. Apple 4.3 bandi bo'yicha bizdan
chiqqan ilovalar bir-biriga o'xshamasligi kerak — 50 ta bir xil ilova
naqsh sifatida aniqlanadi va hammasi rad etilishi mumkin.

```ts
theme.colors.primary     // brend rangi — mijozdan olinadi
theme.colors.background
theme.colors.surface
theme.colors.text
theme.colors.textMuted
theme.colors.border
theme.colors.danger
theme.colors.success
```

Rangni to'g'ridan-to'g'ri yozmang: `color: "#2563EB"` emas,
`color: theme.colors.primary`.

## Asosiy rang ko'rinib turishi SHART

Bosh ekranda kamida bitta `primary` rangdagi element bo'lsin.

Sabab: mijoz «rangni qizil qil» deganda, agent `theme.ts` ni to'g'ri
o'zgartiradi, tekshiruvdan o'tadi, 1 o'zgarish hisoblanadi — lekin
ekranda **farq ko'rinmasa**, u uchun bu «pul oldi, hech narsa qilmadi»
degani. Bu amalda uchragan muammo.

## Oraliq — `theme.spacing`

`xs: 4 · sm: 8 · md: 16 · lg: 24 · xl: 32`

Aralash raqam yozmang: `marginTop: 14` emas, `theme.spacing.md`.

## Bosish maydoni

`theme.minTouchSize` = **44pt**. Undan kichik tugma bo'lmaydi.
E2E tekshiruv agenti qulaylikni aynan shu raqam bo'yicha baholaydi.

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

## Native primitivlar

UI uchun `@expo/ui` ustun: iOS'da SwiftUI, Android'da Jetpack Compose.
Bu JavaScript'da qayta yozilgan taqlid emas — haqiqiy native.

Apple va Google eng yangi API'larni avval o'sha freymvorklarda chiqaradi,
shuning uchun chiqish sifati native darajasida bo'ladi.

## Ro'yxatlar

Doim `FlatList`. Hech qachon `ScrollView` + `.map()` — ESLint buni xato
deb belgilaydi va verify gate o'tmaydi.

## Bo'sh va xato holatlari

Har ro'yxatda `ListEmptyComponent` bo'lishi shart. Bo'sh oq ekran —
Apple ko'rigida rad etish sababi bo'lishi mumkin.

```tsx
ListEmptyComponent={<EmptyState title="Hozircha bron yo'q" hint="Xizmat tanlang." />}
```

## Apostrof haqida

O'zbek lotin yozuvida apostrof har qadamda: «o'zgarish», «yo'q».
`react/no-unescaped-entities` qoidasi **ataylab o'chirilgan** — u har
apostrofni xato deb belgilaydi va agentning uchta bepul tuzatish
urinishini bekorga yeb qo'yadi.
