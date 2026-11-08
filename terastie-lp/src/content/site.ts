// All page copy lives here so it can be reviewed and corrected in one place.
// Source: public information from Hills Grace Clinic (hillsgrace.or.jp) and its
// official online shop (hillsonline.shop). Prices / wording must be re-checked
// against the official information before publishing.

export const site = {
  name: "TERASTIE",
  nameJa: "テラスティー",
  clinic: "ヒルズグレイスクリニック",
  clinicArea: "横浜・あざみ野",
  tagline: "Hills Grace Clinic Original Skincare",
  shopUrl: "https://www.hillsonline.shop/",
  clinicUrl: "https://hillsgrace.or.jp/",
  description:
    "ヒルズグレイスクリニックの医師が開発した、院内処方のスキンケアシリーズ「TERASTIE（テラスティー）」。治療のあとも続く毎日の肌のために。",
} as const;

export const frameSequence = {
  // Output of STEP 4: my-video.mp4 (4s / 1080p / 24fps) -> 25fps -> 100 JPGs
  count: 100,
  path: (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`,
  background: "#e4d8c2",
};

export type Beat = {
  id: string;
  range: [number, number]; // scroll progress where the beat is visible
  eyebrow: string;
  title: string;
  body?: string;
  placement: "left" | "right" | "top";
  cta?: boolean;
};

export const heroBeats: Beat[] = [
  {
    id: "intro",
    range: [0, 0.2],
    eyebrow: "Hills Grace Clinic Original Skincare",
    title: "治療のあとも、\n肌の毎日はつづいていく。",
    body: "医師が考えた、毎日のためのスキンケア。",
    placement: "left",
  },
  {
    id: "moisturize",
    range: [0.26, 0.44],
    eyebrow: "01 — Hydrate",
    title: "うるおいを与える。",
    body: "肌がいちばん欲しいものを、まずたっぷりと。",
    placement: "right",
  },
  {
    id: "balance",
    range: [0.5, 0.66],
    eyebrow: "02 — Balance",
    title: "肌を整える。",
    body: "揺らぎやすい日も、すこやかなリズムへ。",
    placement: "left",
  },
  {
    id: "protect",
    range: [0.7, 0.84],
    eyebrow: "03 — Protect",
    title: "うるおいを守る。",
    body: "与えたうるおいを、逃がさないように。",
    placement: "right",
  },
  {
    id: "lineup",
    range: [0.89, 1.01],
    eyebrow: "TERASTIE",
    title: "3つの役割で考える、\n毎日のスキンケア。",
    placement: "right",
    cta: true,
  },
];

export const about = {
  eyebrow: "About",
  title: "クリニックの外でも、\n治療の考え方をそのままに。",
  lead: [
    "TERASTIE（テラスティー）は、ヒルズグレイスクリニックの医師が開発した院内処方のスキンケアシリーズです。",
    "治療後やケアの途中に、ご自宅で使うためのアイテムとして生まれました。「うるおいを与える」「肌を整える」「うるおいを守る」の3つの役割で、毎日のケアを組み立てます。",
  ],
};

export type Product = {
  id: string;
  name: string;
  kind: string;
  price: string;
  description: string;
  note?: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "essence",
    name: "TERASTIE 1\nトーンアップエッセンス",
    kind: "ローション",
    price: "¥11,000",
    description:
      "高濃度トラネキサム酸を核に、グルタチオン、グリチルリチン酸2K、ヒアルロン酸、5種類のセラミドを配合。シリーズの土台となる一本です。",
    note: "院内処方のため、初回は医師による問診内容の確認が必要です。",
    featured: true,
  },
  {
    id: "serum",
    name: "TERASTIE\nリジェンセラム",
    kind: "美容セラム",
    price: "¥22,000",
    description: "毎日のケアに重ねて使う美容セラム。",
  },
  {
    id: "cream",
    name: "TERASTIE\nリッチクリーム",
    kind: "保湿クリーム",
    price: "¥22,000",
    description: "ケアの仕上げに、うるおいを閉じ込める保湿クリーム。",
  },
  {
    id: "set",
    name: "TERASTIE\nコンプリートセット",
    kind: "セット",
    price: "¥55,000",
    description: "シリーズをそろえて使いたい方のためのセット。",
  },
];

export const roles = [
  { no: "01", en: "Hydrate", title: "うるおいを与える", body: "洗顔後の肌に、まずうるおいを。ケア全体の土台をつくります。" },
  { no: "02", en: "Balance", title: "肌を整える", body: "治療中や季節の変わり目など、揺らぎやすい肌のコンディションを整えます。" },
  { no: "03", en: "Protect", title: "うるおいを守る", body: "与えたうるおいを逃がさないように、最後にしっかり守ります。" },
];

export const ingredients = [
  { name: "トラネキサム酸", note: "高濃度で配合。TERASTIE 1 の核となる成分" },
  { name: "グルタチオン", note: "" },
  { name: "グリチルリチン酸2K", note: "" },
  { name: "ヒアルロン酸", note: "" },
  { name: "5種類のセラミド", note: "" },
];

export const clinicPoints = [
  {
    title: "医師の問診から始まる",
    body: "TERASTIE 1 は院内処方。初回は医師が問診内容を確認し、肌の状態に合うかを見たうえでお渡しします。",
  },
  {
    title: "治療に合わせて使い分ける",
    body: "レーザーなどの治療後は一律に使うのではなく、レチノールを含む製品などの休止・再開の時期を診察で確認します。",
  },
  {
    title: "院内施術のベースにも",
    body: "美容成分を導入する施術「デルマシオ」では、TERASTIE 1 を全コースの土台として使用しています。",
  },
];

export const faqs = [
  {
    q: "どこで購入できますか？",
    a: "ヒルズグレイスクリニックの院内と、公式オンラインショップでお求めいただけます。一部の商品は、購入前にオンライン問診（無料）が必要です。",
  },
  {
    q: "初めてでも TERASTIE 1 を使えますか？",
    a: "TERASTIE 1 は院内処方のため、初回は医師による問診内容の確認が必要です。問診のうえ、ご案内します。",
  },
  {
    q: "レーザー治療のあとにも使えますか？",
    a: "治療の内容や肌の状態によって異なります。レチノールを含む製品などは、休止・再開の時期を診察で確認しますので、治療中の方は医師にご相談ください。",
  },
  {
    q: "ニキビ治療中でも使えますか？",
    a: "ニキビ治療中は、洗いすぎや摩擦を避けて保湿することが基本です。使い方は診察の際にご案内します。",
  },
  {
    q: "クリニックの施術とはどう関係していますか？",
    a: "美容成分の導入施術「デルマシオ」では、TERASTIE 1 を全コースのベースとして使用しています。院内での施術と、ご自宅でのケアをつなぐシリーズです。",
  },
];

export const cta = {
  eyebrow: "TERASTIE",
  title: "まずは、医師に\n肌のことを相談してみる。",
  body: "肌の状態や治療の予定に合わせて、使い方をご案内します。",
  primary: { label: "オンラインショップを見る", href: site.shopUrl },
  secondary: { label: "クリニックのサイトへ", href: site.clinicUrl },
};
