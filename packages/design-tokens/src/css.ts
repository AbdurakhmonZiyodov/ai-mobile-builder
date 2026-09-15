import { colors } from "./colors.js";
import { fonts } from "./typography.js";

/**
 * Tokenlarni CSS o'zgaruvchilariga aylantiradi.
 * Next.js `globals.css` shu chiqishni ishlatadi — qo'lda yozilmaydi.
 */
export function toCssVariables(): string {
  const lines: string[] = [];
  for (const [name, value] of Object.entries(colors)) {
    lines.push(`  --color-${kebab(name)}: ${value};`);
  }
  lines.push(`  --font-sans: ${fonts.sans};`);
  lines.push(`  --font-mono: ${fonts.mono};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}
