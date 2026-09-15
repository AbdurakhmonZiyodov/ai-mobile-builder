# Qoidalar va uslub

## Fayl nomlari

| Tur | Naqsh | Misol |
| --- | --- | --- |
| Controller | `<modul>.controller.ts` | `projects.controller.ts` |
| Service | `<modul>.service.ts` | `agent.service.ts` |
| Repository | `<modul>.repository.ts` | `billing.repository.ts` |
| Module | `<modul>.module.ts` | `verify.module.ts` |
| DTO | `<amal>-<obyekt>.dto.ts` | `create-project.dto.ts` |
| Sxema | `<jadval>.schema.ts` | `projects.schema.ts` |
| Agent tool | `<amal>-<obyekt>.tool.ts` | `edit-file.tool.ts` |
| Do'kon qoidasi | `<mavzu>.rule.ts` | `account-deletion.rule.ts` |
| Prompt | `<maqsad>.prompt.ts` | `classifier.prompt.ts` |

## Import tartibi

```ts
import fs from "node:fs/promises";              // 1. Node
import { Injectable } from "@nestjs/common";    // 2. Tashqi paketlar
import { PLANS } from "@amb/core-rules";        // 3. Monorepo paketlari
import { DatabaseService } from "../../infrastructure/…";  // 4. Ichki
import type { Project } from "./types.js";      // 5. Turlar
```

Nisbiy yo'llar ishlatiladi, `@/` taxallusi emas: TypeScript 7 `baseUrl` ni
olib tashladi va taxallusni ish vaqtida yechish uchun qo'shimcha vosita
kerak bo'lardi.

**`.js` kengaytmasi majburiy** — `moduleResolution: NodeNext` shuni talab
qiladi. (Frontend'da teskarisi: u `bundler` rejimida va kengaytmasiz.)

## Izohlar

Har controller metodi va har muhim funksiya ustida o'zbekcha izoh.
U **nima qilishini emas, NEGA borligini** tushuntiradi.

```ts
/**
 * GET /projects/:id/usage — AI xarajati.
 *
 * Bu mijozga emas, BIZGA kerak: bitta o'zgarishning tannarxi $0,60 dan
 * oshsa, $5 lik narx marjani yo'qotadi.
 */
```

Yomon izoh: «Loyiha xarajatini qaytaradi» — buni kodning o'zi aytadi.

## Xatolar

Har xato `messageUz` bilan tashlanadi:

```ts
throw new NotFoundException({ messageUz: "Loyiha topilmadi." });
```

Global filtr (`common/filters/http-exception.filter.ts`) ularni bir xil
shaklga soladi. Texnik tafsilot faqat development'da qo'shiladi —
ishlab chiqarishda u ichki tuzilma haqida ma'lumot sizdiradi.

## `npm exec` va `--`

```bash
npm exec eslint . --max-warnings 0       # ✗ NOTO'G'RI
npm exec -- eslint . --max-warnings 0    # ✓ TO'G'RI
```

Birinchisida npm `--max-warnings 0` ni **o'zining** bayrog'i deb oladi va
ESLint «0» nomli faylni qidiradi. Natijada verify gate soxta xato beradi,
agent tuzata olmaydigan narsani tuzatishga urinadi va uch bepul urinishni
bekorga sarflaydi. Bu amalda uchragan xato.

## Test

Sof funksiyalar bazasiz testlanadi:

- `@amb/core-rules` — narx, hisob, preview qarori
- `modules/review/rules/` — har qoida alohida
- `modules/verify/error-extractor.ts`

Servislar repository'ni mock qilib testlanadi. Controller'lar test
qilinmaydi — ularda mantiq yo'q.

## Log

```ts
private readonly logger = new Logger(ProjectsService.name);
this.logger.log(`Loyiha yaratildi: ${projectId} (${packId})`);
```

Log'da **hech qachon**: kalit, parol, mijoz kontenti, `service_role`.
