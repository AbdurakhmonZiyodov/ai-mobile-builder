import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/lib/theme";

/**
 * Bo'sh holat — E2E tekshiruvi buni alohida qaraydi (spek 12.2).
 * Bo'sh oq ekran rad etish sababi bo'lishi mumkin.
 */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { padding: theme.spacing.xl, alignItems: "center", gap: theme.spacing.sm },
  title: { fontSize: theme.fontSize.lg, fontWeight: "600", color: theme.colors.text },
  hint: { fontSize: theme.fontSize.md, color: theme.colors.textMuted, textAlign: "center" },
});
