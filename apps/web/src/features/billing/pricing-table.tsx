import { PLANS, EXTRA_CHANGE_PRICE, THIRD_PARTY_COSTS } from "@amb/core-rules";
import { Card, Money, SectionLabel, formatUsd } from "@/shared/ui";

/**
 * Narx jadvali.
 *
 * Qiymatlar `@amb/core-rules` dan keladi — bu yerda qo'lda yozilgan raqam
 * yo'q. Narx o'zgarsa, backend va frontend bir vaqtda o'zgaradi.
 *
 * Uchinchi tomon xarajatlari ataylab shu sahifada: mijozning birinchi
 * savoli «$99 yana alohidami?» bo'ladi va javob shu yerda bo'lishi kerak,
 * to'lovdan keyin emas.
 *
 * Gradient tugma yo'q: bu sahifada tanlash emas, TUSHUNISH vazifasi
 * turibdi. Tanlash prompt maydonidan boshlanadi.
 */
export function PricingTable() {
  return (
    <section className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.values(PLANS).map((plan) => (
          <Card key={plan.id} className="flex flex-col p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold">{plan.nameUz}</h2>
              <span className="label-mono">
                {plan.billing === "monthly"
                  ? "oylik"
                  : plan.billing === "once"
                    ? "bir marta"
                    : "bepul"}
              </span>
            </div>

            <p className="mt-5">
              <Money uzs={plan.priceUzs} usdCents={plan.priceUsdCents} />
            </p>

            {plan.includedChanges > 0 ? (
              <p className="mt-2 text-sm text-ink-muted">
                {plan.includedChanges} o&apos;zgarish kiradi
              </p>
            ) : null}

            <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-ink-muted">
              {plan.featuresUz.map((feature) => (
                <li key={feature} className="flex gap-2.5">
                  <span aria-hidden className="text-accent">
                    ·
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <SectionLabel left="Uchta va'da" right="kafolat" />

        <div className="grid gap-4 sm:grid-cols-3">
          {PROMISES.map((promise) => (
            <Card key={promise.title} nested className="p-5">
              <h3 className="font-semibold">{promise.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{promise.body}</p>
            </Card>
          ))}
        </div>

        <p className="text-sm text-ink-faint">
          Qo&apos;shimcha o&apos;zgarish — {formatUsd(EXTRA_CHANGE_PRICE.usdCents)} / dona,
          muddatsiz.
        </p>
      </div>

      <div className="space-y-6">
        <SectionLabel left="Bizdan tashqari xarajatlar" right="to'g'ridan-to'g'ri do'konga" />

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {THIRD_PARTY_COSTS.map((cost, index) => (
                <tr key={cost.keyUz} className={index > 0 ? "border-t border-line" : ""}>
                  <td className="px-5 py-3.5">{cost.keyUz}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-medium">{formatUsd(cost.usdCents)}</span>{" "}
                    <span className="text-ink-faint">{cost.periodUz}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </section>
  );
}

const PROMISES = [
  {
    title: "Xato tuzatish bepul",
    body: "Tekshiruvdan o'tmagan o'zgarish hisoblanmaydi. Biz o'z xatomiz uchun pul olmaymiz.",
  },
  {
    title: "Qoldiq yonmaydi",
    body: "Sotib olingan o'zgarishlar muddatsiz qoladi. Oy oxirida ular yo'qolmaydi.",
  },
  {
    title: "Kod har doim sizniki",
    body: "GitHub eksport hamma tarifda. Bizdan ketsangiz ham ilovangiz siz bilan qoladi.",
  },
] as const;
