# billing — o'zgarishlar hisobi

Mahsulotning uchta va'dasi shu modulda yashaydi va **boshqa hech qayerda
hisob yuritilmaydi**:

- savol va noaniq so'rov bepul;
- xato tuzatish bepul;
- tekshiruvdan o'tmagan ish hisoblanmaydi.

---

## 1. Fayllar

| Fayl | Javobgarligi |
| --- | --- |
| `billing.service.ts` | Qarorni hisoblaydi va yozuvni boshqaradi |
| `billing.repository.ts` | Faqat SQL: qoldiqni atomar yechish, qo'shimcha qo'shish |
| `billing.module.ts` | DI ulanishi. Controller **yo'q** — modul tashqariga HTTP bermaydi |

Qarorning o'zi bu modulda emas: u `@amb/core-rules` → `decideCharge()` sof
funksiyasida. **Nega:** u I/O bilmaydi, shuning uchun bazasiz testlanadi va
frontend ham xuddi shu mantiqni ko'rsata oladi.

---

## 2. Qoida — nima hisoblanadi

| Holat | `kind` | Hisob |
| --- | --- | --- |
| Savol («bu qanday ishlaydi?») | `question` | **0** |
| Noaniq so'rov → aniqlashtiruvchi savol | `unclear` | **0** |
| Design mode | `design` | **0** |
| Xato tuzatish | `repair` | **0** |
| Diff bo'sh — hech narsa o'zgarmadi | har qanday | **0** |
| Verify gate o'tmadi (`failed`) | har qanday | **0** |
| Tekshiruv o'tkazilmadi (`unavailable`) | har qanday | **0** |
| Kichik tahrir | `small_edit` | **1** |
| O'rta hajmli o'zgarish | `medium` | **1** |
| Katta o'zgarish | `large` | **1** |

Tartib muhim: `decideCharge()` avval turni tekshiradi, keyin diff bor-yo'qligini,
keyin verify natijasini. Ya'ni **bo'sh diff verify natijasidan ustun** —
hech narsa o'zgarmagan bo'lsa, tekshiruv o'tgan bo'lsa ham hisoblanmaydi.

`unavailable` alohida holat sifatida ko'rinmaydi, chunki
`VerifyReport.unavailable` bo'lganda `ok` doim `false` bo'ladi va agent uni
`"failed"` deb uzatadi.

---

## 3. Ikki bosqich: `decide()` va `commit()`

> Nima uchun ajratilgan: mijoz natijani darhol ko'rishi kerak, baza yozuvi
> uni kutib turmasligi kerak.

| Metod | Qachon | Nima qiladi |
| --- | --- | --- |
| `hasRemaining(project)` | Ish boshlanishidan oldin | Qoldiq bormi. Yo'q bo'lsa hisoblanadigan ish umuman boshlanmaydi |
| `decide(project, context)` | Run tugagach, oqim ichida | Qarorni hisoblaydi, **yozmaydi**. `charge` hodisasi shundan chiqadi |
| `commit(projectId, units)` | Oqim yopilgach, `AgentController.persist()` da | Bazaga yozadi |

`decide()` qaytaradigan `ChargeOutcome`:

| Maydon | Tur | Izoh |
| --- | --- | --- |
| `units` | `0 \| 1` | |
| `reasonUz` | `string` | Mijozga ko'rsatiladigan sabab |
| `remaining` | `number` | Shu hisobdan **keyingi** qoldiq |
| `balanceLabelUz` | `string` | «Bu oy 10 tadan 4 tasi ishlatildi · qoldiq 6» |

`commit()` `false` qaytarsa — qoldiq tugagan (masalan ikki so'rov bir vaqtda
kelgan). Bunda mijozdan pul olinmaydi: **kamroq olganimiz ortiqcha
olganimizdan yaxshi.**

---

## 4. Nega bitta atomar SQL so'rov

`consumeOneChange()` ikki narsani SQL ichida hal qiladi.

**1. Qaysi hisobdan yechiladi:**

```sql
used_changes = CASE WHEN used_changes < included_changes
                    THEN used_changes + 1 ELSE used_changes END
extra_used   = CASE WHEN used_changes >= included_changes
                    THEN extra_used + 1 ELSE extra_used END
```

Avval tarif qoldig'idan, keyin sotib olingan qo'shimchalardan. **Nega shu
tartib:** qo'shimchalar yonmaydi, tarif qoldig'i esa oy oxirida yonadi —
shuning uchun avval yonadiganini sarflash mijoz uchun foydaliroq.

**2. Qoldiq bormi:**

```sql
WHERE id = $1
  AND (used_changes < included_changes OR extra_used < extra_purchased)
```

Bu shart ikki parallel so'rovning bitta qoldiqni ikki marta sarflashiga yo'l
qo'ymaydi: ikkinchisi hech qanday qatorni yangilamaydi va `false` qaytadi.
Shu bilan `extra_used` hech qachon `extra_purchased` dan oshmaydi.

O'qib-keyin-yozish (`SELECT` → tekshirish → `UPDATE`) bu kafolatni bermasdi.

`addExtraChanges(projectId, count)` — mijoz qo'shimcha o'zgarish sotib
olganda. **Hozircha hech qayerdan chaqirilmaydi:** to'lov oqimi yozilmagan.

---

## 5. Qattiq qoidalar

| Qoida | Nega |
| --- | --- |
| Hisob **faqat** shu modul orqali | Uchinchi joy paydo bo'lsa, qoidalar bir-biridan uzoqlashadi va mijozdan noto'g'ri pul olinadi |
| Qaror `@amb/core-rules` da, bu yerda emas | Sof funksiya bazasiz testlanadi; frontend ham shuni ishlatadi |
| `decide()` bazaga yozmaydi | Oqim ichida yozish mijozni kutdiradi va yozuv yiqilsa javob ham yo'qoladi |
| Qoldiq yo'qligi ishdan **oldin** tekshiriladi | Aks holda model chaqirilib, pul sarflanib, keyin «qoldiq yo'q» deyilardi |
| Xato bo'lganda hisob 0 | «Xato bo'ldi, lekin pulim yechildimi?» degan savol qolmasligi kerak |

## Nima qilish TAQIQLANGAN

- `projects` jadvalining hisob ustunlarini (`used_changes`, `extra_used`)
  `BillingRepository` dan tashqarida `UPDATE` qilish.
- `BILLABLE` jadvalini chetlab o'tib, `kind` bo'yicha alohida shart yozish.
- Bir run uchun `commit()` ni bir necha marta chaqirish.
- `units` ni `0 | 1` dan boshqa qiymatga kengaytirish — «1 so'rov = 1
  o'zgarish» mahsulot qarori, texnik cheklov emas.
- Hisobni verify gate natijasi ma'lum bo'lishidan oldin yozish.

---

## 6. Yangi bepul holat qo'shish

Faqat `packages/core-rules/src/changes.ts` dagi `BILLABLE` jadvalini
o'zgartiring. API, agent va UI tegilmaydi — ular qaror manbaini bilmaydi.

Yangi `TaskKind` qo'shilsa, uch joyda ko'rinadi: `taskKinds` massivi,
`BILLABLE` jadvali va `reasonForFreeKind()`. Uchalasi bir faylda — bu
ataylab, shunda bittasini unutib bo'lmaydi.
