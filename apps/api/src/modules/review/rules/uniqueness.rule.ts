import { getIn, type Rule } from "../review.types.js";

/** Shablondan qolib ketgan nomlar. */
const GENERIC_SLUGS = ["my-app", "myapp", "expo-app", "app", "template", "amb-app", "amb-new-app"];

/**
 * 4.3 — Spam va duplicate.
 *
 * Bizning eng katta tizimli xavfimiz: agar bizdan chiqqan 50 ta ilova
 * bir-biriga o'xshasa, Apple buni naqsh sifatida aniqlaydi va HAMMASINI
 * rad etishi mumkin.
 *
 * Shuning uchun domen paketlari va har mijoz uchun alohida dizayn tizimi
 * bor. Bu qoida esa eng oddiy belgini tutadi: shablon nomi o'zgartirilmagan.
 */
export const uniqueness: Rule = (input) => {
  const slug = getIn(input.appConfig, ["expo", "slug"]);
  const name = getIn(input.appConfig, ["expo", "name"]);

  if (typeof slug === "string" && GENERIC_SLUGS.includes(slug.toLowerCase())) {
    return [
      {
        clause: "4.3",
        severity: "warning",
        titleUz: "Ilova nomi juda umumiy",
        detailUz: `Slug "${slug}" shablon nomiga o'xshaydi. Apple 4.3 bandi bo'yicha o'xshash ilovalar oqimini rad etadi — nom va dizayn o'ziga xos bo'lsin.`,
        files: ["app.json"],
      },
    ];
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return [
      {
        clause: "4.3",
        severity: "warning",
        titleUz: "Ilova nomi yo'q",
        detailUz: "app.json ichida expo.name to'ldirilmagan.",
        files: ["app.json"],
      },
    ];
  }

  return [];
};
