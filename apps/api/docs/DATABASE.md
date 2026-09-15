# Ma'lumotlar bazasi

PostgreSQL + Drizzle ORM. Har jadval alohida faylda:
`src/infrastructure/database/schema/`.

Bu fayl har jadvalning **nega borligini** va ustunlarining shaklini
yozadi. Sxemani o'zgartirsangiz, shu faylni ham o'zgartiring.

```bash
npm run db:push      # sxemani bazaga yuklash (dev)
npm run db:generate  # migratsiya fayli yaratish (./drizzle)
npm run db:studio    # brauzerda ko'rish
```

Ulanish `DATABASE_URL` dan. Hovuz bitta va butun ilova uchun umumiy
(`DatabaseService`, `max: 10`).

---

## 0. Umumiy qoidalar

> Nima uchun: quyidagilar har jadvalda takrorlanadi — bir marta o'qing.

| Qoida | Nega shunday |
| --- | --- |
| ID — prefiksli matn (`prj_…`, `run_…`), UUID emas | Log yoki xato xabarida ID ko'rinsa, qaysi obyekt ekani darhol ma'lum. Qo'llab-quvvatlashda ko'p vaqt tejaydi |
| Vaqt ustunlari — `timestamp with time zone` | Server va mijoz turli mintaqada bo'lishi mumkin |
| **Tashqi kalit (foreign key) YO'Q** | `project_id` oddiy `text`. Bu bilib qilingan: workspace fayl tizimida, baza esa faqat ko'zgu. Ma'lumot butunligi kod darajasida ushlab turiladi |
| `updated_at` qo'lda yoziladi | Trigger yo'q — repository har `update` da `new Date()` qo'yadi |
| Raqamli sanoq ustunlari `notNull().default(0)` | `null` va `0` ni farqlash hisobda xatoga olib kelardi |

---

## 1. `users` — mijoz

> Holati: **jadval bor, kod ulanmagan.** Hech qayerdan yozilmaydi va
> o'qilmaydi. `CurrentUser` dekoratori doim `"usr_demo"` qaytaradi.

| Ustun | Tur | Izoh |
| --- | --- | --- |
| `id` | `text` PK | |
| `email` | `text` notNull **unique** | |
| `name_uz` | `text` | |
| `locale` | `text` notNull, standart `"uz"` | `uz \| ru \| en` |
| `created_at` | `timestamptz` notNull | |

**Nega auth hali yo'q:** birinchi 5 pilot mijoz bilan yuzma-yuz ishlanadi
va ro'yxatdan o'tish oqimi ularning yo'lini to'sadi. To'liq
autentifikatsiya 15-haftada.

---

## 2. `projects` — bitta ilova

Mahsulotning markaziy jadvali.

| Ustun | Tur | Nega bor |
| --- | --- | --- |
| `id` | `text` PK (`prj_…`) | Workspace papkasining nomi ham shu |
| `user_id` | `text` notNull | Hozircha doim `usr_demo` |
| `name` | `text` notNull | |
| `status` | `text` notNull, standart `"draft"` | `draft \| building \| ready \| failed` |
| `sdk` | `integer` notNull | Loyiha bitta SDK'da **qotiriladi** — avtomatik yangilanish ishlab turgan ilovani buzadi |
| `domain_pack` | `text` | `booking \| shop \| courses \| delivery \| internal` yoki `null` |
| `blocks` | `jsonb` (`string[]`) notNull, standart `[]` | Tanlangan bloklar |
| `sells` | `text` notNull, standart `"physical_or_service"` | `digital \| physical_or_service`. Apple 3.1.1 bandi uchun **hal qiluvchi** |
| `plan` | `text` notNull, standart `"trial"` | |
| `included_changes` | `integer` notNull | Tarifga kiradigan o'zgarishlar |
| `used_changes` | `integer` notNull | |
| `extra_purchased` | `integer` notNull | Dona-dona sotib olinganlar — **muddatsiz, yonmaydi** |
| `extra_used` | `integer` notNull | |
| `preview_path` | `text` notNull, standart `"web"` | To'rt yo'ldan qaysi biri |
| `preview_url` | `text` | Yig'ilgan veb preview manzili |
| `created_at` / `updated_at` | `timestamptz` notNull | |

**Indeks:** `projects_user_idx (user_id, created_at)` — «Loyihalarim»
ekrani aynan shu tartibda o'qiydi.

> **Nega qoldiq shu jadvalda, alohida `balances` da emas:** balans doim
> bitta loyihaga tegishli va u bilan birga o'qiladi. Ajratish faqat
> qo'shimcha JOIN keltirardi.
>
> **Nega qoldiq to'rtta ustunda:** tarif qoldig'i oy oxirida yonadi, sotib
> olingan qo'shimchalar esa yonmaydi. Bitta raqamda ularni farqlab
> bo'lmaydi.

---

## 3. `messages` — suhbat

| Ustun | Tur | Izoh |
| --- | --- | --- |
| `id` | `text` PK (`msg_…`) | |
| `project_id` | `text` notNull | |
| `role` | `text` notNull | `user \| assistant` |
| `content` | `text` notNull | |
| `created_at` | `timestamptz` notNull | |

**Indeks:** `messages_project_idx (project_id, created_at)`.

> **Nega indeks aynan shunday:** agent kontekstiga oxirgi 5 xabar to'liq,
> qolgani xulosa sifatida kiradi. Ya'ni har run tartiblangan o'qish qiladi.

---

## 4. `runs` — agentning har ishga tushishi

| Ustun | Tur | Nega bor |
| --- | --- | --- |
| `id` | `text` PK (`run_…`) | |
| `project_id` | `text` notNull | |
| `kind` | `text` notNull | `question \| unclear \| design \| small_edit \| medium \| large \| repair` |
| `prompt` | `text` notNull | Mijozning so'rovi |
| `verify_status` | `text` notNull, standart `"skipped"` | `passed \| failed \| skipped` |
| `repair_attempts` | `integer` notNull | Nechta **bepul** tuzatish urinishi ketdi — marja ko'rsatkichi |
| `charged_units` | `integer` notNull | 0 yoki 1 |
| `charge_reason_uz` | `text` | Nega hisoblandi yoki hisoblanmadi |
| `cost_cents` | `bigint` (`number`) notNull | **BIZNING xarajatimiz**, mijoznikidan farqli |
| `duration_ms` | `integer` notNull | |
| `version_id` | `text` | Yaratilgan versiya, bo'lmasa `null` |
| `ok` | `boolean` notNull | |
| `created_at` | `timestamptz` notNull | |

**Indeks:** `runs_project_idx (project_id, created_at)`.

> **Nega har run yoziladi:** bitta o'zgarishning o'rtacha tannarxi $0,60 dan
> oshsa, $5 lik narx marjani yo'qotadi. `repair_attempts` ham shu sababdan:
> ko'p bepul urinish — marja yeyilishi. `GET /projects/:id/usage` aynan shu
> jadvaldan hisoblaydi.

---

## 5. `versions` — git commit'ning ko'zgusi

| Ustun | Tur | Izoh |
| --- | --- | --- |
| `id` | `text` PK (`ver_…`) | |
| `project_id` | `text` notNull | |
| `git_sha` | `text` notNull | Workspace'dagi haqiqiy commit |
| `label` | `text` notNull | **Mijozning o'z so'rovi**, 80 belgigacha |
| `files_changed` | `jsonb` (`Array<{path, added, removed}>`) notNull, standart `[]` | |
| `created_at` | `timestamptz` notNull | |

**Indeks:** `versions_project_idx (project_id, created_at)`.

> **Nega bazada ham saqlanadi:** mijoz «v13 ga qaytar» deganda unga git SHA
> emas, o'zi yozgan so'rov matni ko'rsatilishi kerak. Qaytarish esa
> `git_sha` bo'yicha bajariladi (`POST /projects/:id/revert`).

---

## 6. `backend_connections` — mijozning kalitlari

| Ustun | Tur | Izoh |
| --- | --- | --- |
| `id` | `text` PK (`bcn_…`) | |
| `project_id` | `text` notNull **unique** | Bitta loyihaga bitta ulanish |
| `provider` | `text` notNull | `supabase \| firebase` |
| `url` | `text` | |
| `anon_key_enc` | `text` | **AES-256-GCM bilan shifrlangan** |
| `service_role_key_enc` | `text` | Shifrlangan; ishlatilgach o'chiriladi |
| `service_role_deleted_at` | `timestamptz` | To'ldirilgan bo'lsa — kalit o'chirilgan |
| `firebase_config_enc` | `text` | Shifrlangan JSON |
| `created_at` | `timestamptz` notNull | |

Uchta qattiq qoida shu jadvalda ko'rinadi:

1. **Kalitlar mijozniki.** Biz Supabase loyihasini o'zimiz yaratmaymiz —
   aks holda mijoz ketganda ma'lumoti bizda qoladi. Bu lock-in.
2. **`service_role` RLS'ni butunlay chetlab o'tadi.** U hech qachon
   generatsiya qilingan kodga tushmaydi va sxema yaratilgach o'chiriladi.
3. **Ilovaga faqat `anon` kalit ketadi.**

Ochiq holdagi kalit bazaga hech qachon yozilmaydi va API javobida hech
qachon qaytarilmaydi.

---

## 7. `rejections` — rad etishlar korpusi

> Holati: **jadval bor, kod ulanmagan.** Hozircha hech qayerdan yozilmaydi.

| Ustun | Tur | Izoh |
| --- | --- | --- |
| `id` | `text` PK (`rej_…`) | |
| `project_id` | `text` notNull | |
| `store` | `text` notNull | `apple \| google` |
| `clause` | `text` notNull | `"4.2"`, `"5.1.1(v)"`, `"3.1.1"` |
| `domain_pack` | `text` | Qaysi sohada uchradi |
| `screen` | `text` | Qaysi ekran |
| `reviewer_note` | `text` | Ko'ruvchining matni |
| `resolution_uz` | `text` | **Nima yordam berdi** — korpusning asosiy qiymati |
| `resolved_at` | `timestamptz` | |
| `created_at` | `timestamptz` notNull | |

**Indeks:** `rejections_clause_idx (clause, domain_pack)` — «shu sohada shu
band bo'yicha avval nima yordam bergan?» degan savol uchun.

> **Nega bu mahsulotning uchinchi ustuni:** bu ma'lumotni sotib olib ham,
> nusxa ko'chirib ham bo'lmaydi — u faqat vaqt bilan yig'iladi. Har yangi
> rad etish `modules/review/rules/` ga yangi qoida qo'shadi va ikkinchi
> marta o'sha xato takrorlanmaydi.

---

## 8. `builds` — EAS build

> Holati: **jadval bor, kod ulanmagan.** EAS build hali yozilmagan.

| Ustun | Tur | Izoh |
| --- | --- | --- |
| `id` | `text` PK (`bld_…`) | |
| `project_id` | `text` notNull | |
| `profile` | `text` notNull | `development \| preview \| production \| eas-go` |
| `platform` | `text` notNull | `ios \| android` |
| `status` | `text` notNull, standart `"queued"` | `queued \| running \| finished \| failed \| cancelled` |
| `eas_build_id` | `text` | |
| `artifact_url` | `text` | |
| `log_tail` | `text` | Jonli log oxiri — mijozga ko'rsatiladi |
| `created_at` | `timestamptz` notNull | |

**Indeks:** `builds_project_idx (project_id, created_at)`.

> **Nega holat bazada kuzatiladi:** build 5–15 daqiqa davom etadi. Mijoz
> sahifani yopib ketsa ham jarayon yo'qolmasligi kerak.

---

## 9. Qattiq qoidalar

| Qoida | Nega |
| --- | --- |
| Yangi jadval `schema/index.ts` ga `export *` qilinadi | Drizzle Kit faqat shu faylni o'qiydi — aks holda jadval migratsiyaga tushmaydi va xato chiqmaydi |
| Har jadval alohida faylda | Bitta katta sxema faylida kim nimani o'zgartirganini konflikt paytida ajratib bo'lmaydi |
| SQL faqat `*.repository.ts` ichida | Service va controller drizzle'ni ko'rmaydi |
| Hisob ustunlari faqat `BillingRepository` orqali o'zgaradi | `consumeOneChange()` atomar; o'qib-keyin-yozish ikki parallel so'rovda bitta qoldiqni ikki marta sarflardi |
| Kalit ustunlariga faqat shifrlangan qiymat yoziladi | Ochiq kalit bazaga tushsa, zaxira nusxalar orqali ham tarqaladi |
| Ustun o'chirilmaydi, avval `db:generate` bilan migratsiya | `db:push` ma'lumotni jimgina yo'qotishi mumkin |

## Yangi jadval qo'shish

1. `schema/<nom>.schema.ts` yarating — jadval **nega** borligini fayl
   boshidagi izohda yozing.
2. `schema/index.ts` ga `export *` qo'shing.
3. `npm run db:push` (dev) yoki `npm run db:generate` (migratsiya).
4. Shu faylga bo'lim qo'shing: ustunlar jadvali va «nega bor» izohi.
