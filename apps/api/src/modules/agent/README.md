# agent — agent tsikli

Mahsulotning yuragi. Mijoz xabaridan ishlaydigan kodga qadar.

## Fayllar

| Fayl | Javobgarligi |
| --- | --- |
| `agent.controller.ts` | SSE oqimi, natijani bazaga yozish |
| `agent.service.ts` | Bosqichlarni tartiblash |
| `classifier.service.ts` | So'rov turi: savol / noaniq / kichik / o'rta / katta |
| `context-builder.service.ts` | Kontekst byudjeti, MAP.md, tegishli fayllar |
| `repair.service.ts` | Verify gate va bepul tuzatish tsikli |
| `tools/` | Har tool alohida faylda |
| `prompts/` | Har prompt alohida faylda |

## Nega tasniflash birinchi

Mahsulot va'dasi: savol bepul, noaniq so'rov bepul, xato tuzatish bepul.
Nima hisoblanishini oldindan bilmasak, bu va'dani bajarib bo'lmaydi.

Tasniflash arzon modelda (`cheap`) ishlaydi, chunki u **har xabarda**
chaqiriladi. Kuchli model bitta o'zgarishning tannarxini sezilarli
oshirardi, aniqlik esa deyarli o'zgarmasdi.

Shubhalanganda tasniflagich `unclear` tanlaydi: noto'g'ri ish qilib pul
olgandan ko'ra, savol bergan yaxshi.

## Nega faqat `edit_file`

To'liq faylni qayta yozish ikki sababdan taqiqlangan:

1. **Narx.** 400 qatorli ekranni qayta yozish ~6000 token, nuqtali diff ~200.
2. **Sifat.** Model faylni qaytadan yozganda tegishi shart bo'lmagan joyni
   ham o'zgartiradi va ishlab turgan kodni buzadi.

## Nega uch urinish

Cheksiz urinish ikki narsani buzadi: bizning marjani va mijozning
ishonchini — u ekranda soatlab aylanayotgan indikatorni ko'radi va nima
bo'layotganini bilmaydi.

Uchdan keyin halol to'xtaymiz: «Bu xatoni hal qila olmadim. Oxirgi
ishlagan versiyaga qaytaraymi?»

Bir xil xato ikki marta takrorlansa, arzon modeldan kuchligiga o'tamiz —
model o'z darajasida yechimni topolmayotgani aniq bo'ldi.

## Yangi tool qo'shish

1. `tools/<amal>-<obyekt>.tool.ts` yarating
2. `tools/tool.registry.ts` ga qo'shing
3. Design mode'da ruxsat etiladimi — hal qiling (`readOnly`)
