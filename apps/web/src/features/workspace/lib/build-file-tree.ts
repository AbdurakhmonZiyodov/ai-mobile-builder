import type { FileNode } from "@amb/contracts";

/**
 * Tekis yo'llar ro'yxatini daraxtga aylantiradi.
 *
 * Nega alohida fayl, komponent ichida emas: bu sof mantiq — kirish
 * massiv, chiqish massiv, React'siz. `timeline.ts` ham shu sababdan
 * komponentdan tashqarida turadi: uni alohida tekshirish mumkin va
 * komponent faqat KO'RSATISH bilan shug'ullanadi.
 */
export interface TreeNode {
  name: string;
  /** To'liq yo'l — tanlash va ochiq papkalar ro'yxati shu bilan ishlaydi. */
  path: string;
  type: "file" | "dir";
  children: TreeNode[];
}

export function buildFileTree(nodes: FileNode[]): TreeNode[] {
  const root: TreeNode = { name: "", path: "", type: "dir", children: [] };

  for (const node of nodes) {
    const parts = node.path.split("/").filter((part) => part !== "");
    let current = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const path = parts.slice(0, index + 1).join("/");
      // Nega oraliq papka o'zi yaratiladi: server faqat fayllar ro'yxatini
      // yuborishi mumkin va u holda `app/(tabs)/index.tsx` uchun `app` va
      // `(tabs)` papkalari hech qayerda ko'rinmay qolardi.
      let child = current.children.find((item) => item.name === part);
      if (!child) {
        child = { name: part, path, type: isLast ? node.type : "dir", children: [] };
        current.children.push(child);
      }
      current = child;
    });
  }

  sortNodes(root.children);
  return root.children;
}

/** Avval papkalar, keyin fayllar — VS Code shunday va ko'z shunga o'rgangan. */
function sortNodes(nodes: TreeNode[]): void {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  for (const node of nodes) sortNodes(node.children);
}
