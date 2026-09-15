import Link from "next/link";

/** Navigatsiya havolasi — joriy sahifaniki ro'yxatdan chiqariladi. */
interface NavLink {
  href: string;
  label: string;
}

/**
 * Marketing va ro'yxat sahifalarining yuqori paneli.
 *
 * Nega alohida komponent: uchta sahifada bir xil edi va har biri
 * o'zicha o'zgarib ketardi. Endi logotip va navigatsiya bitta joyda.
 *
 * Panelda gradient tugma YO'Q — sahifadagi yagona gradient asosiy
 * amal uchun (prompt maydonidagi tugma yoki tarif tanlash) saqlanadi.
 */
export function SiteHeader({ links }: { links: NavLink[] }) {
  return (
    <header className="flex items-center justify-between border-b border-line pt-6 pb-5">
      <Link href="/" className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-accent-from to-accent-to"
        />
        <span className="text-lg font-semibold tracking-tight">RIVO</span>
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-ink-muted transition-colors hover:text-ink">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
