# Ma'lumotlar bazasi

PostgreSQL 16 + Drizzle ORM. Har jadval alohida faylda:
`src/infrastructure/database/schema/`.

```bash
npm run db:push      # sxemani yuklash (dev)
npm run db:generate  # migratsiya yaratish
npm run db:studio    # brauzerda ko'rish
```

## Jadvallar

### `users`
Mijoz. MVP'da auth yengil — email bo'yicha. To'liq autentifikatsiya
15-haftada: birinchi 5 pilot mijoz bilan yuzma-yuz ishlanadi va
ro'yxatdan o'tish oqimi ularning yo'lini to'sadi.

### `projects`
Bitta ilova.

**Nega qoldiq shu jadvalda, alohida `balances` da emas:** balans doim
bitta loyihaga tegishli va u bilan birga o'qiladi. Ajratish faqat
qo'shimcha JOIN keltirardi.

| Ustun | Nega bor |
| --- | --- |
| `sdk` | Loyiha bitta SDK'da **qotiriladi**. Avtomatik yangilanish ishlab turgan ilovani buzadi |
| `sells` | `digital` yoki `physical_or_service`. Apple 3.1.1 uchun hal qiluvchi |
| `included_changes` / `used_changes` | Tarif qoldig'i |
| `extra_purchased` / `extra_used` | Sotib olingan qo'shimchalar — **muddatsiz, yonmaydi** |
| `preview_path` | To'rt yo'ldan qaysi biri |

### `messages`
Suhbat. Agent kontekstiga oxirgi 5 to'liq, qolgani xulosa sifatida kiradi —
shuning uchun `(project_id, created_at)` indeksi.

### `runs`
Agentning har ishga tushishi.

**`cost_cents` — BIZNING xarajatimiz**, mijoznikidan farqli. Bitta
o'zgarishning o'rtacha tannarxi $0,60 dan oshsa, $5 lik narx marjani
yo'qotadi. `repair_attempts` ham shu sababdan yoziladi: ko'p bepul
urinish — marja yeyilishi.

### `versions`
Git commit'ning ko'zgusi.

**Nega bazada ham:** mijoz «v13 ga qaytar» deganda unga git SHA emas,
o'zi yozgan so'rov matni (`label`) ko'rsatilishi kerak.

### `backend_connections`
Mijozning Supabase/Firebase kalitlari, AES-256-GCM bilan shifrlangan.

`service_role_deleted_at` to'ldirilgan bo'lsa — kalit o'chirilgan.
Bu kalit RLS'ni butunlay chetlab o'tadi, shuning uchun u faqat sxema
yaratish paytida yashaydi.

### `rejections`
**Rad etishlar korpusi — mahsulotning uchinchi ustuni.**

Bu ma'lumotni sotib olib ham, nusxa ko'chirib ham bo'lmaydi: u faqat vaqt
bilan yig'iladi. `resolution_uz` ustuni eng qimmatlisi — nima yordam
bergani. Ikkinchi marta o'sha xato takrorlanmaydi.

### `builds`
EAS build holati. Build 5–15 daqiqa davom etadi, shuning uchun holat
bazada kuzatiladi: mijoz sahifani yopib ketsa ham jarayon yo'qolmaydi.

## Yangi jadval qo'shish

1. `schema/<nom>.schema.ts` yarating
2. `schema/index.ts` ga `export *` qo'shing — **aks holda migratsiyaga tushmaydi**
3. `npm run db:push`
4. Shu faylni yangilang: jadval **nega** borligini yozing
