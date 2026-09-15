import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/lib/theme";

interface CardProps {
  title: string;
  subtitle?: string;
  right?: string;
  onPress?: () => void;
  children?: ReactNode;
}

export function Card({ title, subtitle, right, onPress, children }: CardProps) {
  const content = (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.grow}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right ? <Text style={styles.right}>{right}</Text> : null}
      </View>
      {children}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  grow: { flex: 1 },
  title: { fontSize: theme.fontSize.lg, fontWeight: "600", color: theme.colors.text },
  subtitle: { fontSize: theme.fontSize.md, color: theme.colors.textMuted, marginTop: 2 },
  right: { fontSize: theme.fontSize.md, fontWeight: "600", color: theme.colors.primary },
});
