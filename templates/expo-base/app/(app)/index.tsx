import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { theme } from "@/lib/theme";
import type { ListItem } from "@/types";

/**
 * Bosh ekran.
 * Agent shu ekrandan boshlab mijozning sohasiga moslaydi.
 */
const items: ListItem[] = [
  { id: "1", title: "Birinchi yozuv", subtitle: "Bu namunaviy ma'lumot" },
  { id: "2", title: "Ikkinchi yozuv", subtitle: "Agent buni real ma'lumot bilan almashtiradi" },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen title="Bosh sahifa" subtitle="Ilovangiz shu yerdan boshlanadi" scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState title="Hozircha bo'sh" hint="Birinchi yozuvni qo'shing." />
        }
        renderItem={({ item }) => <Card title={item.title} subtitle={item.subtitle} />}
      />
      <View style={styles.footer}>
        <Button label="Sozlamalar" variant="secondary" onPress={() => router.push("/settings")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: theme.spacing.md, gap: theme.spacing.md },
  footer: { padding: theme.spacing.md },
});
