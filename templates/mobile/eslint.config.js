// Verify gate shu qoidalar bo'yicha ishlaydi (spek 8.1, 17.3).
const expoConfig = require("eslint-config-expo/flat");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  ...expoConfig,
  {
    ignores: ["dist/*", ".amb-web/*", ".amb-bundle/*", ".expo/*", "expo-env.d.ts"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      // Modelga ko'proq cheklov — kamroq xato (spek 17.3).
      "@typescript-eslint/no-explicit-any": "error",

      // O'zbek lotin yozuvida apostrof har qadamda uchraydi ("o'zgarish", "yo'q").
      // Bu qoida React Native matnida ma'nosiz, lekin agentning har tuzatish
      // urinishini yeb qo'yadi — shuning uchun o'chirilgan.
      "react/no-unescaped-entities": "off",

      /**
       * `@expo/ui` ning platformaga xos yo'llari TAQIQLANGAN.
       *
       * `@expo/ui/swift-ui` va `@expo/ui/jetpack-compose` ichida
       * `requireNativeView(...)` MODUL DARAJASIDA chaqiriladi — import
       * paytida tashlaydi. Vebda native modul yo'q, shuning uchun:
       *
       *   · `expo export --platform web` MUVAFFAQIYATLI tugaydi (EXIT=0)
       *   · verify gate yashil bo'ladi va o'zgarish HISOBLANADI
       *   · mijozning birinchi preview'i BO'SH EKRAN bo'ladi
       *
       * Bu empirik tekshirilgan. Universal `@expo/ui` da RN zaxirasi bor
       * va u uchala platformada ishlaydi.
       */
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@expo/ui/swift-ui",
              message:
                "@expo/ui/swift-ui vebda import paytida yiqiladi va preview bo'sh chiqadi. Universal '@expo/ui' dan import qiling.",
            },
            {
              name: "@expo/ui/jetpack-compose",
              message:
                "@expo/ui/jetpack-compose vebda import paytida yiqiladi va preview bo'sh chiqadi. Universal '@expo/ui' dan import qiling.",
            },
          ],
          patterns: [
            {
              group: ["@expo/ui/swift-ui/*", "@expo/ui/jetpack-compose/*"],
              message:
                "Platformaga xos @expo/ui yo'llari vebda yiqiladi. Universal '@expo/ui' dan import qiling.",
            },
          ],
        },
      ],

      // AI ko'pincha FlatList o'rniga .map() ishlatadi — ro'yxat unumdorligi tushadi (spek 17.2).
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXElement[openingElement.name.name='ScrollView'] JSXExpressionContainer > CallExpression[callee.property.name='map']",
          message: "ScrollView ichida .map() ishlatmang — uzun ro'yxat uchun FlatList ishlating.",
        },
      ],
    },
  },
];
