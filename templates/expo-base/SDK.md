# Expo SDK boshqaruvi

Bu loyiha **Expo SDK 57** da qotirilgan.

## Nega qotirilgan
Expo yiliga uch marta SDK chiqaradi va har biri buzuvchi o'zgarishlar bilan keladi.
Avtomatik yangilanish ishlab turgan ilovani buzadi. Yangilash — alohida ish.

## SDK 55 dan boshlangan qoida
Barcha `expo-*` paketlar SDK bilan **bir xil major versiyani** ishlatadi.
Ya'ni SDK 57 da `expo-router` ~57.x, `expo-status-bar` ~57.x va hokazo.
Paketlar SDK'lar orasida mos kelmasligi Expo tomonidan rasman e'lon qilingan —
`expo-router@7.x` ni SDK 57 ga qo'yib bo'lmaydi.

## Yangi paket qo'shganda
```bash
npx expo install <paket>
```
`npm install` emas — `expo install` SDK'ga mos versiyani tanlaydi.
