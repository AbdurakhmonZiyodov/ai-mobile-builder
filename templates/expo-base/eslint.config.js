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
