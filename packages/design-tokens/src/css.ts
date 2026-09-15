import { colors } from "./colors.js";
import { gradients } from "./gradients.js";
import { fonts } from "./typography.js";

/**
 * Tokenlarni CSS o'zgaruvchilariga aylantiradi.
 * Next.js `globals.css` shu chiqishni ishlatadi — qo'lda yozilmaydi.
 *
 * Gradient to'xtash nuqtalari ham `--color-*` nomi bilan chiqadi:
 * shunda Tailwind'ning `from-* / via-* / to-*` sinflari ishlaydi.
 */
export function toCssVariables(): string {
  const lines: string[] = [];

  for (const [name, value] of Object.entries(colors)) {
    lines.push(`  --color-${kebab(name)}: ${value};`);
  }

  for (const [name, stops] of Object.entries(gradients)) {
    const prefix = `--color-${kebab(name)}`;
    lines.push(`  ${prefix}-from: ${stops.from};`);
    lines.push(`  ${prefix}-via: ${stops.via};`);
    lines.push(`  ${prefix}-to: ${stops.to};`);
    lines.push(`  --gradient-${kebab(name)}-angle: ${stops.angle};`);
  }

  lines.push(`  --font-sans: ${fonts.sans};`);
  lines.push(`  --font-mono: ${fonts.mono};`);

  return `:root {\n${lines.join("\n")}\n}`;
}

function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}
