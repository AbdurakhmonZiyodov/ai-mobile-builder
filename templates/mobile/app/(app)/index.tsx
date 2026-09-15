import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { useRecords } from "@/features/records/use-records";
import { theme } from "@/lib/theme";

/**
 * Bosh ekran.
 *
 * Shablonda NAMUNAVIY MA'LUMOT YO'Q. Sabab: soxta yozuvlar mijozga
 * ilovasi ishlayotgandek ko'rsatadi, aslida baza hali ulanmagan. U buni
 * do'konga chiqargandan keyin biladi — eng qimmat payt.
 *
 * Shuning uchun ro'yxat haqiqiy manbadan keladi va manba yo'q bo'lsa,
 * ekran buni ochiq aytadi.
 */
export default function HomeScreen() {
  const router = useRouter();
  const records = useRecords();

  return (
    <Screen title="Bosh sahifa" subtitle="Ilovangiz shu yerdan boshlanadi" scroll={false}>
      <FlatList
        data={records.status === "ready" ? records.data : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState {...emptyStateFor(records)} />}
        renderItem={({ item }) => (
          <Card title={item.title} subtitle={item.subtitle} right="Ochish" />
        )}
      />

      <View style={styles.footer}>
        <Button label="Sozlamalar" variant="secondary" onPress={() => router.push("/settings")} />
      </View>
    </Screen>
  );
}

/** Har holat uchun mazmunli matn — bo'sh oq ekran rad etish sababi bo'lishi mumkin. */
function emptyStateFor(records: ReturnType<typeof useRecords>) {
  switch (records.status) {
    case "loading":
      return { title: "Yuklanmoqda…" };
    case "error":
      return { title: "Ma'lumotni olib bo'lmadi", hint: records.message };
    case "not-connected":
      return {
        title: "Ma'lumotlar bazasi ulanmagan",
        hint: "Builder'da «Ma'lumotlar bazasi» blokini ulang — shundan keyin bu yerda haqiqiy yozuvlar ko'rinadi.",
      };
    default:
      return { title: "Hozircha bo'sh", hint: "Birinchi yozuvni qo'shing." };
  }
}

const styles = StyleSheet.create({
  list: { padding: theme.spacing.md, gap: theme.spacing.md },
  footer: { padding: theme.spacing.md, gap: theme.spacing.sm },
});
