// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Backend uchun ESLint.
 *
 * Avval `package.json` da `lint` skripti bor edi, lekin na konfiguratsiya,
 * na bog'liqlik — ya'ni buyruq yiqilardi. Ishlamaydigan skript
 * yo'qligidan yomonroq: u tekshiruv bor degan taassurot beradi.
 *
 * Kengaytma `.mjs`: paketda `"type": "module"` yo'q (TypeScript CommonJS
 * chiqaradi), ESLint konfiguratsiyasi esa ESM.
 */
export default tseslint.config(
  { ignores: ["dist/**", "drizzle/**", "node_modules/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    rules: {
      // Turlar bo'yicha qat'iylik — modelga ham, bizga ham kamroq xato.
      "@typescript-eslint/no-explicit-any": "error",
      /**
       * `consistent-type-imports` ATAYLAB YOQILMAGAN.
       *
       * NestJS DI `emitDecoratorMetadata` orqali chiqadigan
       * `design:paramtypes` metadatasiga tayanadi. Konstruktor parametri
       * sintaktik jihatdan «faqat tur» bo'lib ko'rinadi, shuning uchun
       * qoida uni `import type` ga aylantirishni taklif qiladi — va
       * `--fix` shuni qiladi. Natijada class chiqish JS'dan o'chadi,
       * metadata `undefined` bo'ladi va ilova «Nest can't resolve
       * dependencies» bilan umuman ko'tarilmaydi.
       *
       * typescript-eslint hujjati ham `emitDecoratorMetadata` bilan bu
       * qoidadan ogohlantiradi.
       */
      // NestJS konstruktorida `private readonly` parametrlari ishlatilmagandek
      // ko'rinadi, shuning uchun dekorator bilan kelganini hisobga olmaymiz.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
