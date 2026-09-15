# Bloklar

Blok — kichik, qayta ishlatiladigan, **do'kon qoidalariga oldindan
moslangan** qism.

## Nega blok, shablon emas

**Do'kon xavfi.** Apple'ning 4.2 va 4.3 bandlari o'xshash ilovalar oqimiga
qarshi. 50 ta mijoz bitta shablondan chiqsa, Apple buni naqsh sifatida
ko'radi.

**Texnik xavf.** Prompt shablondan uzoqlashgan sayin agent begona kodni
buzadi.

Bloklar va domen bilimi bilan 50 ta ilova **har xil ko'rinadi, lekin bir
xil to'g'ri bo'ladi**.

## Agent bloklarni NOLDAN YOZMAYDI

Bloklar `generationPolicy: "parameterize_only"` bilan keladi. Agent
ularning fayllarini **parametrlashtiradi**, qayta yozmaydi.

Sabab: agent har safar noldan yozganda detallarni goh unutadi. Blok
hech qachon unutmaydi.

## Mavjud bloklar

| Blok | Preview | Ichida nima bor |
| --- | --- | --- |
| `auth` | Expo Go | Email/parol, Apple bilan kirish, **akkauntni o'chirish** ekrani |
| `data` | Expo Go | Supabase sxema, sinovdan o'tgan RLS naqshlari, offline kesh |
| `payments_iap` | Dev client | In-App Purchase — **faqat raqamli kontent uchun** |
| `payments_local` | Expo Go | Payme / Click / Uzum — **faqat jismoniy tovar va xizmat uchun** |
| `notifications` | Dev client | Ruxsat kontekst bilan, sozlamalar, opt-out |
| `media` | Dev client | Kamera va galereya, `NSUsageDescription` to'ldirilgan |
| `analytics` | Expo Go | Ixtiyoriy, rozilik bilan, privacy labels avtomatik |
| `onboarding` | Expo Go | Kirish oqimi, ruxsatlar to'g'ri tartibda |
| `navigation` | Expo Go | Expo Router — **qotirilgan, agent tegmaydi** |

## «Preview» ustuni nega bor

Mijoz blok **tanlashdan oldin** uning telefonda darhol ochilishini yoki
dev client kerakligini ko'rishi kerak.

Expo Go faqat Expo SDK ichidagi native modullarni ishlatadi. Uchinchi
tomon native paket qo'shilishi bilan u ishlamay qoladi va dev client
kerak bo'ladi — EAS orqali 5–15 daqiqada yig'iladi.

Bu oldindan aytilmasa, «ilovam telefonimda ochilmayapti» degan support
oqimi boshlanadi.

## RLS — kod emas, blok

AI generatsiya qilgan RLS qoidalari eng xavfli joy: **bitta xato butun
bazani ochib qo'yadi**.

`auth` va `data` bloklari sinovdan o'tgan RLS naqshlari bilan keladi.
Agent ularni faqat parametrlashtiradi, noldan yozmaydi.

## To'lov bloki — 3.1.1 qorovuli

| Nima sotiladi | Qaysi blok |
| --- | --- |
| Obuna, premium funksiya, kursga kirish, virtual tovar | `payments_iap` — **majburiy** |
| Yetkazib berish, taksi, bron, do'kondan xarid | `payments_local` — ruxsat etiladi |

Raqamli kontent uchun tashqi to'lov — **aniq rad etish**. Backend buni
loyiha yaratilayotganda tekshiradi va noto'g'ri tanlovda to'xtatadi.
