import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { theme } from "@/lib/theme";
import type { ListItem } from "@/types";

/**
 * Bosh ekran. Agent shu ekrandan boshlab mijozning sohasiga moslaydi.
 *
 * Ikkita narsa ataylab shunday:
 * 1. Asosiy rangdagi tugma ko'rinib turadi — mijoz "rangni o'zgartir" degandan
 *    keyin farqni DARHOL ko'rishi kerak, aks holda ishonch yo'qoladi.
 * 2. Tugma haqiqiy ish qiladi. Bo'sh `onPress` — Apple 2.1 bandi bo'yicha
 *    rad etish sababi va Review Checker uni topadi.
 */
const initialItems: ListItem[] = [
  { id: "1", title: "Birinchi yozuv", subtitle: "Bu namunaviy ma'lumot" },
  { id: "2", title: "Ikkinchi yozuv", subtitle: "Agent buni real ma'lumot bilan almashtiradi" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ListItem[]>(initialItems);

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: `Yangi yozuv ${prev.length + 1}`,
        subtitle: "Hozir qo'shildi",
      },
    ]);
  }

  return (
    <Screen title="Bosh sahifa" subtitle="Ilovangiz shu yerdan boshlanadi" scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState title="Hozircha bo'sh" hint="Birinchi yozuvni qo'shing." />
        }
        renderItem={({ item }) => (
          <Card title={item.title} subtitle={item.subtitle} right="Ochish" />
        )}
      />
      <View style={styles.footer}>
        <Button label="Yangi yozuv qo'shish" onPress={addItem} />
        <Button label="Sozlamalar" variant="secondary" onPress={() => router.push("/settings")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: theme.spacing.md, gap: theme.spacing.md },
  footer: { padding: theme.spacing.md, gap: theme.spacing.sm },
});
