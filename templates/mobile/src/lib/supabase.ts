import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase mijozi.
 *
 * Kalitlar `EXPO_PUBLIC_*` orqali keladi va ular MIJOZNIKI — biz Supabase
 * loyihasini o'zimiz yaratmaymiz. Sabab: aks holda mijoz ketganda
 * ma'lumoti bizda qoladi (lock-in), bu esa «kod va ma'lumot sizniki»
 * va'damizga zid.
 *
 * Bu yerga faqat `anon` kalit tushadi. `service_role` kaliti RLS'ni
 * butunlay chetlab o'tadi va u hech qachon ilova kodiga kirmaydi.
 */

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Baza ulanganmi.
 *
 * Ekranlar buni tekshiradi: ulanmagan bo'lsa, ular soxta ma'lumot
 * ko'rsatmaydi, balki «baza ulanmagan» deb ochiq aytadi.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(URL && ANON_KEY);
}

export function getSupabase(): SupabaseClient {
  if (!URL || !ANON_KEY) {
    throw new Error(
      "Supabase sozlanmagan. .env faylga EXPO_PUBLIC_SUPABASE_URL va EXPO_PUBLIC_SUPABASE_ANON_KEY qo'shing.",
    );
  }

  if (!client) {
    client = createClient(URL, ANON_KEY, {
      auth: {
        /**
         * React Native'da `localStorage` yo'q.
         *
         * Bu adapter ko'rsatilmasa, supabase-js seansni saqlay olmaydi va
         * foydalanuvchi ilovani har ochganda qaytadan kirishga majbur
         * bo'ladi. Veb preview'da bu ko'rinmaydi — faqat qurilmada
         * chiqadi, ya'ni eng kech payt.
         */
        storage: AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
        /** URL'dan seans o'qish faqat veb uchun. */
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
