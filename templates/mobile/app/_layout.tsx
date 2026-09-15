// supabase-js React Native'da `URL` va `URLSearchParams` ga tayanadi,
// Hermes esa ularni to'liq bermaydi. Polyfill ilovaning ENG BIRINCHI
// import'i bo'lishi shart — aks holda tarmoq so'rovlari qurilmada
// jimgina ishlamay qoladi.
import "react-native-url-polyfill/auto";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * Ildiz layout — QOTIRILGAN.
 * Agent bu faylni generatsiya qilmaydi: AI eng ko'p navigatsiyada xato qiladi (spek 17.2).
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" options={{ title: "Topilmadi" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
