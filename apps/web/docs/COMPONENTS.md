# Komponentlar

`src/shared/ui/` — dizayn tizimi. Import doim `@/shared/ui` dan.

## Button

```tsx
<Button>Ekranlarni ko'rsat</Button>                      // primary
<Button variant="secondary">Telefonda ochish</Button>
<Button variant="dark" size="sm">Suhbat</Button>
<Button variant="ghost">Bekor qilish</Button>
```

| Variant | Qachon |
| --- | --- |
| `primary` | Ekranning **yagona** asosiy amali |
| `secondary` | Yordamchi amal |
| `dark` | Quyuq fon ustida yoki alohida ajratish uchun |
| `ghost` | Uchinchi daraja, chegarasiz |

Balandlik `md` = 44px — bosish maydonining eng kichik qulay o'lchami.

## Card

```tsx
<Card className="p-5">…</Card>
<Card nested className="p-3">…</Card>   // ichki karta, to'qroq fon
```

## Badge

```tsx
<Badge tone="success">Do'konda</Badge>
<Badge tone="warning">Tekshiruvda</Badge>
<Badge>Expo Go</Badge>
```

Holat **rang bilan ham, matn bilan ham** ko'rsatiladi — faqat rangga
tayanish rang ko'rmaydigan foydalanuvchini chetlab qoldiradi.

## SectionLabel

```tsx
<SectionLabel left="Loyihalarim" right="4 ta" />
```

Mono yorliq va chiziq. Sahifani bo'limlarga ajratadi.

## BalanceMeter

```tsx
<BalanceMeter balance={project.balance} />
```

«10 tadan 4 tasi ishlatildi» + progress + **nima bepul ekani**.

Oxirgi qator majburiy: mijoz nima bepulligini doim ko'rib turishi kerak,
aks holda savol berishdan ham qo'rqadi.

## Money

```tsx
<Money uzs={490_000} usdCents={7900} />   // 490 000 so'm ($79)
formatUzs(150_000)                        // "150 000 so'm"
formatUsd(29900)                          // "$299"
```

---

# Xususiyat komponentlari

## `features/project-create/PromptBox`

Mahsulotning kirish nuqtasi. Mijozdan **hech qanday texnik savol
so'ralmaydi** — hatto ilova nomi ham birinchi jumladan yasaladi.

Har qo'shimcha maydon boshlanishdagi to'siq va mijozning bir qismini
yo'qotadi.

## `features/workspace/WorkspaceView`

Asosiy ekran: **ilova markazda**, suhbat ustidan qoplama, qoldiq yuqorida.

Raqobatchilarda chat markazda, ilova yon panelda. Bizda teskarisi: mijoz
chat bilan emas, ilovasi bilan qiziqadi.

| Qism | Fayl |
| --- | --- |
| Telefon ramkasi | `components/phone-frame.tsx` |
| Suhbat qoplamasi | `components/chat-overlay.tsx` |
| Yuqori panel | `components/workspace-top-bar.tsx` |
| SSE oqimi | `hooks/use-agent-run.ts` |
| Hodisa → matn tarjimasi | `timeline.ts` |

`timeline.ts` — **barcha texnik atamalar shu yerda tarjima qilinadi**.
Mijoz «edit_file» yoki «typecheck» degan so'zni hech qachon ko'rmaydi.

## `features/billing/PricingTable`

Narx `@amb/core-rules` dan keladi. Uchinchi tomon xarajatlari (Apple $99,
Google $25) ataylab shu sahifada: mijozning birinchi savoli «$99 yana
alohidami?» bo'ladi va javob to'lovdan **oldin** bo'lishi kerak.
