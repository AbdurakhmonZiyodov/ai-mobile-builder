# 0004. `react/no-unescaped-entities` o'chirilgan

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-14 |
| **Tegishli** | `templates/mobile/eslint.config.js` |
| **Bog'liq qarorlar** | [0005](./0005-vosita-node-modules-bin-dan.md), [0013](./0013-verify-otkazib-yuborilgan-qadam.md) |

## Kontekst

O'zbek lotin yozuvida apostrof har qadamda uchraydi: «o'zgarish», «yo'q»,
«bo'lmasa». ESLint'ning `react/no-unescaped-entities` qoidasi har bittasini
xato deb belgilaydi.

Oqibat zanjiri:

1. verify gate yiqiladi;
2. agent 3 ta bepul tuzatish urinishini apostrof qochirishga sarflaydi;
3. halol to'xtashga boradi;
4. mijoz hech narsa olmaydi.

## Qaror

Qoida shablon ESLint sozlamasida o'chirilgan.

## Sabab

Qoida HTML kontekstida ma'noga ega, React Native `<Text>` ichida esa
baribir ma'nosiz — u yerda entity qochirish talab qilinmaydi.

Bizning holatda qoidaning yagona amaliy natijasi — asosiy tildagi matnni
yozib bo'lmaydigan qilish va agentning tuzatish byudjetini yeyish edi.

## Oqibatlari

- Shablonda o'zbekcha matn hech qanday qochirishsiz yoziladi.
- Boshqa ESLint qoidalari o'z kuchida qoladi — faqat shu bittasi o'chirilgan.
- Yangi lint qoidasi qo'shilganda savol o'sha-o'sha: bu qoida agentning
  tuzatish urinishlarini yeydimi?
