# Expo SDK boshqaruvi

Bu loyiha **Expo SDK 57** da qotirilgan.

| Nima | Qiymat | Qayerda |
| --- | --- | --- |
| Expo SDK | `~57.0.22` | `package.json` |
| React Native | `0.86.3` | `package.json` |
| React | `19.2.3` | `package.json` |
| New Architecture | yoqilgan | `app.json` → `newArchEnabled: true` |
| JS dvigateli | Hermes (standart) | — |
| Typed routes | yoqilgan | `app.json` → `experiments.typedRoutes` |

## Nega qotirilgan

Expo yiliga uch marta SDK chiqaradi va har biri buzuvchi o'zgarishlar
bilan keladi. Avtomatik yangilanish ishlab turgan, do'kondagi ilovani
buzadi. Yangilash — alohida ish va alohida xizmat.

| SDK | Nima bo'lgan |
| --- | --- |
| 55 | Legacy Architecture qo'llab-quvvatlashi to'xtatildi |
| 56 | `@expo/ui` stabil; Hermes V1 xotira regressiyasi bor edi |
| 57 | O'sha regressiya tuzatildi — bizning standartimiz |

## SDK 55 dan boshlangan qoida

Barcha `expo-*` paketlar SDK bilan **bir xil major versiyani** ishlatadi.
Shuning uchun bu loyihada `expo-router@~57.0.21`, `expo-status-bar@~57.0.1`,
`@expo/ui@~57.0.18` — hammasi 57.x. Eski raqamlash (`expo-router@3.x`)
SDK 57 ga **mos kelmaydi** va Expo buni rasman e'lon qilgan.

## Yangi paket qo'shish

```bash
npx expo install <paket>
```

`npm install <paket>` **emas**. Farqi: `expo install` paketning shu SDK
uchun sinovdan o'tgan versiyasini tanlaydi, `npm install` esa eng so'nggisini
oladi — u ko'pincha keyingi SDK uchun.

Mavjudini tekshirish:

```bash
npx expo install --check    # mos kelmaydiganini ko'rsatadi
npx expo install --fix      # mos versiyaga tushiradi
```

## Agent paket qo'shmaydi

Bu shunchaki uslub qoidasi emas, muhit cheklovi:

1. **Agentda terminal yo'q.** Uning vositalari — `read_file`, `edit_file`,
   `create_file`, `delete_file`, `list_files`, `search_files`,
   `update_design_note`. Buyruq bajaradigan vosita yo'q.
2. **`node_modules` umumiy.** Har workspace shablonning `node_modules`
   iga **symlink** qo'yadi (sovuq startni 0 ms qilish uchun). Ya'ni
   `package.json` ga qator qo'shish hech narsa o'rnatmaydi — import
   yig'ilishda yiqiladi va verify gate qizil bo'ladi.

Ilovaga yangi paket **faqat blok orqali** keladi: har blok o'z paketlar
ro'yxati bilan e'lon qilingan va uni backend o'rnatadi
(`docs/BLOCKS.md`).

## Expo Go devori

Expo Go — App Store'dagi tayyor ilova. U **faqat o'zi ichiga yig'ilgan
native modullarni** ishlata oladi: Expo SDK paketlari va Expo tanlagan
bir nechta kutubxona.

| Holat | Preview |
| --- | --- |
| Faqat Expo SDK modullari (shablonning boshlang'ich holati) | Expo Go — QR kod, darhol |
| Loyiha SDK'si Expo Go'nikidan yangi | `eas go` — o'z Expo Go build'ingiz |
| Uchinchi tomon native modul qo'shildi (RevenueCat, MMKV, maxsus kamera) | Dev client — EAS build 5–15 daqiqa |

Shuning uchun `docs/BLOCKS.md` dagi har blok yonida preview turi turadi:
mijoz blok **tanlashdan oldin** telefonida darhol ochiladimi yoki build
kutadimi bilishi kerak.

## `EXPO_PUBLIC_*` haqida

`.env` dagi `EXPO_PUBLIC_` bilan boshlanadigan qiymatlar **bundle ichiga
yoziladi** — ilovani yuklab olgan har kim ularni o'qiy oladi. Shuning
uchun u yerga faqat Supabase `anon` kaliti tushadi; `service_role` hech
qachon (u RLS'ni butunlay chetlab o'tadi).

Qiymat o'zgarsa Metro qayta ishga tushirilishi kerak — ular yig'ilish
paytida inline qilinadi, ish paytida o'qilmaydi.
