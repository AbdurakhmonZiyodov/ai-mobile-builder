import { allSource, type Rule } from "../review.types.js";

/**
 * 4.8 — Sign in with Apple.
 *
 * Google yoki Facebook bilan kirish bo'lsa, Apple bilan kirish ham
 * bo'lishi shart. Apple buni o'z ekotizimidagi maxfiylik kafolati deb
 * biladi va istisno qilmaydi.
 */
export const appleSignIn: Rule = (input) => {
  const source = allSource(input);

  const hasThirdParty = /google.?sign.?in|signInWithOAuth|facebook|GoogleSignin/i.test(source);
  const hasApple = /expo-apple-authentication|AppleAuthentication|signInWithApple/i.test(source);

  if (!hasThirdParty || hasApple) return [];

  return [
    {
      clause: "4.8",
      severity: "blocker",
      titleUz: "Apple bilan kirish yo'q",
      detailUz:
        "Google yoki Facebook bilan kirish bor, lekin Apple bilan kirish yo'q. Apple buni talab qiladi.",
      files: [],
    },
  ];
};
