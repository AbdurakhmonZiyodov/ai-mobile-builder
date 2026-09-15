# Kod qayerga yoziladi

Papka nomlari **qotirilgan**. Agent ularni o'zgartirsa, keyingi run'da
loyiha xaritasi (`MAP.md`) noto'g'ri bo'lib qoladi — model qaramaydigan
joyga qarab, mavjud kodni takrorlaydi.

## Nima bor, nima hosil qilinadi

| Yo'l | Holati |
| --- | --- |
| `app/`, `src/components/`, `src/features/`, `src/lib/`, `src/types/` | Shablonda bor |
| `src/blocks/`, `src/hooks/` | Loyiha yaratilganda bo'sh hosil qilinadi |
| `assets/` | Bo'sh hosil qilinadi — ikonka va splash shu yerga |
| `PROJECT.md`, `DESIGN.md` | Loyiha yaratilganda yoziladi. `DESIGN.md` ni faqat `update_design_note` o'zgartiradi |
| `MAP.md` | Fayl emas — har xabarda qaytadan quriladi va promptga qo'yiladi |
| `ARCHITECTURE.md`, `HANDOFF.md` | Topshirish paketi yaratilganda. `README.md` ham o'sha paytda qayta yoziladi |
| `.amb-cache/`, `.amb-web/`, `.amb-bundle/`, `.expo/` | Yig'ilish natijalari. Tegilmaydi, o'qilmaydi, git'ga tushmaydi |

## Qaror jadvali

| Nima qo'shyapsiz | Qayerga | Misol |
| --- | --- | --- |
| Yangi ekran | `app/(app)/<yo'l>.tsx` | `app/(app)/bron.tsx` → `/bron` |
| Ekran ichidagi qism | `src/features/<soha>/components/` | `src/features/booking/components/slot-picker.tsx` |
| Ma'lumot olish | `src/features/<soha>/use-<narsa>.ts` | `src/features/booking/use-slots.ts` |
| Qayta ishlatiladigan UI | `src/components/` | `src/components/button.tsx` |
| Tashqi xizmat | `src/lib/` | `src/lib/supabase.ts` |
| Umumiy tur | `src/types/index.ts` | `ListItem` |
| Blok fayli | Blok qayerga qo'ysa — o'sha yer | `app/(app)/settings/delete-account.tsx` |

Marshrut **fayl nomidan** keladi. Yangi ekran uchun layout tahrirlash
shart emas va **taqiqlangan** ([`AI-GUIDE.md`](./AI-GUIDE.md) 1-qoida).

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

Uchta narsa majburiy:

- `export default` — Expo Router faqat shuni oladi.
- `scroll={false}` — ro'yxatli ekranda. `FlatList` ni `ScrollView` ichiga
  qo'ysangiz virtualizatsiya o'chadi va uzun ro'yxat qotib qoladi.
- `ListEmptyComponent` — bo'sh oq ekran rad etish sababi.

Ekran **mantiq yozmaydi**: u hook'dan holat oladi va ko'rsatadi. So'rov,
filtr, hisob — hammasi `src/features/` da.

## Hook shabloni

Har hook to'rt holatni qaytaradi:

```ts
type State =
  | { status: "loading" }
  | { status: "not-connected" }   // baza hali ulanmagan
  | { status: "error"; message: string }
  | { status: "ready"; data: T[] };
```

`not-connected` alohida bo'lishi shart: uni «xato» deb ko'rsatish
mijozni qo'rqitadi, bo'sh ro'yxat esa yolg'on. Ikkalasi ham noto'g'ri.

Namuna: `src/features/records/use-records.ts`. Uch narsani nusxa oling —
`cancelled` bayrog'i (ekran yopilgach `setState` chaqirilmasin),
`isSupabaseConfigured()` tekshiruvi, `try/catch` ichida `unknown` xato.

## Nomlash

| Tur | Naqsh | Misol |
| --- | --- | --- |
| Komponent fayli | `kebab-case.tsx`, export `PascalCase` | `empty-state.tsx` → `EmptyState` |
| Hook | `use-<narsa>.ts`, export `useNarsa` | `use-slots.ts` → `useSlots` |
| Ekran | `kebab-case.tsx`, `export default` | `delete-account.tsx` |
| Tur | `PascalCase` | `ListItem` |
| Doimiy | `SCREAMING_SNAKE` | `MAX_ITEMS` |

## Import taxalluslari

```ts
import { Button } from "@/components/button";   // src/components/
import { theme } from "@/lib/theme";            // src/lib/
```

`@/` → `src/`. Nisbiy yo'l (`../../lib/theme`) ishlatilmaydi: fayl
ko'chirilganda buziladi va model uni noto'g'ri tuzatadi.

Ekranlar `app/` da qoladi va bir-birini **import qilmaydi** — ular
`expo-router` orqali chaqiriladi:

```ts
router.push("/bron");     // to'g'ri
import Bron from "./bron"; // noto'g'ri
```

Umumiy kod kerak bo'lsa u `src/` ga chiqariladi.
