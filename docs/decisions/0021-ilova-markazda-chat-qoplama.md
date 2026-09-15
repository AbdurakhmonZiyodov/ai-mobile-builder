# 0021. Workspace'da ilova markazda, chat qoplama

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `apps/web/src/features/workspace/` |
| **Bog'liq qarorlar** | [0020](./0020-frontend-xususiyat-boyicha.md) |

## Kontekst

Dizayn kanvasidan olingan qaror. Raqobatchilarda chat markazda, ilova esa
yon panelda turadi.

## Qaror

Bizda teskarisi: **ilova markazda**, chat esa uning ustidagi **qoplama**.
Qoplamani yopib qo'yish mumkin.

## Sabab

Mijoz chat bilan emas, **ilovasi bilan** qiziqadi. Chat — vosita, natija
emas. Ekranning markazini natija egallashi kerak.

Qoplama yopilganda ham oqim to'xtamaydi: agent ishlashda davom etadi va
hodisalar kelaveradi — ya'ni chatni yopish «ishni bekor qilish» degani emas.

## Oqibatlari

- Telefon ramkasi eng katta va eng barqaror element bo'lishi kerak — uning
  o'lchami boshqa panellarga qarab sakramaydi.
- Chat yopiq holatda ham oqim davom etgani uchun holat (state) chat
  komponentida emas, workspace darajasida saqlanadi — bu
  [0020](./0020-frontend-xususiyat-boyicha.md) dagi xususiyat bo'yicha
  ajratishning sabablaridan biri.
