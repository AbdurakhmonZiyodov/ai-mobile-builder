# API — barcha endpointlar

Bu fayl **shartnoma**: har endpointning so'rov va javob SHAKLI maydon
nomlari va turlari bilan yozilgan. Kodni o'zgartirsangiz, shu faylni ham
o'zgartiring — aks holda frontend nima kutishini bilmay qoladi.

---

## 0. Umumiy qoidalar

| Narsa | Qiymat |
| --- | --- |
| Bazaviy manzil | `http://localhost:4000` (`PORT`, standart 4000) |
| CORS | Faqat `AMB_WEB_ORIGIN` (standart `http://localhost:3000`), `credentials: true` |
| Format | JSON (`POST /chat` dan tashqari — u SSE) |
| Autentifikatsiya | **Yo'q.** `@CurrentUser()` doim `"usr_demo"` qaytaradi |
| Validatsiya | zod, sxemalar `@amb/contracts` da |

### Xato javobi — hamma joyda bir xil

`common/filters/http-exception.filter.ts` har xatoni shu shaklga soladi:

| Maydon | Tur | Qachon bor |
| --- | --- | --- |
| `ok` | `false` | Doim |
| `messageUz` | `string` | Doim — mijozga ko'rsatiladigan o'zbekcha matn |
| `path` | `string` | Doim — so'rov manzili |
| `at` | `string` (ISO) | Doim |
| `fields` | `Array<{ field: string; messageUz: string }>` | zod validatsiyasi yiqilganda (400) |
| `clause` | `string` | Do'kon bandi xatosi (masalan `"3.1.1"`, 422) |
| `warningsUz` | `string[]` | Ogohlantirish bo'lsa |
| `detail` | `string` | **Faqat** `NODE_ENV=development` |

```json
{
  "ok": false,
  "messageUz": "Loyiha topilmadi.",
  "path": "/projects/prj_xyz",
  "at": "2026-09-15T10:22:31.004Z"
}
```

> **Nega `messageUz` majburiy:** mijoz — texnik bo'lmagan biznes egasi.
> «Internal Server Error» unga hech narsa aytmaydi va qo'rqitadi.

---

## 1. Health

> Nima uchun: sozlama xatosini topishning eng tez yo'li.

### `GET /health`

**So'rov:** yo'q.

**Javob `200`:**

| Maydon | Tur | Izoh |
| --- | --- | --- |
| `ok` | `true` | |
| `models.cheap` | `string` | Tasniflagich modeli, masalan `"anthropic/claude-haiku-4.5"` |
| `models.standard` | `string` | Kundalik tahrir modeli |
| `models.strong` | `string` | Katta o'zgarish va qaytalangan xato modeli |
| `gatewayConfigured` | `boolean` | Kalit bormi. **Kalitning o'zi hech qachon qaytmaydi** |
| `defaultSdk` | `number` | Yangi loyiha uchun Expo SDK (`DEFAULT_SDK`) |
| `expoGoSdk` | `number` | App Store'dagi Expo Go qaysi SDK'da (`EXPO_GO_APP_STORE_SDK`) |
| `workspaceRoot` | `string` | Loyihalar papkasining absolut yo'li |
| `templateDir` | `string` | Shablon papkasining absolut yo'li |

```json
{
  "ok": true,
  "models": {
    "cheap": "anthropic/claude-haiku-4.5",
    "standard": "anthropic/claude-sonnet-5",
    "strong": "anthropic/claude-opus-5"
  },
  "gatewayConfigured": true,
  "defaultSdk": 57,
  "expoGoSdk": 57,
  "workspaceRoot": "/…/workspaces",
  "templateDir": "/…/templates/mobile"
}
```

> **Nega model ID'lari qaytadi:** «nega javob sekin?» degan savolga
> «kuchli model tanlangan» javobi shu yerdan ko'rinadi.

---

## 2. Loyihalar

> Nima uchun: mahsulotning kirish nuqtasi va mijozning asosiy obyekti.

### `ProjectSummary` — qayta ishlatiladigan shakl

`modules/projects/dto/project-summary.dto.ts`. Baza qatoridan **farq
qiladi**: `userId` va `updatedAt` ataylab chiqarilmaydi.

| Maydon | Tur |
| --- | --- |
| `id` | `string` (`prj_…`) |
| `name` | `string` |
| `status` | `"draft" \| "building" \| "ready" \| "failed"` |
| `sdk` | `number` |
| `domainPack` | `string \| null` |
| `blocks` | `string[]` |
| `sells` | `"digital" \| "physical_or_service"` |
| `plan` | `string` |
| `previewPath` | `"web" \| "expo_go" \| "eas_go" \| "dev_client"` |
| `previewUrl` | `string \| null` |
| `balance.included` | `number` — tarifga kiradigan o'zgarishlar |
| `balance.used` | `number` |
| `balance.extraPurchased` | `number` — sotib olingan qo'shimchalar |
| `balance.extraUsed` | `number` |
| `createdAt` | `string` (ISO) |

---

### `GET /projects`

Mijozning loyihalari, har birida qoldiq bilan. Eng yangisi birinchi, 50 tagacha.

**Javob `200`:** `{ "projects": ProjectSummary[] }`

> **Nega qoldiq ham shu javobda:** «Loyihalarim» ekranida har qator yonida
> «qoldiq 4/10» ko'rinadi. Alohida endpoint bo'lsa, ro'yxat N marta so'rov
> yuborardi.

---

### `POST /projects`

Yangi loyiha. **Mahsulotning kirish nuqtasi.**

**So'rov** (`createProjectInput`, `@amb/contracts`):

| Maydon | Tur | Majburiy | Izoh |
| --- | --- | --- | --- |
| `name` | `string` (2–60) | ha | Ilova nomi |
| `prompt` | `string` (3–4000) | ha | Mijozning birinchi jumlasi |
| `domainPack` | `string` | yo'q | Berilmasa `guessDomainPack(prompt)` bilan taxmin qilinadi |
| `blocks` | `string[]` | yo'q (standart `[]`) | Bo'sh bo'lsa domen paketining tavsiyasi olinadi |
| `sdk` | `number` (butun) | yo'q | Berilmasa `DEFAULT_SDK` |
| `locale` | `"uz" \| "ru" \| "en"` | yo'q (standart `"uz"`) | **Hozircha ishlatilmaydi** — qabul qilinadi, saqlanmaydi |

```json
{
  "name": "Barber Studio",
  "prompt": "Sartaroshxonam bor, mijozlar navbat olsin",
  "blocks": []
}
```

**Javob `201`:**

| Maydon | Tur | Izoh |
| --- | --- | --- |
| `projectId` | `string` (`prj_…`) | |
| `domainPack` | `string \| null` | Aniqlangan domen |
| `blocks` | `string[]` | Yakuniy blok ro'yxati |
| `preview.path` | `"web" \| "expo_go" \| "eas_go" \| "dev_client"` | Qaysi yo'l |
| `preview.reasonUz` | `string` | **Nega shu yo'l** — bir jumla |
| `preview.fallback` | `PreviewPath` | Zaxira yo'l (amalda doim `"web"`) |
| `blockInfo` | `Array<{ id: string; nameUz: string; preview: "expo_go" \| "dev_client" }>` | Har blokning preview turi |

**Xatolar:**

| Kod | Qachon |
| --- | --- |
| `400` | Validatsiya — `fields` bilan |
| `422` | Noto'g'ri to'lov tanlovi. Javobda `clause: "3.1.1"` |

> **Nega `422` alohida:** raqamli kontent uchun Payme/Click bloki tanlansa,
> ilova Apple 3.1.1 bandi bo'yicha **albatta** rad etiladi. Buni boshida
> to'xtatgan arzonroq — tekshiruv `checkPaymentChoice()` da.

> **Nega bitta so'rovda hammasi:** mijoz bitta jumla yozadi va darhol natija
> ko'rishi kerak. Domen aniqlash, blok tanlash va workspace yaratish uchun
> alohida qadamlar mijozni yo'qotadi.

> **Diqqat:** yaratishda preview qarori `hasAppleAccount: false` bilan
> hisoblanadi. Apple akkaunti bo'lsa, `GET /preview/:id?apple=1` boshqa
> javob beradi.

---

### `GET /projects/:id`

**Javob `200`:** `ProjectSummary` (o'ram yo'q). `404` — topilmasa.

---

### `GET /projects/:id/files`

Fayl daraxti — **faqat ro'yxat, kontentsiz**.

**Javob `200`:** `{ "files": Array<{ path: string; type: "file" | "dir"; size?: number }> }`

`size` faqat fayllarda. `node_modules`, `.git`, `.expo`, `dist`, `build`,
`.turbo`, `ios`, `android`, `.amb-web`, `.amb-bundle`, `.amb-cache`
chiqarilmaydi. Eng ko'pi 400 element.

> **Nega kontentsiz:** workspace'da yuzlab fayl bor; hammasini yuborish bir
> necha megabayt bo'lardi.

---

### `GET /projects/:id/file?path=…`

**So'rov:** `path` — query parametr, **majburiy**, loyihaga nisbatan yo'l.

**Javob `200`:** `{ "path": string, "content": string }`

Yo'l workspace'dan chiqib ketsa (`../`), `LocalWorkspace.resolve()` uni rad
etadi. `path` berilmasa yoki fayl topilmasa — `500` (bu joy hali toza
ishlanmagan).

---

### `GET /projects/:id/messages`

Suhbat tarixi — sahifa qayta ochilganda tiklash uchun. Eskisi birinchi, 100 tagacha.

**Javob `200`:** `{ "messages": Message[] }`, bu yerda `Message` — **baza
qatori**:

| Maydon | Tur |
| --- | --- |
| `id` | `string` (`msg_…`) |
| `projectId` | `string` |
| `role` | `"user" \| "assistant"` |
| `content` | `string` |
| `createdAt` | `string` (ISO) |

---

### `GET /projects/:id/versions`

Versiya tarixi. Eng yangisi birinchi, 50 tagacha.

**Javob `200`:** `{ "versions": Version[] }`:

| Maydon | Tur | Izoh |
| --- | --- | --- |
| `id` | `string` (`ver_…`) | |
| `projectId` | `string` | |
| `gitSha` | `string` | Workspace'dagi commit |
| `label` | `string` | **Mijozning o'z so'rovi**, 80 belgigacha |
| `filesChanged` | `Array<{ path: string; added: number; removed: number }>` | |
| `createdAt` | `string` (ISO) | |

> **Nega `label`:** mijozga git SHA emas, o'zi yozgan matn ko'rsatiladi —
> «Bron tugmasini yashil qil». U shundan qaysi versiya ekanini biladi.

---

### `POST /projects/:id/revert`

**So'rov:** `{ "versionId": "ver_…" }`

> **Diqqat:** bu endpointda zod validatsiyasi yo'q — tana `@Body("versionId")`
> bilan xom olinadi.

**Javob `200`:** `{ "ok": true, "revertedToUz": string }` — `revertedToUz`
o'sha versiyaning `label` i.

`404` — loyiha yoki versiya topilmasa.

> **Nega kerak:** agent xato qilishi mumkin va mijoz buni darhol qaytara
> olishi kerak. «Buzilsa qaytaraman» degan bilim — ishonchning asosi.

---

### `GET /projects/:id/usage`

**Javob `200`:**

| Maydon | Tur | Izoh |
| --- | --- | --- |
| `runs` | `number` | Jami run soni |
| `chargedUnits` | `number` | Hisoblangan run soni |
| `totalCostCents` | `number` | **Bizning** AI xarajatimiz, AQSh sentida |
| `avgCostPerChangeCents` | `number` | Bitta hisoblangan o'zgarishning tannarxi |
| `balance` | `{ included, used, extraPurchased, extraUsed }` | Barchasi `number` |

> **Bu mijozga emas, BIZGA kerak:** bitta o'zgarishning tannarxi $0,60 dan
> oshsa, $5 lik narx marjani yo'qotadi. Kodda o'lchanmasa, buni faqat oy
> oxirida bilamiz.

---

## 3. Agent — `POST /chat`

> Nima uchun: mahsulotning yuragi. Mijoz xabaridan ishlaydigan kodga qadar.

**So'rov** (`sendMessageInput`):

| Maydon | Tur | Majburiy | Izoh |
| --- | --- | --- | --- |
| `projectId` | `string` | ha | |
| `text` | `string` (1–8000) | ha | Mijozning so'rovi |
| `designMode` | `boolean` | yo'q (standart `false`) | Kod o'zgarmaydi, **hech qachon hisoblanmaydi** |

**Javob:** `200`, `Content-Type: text/event-stream`.

Sarlavhalar: `Cache-Control: no-cache, no-transform`, `Connection: keep-alive`,
`X-Accel-Buffering: no` (Nginx kabi proksilar SSE'ni buferlaydi va oqim
to'xtab qoladi).

Har hodisa ikki qatorda keladi:

```
event: run.classified
data: {"type":"run.classified","kind":"small_edit","billable":true,"summaryUz":"Kichik tahrir — 1 o'zgarish."}

```

> **Nega SSE:** bitta o'zgarish 2 soniyadan 3 daqiqagacha davom etadi. Mijoz
> shu vaqt davomida nima bo'layotganini ko'rishi kerak, aks holda ilova qotib
> qoldi deb o'ylaydi.
>
> **Nega WebSocket emas:** oqim bir tomonlama va qisqa muddatli. WebSocket
> qo'shimcha holat va qayta ulanish mantiqini keltirardi, foyda bermay.

### Hodisalar — to'liq shakl

Sxema: `@amb/contracts` → `agentEventSchema`. Har hodisada `type` maydoni bor.

| `type` | Maydonlari | Qachon | Mijoz nima ko'radi |
| --- | --- | --- | --- |
| `run.started` | `runId: string`, `at: number` (ms) | Boshida | — |
| `run.classified` | `kind: TaskKind`, `billable: boolean`, `summaryUz: string` | Tasnif tayyor | «Kichik tahrir — 1 o'zgarish» |
| `clarify` | `questionUz: string`, `options: string[]` | So'rov noaniq | Aniqlashtiruvchi savol, **bepul** |
| `text` | `delta: string` | Model matn qaytarganda | Javob matni |
| `tool.started` | `tool: string`, `argsPreview: string` (200 belgigacha) | Tool chaqirildi | «Kodni o'qiyapman…» |
| `tool.finished` | `tool: string`, `ok: boolean`, `summary: string` | Tool tugadi | — |
| `file.changed` | `path: string`, `action: "create" \| "edit" \| "delete"`, `added: number`, `removed: number` | Fayl tahrirlandi | `lib/theme.ts (+1 / −1)` |
| `verify.started` | `step: "typecheck" \| "lint" \| "bundle"` | Tekshiruv boshlandi | «Kodni tekshiryapman…» |
| `verify.finished` | `step`, `ok: boolean`, `skipped: boolean`, `errors: string[]` | Tekshiruv tugadi | «o'tdi» / «o'tmadi» |
| `repair.attempt` | `attempt: number`, `max: number`, `errorPreview: string` (300 belgigacha) | Xato tuzatilyapti | «Tuzatyapman (1/3) — bepul» |
| `repair.gaveUp` | `messageUz: string`, `lastGoodVersionId: string \| null` | 3 urinish yetmadi | «O'zgarishlarni bekor qildim» |
| `charge` | `units: number`, `reasonUz: string`, `remaining: number`, `balanceLabelUz: string` | Run oxirida, **doim** | «5 tadan 1 tasi · qoldiq 4» |
| `run.finished` | `runId: string`, `ok: boolean`, `versionId: string \| null`, `durationMs: number` | Oxirida | — |
| `error` | `messageUz: string`, `detail?: string` | Qoldiq tugadi, muhit nosoz yoki model yiqildi | Sabab va «hisoblanmadi» |

`TaskKind` = `"question" | "unclear" | "design" | "small_edit" | "medium" | "large" | "repair"`.

**Muhim tafsilotlar:**

- `verify.finished` da `skipped: true` bo'lsa, qadam **bajarilmagan**. Uni
  «o'tdi» deb ko'rsatish yolg'on bo'lardi.
- `run.finished.versionId` — aslida **git SHA** (yoki `null`), baza
  `versions.id` emas.
- `error` hodisasidan keyin ham `charge` va `run.finished` keladi, faqat
  model yiqilgan holat bundan mustasno: unda oqim `error` bilan yopiladi.
- `agentEventSchema` da `plan` va `preview.ready` hodisalari e'lon qilingan,
  lekin backend ularni **hozircha yubormaydi**.

---

## 4. Preview

> Nima uchun: mijoz ilovasini ko'rmasa, boshqa hech narsaning ahamiyati yo'q.

### `PreviewPathInfo` — qayta ishlatiladigan shakl

| Maydon | Tur |
| --- | --- |
| `id` | `"web" \| "expo_go" \| "eas_go" \| "dev_client"` |
| `labelUz` | `string` |
| `whenUz` | `string` — qachon ishlatiladi |
| `controlledByUz` | `string` — kim boshqaradi (biz / Expo va Apple) |
| `limitUz` | `string` — cheklovi |
| `needsAppleAccount` | `boolean` |
| `etaSeconds` | `number` |

---

### `GET /preview/:id`

**So'rov:** `?apple=1` — mijozda Apple Developer akkaunti bor. Boshqa
qiymat yoki yo'qligi `false` deb qaraladi.

**Javob `200`:**

| Maydon | Tur |
| --- | --- |
| `path` | `PreviewPath` |
| `reasonUz` | `string` — **nega aynan shu yo'l**, bir jumla |
| `fallback` | `PreviewPath` |
| `info` | `PreviewPathInfo` — tanlangan yo'l haqida |
| `fallbackInfo` | `PreviewPathInfo` |
| `allPaths` | `PreviewPathInfo[]` — to'rttasi ham |

> **Nega sabab ham qaytadi:** mijoz «nega telefonimda ochilmayapti?» deb
> so'ramasligi kerak. Javob oldindan beriladi.
>
> **Nega `?apple=1` qarorni o'zgartiradi:** `eas go` va dev client faqat
> mijozning Apple akkaunti bo'lganda mumkin.

---

### `POST /preview/:id/web`

Veb preview yig'adi: `expo export --platform web --output-dir .amb-web`.
Timeout 300 soniya.

**So'rov:** tana yo'q.

**Javob `200`:**

| Maydon | Tur | Izoh |
| --- | --- | --- |
| `ok` | `boolean` | Yig'ildimi |
| `url` | `string \| null` | Muvaffaqiyatda `/preview/<id>/static/index.html` |
| `durationMs` | `number` | |
| `messageUz` | `string` | |
| `logTail` | `string` | Faqat xatoda — `stderr` ning oxirgi 4000 belgisi |

`ok: false` ikki holatda: `expo` vositasi topilmadi (muhit nosozligi) yoki
yig'ish yiqildi. **Ikkalasida ham HTTP kodi `200`** — bu biznes natijasi,
protokol xatosi emas.

> **Nega POST:** yig'ish resurs sarflaydi va fayl tizimini o'zgartiradi. GET
> bo'lsa, brauzer uni oldindan yuklab, har ochilishda qayta yig'ishga majbur
> qilardi.

---

### `GET /preview/:id/static/*path`

Yig'ilgan fayllarni beradi. Yo'l bo'sh bo'lsa `index.html`.

**Javob:** faylning o'zi. `Cache-Control: no-store` — preview har
o'zgarishda yangilanadi, keshlash eski ilovani ko'rsatardi.

| Kod | Qachon |
| --- | --- |
| `400` | Loyiha ID formati noto'g'ri |
| `403` | Yo'l `.amb-web` papkasidan **chiqib ketgan** |
| `404` | Fayl yo'q — «avval veb preview yig'ing» |

Faqat ruxsat etilgan tur beriladi (`.html`, `.js`, `.css`, `.json`, `.map`,
`.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.ico`, `.woff2`, `.ttf`);
qolgani `application/octet-stream`.

---

## 5. Do'kon tekshiruvi — `GET /review/:id`

> Nima uchun: bu ixtiyoriy vosita emas, **kafolatning sharti**.

Apple bandlari: 4.2, 2.1, 5.1.1(v), 4.8, 5.1.1, 3.1.1, Privacy, 4.3.

**So'rov:** yo'q.

**Javob `200`:**

| Maydon | Tur | Izoh |
| --- | --- | --- |
| `ok` | `boolean` | `true` — birorta ham `blocker` yo'q |
| `findings` | `Finding[]` | Og'irligi bo'yicha saralangan |
| `passLikelihood` | `number` (0..1) | `max(0, 1 − blocker×0.35 − warning×0.08)` |

`Finding`:

| Maydon | Tur |
| --- | --- |
| `clause` | `string` — masalan `"4.2"`, `"5.1.1(v)"`, `"Privacy"` |
| `severity` | `"blocker" \| "warning" \| "info"` |
| `titleUz` | `string` — sodda tilda: «nima qilish kerak» |
| `detailUz` | `string` |
| `files` | `string[]` — tegishli fayllar |

```json
{
  "ok": false,
  "passLikelihood": 0.3,
  "findings": [
    {
      "clause": "4.2",
      "severity": "blocker",
      "titleUz": "Ilova juda sodda ko'rinishi mumkin",
      "detailUz": "Hozir 3 ta mazmunli ekran bor, bu soha uchun kamida 6 ta kerak.",
      "files": ["app/(app)/index.tsx"]
    }
  ]
}
```

> **Nega do'konga chiqarishdan OLDIN:** Apple ko'rigi 1–3 kun davom etadi.
> Sababni oldindan topib tuzatsak, mijoz shuncha kun yo'qotmaydi va bizning
> kafolat xarajatimiz tushadi.
>
> **Nega GET:** tekshiruv hech narsani o'zgartirmaydi va istalgan payt qayta
> chaqirilishi mumkin.

---

## 6. Backend ulanish

> Nima uchun: mijozning ma'lumoti mijozniki bo'lishi kerak.

### `POST /backend/:id`

**So'rov** (`connectBackendInput`):

| Maydon | Tur | Majburiy | Izoh |
| --- | --- | --- | --- |
| `projectId` | `string` | ha (sxemada) | Server **yo'ldagi `:id`** ni ishlatadi; bu maydon sxemada bor, ammo e'tiborga olinmaydi |
| `provider` | `"supabase" \| "firebase"` | ha | |
| `url` | `string` | Supabase uchun ha | Loyiha URL'i |
| `anonKey` | `string` | Supabase uchun ha | Ilovaga tushadigan yagona kalit |
| `serviceRoleKey` | `string` | yo'q | Faqat sxema yaratish uchun |
| `firebaseConfig` | `Record<string, string>` | yo'q | |

**Javob `200`:**

| Maydon | Tur |
| --- | --- |
| `ok` | `true` |
| `provider` | `string` |
| `messageUz` | `string` |
| `warningsUz` | `string[]` — Firebase tanlansa chiqishning og'irligi haqida ogohlantirish |

`400` — Supabase tanlangan, lekin `url` yoki `anonKey` yo'q.

Barcha kalitlar AES-256-GCM bilan shifrlanadi (`infrastructure/crypto/secret-cipher.ts`).

> **Nega kalitlar mijozniki:** agar biz Supabase loyihasini o'zimiz yaratsak,
> mijoz ketganda ma'lumoti bizda qoladi. Bu lock-in.

---

### `GET /backend/:id`

**Javob `200`** — ulanmagan bo'lsa: `{ "connected": false }`

Ulangan bo'lsa:

| Maydon | Tur |
| --- | --- |
| `connected` | `true` |
| `provider` | `string` |
| `url` | `string \| null` |
| `hasAnonKey` | `boolean` |
| `serviceRoleActive` | `boolean` |
| `serviceRoleDeletedAt` | `string \| null` (ISO) |

`404` — loyiha topilmasa.

> **Kalitlar QAYTARILMAYDI** — faqat «bormi yo'qmi». Kalit bir marta
> kiritiladi va boshqa hech qachon o'qilmaydi, hatto biz ham.

---

### `POST /backend/:id/burn-service-role`

**Javob `200`:** `{ "ok": true, "messageUz": string }`

> **Nega majburiy:** `service_role` kaliti RLS'ni butunlay chetlab o'tadi —
> u bilan butun bazani o'qish va o'chirish mumkin. Faqat sxema yaratish
> paytida kerak; ish tugagach saqlab turish — keraksiz xavf.

---

## 7. Topshirish paketi — `POST /handoff/:id`

> Nima uchun: «obuna tugasa loyiha qulflanadi» bozordagi uchta asosiy
> shikoyatdan biri.

`README.md`, `ARCHITECTURE.md`, `HANDOFF.md` yozadi va commit qiladi.

**Javob `200`:**

| Maydon | Tur | Izoh |
| --- | --- | --- |
| `ok` | `true` | |
| `generated` | `string[]` | **Shu run'da yozilgan** fayllar |
| `included` | `string[]` | Shablondan kelgan, paketga kiradigan fayllar (`.env.example`, `SDK.md`) |
| `gitSha` | `string \| null` | Commit; hech narsa o'zgarmagan bo'lsa `null` |
| `messageUz` | `string` | |

> **Nega POST:** hujjatlar workspace'ga yoziladi va commit qilinadi — bu
> holatni o'zgartiradi.

---

## 8. Katalog

> Nima uchun: narx va bloklar ro'yxati mahsulot qarori. Frontend'ga nusxa
> qo'yilsa, ikki tomon albatta bir-biridan uzoqlashadi. Manba bitta:
> `@amb/core-rules`, `@amb/blocks`, `@amb/domains`.

Hamma javoblar o'zgarmas ma'lumot — so'rov tanasi yo'q.

| Endpoint | Javob shakli |
| --- | --- |
| `GET /catalog/blocks` | `{ blocks: Block[] }` |
| `GET /catalog/domains` | `{ packs: DomainSummary[] }` |
| `GET /catalog/pricing` | `{ plans, extraChange, assistedPublish, thirdPartyCosts, faqUz }` |
| `GET /catalog/preview-paths` | `{ paths: PreviewPathInfo[] }` |
| `GET /catalog/sdks` | `{ sdks: SdkRelease[] }` |

**`Block`:**

| Maydon | Tur |
| --- | --- |
| `id` | `"auth" \| "data" \| "payments_iap" \| "payments_local" \| "notifications" \| "media" \| "analytics" \| "onboarding" \| "navigation"` |
| `nameUz`, `descriptionUz` | `string` |
| `preview` | `"expo_go" \| "dev_client"` |
| `packages` | `string[]` — ilovaga qo'shiladigan npm paketlar |
| `files` | `string[]` — blok beradigan fayllar |
| `storeRequirements` | `Array<{ clause: string; requirementUz: string; coveredByBlock: boolean }>` |
| `generationPolicy` | `"parameterize_only" \| "extend_allowed"` |
| `allowedGoods` | `"physical_or_service" \| "digital"` (ixtiyoriy) |

> **`preview` maydoni hal qiluvchi:** mijoz blok **tanlashdan oldin** uning
> telefonda darhol ochilishini yoki dev client kerakligini bilishi kerak.
> Aks holda «ilovam telefonimda ochilmayapti» degan support oqimi boshlanadi.

**`DomainSummary`** — to'liq paket emas:

| Maydon | Tur |
| --- | --- |
| `id`, `nameUz`, `descriptionUz` | `string` |
| `examplesUz` | `string[]` |
| `recommendedBlocks` | `string[]` |
| `sells` | `"digital" \| "physical_or_service"` |
| `minScreens` | `number` — 4.2 bandi uchun eng kam ekran soni |
| `evalCount` | `number` |

> **Nega `evals` o'rniga `evalCount`:** to'liq ro'yxat ichki tekshiruv uchun
> va hajmi katta. Mijozga faqat soni ko'rsatiladi: «12 ta tekshiruv».

**`GET /catalog/pricing` javobi:**

| Maydon | Tur |
| --- | --- |
| `plans` | `Plan[]` — `{ id, nameUz, priceUsdCents, priceUzs, billing: "once"\|"monthly"\|"free", includedChanges, canBuild, featuresUz }` |
| `extraChange` | `{ usdCents: number; uzs: number }` |
| `assistedPublish` | `{ usdCents: number; uzs: number }` |
| `thirdPartyCosts` | `Array<{ keyUz: string; usdCents: number; periodUz: string }>` |
| `faqUz` | `Array<{ q: string; a: string }>` |

> **Nega uchinchi tomon xarajatlari shu javobda:** mijozning birinchi savoli
> «$99 yana alohidami?» bo'ladi va unga javob narx sahifasining o'zida
> bo'lishi kerak.

**`SdkRelease`:** `{ version: number; status: "supported" | "trial" | "deprecated"; inExpoGo: boolean; notesUz: string }`

---

## 9. Yangi endpoint qo'shish — qattiq tartib

1. Sxemani `packages/contracts/src/http.ts` ga yozing (zod).
2. `modules/<modul>/dto/` da re-export qiling.
3. Controller'da `@ZodBody(sxema)` bilan qabul qiling.
4. Controller metodi ustiga **nega** borligini tushuntiruvchi izoh yozing.
5. Shu faylga so'rov va javob shaklini jadval bilan qo'shing.

**Taqiq:** shu faylda yozilmagan endpoint — mavjud emas. Javob shaklini
kodda o'zgartirib, hujjatda qoldirish eng qimmat xato turi: frontend eski
shaklga tayanib qoladi va xato ish vaqtida chiqadi.
