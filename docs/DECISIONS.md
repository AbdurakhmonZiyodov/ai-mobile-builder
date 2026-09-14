# Qarorlar

Spekda aniq yozilmagan yoki qurish paytida haqiqat bilan to'qnashgan joylar.
Har biri ochiq: raqam yoki yondashuv o'zgartirilsa, qayerga tegish kerakligi ko'rsatilgan.

---

## 1. Sinov tarifi 0 emas, 5 o'zgarish

**Spekda:** «Sinov · $0 · Design mode cheksiz, veb preview, telefonda ko'rish, kod ko'rish. **Build yo'q**».

**Muammo:** «Build yo'q» — bu do'konga chiqarish yo'q degani. Lekin 0 o'zgarish
qo'yilsa, mijoz g'oyasini umuman ko'ra olmaydi: birinchi so'rovi ham bloklanadi.
«G'oyani bir kunda ko'rish» va «birinchi preview < 90 soniya» maqsadlariga zid.

**Qaror:** sinovga 5 o'zgarish. `canBuild: false` saqlanadi — EAS build va do'kon yo'q.

**Qayerda:** `packages/shared/src/pricing.ts` -> `PLANS.trial.includedChanges`

---

## 2. Design mode'da agentga tahrir tool'lari berilmaydi

**Spekda:** «Design mode bepul — ekranlarni ko'rish, fikr o'zgartirish, cheksiz».

**Muammo:** hisob qoidasi design mode'ni 0 deb belgilaydi. Agar agent shu rejimda
ham `edit_file` ni ishlata olsa, mijoz har so'rovga «design mode» belgisini qo'yib
cheksiz bepul o'zgarish oladi. Marja teshigi.

**Qaror:** design mode'da tool to'plami faqat o'qish + `update_design_note`
(DESIGN.md). Ilova kodi tegilmaydi.

**Qayerda:** `packages/agent/src/tools.ts` -> `ToolContext.readOnly`

---

## 3. Expo SDK 57, 56 emas

**Spekda:** SDK 56 dan `@expo/ui` stabil; SDK 56 da Hermes V1 xotira regressiyasi
bor, SDK 57 da tuzatilgan.

**Qaror:** standart SDK — 57. Regressiyasiz va `@expo/ui` bor. Reestrda 56 ham
qo'llab-quvvatlanadi (bir vaqtda ko'pi bilan ikkita SDK qoidasi).

**Qayerda:** `packages/shared/src/sdk.ts`

**Amaliy tafsilot:** SDK 55 dan boshlab barcha `expo-*` paketlar SDK bilan bir xil
major versiyada. Ya'ni `expo-router@57.x`, `@7.x` emas. Shablon shunga moslangan.
Yangi paket faqat `npx expo install` bilan qo'shiladi.

---

## 4. `react/no-unescaped-entities` o'chirilgan

**Muammo:** o'zbek lotin yozuvida apostrof har qadamda: «o'zgarish», «yo'q»,
«bo'lmasa». ESLint'ning bu qoidasi har bittasini xato deb belgilaydi. Verify gate
yiqiladi, agent 3 ta bepul tuzatish urinishini apostrof qochirishga sarflaydi va
halol to'xtashga boradi. Mijoz esa hech narsa olmaydi.

**Qaror:** qoida o'chirilgan. React Native matnida u baribir ma'nosiz.

**Qayerda:** `templates/expo-base/eslint.config.js`

---

## 5. `npm exec` dan keyin `--` majburiy

**Topilgan xato:** `npm exec eslint . --max-warnings 0` — npm `--max-warnings 0`
ni **o'zining** bayrog'i deb oladi, ESLint esa «0» nomli faylni qidiradi va
yiqiladi. Verify gate soxta xato beradi, agent tuzata olmaydigan narsani tuzatishga
urinadi, o'zgarish hisoblanmaydi.

**Qaror:** hamma joyda `npm exec -- <vosita> <bayroqlar>`.

**Qayerda:** `packages/verify/src/index.ts`, `apps/api/src/routes/preview.ts`

---

## 6. Workspace bog'liqliklari — symlink

**Spekda:** «Isitilgan hovuz 1-haftada», «sovuq start 3 daqiqadan oshsa mijozning
yarmi ketadi».

**O'lchangan:** `node_modules` ni APFS clone (`COPYFILE_FICLONE`) bilan nusxalash —
**9.8 s**. `npm install` — 36 s. Symlink — **0 ms**.

**Qaror:** MVP'da symlink. Loyiha yaratish 0.2 s da tugaydi.

**Cheklovi:** bog'liqliklar shablon bilan umumiy. Workspace ichida yangi paket
o'rnatishdan oldin `isolateDependencies()` chaqirilishi **shart**. Ishlab
chiqarishda buning o'rnini Docker obrazi qatlami egallaydi.

**Qayerda:** `packages/workspace/src/local-driver.ts`

---

## 7. tRPC emas, Hono + zod shartnomalar

**Spekda:** «API / Orkestrator — Node 20+ yoki Bun, tRPC, SSE».

**Qaror:** Hono + `packages/shared` dagi zod sxemalari. Sabab: asosiy kanal —
SSE oqimi, tRPC uni qo'shimcha qatlam bilan o'raydi. Turlar baribir bitta manbadan
(`contracts.ts`, `events.ts`) keladi. tRPC keyin ustiga qo'yilsa ham bo'ladi.

---

## 8. Node 22 talab qilinadi

AI SDK 7 `node >= 22` talab qiladi. Mashinada 20.19.5 aktiv edi, nvm'da 22.16.0 bor.
`.nvmrc` va `engines` qo'yildi.

---

## 9. TypeScript 5.9, `expo install --check` 6.0.3 so'raydi

Expo 57 `typescript@~6.0.3` ni kutadi, lekin npm'da TS 6 ning stabil relizi yo'q
(faqat `6.0.0-beta` va dev build'lar; `latest` esa 7.0.2). Shablon 5.9.3 da toza
typecheck qiladi. TS 6 chiqqach qayta ko'riladi.

---

## Hali qurilmagan (spek bo'yicha keyingi navbat)

| Nima | Spek | Hafta |
| --- | --- | --- |
| E2E tekshiruv agenti (Maestro + vision) | 12-bo'lim | 9–10 |
| EAS Build va TestFlight (`asc` CLI) | 13-bo'lim | 13 |
| `eas go` va dev client yig'ish | 10.3 | 8 |
| Konteyner izolyatsiyasi (Firecracker / gVisor) | 16.2 | 2 |
| Auth va billing | 6-bo'lim | 15 |
| Rad etishlar dashboardi | 3.1 | v1.3 |
| Payme / Click / Uzum blokining implementatsiyasi | 14.2 | v1.3 |

Hozir bularning **sxemasi va interfeysi** bor (`rejections`, `builds` jadvallari,
`payments_local` bloki, preview yo'llari), amalga oshirilishi yo'q.
