import { PricingTable } from "@/features/billing/pricing-table";
import { AmbientGlow, GradientText, SiteHeader } from "@/shared/ui";

export const metadata = { title: "Narx — RIVO" };

/**
 * Narx sahifasi.
 *
 * Mijozning uchta savoliga javob beradi: qancha turadi, nima kiradi,
 * ishlamasa nima bo'ladi. Uchinchisi — kafolat — eng muhimi, chunki
 * uning asl qo'rquvi «pul to'layman, keyin tiqilib qolaman».
 *
 * Sarlavhada gradient faqat «hech qanday yashirin to'lov» jumlasida:
 * mijoz eng qo'rqadigan joy aynan shu va ko'z o'sha yerga tushishi kerak.
 */
export default function PricingPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-6 pb-24">
      <SiteHeader
        links={[
          { href: "/narx", label: "Narx" },
          { href: "/loyihalarim", label: "Loyihalarim" },
        ]}
      />

      <section className="relative flex flex-col items-center pt-16 pb-14 text-center">
        <AmbientGlow className="top-0 left-1/2 h-[320px] w-[560px] -translate-x-1/2 opacity-12" />

        <h1 className="max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
          Narxi oldindan ma&apos;lum. <GradientText>Yashirin to&apos;lov yo&apos;q.</GradientText>
        </h1>

        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-muted text-pretty">
          Bizdan tashqari xarajatlar ham shu sahifada — to&apos;lovdan keyin emas,
          oldin.
        </p>
      </section>

      <PricingTable />
    </main>
  );
}
