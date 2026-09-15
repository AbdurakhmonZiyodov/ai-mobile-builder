# agent — agent tsikli

Mahsulotning yuragi: mijoz xabaridan ishlaydigan kodga qadar.

Bu modul **kod yozmaydi** — model yozadi. Modul modelga kontekst tayyorlaydi,
tool beradi, natijani `verify` moduliga tekshirtiradi va `billing` ga
hisob qaroriga topshiradi.

---

## 1. Fayllar

| Fayl | Javobgarligi |
| --- | --- |
| `agent.controller.ts` | `POST /chat` — SSE oqimi va oqim tugagach bazaga yozish |
| `agent.service.ts` | Bosqichlarni tartiblash; tsiklning yagona egasi |
| `agent.types.ts` | `RunAgentInput` va `RunAgentResult` |
| `agent.module.ts` | DI ulanishi |
| `classifier.service.ts` | So'rov turi: savol / noaniq / kichik / o'rta / katta |
| `context-builder.service.ts` | Kontekst byudjeti, suhbat, tegishli fayllar |
| `repair.service.ts` | Verify gate va bepul tuzatish tsikli |
| `tools/` | Har tool alohida faylda + `tool.registry.ts` |
| `prompts/` | Har prompt alohida faylda |

Tsiklning to'liq sxemasi: [`docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md) → «Agent tsikli».

---

## 2. Nega tasniflash birinchi

Mahsulot va'dasi: **savol bepul, noaniq so'rov bepul, xato tuzatish bepul.**
Nima hisoblanishini oldindan bilmasak, bu va'dani bajarib bo'lmaydi.

| Qaror | Sabab |
| --- | --- |
| Tasniflash `cheap` modelda | U **har xabarda** chaqiriladi. Kuchli model bitta o'zgarishning tannarxini sezilarli oshirardi, aniqlik esa deyarli o'zgarmasdi |
| Bitta chaqiruv, `temperature: 0` | Aniqlashtiruvchi savol ham shu javobda keladi. Ikkinchi chaqiruv qo'shimcha kechikish va xarajat bo'lardi |
| Shubhada `unclear` | Noto'g'ri ish qilib pul olgandan ko'ra, savol bergan yaxshi |
| Kutilmagan javob ham `unclear` | Model JSON o'rniga matn qaytarsa yoki noma'lum `kind` bersa — `pickKind()` uni `unclear` ga tushiradi |

Design mode'da tasniflagich **umuman chaqirilmaydi**: `kind` darhol
`"design"` bo'ladi va modelga bitta ham so'rov ketmaydi.

---

## 3. Tool'lar

> Nima uchun ikki to'plam: design mode «kod o'zgarmaydi» degani. Agar u
> rejimda ham tahrir tool'i bo'lsa, mijoz har so'rovga «design mode»
> belgisini qo'yib cheksiz bepul o'zgarish oladi — marja teshigi.

`tools/tool.registry.ts` → `buildTools({ ws, changes, readOnly, onFileChanged })`.

### O'qish to'plami — har rejimda

| Tool | Parametrlari | Nima qiladi |
| --- | --- | --- |
| `list_files` | `dir: string` (standart `"."`) | Papkadagi fayllar ro'yxati |
| `read_file` | `path: string`, `startLine?: number`, `endLine?: number` | Faylni **qator raqamlari bilan** o'qiydi |
| `search_files` | `query: string`, `glob?: string` | Loyiha bo'ylab matn qidiradi |

### Yozish to'plami — faqat `readOnly: false`

| Tool | Parametrlari | Nima qiladi |
| --- | --- | --- |
| `edit_file` | `path`, `oldText`, `newText` | Nuqtali diff |
| `create_file` | `path`, `content` | **Faqat yangi** fayl |
| `delete_file` | `path` | Faylni o'chiradi |

### Design mode to'plami — faqat `readOnly: true`

| Tool | Parametrlari | Nima qiladi |
| --- | --- | --- |
| `update_design_note` | `content: string` | `DESIGN.md` ni to'liq almashtiradi |

`update_design_note` oddiy rejimda **berilmaydi**, `edit_file` esa design
mode'da berilmaydi. Ikki to'plam kesishmaydi.

---

## 4. Nega faqat `edit_file`

To'liq faylni qayta yozish ikki sababdan taqiqlangan:

| Sabab | Tafsilot |
| --- | --- |
| **Narx** | 400 qatorli ekranni qayta yozish ~6000 token, nuqtali diff ~200 |
| **Sifat** | Model faylni qaytadan yozganda tegishi shart bo'lmagan joyni ham o'zgartiradi va ishlab turgan kodni buzadi |

Buni uchta mexanizm ushlab turadi:

1. `create_file` mavjud faylni qayta yozmaydi — model `edit_file` ga
   yo'naltiriladi.
2. `edit_file` da `oldText` fayl ichida **aynan bir marta** uchrashi shart.
   Ko'p uchrasa, drayver xato beradi va modeldan ko'proq kontekst so'raydi.
3. Quruvchi prompt (`prompts/builder.prompt.ts`) buni birinchi qattiq qoida
   qilib beradi.

---

## 5. Nega uch urinish

Cheksiz urinish ikki narsani buzadi: bizning marjani va mijozning ishonchini
— u ekranda soatlab aylanayotgan indikatorni ko'radi va nima bo'layotganini
bilmaydi.

| Holat | Xatti-harakat |
| --- | --- |
| Tekshiruv o'tdi | Tsikl tugaydi, commit qilinadi, 1 hisoblanadi |
| Xato boshqacha | O'sha tier'da qayta urinish |
| **Bir xil xato ikki marta** | `standard` → `strong` ga o'tiladi: model o'z darajasida yechimni topolmayotgani aniq bo'ldi |
| Vosita topilmadi (`unavailable`) | Tsikl **umuman boshlanmaydi** — model muhit xatosini tuzata olmaydi |
| 3 urinish yetmadi | Halol to'xtash |

> **Diqqat — tez-tez xato qilinadigan joy:** eskalatsiya `cheap` dan emas,
> `standard` dan boshlanadi. `cheap` tier faqat tasniflashda ishlatiladi va
> tuzatish tsikliga hech qachon tushmaydi. `large` turidagi o'zgarish esa
> allaqachon `strong` da boshlanadi — unda eskalatsiya bo'lmaydi.

Uchdan keyin: o'zgarishlar `discardUncommitted()` bilan bekor qilinadi va
mijozga aytiladi — «bu xatoni hal qila olmadim, ilovangiz oldingi ishlaydigan
holatida turibdi, bu o'zgarish hisoblanmadi».

**Tuzatish konteksti ataylab tor:** faqat xato matni (`errorDigest`) va
`MAP.md`. Keng kontekst modelni o'sha xato yo'ldan yana olib ketadi.

---

## 6. Promptlar

| Fayl | Eksport | Qayerda ishlatiladi |
| --- | --- | --- |
| `classifier.prompt.ts` | `CLASSIFIER_SYSTEM` | `ClassifierService` |
| `builder.prompt.ts` | `builderSystem(input)` | Asosiy tahrir tsikli |
| `repair.prompt.ts` | `repairSystem(attempt, max)` | Tuzatish tsikli |
| `answer.prompt.ts` | `ANSWER_SYSTEM` | Savolga javob |

`builderSystem()` ichidagi qattiq qoidalar ro'yxati did masalasi emas: har
band amaliyotda ko'rilgan xatoning oldini oladi — model uzun faylda adashadi,
`ScrollView` ichida `.map()` bilan ro'yxat yozadi, navigatsiyani buzadi,
bloklarni noldan qayta yozib do'kon talablarini unutadi.

**Promptdagi band o'chirilmaydi**, agar u yopayotgan xato boshqa yo'l bilan
yopilmagan bo'lsa.

---

## 7. Qattiq qoidalar

| Qoida | Nega |
| --- | --- |
| Hisob qarorini bu modul qabul qilmaydi | Qaror `@amb/core-rules` → `decideCharge()` da; agent faqat `billing.decide()` ni chaqiradi |
| Har fayl o'zgarishi `recordChange()` dan o'tadi | Usiz o'zgarish ro'yxatga tushmaydi: diff «bo'sh» ko'rinadi, UI'da fayl chiqmaydi va commit qilinmasdan qoladi |
| Verify o'tmasa `discardUncommitted()` majburiy | Aks holda buzuq fayllar keyingi run'ning `git add -A` si bilan begona versiyaga tushadi |
| `settle()` har yo'lda chaqiriladi | `charge` va `run.finished` hodisalari **doim** yuboriladi — mijoz nima uchun pul olinganini (yoki olinmaganini) bilishi kerak |
| Butun repo modelga yuborilmaydi | Narx va sifat. Kontekst chegaralari `context-builder.service.ts` da |
| Design mode'da tahrir tool'i berilmaydi | 3-bo'lim |

## Nima qilish TAQIQLANGAN

- Design mode'ga `edit_file`, `create_file` yoki `delete_file` qo'shish.
- Tuzatish urinishlari sonini `MAX_REPAIR_ATTEMPTS` dan boshqa joyda
  o'zgartirish yoki uni oshirish.
- `unavailable` holatida tuzatish tsiklini ishga tushirish.
- Hisobni verify gate'dan **oldin** yozish.
- Tasniflashni `standard` yoki `strong` tier'ga ko'chirish.
- Modelga `system` rolli xabarni `messages` ichida yuborish — AI SDK 7 da
  u `instructions` orqali beriladi (`gateway.provider.ts`).

---

## 8. Yangi tool qo'shish

1. `tools/<amal>-<obyekt>.tool.ts` yarating — `defineTool({ name,
   description, parameters, execute })`.
2. `execute` hech qachon istisno tashlamasin: xatoni `{ ok: false, output }`
   bilan qaytaring — model uni o'qib o'zini tuzata oladi.
3. Fayl o'zgartirsa — `recordChange(ctx, result)` chaqiring.
4. `tools/tool.registry.ts` ga qo'shing va **qaysi to'plamga** tushishini
   hal qiling (o'qish / yozish / design).
5. Shu fayldagi jadvalni yangilang.
