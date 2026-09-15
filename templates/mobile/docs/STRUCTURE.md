# Kod qayerga yoziladi

## Qaror jadvali

| Nima qo'shyapsiz | Qayerga | Misol |
| --- | --- | --- |
| Yangi ekran | `app/(app)/<yo'l>.tsx` | `app/(app)/bron.tsx` |
| Ekran ichidagi qism | `src/features/<soha>/components/` | `features/booking/components/slot-picker.tsx` |
| Ma'lumot olish | `src/features/<soha>/use-<narsa>.ts` | `features/booking/use-slots.ts` |
| Qayta ishlatiladigan UI | `src/components/` | `components/button.tsx` |
| Tashqi xizmat | `src/lib/` | `lib/supabase.ts` |
| Umumiy tur | `src/types/index.ts` | `ListItem` |

## Ekran shabloni

```tsx
import { FlatList } from "react-native";
import { Screen } from "@/components/screen";
import { EmptyState } from "@/components/empty-state";
import { useSlots } from "@/features/booking/use-slots";

export default function BookingScreen() {
  const slots = useSlots();

  return (
    <Screen title="Vaqt tanlang" scroll={false}>
      <FlatList
        data={slots.status === "ready" ? slots.data : []}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="Bo'sh vaqt yo'q" />}
        renderItem={({ item }) => <SlotCard slot={item} />}
      />
    </Screen>
  );
}
```

Ekran **mantiq yozmaydi** — u hook'dan holat oladi va ko'rsatadi.

## Hook shabloni

Har hook to'rt holatni qaytaradi:

```ts
type State =
  | { status: "loading" }
  | { status: "not-connected" }   // baza hali ulanmagan
  | { status: "error"; message: string }
  | { status: "ready"; data: T[] };
```

`not-connected` alohida holat bo'lishi shart: uni «xato» deb ko'rsatish
mijozni qo'rqitadi, bo'sh ro'yxat esa yolg'on.

## Nomlash

| Tur | Naqsh |
| --- | --- |
| Komponent fayli | `kebab-case.tsx`, export `PascalCase` |
| Hook | `use-<narsa>.ts`, export `useNarsa` |
| Tur | `PascalCase` |
| Doimiy | `SCREAMING_SNAKE` |

## Import taxalluslari

```ts
import { Button } from "@/components/button";   // src/components/
import { theme } from "@/lib/theme";            // src/lib/
```

`@/` → `src/`. Ekranlar `app/` da qoladi va ular bir-birini
`expo-router` orqali chaqiradi, to'g'ridan-to'g'ri import qilmaydi.
