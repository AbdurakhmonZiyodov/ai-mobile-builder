# Komponentlar

`src/shared/ui/` — dizayn tizimi. Import doim `@/shared/ui` dan.

## Button

```tsx
<Button>Do'konga chiqarish</Button>              // primary — gradient
<Button variant="solid">Yuborish</Button>        // oq pill
<Button variant="secondary">Telefonda ochish</Button>
<Button variant="ghost">Bekor qilish</Button>
```

| Variant | Ko'rinishi | Qachon |
| --- | --- | --- |
| `primary` | Gradient + porlash | Sahifaning **yagona** asosiy amali |
| `solid` | Oq fon, quyuq matn | Kuchli ikkinchi amal (suhbatdagi «Yuborish») |
| `secondary` | Quyuq sirt + chegara | Yordamchi amal |
| `ghost` | Fonsiz | Uchinchi daraja |

Hammasi `rounded-full`. Balandlik: `sm` 36px, `md` **44px**
(bosish maydonining eng kichik qulay o'lchami), `lg` 52px.

**Bir sahifada faqat bitta `primary`.** Workspace'da u yuqori paneldagi
«Do'konga chiqarish» — mahsulotning yakuniy maqsadi; suhbatdagi
«Yuborish» esa `solid` bo'lib qoladi.

O'chirilganda `primary` gradientni tashlaydi va tekis `surface-high`
ga o'tadi: shaffoflik bilan xiralashtirilgan gradient loyqa jigarrang
dog'ga aylanadi va «buzilgan» ko'rinadi.

## Card

```tsx
<Card className="p-6">…</Card>
<Card nested className="p-5">…</Card>       // ichki karta, ochroq sirt
<Card highlighted className="p-6">…</Card>  // kuchliroq chegara
```

Quyuq dizaynda qatlam soya bilan emas, yorug'lik bilan ajratiladi:
fon bir pog'ona ochroq va chegara nozik.

## Badge

```tsx
<Badge tone="success">Do'konda</Badge>
<Badge tone="warning">Yig'ilmoqda</Badge>
<Badge tone="danger">Xato</Badge>
<Badge>Expo Go</Badge>
```

Holat **rang bilan ham, matn bilan ham** ko'rsatiladi — har belgida
rangli nuqta ham, yozuv ham bor. Faqat rangga tayanish rang
ko'rmaydigan foydalanuvchini chetlab qoldiradi.

Gradient ishlatilmaydi: belgi ikkinchi darajali ma'lumot.

## SectionLabel

```tsx
<SectionLabel left="Loyihalarim" right="4 ta" />
```

Mono yorliq va gradientdan fonga singib ketuvchi chiziq. Bu
gradientning eng kam «ovozli» ishlatilishi.

## GradientText

```tsx
<h1>Boshqalar tez chiqarish uchun. <GradientText>Biz ishlab turishi uchun.</GradientText></h1>
```

**Bir sarlavhada faqat bir-ikki so'z (yoki bitta jumla).** Butun
matnga qo'yilsa o'qish qiyinlashadi va gradient aksent bo'lishdan
to'xtaydi.

Ichida `text-accent` zaxira rangi bor: `background-clip: text`
ishlamagan brauzerda so'z yo'qolib qolmaydi.

## AmbientGlow

```tsx
<section className="relative">
  <AmbientGlow className="top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 opacity-15" />
  …
</section>
```

Fon porlashi — qora fonga chuqurlik beradi. Opaklik **12–25%** dan
oshmasin, aks holda matn bilan raqobatlashadi. Ota element
`relative` bo'lishi shart.

## BalanceMeter

```tsx
<BalanceMeter balance={project.balance} />
```

«10 tadan 4 tasi ishlatildi» + gradient progress + **nima bepul ekani**.

Oxirgi qator majburiy: mijoz nima bepulligini doim ko'rib turishi kerak,
aks holda savol berishdan ham qo'rqadi.

## Money

```tsx
<Money uzs={490_000} usdCents={7900} />   // 490 000 so'm ($79)
formatUzs(150_000)                        // "150 000 so'm"
formatUsd(29900)                          // "$299"
```

## SiteHeader

```tsx
<SiteHeader links={[{ href: "/narx", label: "Narx" }]} />
```

Marketing va ro'yxat sahifalarining yuqori paneli: gradient nuqtali
logotip va navigatsiya. Panelda **gradient tugma yo'q** — sahifadagi
yagona gradient asosiy amal uchun saqlanadi.

---

# Xususiyat komponentlari

## `features/project-create/PromptBox`

Mahsulotning kirish nuqtasi. Mijozdan **hech qanday texnik savol
so'ralmaydi** — hatto ilova nomi ham birinchi jumladan yasaladi.

Ko'rinishi: quyuq karta, ichida undan ham quyuqroq maydon. Fokus
konturi global (`:focus-visible`, aksent rangda) — komponentda alohida
ring yozilmaydi.

## `features/workspace/WorkspaceView`

Asosiy ekran. Uch ustun: chapda suhbat, **markazda ilova**, o'ngda
holat. Markaz ustuni telefon kengligiga teng (`auto`), butun blok
o'rtaga markazlashadi — shunda telefon har doim aniq markazda turadi.

Raqobatchilarda chat markazda, ilova yon panelda. Bizda teskarisi:
mijoz chat bilan emas, ilovasi bilan qiziqadi.

| Qism | Fayl |
| --- | --- |
| Telefon ramkasi | `components/phone-frame.tsx` |
| Suhbat qoplamasi | `components/chat-overlay.tsx` |
| Yuqori panel | `components/workspace-top-bar.tsx` |
| SSE oqimi | `hooks/use-agent-run.ts` |
| Hodisa → matn tarjimasi | `timeline.ts` |

### PhoneFrame

Uch qatlam: tashqi yorug' qirra (metall chekka), quyuq bezel va ekran.
Yagona qatlam bilan maket «rasm» bo'lib qolardi. Qo'shimcha: dynamic
island va yon tugmalar (`aria-hidden`, sof bezak), orqasida iliq
porlash.

O'lcham ekranga moslashadi — DESIGN-SYSTEM.md dagi «Telefon maketi»
bo'limiga qarang. Preview yo'q bo'lsa ekran **quyuq** qoladi
(«o'chiq telefon»); oq bo'sh ekran «ilova buzilgan» degan taassurot
berardi.

### timeline.ts

**Barcha texnik atamalar shu yerda tarjima qilinadi.** Mijoz
«edit_file» yoki «typecheck» degan so'zni hech qachon ko'rmaydi.

## `features/billing/PricingTable`

Narx `@amb/core-rules` dan keladi. Uchinchi tomon xarajatlari (Apple $99,
Google $25) ataylab shu sahifada: mijozning birinchi savoli «$99 yana
alohidami?» bo'ladi va javob to'lovdan **oldin** bo'lishi kerak.

Bu sahifada gradient tugma yo'q: bu yerda tanlash emas, **tushunish**
vazifasi turibdi. Tanlash prompt maydonidan boshlanadi.
