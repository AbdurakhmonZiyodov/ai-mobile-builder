import { Stack } from "expo-router";
import { theme } from "@/lib/theme";

/** Ilova bo'limining layout'i — QOTIRILGAN. */
export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
