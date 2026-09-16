// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Frontend uchun ESLint.
 *
 * NEGA BU FAYL KECHIKIB PAYDO BO'LDI. `package.json` da `"lint": "next
 * lint"` turardi va u Next 16'da olib tashlangan — buyruq `lint` degan
 * PAPKANI qidirib «Invalid project directory» bilan yiqilardi. Ya'ni
 * frontend bir marta ham lint qilinmagan, lekin CI'da «lint skripti bor»
 * ko'rinib turardi. Backend'dagi izoh aytganidek: ishlamaydigan skript
 * yo'qligidan yomonroq, chunki u tekshiruv bor degan taassurot beradi.
 *
 * NEGA `eslint-config-next` EMAS. U o'rnatilmagan va uni qo'shish
 * o'nlab yangi bog'liqlik keltiradi. Bu yerdagi to'plam backend bilan
 * BIR XIL asosga quriladi (`@eslint/js` + `typescript-eslint`), ya'ni
 * ikki ilovada bir xil qoidalar va yangi paket yo'q. React'ga xos
 * qoidalar (hooks tartibi, `next/image`) hozircha yo'q — ular kerak
 * bo'lganda `eslint-config-next` alohida qaror bilan qo'shiladi.
 *
 * Kengaytma `.mjs`: paketda `"type": "module"` yo'q, konfiguratsiya esa ESM.
 */
export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      // Brauzer API'lari (`window`, `document`, `ResizeObserver`,
      // `crypto`, `fetch`) global sifatida e'lon qilinadi — aks holda
      // ularning har biri `no-undef` xatosi bo'lib chiqadi.
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        ResizeObserver: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        HTMLDivElement: "readonly",
        HTMLElement: "readonly",
        AbortController: "readonly",
        TextDecoder: "readonly",
        RequestInit: "readonly",
      },
    },
    rules: {
      // `any` — AI-GUIDE.md dagi qattiq qoida. Ogohlantirish emas, XATO.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
