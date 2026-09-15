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
