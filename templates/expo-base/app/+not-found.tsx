import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/lib/theme";

export default function NotFoundScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Bunday sahifa yo'q</Text>
      <Link href="/" style={styles.link}>
        Bosh sahifaga qaytish
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: { fontSize: theme.fontSize.xl, fontWeight: "600", color: theme.colors.text },
  link: { fontSize: theme.fontSize.md, color: theme.colors.primary },
});
