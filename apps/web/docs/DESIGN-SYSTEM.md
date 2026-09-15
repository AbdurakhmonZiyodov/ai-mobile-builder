# RIVO dizayn tizimi

## Nega issiq qog'oz palitrasi

Mahsulot texnik vosita emas — biznes egasining ishchi stoli. Sovuq kulrang
SaaS palitrasi «dasturchi vositasi» degan signal beradi, bizning mijoz esa
dasturchi emas va aynan shundan qo'rqadi.

## Ranglar

| Token | Qiymat | Qachon |
| --- | --- | --- |
| `paper` | `#E7E1D5` | Sahifa foni |
| `surface` | `#F7F4EE` | Kartalar, panellar |
| `surface-alt` | `#EDE7DB` | Ichki bloklar, input fon |
| `surface-sunken` | `#DCD5C8` | Progress bar orqa foni |
| `ink` | `#151510` | Asosiy matn, quyuq tugma |
| `ink-muted` | `#4A4840` | Ikkinchi darajali matn |
| `ink-faint` | `#5F5B52` | Mono yorliqlar, uchinchi daraja |
| `line` | `#C9C2B3` | Chegaralar |
| `accent` | `#B03A18` | **Asosiy amal** — terrakota |
| `accent-soft` | `#F0A483` | Ogohlantirish foni |
| `success` | `#155C3E` | O'tdi, do'konda |
| `success-surface` | `#E4F0E8` | Muvaffaqiyat foni |

Ishlatish: `bg-surface`, `text-ink-muted`, `border-line`.
**Hech qachon** `bg-[#F7F4EE]` yozmang.

### Asosiy rang qoidasi

Sahifada **faqat bitta** `accent` tugma bo'ladi. Ikkitasi bo'lsa, mijoz
qaysi birini bosishni bilmaydi va to'xtaydi.

## Tipografiya

| Oila | Qachon |
| --- | --- |
| IBM Plex Sans | Hamma matn |
| IBM Plex Mono | Raqam, versiya, fayl yo'li, bo'lim yorlig'i |

Mono shrift «bu texnik ma'lumot» degan signal beradi va uni oddiy matndan
ajratadi: `v14`, `4 / 10`, `01 — LANDING`.

`.label-mono` sinfi: 12px, `0.14em` oraliq, katta harf, `ink-faint`.

| O'lcham | px | Qachon |
| --- | --- | --- |
| label | 12 | Mono yorliqlar |
| sm | 13 | Yordamchi matn |
| base | 15 | Asosiy matn |
| md | 17 | Kirish matni |
| lg | 20 | Karta sarlavhasi |
| xl | 26 | Bo'lim sarlavhasi |
| display | 34 | Ekran sarlavhasi |
| hero | 44 | Landing |

Sarlavhalarda `tracking-tight` (`-0.02em`), matnda `leading-relaxed`.

## Oraliq

4 ga karrali: 4, 8, 12, 16, 24, 32, 48, 72.
Bo'limlar orasi — 72px (`space-y-14` ≈ 56px va undan katta).

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

## Mobil ko'rinish

Dizayn kanvasidagi mobil ekranlar — **chizmalar, andoza emas**. Telefon
uchun alohida, native primitivlarga tayangan tartib quriladi:
`templates/mobile/docs/STYLE-GUIDE.md`.
