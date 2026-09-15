# 0011. Shablon bosh ekranida asosiy rang ko'rinib turishi shart

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `templates/mobile/app/(app)/index.tsx` |
| **Bog'liq qarorlar** | [0013](./0013-verify-otkazib-yuborilgan-qadam.md) |

## Kontekst

Mijoz «rangni qizil qil» dedi. Agent `theme.ts` ni **to'g'ri** o'zgartirdi,
verify gate o'tdi, 1 o'zgarish hisoblandi — lekin ekranda **farq yo'q** edi,
chunki bosh ekranda asosiy rangdagi birorta element yo'q edi.

Mijoz uchun bu «pul oldi, hech narsa qilmadi» degani.

## Qaror

Shablonning bosh ekranida asosiy rangdagi **tugma** va ro'yxatdagi rangli
**havola** bo'ladi. Tugma haqiqiy ish bajaradi — bo'sh `onPress` qoldirilmaydi.

## Sabab

Texnik jihatdan to'g'ri o'zgarish, agar ekranda ko'rinmasa, mijoz uchun
xatodan farq qilmaydi. Shablon shunday tuzilishi kerakki, eng ko'p
so'raladigan o'zgarish — rang — birinchi ekrandayoq ko'zga tashlansin.

Tugmaning haqiqiy ish bajarishi alohida sabab: bo'sh `onPress` App Store
qoidalarining **2.1-bandi** bo'yicha rad etish sababi va Review Checker uni
topadi.

## Oqibatlari

- Shablonning bosh ekraniga tegilganda bu shart buzilmasligini tekshirish kerak:
  asosiy rangdagi element olib tashlansa, «rangni o'zgartir» so'rovi yana
  ko'rinmas bo'lib qoladi.
- Yangi shablonlar (domen paketlari) qo'shilganda ham shu shart amal qiladi.
