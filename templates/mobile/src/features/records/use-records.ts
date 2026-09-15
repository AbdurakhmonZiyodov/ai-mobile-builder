import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { ListItem } from "@/types";

export type RecordsState =
  | { status: "loading" }
  | { status: "not-connected" }
  | { status: "error"; message: string }
  | { status: "ready"; data: ListItem[] };

/**
 * Yozuvlarni haqiqiy manbadan oladi.
 *
 * Nega `not-connected` alohida holat: shablon ilk yaratilganda baza hali
 * ulanmagan bo'ladi. Buni «xato» deb ko'rsatish mijozni qo'rqitadi, bo'sh
 * ro'yxat esa yolg'on — ikkalasi ham noto'g'ri. Uchinchi holat kerak.
 *
 * Agent bu hook'ni domen modeliga moslab qayta yozadi: `records` o'rniga
 * `bookings`, `products` va hokazo.
 */
export function useRecords(): RecordsState {
  const [state, setState] = useState<RecordsState>(() =>
    isSupabaseConfigured() ? { status: "loading" } : { status: "not-connected" },
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let cancelled = false;

    void (async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("records")
          .select("id, title, subtitle")
          .order("created_at", { ascending: false })
          .limit(50);

        if (cancelled) return;
        if (error) {
          setState({ status: "error", message: error.message });
          return;
        }
        setState({ status: "ready", data: (data ?? []) as ListItem[] });
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Noma'lum xatolik",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
