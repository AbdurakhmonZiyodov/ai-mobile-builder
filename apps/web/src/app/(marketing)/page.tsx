import Link from "next/link";
import { PromptBox } from "@/features/project-create/prompt-box";
import { SectionLabel } from "@/shared/ui";

/**
 * Landing.
 *
 * Prompt maydoni ekranning yuqorisida va bu ataylab: mijoz mahsulotni
 * o'qimasdan ham boshlay olishi kerak. Pozitsiyalash matni pastda —
 * u ishonchni mustahkamlaydi, lekin boshlashga to'sqinlik qilmaydi.
 */
export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-14 px-6 py-12">
      <header className="flex items-center justify-between border-b-2 border-ink pb-5">
        <span className="text-xl font-semibold tracking-tight">RIVO</span>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/narx" className="text-ink-muted hover:text-ink">
            Narx
          </Link>
          <Link href="/loyihalarim" className="text-ink-muted hover:text-ink">
            Loyihalarim
          </Link>
        </nav>
      </header>

      <section className="space-y-6">
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          Boshqalar tez chiqarish uchun.{" "}
          <span className="text-accent">Biz ishlab turishi uchun.</span>
        </h1>

        <p className="max-w-2xl text-[17px] leading-relaxed text-ink-muted">
          G&apos;oyangizni o&apos;z tilingizda ayting. Biz ilovani quramiz,
          o&apos;zimiz ochib har tugmasini bosib tekshiramiz, do&apos;konga chiqaramiz va keyin ham
          ishlab turishini ta&apos;minlaymiz.
        </p>

        <PromptBox />
      </section>

      <section className="space-y-5">
        <SectionLabel left="Uchta ustun" right="nega biz" />
        <div className="grid gap-4 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="border-t-2 border-ink pt-4">
              <h2 className="font-semibold">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{pillar.body}</p>
            </div>
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
