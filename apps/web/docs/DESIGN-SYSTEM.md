# RIVO dizayn tizimi

## Nega quyuq fon va iliq gradient

Mahsulot ekrani soatlab ochiq turadi va uning markazida mijozning
**ilovasi** bo'ladi. Quyuq fon telefon maketini ramkadan ajratadi va
e'tiborni unga qaratadi — oq fon esa telefon ekrani bilan qo'shilib
ketardi.

Aksent iliq: sovuq ko'k-binafsha «dasturchi vositasi» degan signal
beradi, bizning mijoz esa dasturchi emas. Oltin-marjon gradient eski
terrakota identikamizning davomi.

## Ranglar

Qiymatlar `@amb/design-tokens` dan keladi. `globals.css` dagi `@theme`
bloki — o'sha tokenlarning nusxasi (Tailwind v4 build paytida CSS
o'qiydi, JS'dan qiymat ololmaydi).

| Token | Qiymat | Qachon ishlatiladi |
| --- | --- | --- |
| `paper` | `#0B0B0D` | Sahifa foni. Boshqa hech narsa uchun emas |
| `surface` | `#141416` | Kartalar, panellar, yuqori panel |
| `surface-alt` | `#1B1B1E` | Input fon, ichki karta, hover |
| `surface-high` | `#24242A` | Progress trek, o'chirilgan tugma |
| `ink` | `#F4F3F1` | Asosiy matn, sarlavha, oq tugma foni |
| `ink-muted` | `#ABA9A5` | Tavsif, ikkinchi darajali matn |
| `ink-faint` | `#918F8A` | Mono yorliq, uchinchi daraja |
| `line` | `#26262B` | Odatdagi chegara |
| `line-strong` | `#3A3A42` | Hover chegara, ajratgich, telefon qirrasi |
| `accent` | `#FFA93B` | Bitta rang kerak bo'lganda: nuqta, kichik progress |
| `accent-ink` | `#0A0A0B` | Gradient ustidagi matn |
| `accent-surface` | `#2A1C0D` | Ogohlantirish foni, hisob qatori |
| `accent-soft` | `#FFC77A` | `accent-surface` ustidagi matn |
| `success` | `#4ADE94` | Tekshiruvdan o'tdi, do'konda |
| `success-surface` | `#10261D` | Muvaffaqiyat foni |
| `danger` | `#FF7A6B` | Xato, ulanish uzildi |
| `danger-surface` | `#2A1512` | Xato foni |

Ishlatish: `bg-surface`, `text-ink-muted`, `border-line`.
**Hech qachon** `bg-[#141416]` yozmang.

### Kontrast

Har matn rangi har sirt ustida WCAG AA (4.5:1) dan yuqori. Eng past
juftlik — `ink-faint` / `surface-high` = **4.78:1**. Yangi rang
qo'shsangiz shu chegaradan o'tishini tekshiring.

## Gradient

Yagona ta'rif — `globals.css` dagi `--gradient-accent`:
oltin sariq `#F7E15E` → amber `#FFA93B` → marjon `#FF6B4A`, 100°.

Tokenlar: `accent-from`, `accent-via`, `accent-to` (Tailwind'ning
`from-* / via-* / to-*` sinflari bilan ishlaydi).

### Qayerda MUMKIN

| Joy | Nechta |
| --- | --- |
| Asosiy tugma (`Button variant="primary"`) | Sahifada **bitta** |
| Sarlavhaning bir-ikki so'zi (`GradientText`) | Sahifada bitta |
| Logotip nuqtasi | Brend belgisi |
| `BalanceMeter` progress chizig'i | Bitta |
| `SectionLabel` chizig'i (40% shaffoflik) | Bo'lim boshida |
| Fon porlashi (`AmbientGlow`, 12–25%) | Bo'limda bitta |

### Qayerda MUMKIN EMAS

- Karta foni, panel foni, sahifa foni
- Ikkinchi darajali tugmalar (`solid`, `secondary`, `ghost`)
- `Badge`, chegara, matn bloki
- Bir sahifada ikkita gradient tugma

Sabab: gradient e'tiborni tortadi. Ikkita bo'lsa mijoz qaysi birini
bosishni bilmaydi va to'xtaydi. Hamma joyda bo'lsa u aksent bo'lishdan
to'xtaydi va shovqinga aylanadi.

### Yordamchi sinflar

| Sinf | Nima qiladi |
| --- | --- |
| `.gradient-text` | Matnni gradient bilan bo'yaydi (`GradientText` ishlatadi) |
| `.gradient-surface` | Gradient fon + quyuq matn. O'chirilganda tekis sirtga o'tadi |
| `.gradient-glow` | Tugma ostidagi yumshoq yorug'lik |

Gradient ustidagi matn **quyuq** (`accent-ink`), oq emas: gradientning
eng yorug' nuqtasi oltin sariq va oq matn u yerda o'qilmay qoladi.
Quyuq matn butun gradient bo'ylab 7:1 dan yuqori kontrast beradi.

## Tipografiya

| Oila | Qachon |
| --- | --- |
| Inter | Hamma matn |
| JetBrains Mono | Raqam, versiya, fayl yo'li, bo'lim yorlig'i |

Eski IBM Plex tahririy-qog'oz ko'rinishga ega edi — quyuq interfeys
uchun mos emas. Inter quyuq fonda tiniq va o'zbek lotin
diakritikalarini (oʻ, gʻ) to'g'ri ko'rsatadi.

`.label-mono` sinfi: 11px, `0.16em` oraliq, katta harf, `ink-faint`.

| O'lcham | px | Qachon |
| --- | --- | --- |
| label | 11 | Mono yorliqlar |
| sm | 13 | Yordamchi matn |
| base | 15 | Asosiy matn |
| md | 17 | Kirish matni |
| lg | 20 | Karta sarlavhasi |
| xl | 28 | Bo'lim sarlavhasi |
| display | 40 | Ekran sarlavhasi |
| hero | 60 | Landing |

Katta sarlavhalarda `tracking-[-0.035em]`: quyuq fonda zich oq matn
og'ir ko'rinadi, siqilgan oraliq uni yengillashtiradi.

## Shakl

Tugmalar va chiplar — `rounded-full` (pill). Kartalar — `rounded-2xl`.
O'tkir burchak quyuq fonda qattiq ko'rinadi.

Quyuq dizaynda qatlam **soya bilan emas, yorug'lik bilan** ajratiladi:
fon bir pog'ona ochroq va chegara juda nozik. Soya qora fonda
ko'rinmaydi.

## Oraliq

4 ga karrali: 4, 8, 12, 16, 24, 32, 48, 96.
Bo'limlar orasi — 96px (`space-y-12` va undan katta).

## Telefon maketi

Ilgari ramka qat'iy `390×844 px` edi va 1440×900 noutbukda pastki qismi
kesilib qolardi.

Endi `globals.css` dagi `.phone-shell` balandlikni ekrandan hisoblaydi,
nisbat esa `aspect-ratio: 390 / 844` bilan saqlanadi:

```css
--phone-reserve: 11.5rem;                 /* yuqori panel + chekkalar */
--phone-status-row: 2.5rem;               /* telefon ustidagi holat matni */
--workspace-panel-h: min(844px, calc(100dvh - var(--phone-reserve)));

.phone-shell { height: calc(var(--workspace-panel-h) - var(--phone-status-row)); }
.panel-tall  { height: var(--workspace-panel-h); }
```

Suhbat paneli (`.panel-tall`) ham shu o'zgaruvchini o'qiydi — shunda
telefon va suhbat pastda tekis tugaydi. Raqam bitta joyda turadi.

Natija: 1440×900 da telefon ≈ 312×676, 1080p da ≈ 372×804. Hech qachon
kesilmaydi va hech qachon nisbatini buzmaydi.

1024px dan tor ekranda `--phone-reserve` 19rem ga o'tadi va ustunlar
bir-birining ostiga tushadi: telefon tepada, suhbat pastda — mijoz
avval natijani ko'radi.

## Raqamlar

`body` da `font-variant-numeric: tabular-nums`. Bu narx va qoldiq
jadvallarida raqamlar ustma-ust turishini ta'minlaydi.

## Narx — har doim ikki valyutada

```tsx
<Money uzs={1_900_000} usdCents={29900} />
// → 1 900 000 so'm ($299)
```

O'zbek mijozi so'mda o'ylaydi, `$299` esa xalqaro kontekst beradi va
«bu jiddiy mahsulot» degan signal yuboradi.

## Holat — rang bilan ham, MATN bilan ham

Faqat rangga tayanish rang ko'rmaydigan foydalanuvchini chetlab
qoldiradi. Shuning uchun `Badge` da nuqta ham, yozuv ham bor; telefon
ustida «Brauzerda ishlayapti» deb yoziladi; `BalanceMeter` da progress
yonida «10 tadan 4 tasi» raqami turadi.

## Mobil ko'rinish

Dizayn kanvasidagi mobil ekranlar — **chizmalar, andoza emas**. Telefon
uchun alohida, native primitivlarga tayangan tartib quriladi:
`templates/mobile/docs/STYLE-GUIDE.md`.
