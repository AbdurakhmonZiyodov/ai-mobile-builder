import { PLANS, EXTRA_CHANGE_PRICE, THIRD_PARTY_COSTS } from "@amb/shared";

const usd = (cents: number) => (cents === 0 ? "$0" : `$${(cents / 100).toFixed(0)}`);
const uzs = (sum: number) => (sum === 0 ? "0" : sum.toLocaleString("uz-UZ").replace(/ /g, " "));

/**
 * Narx jadvali.
 * Mijozning uchta savoliga javob berishi shart (spek 15.2):
 * qancha turadi · qachon tayyor bo'ladi · ishlamasa nima bo'ladi.
 */
export function PricingTable() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Narx</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.values(PLANS).map((plan) => (
          <div key={plan.id} className="rounded-xl border border-[color:var(--color-line)] p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">{plan.nameUz}</h3>
              <span className="text-lg font-bold">
                {usd(plan.priceUsdCents)}
                {plan.billing === "monthly" ? "/oy" : plan.billing === "once" ? " bir marta" : ""}
              </span>
            </div>
            <p className="text-sm text-[color:var(--color-muted)]">
              {uzs(plan.priceUzs)} so'm
              {plan.includedChanges > 0 ? ` · ${plan.includedChanges} o'zgarish` : ""}
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {plan.featuresUz.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[color:var(--color-line)] p-4 space-y-2">
        <h3 className="font-semibold">Uchta va&apos;da</h3>
        <ul className="space-y-1 text-sm">
          <li>· Xato tuzatish bepul — tekshiruvdan o&apos;tmasa hisoblanmaydi.</li>
          <li>
            · Qoldiq yonmaydi — sotib olingan o&apos;zgarishlar muddatsiz (
            {usd(EXTRA_CHANGE_PRICE.usdCents)} / dona).
          </li>
          <li>· Kod har doim sizniki — GitHub eksport hamma tarifda.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-[color:var(--color-line)] p-4">
        <h3 className="font-semibold">Bizdan tashqari xarajatlar</h3>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {THIRD_PARTY_COSTS.map((c) => (
              <tr key={c.keyUz} className="border-t border-[color:var(--color-line)]">
                <td className="py-1.5">{c.keyUz}</td>
                <td className="py-1.5 text-right">
                  {usd(c.usdCents)} <span className="text-[color:var(--color-muted)]">{c.periodUz}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
