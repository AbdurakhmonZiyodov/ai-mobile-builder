export interface CheckerFile {
  path: string;
  content: string;
}

export interface CheckerInput {
  files: CheckerFile[];
  /** app.json / app.config.js dan olingan konfiguratsiya */
  appConfig: Record<string, unknown>;
  blocks: readonly string[];
  /** Mahsulot turi — 3.1.1 bandi uchun hal qiluvchi */
  sells: "digital" | "physical_or_service";
  minScreens: number;
}

export type Severity = "blocker" | "warning" | "info";

export interface Finding {
  /** Apple App Store Review Guidelines bandi */
  clause: string;
  severity: Severity;
  /** Mijozga oddiy tilda — "rad etish sababi" emas, "nima qilish kerak" */
  titleUz: string;
  detailUz: string;
  files: string[];
}

export interface ReviewReport {
  ok: boolean;
  findings: Finding[];
  /** Do'konda birinchi urinishda o'tish ehtimoli, 0..1 — metrikaga ulanadi */
  passLikelihood: number;
}

/**
 * Review Checker — spek 13.3.
 * Bu ixtiyoriy emas: kafolatning ("Apple rad qilsa, bepul tuzatamiz") sharti.
 */
export function runReviewChecker(input: CheckerInput): ReviewReport {
  const findings: Finding[] = [];
  for (const rule of RULES) findings.push(...rule(input));

  const blockers = findings.filter((f) => f.severity === "blocker");
  const warnings = findings.filter((f) => f.severity === "warning");

  return {
    ok: blockers.length === 0,
    findings: findings.sort((a, b) => weight(b.severity) - weight(a.severity)),
    passLikelihood: Math.max(0, 1 - blockers.length * 0.35 - warnings.length * 0.08),
  };
}

function weight(s: Severity): number {
  return s === "blocker" ? 3 : s === "warning" ? 2 : 1;
}

type Rule = (i: CheckerInput) => Finding[];

/** 4.2 — Minimum functionality. Eng ko'p rad etish sababi. */
const minimumFunctionality: Rule = (i) => {
  const screens = i.files.filter(
    (f) => f.path.startsWith("app/") && /\.(tsx|jsx)$/.test(f.path) && !f.path.includes("_layout"),
  );
  if (screens.length >= i.minScreens) return [];
  return [
    {
      clause: "4.2",
      severity: "blocker",
      titleUz: "Ilova juda sodda ko'rinishi mumkin",
      detailUz: `Hozir ${screens.length} ta mazmunli ekran bor, bu soha uchun kamida ${i.minScreens} ta kerak. Apple 4.2 bandi bo'yicha "veb-sayt nusxasi" yoki "juda sodda" ilovalarni rad etadi.`,
      files: screens.map((s) => s.path).slice(0, 10),
    },
  ];
};

/** 2.1 — To'liqlik. Placeholder va ishlamaydigan tugma. */
const completeness: Rule = (i) => {
  const out: Finding[] = [];
  const placeholderRe = /lorem ipsum|TODO|FIXME|Coming soon|Tez orada|placeholder text/i;
  const bad = i.files.filter((f) => /\.(tsx|jsx|ts)$/.test(f.path) && placeholderRe.test(f.content));
  if (bad.length) {
    out.push({
      clause: "2.1",
      severity: "blocker",
      titleUz: "Tugallanmagan matn qolgan",
      detailUz:
        "Ilovada 'Lorem ipsum', 'TODO' yoki 'Tez orada' kabi matnlar bor. Apple bunday ilovani tugallanmagan deb rad etadi.",
      files: bad.map((f) => f.path).slice(0, 10),
    });
  }

  const emptyPress = i.files.filter(
    (f) =>
      /\.(tsx|jsx)$/.test(f.path) &&
      /onPress=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}|onPress=\{\s*\(\s*\)\s*=>\s*(?:null|undefined)\s*\}/.test(
        f.content,
      ),
  );
  if (emptyPress.length) {
    out.push({
      clause: "2.1",
      severity: "blocker",
      titleUz: "Ishlamaydigan tugma bor",
      detailUz:
        "Bosilganda hech narsa qilmaydigan tugma topildi. Ko'rikchi buni bosib ko'radi va ilovani rad etadi.",
      files: emptyPress.map((f) => f.path).slice(0, 10),
    });
  }
  return out;
};

/** 5.1.1(v) — Akkaunt yaratish bo'lsa, o'chirish ham bo'lishi shart. */
const accountDeletion: Rule = (i) => {
  if (!i.blocks.includes("auth")) return [];
  const hasDelete = i.files.some(
    (f) =>
      /delete-account|deleteAccount|akkauntni o.?chirish/i.test(f.path) ||
      /delete-account|deleteAccount|Akkauntni o.?chirish/i.test(f.content),
  );
  if (hasDelete) return [];
  return [
    {
      clause: "5.1.1(v)",
      severity: "blocker",
      titleUz: "Akkauntni o'chirish ekrani yo'q",
      detailUz:
        "Ilovada ro'yxatdan o'tish bor, lekin akkauntni o'chirish yo'q. Apple 2022-yildan buni majburiy qilgan — bu aniq rad etish.",
      files: [],
    },
  ];
};

/** 4.8 / Sign in with Apple — uchinchi tomon login bo'lsa Apple login ham kerak. */
const appleSignIn: Rule = (i) => {
  const src = i.files.map((f) => f.content).join("\n");
  const hasThirdParty = /google.?sign.?in|signInWithOAuth|facebook|GoogleSignin/i.test(src);
  const hasApple = /expo-apple-authentication|AppleAuthentication|signInWithApple/i.test(src);
  if (!hasThirdParty || hasApple) return [];
  return [
    {
      clause: "4.8",
      severity: "blocker",
      titleUz: "Apple bilan kirish yo'q",
      detailUz:
        "Google yoki Facebook bilan kirish bor, lekin Apple bilan kirish yo'q. Apple buni talab qiladi.",
      files: [],
    },
  ];
};

/** 5.1.1 — Har ruxsat so'rovi mazmunli sabab bilan. */
const usageDescriptions: Rule = (i) => {
  const out: Finding[] = [];
  const ios = getIn(i.appConfig, ["expo", "ios", "infoPlist"]) as Record<string, unknown> | undefined;
  const needed: Array<[string, string, RegExp]> = [
    ["NSCameraUsageDescription", "kamera", /expo-camera|useCameraPermissions|launchCameraAsync/],
    ["NSPhotoLibraryUsageDescription", "galereya", /expo-image-picker|launchImageLibraryAsync/],
    ["NSLocationWhenInUseUsageDescription", "joylashuv", /expo-location|getCurrentPositionAsync/],
  ];
  const src = i.files.map((f) => f.content).join("\n");

  for (const [key, labelUz, used] of needed) {
    if (!used.test(src)) continue;
    const value = ios?.[key];
    const text = typeof value === "string" ? value.trim() : "";
    if (text.length < 15) {
      out.push({
        clause: "5.1.1",
        severity: "blocker",
        titleUz: `${labelUz} ruxsati uchun sabab yozilmagan`,
        detailUz: `Ilova ${labelUz}dan foydalanadi, lekin app.json ichida ${key} yo'q yoki juda qisqa. Apple sababni foydalanuvchi tilida ko'rishni talab qiladi.`,
        files: ["app.json"],
      });
    }
  }
  return out;
};

/** 3.1.1 — Raqamli kontent uchun IAP majburiy. Eng qimmat xato. */
const paymentClause: Rule = (i) => {
  const src = i.files.map((f) => f.content).join("\n");
  const hasExternalPay = /payme|click\.uz|uzum|paynet|checkout\.stripe|openURL\(.*pay/i.test(src);
  const hasIap = /react-native-purchases|expo-in-app-purchases|Purchases\./i.test(src);

  if (i.sells === "digital" && hasExternalPay && !hasIap) {
    return [
      {
        clause: "3.1.1",
        severity: "blocker",
        titleUz: "Raqamli mahsulot tashqi to'lov bilan sotilyapti",
        detailUz:
          "Kursga kirish, obuna va premium funksiya — raqamli kontent. Apple buni faqat In-App Purchase orqali sotishga ruxsat beradi. Payme/Click bilan qoldirilsa, ilova aniq rad etiladi.",
        files: [],
      },
    ];
  }
  if (i.sells === "physical_or_service" && hasIap && !hasExternalPay) {
    return [
      {
        clause: "3.1.1",
        severity: "info",
        titleUz: "In-App Purchase shart emas",
        detailUz:
          "Siz jismoniy tovar yoki real xizmat sotasiz. Apple bunda IAP talab qilmaydi — Payme/Click ishlatib, 30% komissiyani to'lamasligingiz mumkin.",
        files: [],
      },
    ];
  }
  return [];
};

/** Privacy — siyosat havolasi. */
const privacyPolicy: Rule = (i) => {
  const src = i.files.map((f) => f.content).join("\n") + JSON.stringify(i.appConfig);
  if (/privacy|maxfiylik|политик/i.test(src)) return [];
  return [
    {
      clause: "Privacy",
      severity: "warning",
      titleUz: "Maxfiylik siyosati havolasi topilmadi",
      detailUz:
        "App Store Connect maxfiylik siyosati havolasini talab qiladi va u ishlashi kerak. Ilova ichida ham havola bo'lgani yaxshi.",
      files: [],
    },
  ];
};

/** 4.3 — Spam / duplicate. Bizdan chiqqan ilovalar bir-biriga o'xshamasin. */
const uniqueness: Rule = (i) => {
  const name = getIn(i.appConfig, ["expo", "name"]);
  const slug = getIn(i.appConfig, ["expo", "slug"]);
  const generic = ["my-app", "myapp", "expo-app", "app", "template", "amb-app"];
  if (typeof slug === "string" && generic.includes(slug.toLowerCase())) {
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

const RULES: Rule[] = [
  minimumFunctionality,
  completeness,
  accountDeletion,
  appleSignIn,
  usageDescriptions,
  paymentClause,
  privacyPolicy,
  uniqueness,
];

function getIn(obj: unknown, keys: string[]): unknown {
  let cur: unknown = obj;
  for (const k of keys) {
    if (typeof cur !== "object" || cur === null) return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }
  return cur;
}
