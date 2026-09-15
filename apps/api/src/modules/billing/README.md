# billing — o'zgarishlar hisobi

Mahsulotning uchta va'dasi shu modulda yashaydi va **boshqa hech qayerda
hisob yuritilmaydi**.

## Qoida

| Holat | Hisob |
| --- | --- |
| Savol («bu qanday ishlaydi?») | 0 |
| Noaniq so'rov → aniqlashtiruvchi savol | 0 |
| Design mode | 0 |
| Xato tuzatish | 0 |
| Verify gate o'tmadi | 0 |
| Diff bo'sh | 0 |
| Kichik tahrir, o'rta yoki katta o'zgarish | **1** |

Qaror `@amb/core-rules` dagi `decideCharge()` sof funksiyasida — u I/O
bilmaydi va bazasiz testlanadi. Bu servis faqat qarorni bazaga yozadi.

## Nega bitta atomar so'rov

`consumeOneChange()` qaysi hisobdan yechishni SQL ichida hal qiladi:

```sql
usedChanges = CASE WHEN used < included THEN used + 1 ELSE used END
extraUsed   = CASE WHEN used >= included THEN extra + 1 ELSE extra END
```

O'qib-keyin-yozish ikki parallel so'rovda bitta qoldiqni ikki marta
sarflashi mumkin edi.

Avval tarif qoldig'idan yechiladi, keyin sotib olingan qo'shimchalardan:
qo'shimchalar yonmaydi, shuning uchun ular oxirida sarflansa mijoz uchun
foydaliroq.

## Yangi bepul holat qo'shish

Faqat `@amb/core-rules/src/changes.ts` dagi `BILLABLE` jadvalini
o'zgartiring. API, agent va UI tegilmaydi.
