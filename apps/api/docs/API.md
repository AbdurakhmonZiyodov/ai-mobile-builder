# API — barcha endpointlar

Bazaviy manzil: `http://localhost:4000`

Har xato javobi bir xil shaklda:

```json
{ "ok": false, "messageUz": "Tushunarli xabar", "path": "/projects/xyz", "at": "..." }
```

---

## Health

### `GET /health`

Server holati va sozlangan modellar.

**Nega model ID'lari qaytadi:** sozlama xatosini topishning eng tez yo'li.
«Nega javob sekin?» degan savolga «kuchli model tanlangan» javobi shu
yerdan ko'rinadi. Kalitning o'zi qaytmaydi — faqat `gatewayConfigured`.

```json
{
  "ok": true,
  "models": { "cheap": "anthropic/claude-haiku-4.5", "standard": "…", "strong": "…" },
  "gatewayConfigured": true,
  "defaultSdk": 57,
  "expoGoSdk": 57
}
```

---

## Loyihalar

### `GET /projects`

Mijozning loyihalari, har birida qoldiq bilan.

**Nega qoldiq ham:** «Loyihalarim» ekranida har qator yonida «qoldiq 4/10»
ko'rinadi. Alohida endpoint bo'lsa, ro'yxat N marta so'rov yuborardi.

### `POST /projects`

Yangi loyiha. **Mahsulotning kirish nuqtasi.**

```json
{ "name": "Barber Studio", "prompt": "Sartaroshxonam bor, mijozlar navbat olsin", "blocks": [] }
```

**Nega bitta so'rovda hammasi:** mijoz bitta jumla yozadi va darhol natija
ko'rishi kerak. Domen aniqlash, blok tanlash va workspace yaratish uchun
alohida qadamlar mijozni yo'qotadi.

Javobda: domen paketi, tanlangan bloklar, preview qarori va **sababi**,
har blokning preview turi.

Xato `422` — noto'g'ri to'lov tanlovi (Apple 3.1.1). Masalan raqamli
kontent uchun Payme bloki: bu aniq rad etishga olib keladi, shuning uchun
boshida to'xtatamiz.

### `GET /projects/:id`
Bitta loyiha holati va qoldig'i.

### `GET /projects/:id/files`
Fayl daraxti — **faqat ro'yxat, kontentsiz**. Workspace'da yuzlab fayl bor.

### `GET /projects/:id/file?path=…`
Bitta faylning kodi.

### `GET /projects/:id/messages`
Suhbat tarixi — sahifa qayta ochilganda tiklash uchun.

### `GET /projects/:id/versions`
Versiya tarixi. Mijozga git SHA emas, **o'zi yozgan so'rov matni**
ko'rsatiladi: «Bron tugmasini yashil qil».

### `POST /projects/:id/revert`

```json
{ "versionId": "ver_…" }
```

**Nega kerak:** agent xato qilishi mumkin va mijoz buni darhol qaytara
olishi kerak. «Buzilsa qaytaraman» degan bilim — ishonchning asosi.

### `GET /projects/:id/usage`

AI xarajati va o'zgarish boshiga tannarx.

**Bu mijozga emas, BIZGA kerak:** bitta o'zgarishning tannarxi $0,60 dan
oshsa, $5 lik narx marjani yo'qotadi. Kodda o'lchanmasa, buni faqat oy
oxirida bilamiz.

---

## Agent

### `POST /chat` — SSE oqimi

```json
{ "projectId": "prj_…", "text": "Bron tugmasini yashil qil", "designMode": false }
```

**Nega SSE:** bitta o'zgarish 2 soniyadan 3 daqiqagacha davom etadi. Mijoz
shu vaqt davomida nima bo'layotganini ko'rishi kerak, aks holda ilova
qotib qoldi deb o'ylaydi.

**Nega WebSocket emas:** oqim bir tomonlama va qisqa muddatli. WebSocket
qo'shimcha holat va qayta ulanish mantiqini keltirardi, foyda bermay.

Hodisalar ketma-ketligi:

| Hodisa | Qachon | Mijoz nima ko'radi |
| --- | --- | --- |
| `run.started` | boshida | — |
| `run.classified` | tasnif tayyor | «Kichik tahrir — 1 o'zgarish» |
| `clarify` | so'rov noaniq | Aniqlashtiruvchi savol, **bepul** |
| `tool.started` | tool chaqirildi | «Kodni o'qiyapman…» |
| `file.changed` | fayl tahrirlandi | `lib/theme.ts (+1 / −1)` |
| `verify.started` / `verify.finished` | tekshiruv | «Kodni tekshiryapman: o'tdi» |
| `repair.attempt` | xato tuzatilyapti | «Tuzatyapman (1/3) — bepul» |
| `repair.gaveUp` | 3 urinish yetmadi | «Qaytaraymi?» |
| `charge` | run oxirida, **doim** | «5 tadan 1 tasi · qoldiq 4» |
| `run.finished` | oxirida | — |

`verify.finished` da `skipped: true` bo'lsa, qadam **bajarilmagan**.
Uni «o'tdi» deb ko'rsatish yolg'on bo'lardi.

---

## Preview

### `GET /preview/:id` · `?apple=1`

Qaysi yo'l va **nima uchun**, bir jumlada.

**Nega sabab ham qaytadi:** mijoz «nega telefonimda ochilmayapti?» deb
so'ramasligi kerak. Javob oldindan beriladi.

`?apple=1` — mijozda Apple Developer akkaunti bor. Bu qarorni o'zgartiradi:
`eas go` va dev client faqat shunda mumkin.

### `POST /preview/:id/web`

Veb preview yig'adi.

**Nega POST:** yig'ish resurs sarflaydi va fayl tizimini o'zgartiradi.
GET bo'lsa, brauzer uni oldindan yuklab, har ochilishda qayta yig'ishga
majbur qilardi.

### `GET /preview/:id/static/*`

Yig'ilgan fayllar. Yo'l `.amb-web` papkasidan chiqib ketmasligi
tekshiriladi.

---

## Do'kon tekshiruvi

### `GET /review/:id`

Apple bandlari bo'yicha tekshiruv: 4.2, 4.3, 2.1, 3.1.1, 5.1.1, 5.1.1(v), 4.8, Privacy.

**Nega do'konga chiqarishdan OLDIN:** Apple ko'rigi 1–3 kun davom etadi.
Sababni oldindan topib tuzatsak, mijoz shuncha kun yo'qotmaydi va bizning
kafolat xarajatimiz tushadi.

```json
{ "ok": false, "passLikelihood": 0.3, "findings": [ { "clause": "4.2", "severity": "blocker", "titleUz": "…", "detailUz": "…" } ] }
```

---

## Backend ulanish

### `POST /backend/:id`

Mijozning Supabase yoki Firebase kalitlari.

**Nega kalitlar mijozniki:** agar biz Supabase loyihasini o'zimiz yaratsak,
mijoz ketganda ma'lumoti bizda qoladi. Bu lock-in.

### `GET /backend/:id`

Ulanish holati. **Kalitlar QAYTARILMAYDI** — faqat «bormi yo'qmi». Kalit
bir marta kiritiladi va boshqa hech qachon o'qilmaydi, hatto biz ham.

### `POST /backend/:id/burn-service-role`

`service_role` kalitini o'chiradi.

**Nega majburiy:** bu kalit RLS'ni butunlay chetlab o'tadi — u bilan butun
bazani o'qish va o'chirish mumkin. Faqat sxema yaratish paytida kerak.
Ish tugagach saqlab turish — keraksiz xavf.

---

## Topshirish paketi

### `POST /handoff/:id`

`README.md`, `ARCHITECTURE.md`, `HANDOFF.md` yaratadi va commit qiladi.

**Nega har tarifda:** «obuna tugasa loyiha qulflanadi» bozordagi uchta
asosiy shikoyatdan biri. Chiqish yo'li doim ochiq bo'lishi — mijozning
bizga ishonishining sababi.

---

## Katalog

| Endpoint | Nima beradi |
| --- | --- |
| `GET /catalog/blocks` | Bloklar, **preview belgisi bilan** |
| `GET /catalog/domains` | 5 domen paketi |
| `GET /catalog/pricing` | Narx + Apple/Google xarajatlari + FAQ |
| `GET /catalog/preview-paths` | To'rt yo'l va cheklovlari |
| `GET /catalog/sdks` | Qo'llab-quvvatlanadigan Expo SDK'lar |

`blocks` javobidagi `preview` maydoni hal qiluvchi: mijoz blok
**tanlashdan oldin** uning telefonda darhol ochilishini yoki dev client
kerakligini bilishi kerak. Aks holda «ilovam telefonimda ochilmayapti»
degan support oqimi boshlanadi.
