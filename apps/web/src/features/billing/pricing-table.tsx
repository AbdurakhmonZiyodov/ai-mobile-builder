import { PLANS, EXTRA_CHANGE_PRICE, THIRD_PARTY_COSTS } from "@amb/core-rules";
import { Card, Money, formatUsd } from "@/shared/ui";

/**
 * Narx jadvali.
 *
 * Qiymatlar `@amb/core-rules` dan keladi — bu yerda qo'lda yozilgan raqam
 * yo'q. Narx o'zgarsa, backend va frontend bir vaqtda o'zgaradi.
 *
 * Uchinchi tomon xarajatlari ataylab shu sahifada: mijozning birinchi
 * savoli «$99 yana alohidami?» bo'ladi va javob shu yerda bo'lishi kerak,
 * to'lovdan keyin emas.
 */
export function PricingTable() {
  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.values(PLANS).map((plan) => (
          <Card key={plan.id} className="p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold">{plan.nameUz}</h3>
              <span className="label-mono !text-[11px]">
                {plan.billing === "monthly" ? "oylik" : plan.billing === "once" ? "bir marta" : "bepul"}
              </span>
            </div>

            <p className="mt-2 text-xl">
              <Money uzs={plan.priceUzs} usdCents={plan.priceUsdCents} />
            </p>

            {plan.includedChanges > 0 ? (
              <p className="mt-1 text-sm text-ink-muted">{plan.includedChanges} o&apos;zgarish kiradi</p>
            ) : null}

            <ul className="mt-4 space-y-1.5 text-sm text-ink-muted">
              {plan.featuresUz.map((feature) => (
                <li key={feature}>· {feature}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Uchta va&apos;da</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li>
            · <strong className="text-ink">Xato tuzatish bepul.</strong> Tekshiruvdan o&apos;tmasa
            hisoblanmaydi.
          </li>
          <li>
            · <strong className="text-ink">Qoldiq yonmaydi.</strong> Sotib olingan o&apos;zgarishlar
            muddatsiz ({formatUsd(EXTRA_CHANGE_PRICE.usdCents)} / dona).
          </li>
          <li>
            · <strong className="text-ink">Kod har doim sizniki.</strong> GitHub eksport hamma
            tarifda.
          </li>
        </ul>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold">Bizdan tashqari xarajatlar</h3>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {THIRD_PARTY_COSTS.map((cost) => (
              <tr key={cost.keyUz} className="border-t border-line">
                <td className="py-2">{cost.keyUz}</td>
                <td className="py-2 text-right">
                  {formatUsd(cost.usdCents)}{" "}
                  <span className="text-ink-faint">{cost.periodUz}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
