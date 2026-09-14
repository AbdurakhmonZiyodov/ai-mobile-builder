import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { theme } from "@/lib/theme";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Screen title="Sozlamalar">
      <View style={styles.section}>
        <Text style={styles.label}>Ilova haqida</Text>
        <Text style={styles.value}>Versiya 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Maxfiylik</Text>
        <Text style={styles.value}>
          Maxfiylik siyosati havolasi do'konga chiqarishdan oldin qo'shiladi.
        </Text>
      </View>

      <Button label="Orqaga" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted, textTransform: "uppercase" },
  value: { fontSize: theme.fontSize.md, color: theme.colors.text },
});
