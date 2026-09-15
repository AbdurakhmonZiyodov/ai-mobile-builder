import { PromptBox } from "@/features/project-create/prompt-box";
import { AmbientGlow, Card, GradientText, SectionLabel, SiteHeader } from "@/shared/ui";

/**
 * Landing.
 *
 * Tartib: katta markazlashgan sarlavha, ostida darhol prompt maydoni.
 * Mijoz mahsulotni o'qimasdan ham boshlay olishi kerak — pozitsiyalash
 * matni pastda, u ishonchni mustahkamlaydi, lekin boshlashga
 * to'sqinlik qilmaydi.
 *
 * Gradient bu sahifada uch joyda: sarlavhaning bitta jumlasi, prompt
 * tugmasi va fon porlashi. Undan ko'pi shovqin bo'lardi.
 */
export default function LandingPage() {
  return (
    <main className="relative mx-auto max-w-5xl px-6 pb-24">
      <SiteHeader
        links={[
          { href: "/narx", label: "Narx" },
          { href: "/loyihalarim", label: "Loyihalarim" },
        ]}
      />

      <section className="relative flex flex-col items-center pt-14 pb-24 text-center sm:pt-20">
        <AmbientGlow className="top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 opacity-15" />

        <span className="label-mono rounded-full border border-line bg-surface px-4 py-1.5">
          O&apos;zbek tilida · Kafolat bilan
        </span>

        <h1 className="mt-8 max-w-4xl text-[2.75rem] leading-[1.04] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
          Boshqalar tez chiqarish uchun.
          <br />
          <GradientText>Biz ishlab turishi uchun.</GradientText>
        </h1>

        <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-muted text-pretty">
          G&apos;oyangizni o&apos;z tilingizda ayting. Biz ilovani quramiz, o&apos;zimiz
          ochib har tugmasini bosib tekshiramiz, do&apos;konga chiqaramiz va keyin ham
          ishlab turishini ta&apos;minlaymiz.
        </p>

        <div className="mt-12 w-full max-w-2xl text-left">
          <PromptBox />
        </div>
      </section>

      <section className="space-y-6">
        <SectionLabel left="Uchta ustun" right="nega biz" />

        <div className="grid gap-4 sm:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Card key={pillar.title} className="p-6">
              <span className="label-mono">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-4 font-semibold">{pillar.title}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{pillar.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

const PILLARS = [
  {
    title: "Ilovangizni o'zimiz bosib ko'ramiz",
    body: "Boshqalar «kod yig'ildi» deydi. Biz ilovani haqiqiy qurilmada ochib, ro'yxatdan o'tib, asosiy amalni bajarib, natijani skrinshot bilan ko'rsatamiz.",
  },
  {
    title: "Rad etish sabablari bazasi",
    body: "Do'kon rad etgan har holat qaysi band, qaysi ekran va nima yordam berganigacha yoziladi. Ikkinchi marta o'sha xato takrorlanmaydi.",
  },
  {
    title: "Kafolat",
    body: "Apple rad qilsa — o'tgunicha bepul tuzatamiz. Raqobatchilar buni ayta olmaydi, chunki o'z sifatini o'lchamaydi.",
  },
] as const;
