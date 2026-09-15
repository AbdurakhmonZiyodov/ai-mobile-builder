import Link from "next/link";
import { PricingTable } from "@/features/billing/pricing-table";
import { SectionLabel } from "@/shared/ui";

export const metadata = { title: "Narx — RIVO" };

/**
 * Narx sahifasi.
 *
 * Mijozning uchta savoliga javob beradi: qancha turadi, nima kiradi,
 * ishlamasa nima bo'ladi. Uchinchisi — kafolat — eng muhimi, chunki
 * uning asl qo'rquvi «pul to'layman, keyin tiqilib qolaman».
 */
export default function PricingPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-12">
      <header className="flex items-center justify-between border-b-2 border-ink pb-5">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          RIVO
        </Link>
        <Link href="/loyihalarim" className="text-sm text-ink-muted hover:text-ink">
          Loyihalarim
        </Link>
      </header>

      <SectionLabel left="Narx" right="ikki valyutada" />
      <PricingTable />
    </main>
  );
}
