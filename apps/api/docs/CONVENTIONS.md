# Qoidalar va uslub

Bu fayl did masalasi emas. Har band aniq bir muammoni yopadi va sababi
yozilgan. Sabab eskirsa — qoida ham qayta ko'riladi; sababsiz o'zgartirilmaydi.

---

## 1. Fayl nomlari

> Nima uchun: nom faylning qaysi qatlamga tegishli ekanini ochib berishi
> kerak. Shunda `grep` bilan izlash o'rniga to'g'ridan-to'g'ri ochiladi.

| Tur | Naqsh | Misol |
| --- | --- | --- |
| Controller | `<modul>.controller.ts` | `projects.controller.ts` |
| Service | `<modul>.service.ts` | `agent.service.ts` |
| Repository | `<modul>.repository.ts` | `billing.repository.ts` |
| Module | `<modul>.module.ts` | `verify.module.ts` |
| Turlar | `<modul>.types.ts` | `verify.types.ts` |
| DTO | `<amal>-<obyekt>.dto.ts` | `create-project.dto.ts` |
| Baza sxemasi | `<jadval>.schema.ts` | `projects.schema.ts` |
| Agent tool | `<amal>-<obyekt>.tool.ts` | `edit-file.tool.ts` |
| Do'kon qoidasi | `<mavzu>.rule.ts` | `account-deletion.rule.ts` |
| Prompt | `<maqsad>.prompt.ts` | `classifier.prompt.ts` |

Papka nomlari — birlikda emas, ishning nomi bilan: `tools/`, `prompts/`,
`rules/`, `drivers/`, `schema/`.

---

## 2. TypeScript

> Nima uchun: sozlama qattiq, chunki bu kod begona kodni bajaradigan
> tizimning o'zagi. Turdagi xato bu yerda ish vaqtida chiqsa, uni mijoz
> topadi.

`tsconfig.json` da yoqilgan va **o'chirilmaydi**:

| Bayroq | Nima beradi |
| --- | --- |
| `strict` | To'liq qat'iy rejim |
| `noUncheckedIndexedAccess` | `arr[i]` turi `T \| undefined` bo'ladi |
| `noImplicitOverride` | `override` kalit so'zi majburiy |
| `noUnusedLocals` / `noUnusedParameters` | O'lik kod qolib ketmaydi |
| `experimentalDecorators` + `emitDecoratorMetadata` | NestJS DI turga tayanadi |

Modul tizimi — `NodeNext`. **`any` ishlatilmaydi**; noma'lum qiymat uchun
`unknown` va aniq tekshiruv (`isRecord()`, `asString()` kabi kichik
yordamchilar).

---

## 3. Import tartibi

```ts
import fs from "node:fs/promises";                        // 1. Node
import { Injectable } from "@nestjs/common";              // 2. Tashqi paketlar
import { PLANS } from "@amb/core-rules";                  // 3. Monorepo paketlari
import { DatabaseService } from "../../infrastructure/…"; // 4. Ichki modullar
import type { Project } from "./types.js";                // 5. Faqat turlar
```

| Qoida | Nega |
| --- | --- |
| Nisbiy yo'llar, `@/` taxallusi emas | TypeScript 7 `baseUrl` ni olib tashladi; taxallusni ish vaqtida yechish uchun qo'shimcha vosita kerak bo'lardi |
| `.js` kengaytmasi **majburiy** | `moduleResolution: NodeNext` shuni talab qiladi. Frontend'da teskarisi: u `bundler` rejimida va kengaytmasiz |
| Faqat tur import qilinsa — `import type` | Tur importi bundle'ga tushmaydi va aylanma bog'liqlik yasamaydi |

---

## 4. Izohlar

> Nima uchun: kod **nima qilishini** o'zi aytadi. Izoh esa **nega shunday
> qilinganini** saqlaydi — bu yagona joyda yashaydigan ma'lumot.

Har controller metodi va har muhim funksiya ustida o'zbekcha izoh.

```ts
/**
 * GET /projects/:id/usage — AI xarajati.
 *
 * Bu mijozga emas, BIZGA kerak: bitta o'zgarishning tannarxi $0,60 dan
 * oshsa, $5 lik narx marjani yo'qotadi.
 */
```

| Yaxshi izoh | Yomon izoh |
| --- | --- |
| «Nega bitta atomar so'rov: o'qib-keyin-yozish ikki parallel so'rovda bitta qoldiqni ikki marta sarflashi mumkin edi» | «Qoldiqni kamaytiradi» |
| «Avval bu holat "o'tdi" deb belgilanardi — natijada tekshirilmagan kod uchun pul olinardi» | «Vosita bor-yo'qligini tekshiradi» |

**Amalda uchragan xato haqidagi izoh o'chirilmaydi.** U qaytadan qilinmasligi
kerak bo'lgan xatoning yagona qaydnomasi.

---

## 5. Xatolar

> Nima uchun: mijoz — texnik bo'lmagan biznes egasi. Xato unga nima
> bo'lganini va endi nima qilishini aytishi kerak.

Har xato `messageUz` bilan tashlanadi:

```ts
throw new NotFoundException({ messageUz: "Loyiha topilmadi." });
```

Global filtr (`common/filters/http-exception.filter.ts`) ularni bir xil
shaklga soladi. Qo'shimcha maydonlar (`fields`, `clause`, `warningsUz`)
javobga o'tkaziladi; texnik tafsilot (`detail`) **faqat** development'da —
ishlab chiqarishda u ichki tuzilma haqida ma'lumot sizdiradi.

| Holat | Qaysi istisno |
| --- | --- |
| Topilmadi | `NotFoundException` |
| Kiruvchi ma'lumot noto'g'ri | `BadRequestException` (odatda `ZodValidationPipe` orqali) |
| Do'kon qoidasiga zid | `UnprocessableEntityException` + `clause` |
| Ruxsat yo'q | `ForbiddenException` |

**Model xatolari alohida:** ular `LlmError` ga aylantiriladi
(`classifyLlmError()`), xom provayder xatosi hech qachon yuqoriga chiqmaydi.

**Xato xabarida majburiy:** pul olinganmi yoki yo'qmi. Mijoz «xato bo'ldi,
lekin pulim yechildimi?» degan savol bilan qolmasligi kerak.

---

## 6. Workspace ichida vosita ishga tushirish

> Nima uchun: bu bo'lim ikkita **amalda uchragan** xatoni yopadi.

`npm exec` **ishlatilmaydi**. Vosita loyihaning `node_modules/.bin` idan
to'g'ridan-to'g'ri chaqiriladi:

```ts
const bin = await ws.resolveBin("tsc");
if (!bin) {
  // Muhit nosozligi — tekshiruv "o'tkazilmadi" deb belgilanadi (unavailable),
  // hisob 0 bo'ladi va tuzatish tsikli ishga tushmaydi.
}
await ws.exec(bin, ["--noEmit", "--pretty", "false"]);
```

| Nega `npm exec` emas | Nima bo'lgan |
| --- | --- |
| U vosita topilmasa **reyestrdan paket yuklab bajaradi** | `tsc` uchun bu TypeScript emas, butunlay begona paket bo'lib chiqdi — tekshiruv tasodifiy kodni bajargan bo'lardi |
| Undan keyin `--` esdan chiqsa, npm bayroqlarni o'zi yeydi | `npm exec eslint . --max-warnings 0` da npm `--max-warnings 0` ni o'zining bayrog'i deb oldi va ESLint «0» nomli faylni qidirdi |

`exec()` da `shell: false` — buyruq satri orqali inyeksiya bo'lmasligi
uchun. Muhit: `CI=1`, `NO_COLOR=1`, `FORCE_COLOR=0`; standart timeout 120 s.

---

## 7. Log

```ts
private readonly logger = new Logger(ProjectsService.name);
this.logger.log(`Loyiha yaratildi: ${projectId} (${packId})`);
```

| Daraja | Qachon |
| --- | --- |
| `log` | Muhim biznes hodisasi: loyiha yaratildi, run tugadi, backend ulandi |
| `warn` | Kutilgan nosozlik: verify o'tmadi, preview yig'ilmadi |
| `error` | Kutilmagan nosozlik yoki muhit buzilishi: vosita topilmadi, model yiqildi |

Log'da **hech qachon**: kalit, parol, mijoz kontenti, `service_role`,
so'rov matnining to'liq nusxasi. Log ishlab chiqarishda saqlanadi va
uzatiladi — u yerga tushgan narsa o'chirilmaydi deb hisoblang.

ID'lar aksincha **doim** yoziladi (`prj_…`, `run_…`): qo'llab-quvvatlashda
aynan shular bo'yicha izlanadi.

---

## 8. Test

> Holati ochiq aytiladi: `vitest` bog'liqlik sifatida bor va `npm run test`
> skripti bor, lekin **hozircha birorta ham test fayli yozilmagan**.

Test yozilganda tartib shunday bo'ladi:

| Nima | Qanday |
| --- | --- |
| `@amb/core-rules` (narx, hisob, preview qarori) | Sof funksiyalar — bazasiz, mock'siz |
| `modules/review/rules/` | Har qoida alohida, `CheckerInput` yasab |
| `modules/verify/error-extractor.ts` | Vosita chiqishining namunasi bilan |
| Servislar | Repository mock qilinadi |
| Controller'lar | Test qilinmaydi — ularda mantiq yo'q |

**Qoida:** yangi sof funksiya (`rules/`, `core-rules`) qo'shilsa, testi ham
qo'shiladi. Sof funksiya — testlash eng arzon bo'lgan joy; u yerda test
yozilmasa, boshqa joyda ham yozilmaydi.

---

## 9. Lint

| Nima | Holati |
| --- | --- |
| **Workspace** ichidagi ESLint (verify gate) | Ishlaydi. Konfiguratsiya `templates/mobile/eslint.config.js` da, ESLint o'sha yerdagi `node_modules` dan keladi |
| **`apps/api` ning o'z linti** | `lint` skripti bor, lekin konfiguratsiya fayli ham, `eslint` bog'liqligi ham yo'q — hozircha ishlamaydi |

`react/no-unescaped-entities` qoidasi shablonda ataylab o'chirilgan:
o'zbek lotin yozuvida apostrof har qadamda uchraydi («o'zgarish», «yo'q»),
va bu qoida verify gate'ni yiqitib, agentning uchta bepul urinishini
apostrof qochirishga sarflatardi.

---

## 10. Qattiq qoidalar — qisqacha

| Qoida | Buzilsa nima bo'ladi |
| --- | --- |
| `process.env` ga to'g'ridan-to'g'ri murojaat yo'q | Sozlama qayerda ishlatilishi ko'rinmay qoladi, testda almashtirib bo'lmaydi |
| `any` yo'q | Qat'iy rejimning barcha foydasi bekor bo'ladi |
| Yangi kutubxona qo'shilmaydi (drizzle, zod, `fetch` yetarli) | Yangilanish yuki va yangi xavfsizlik yuzasi |
| Sxema `@amb/contracts` da, ikki nusxa emas | Frontend va backend vaqt o'tib bir-biridan uzoqlashadi |
| Hisob faqat `modules/billing` orqali | Mijozdan ikki marta yoki noto'g'ri pul olinadi |
| SQL faqat repository'da | Biznes qoidasini bazasiz testlab bo'lmaydi |
| `npm exec` yo'q | Yuqoridagi 6-bo'lim |
| Kalit log qilinmaydi | Kalit tarqaladi va uni qaytarib bo'lmaydi |
| Izoh «nega» ni aytadi | Qaror sababi yo'qoladi va keyingi odam uni bekor qiladi |
