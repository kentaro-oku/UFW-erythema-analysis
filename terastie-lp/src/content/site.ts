// All page copy lives here so it can be reviewed and corrected in one place.
// Source: product pages on the official online shop "Hills Online"
// (https://www.hillsonline.shop/ , TERASTIE items 892 / 893 / 887 / 894).
// Wording is kept within cosmetic-claim limits; re-check against the official
// information and Japanese advertising rules before publishing.

export const site = {
  name: "TERASTIE",
  nameJa: "テラスティー",
  clinic: "ヒルズグレイスクリニック",
  clinicArea: "横浜・あざみ野",
  tagline: "Doctor's Cosmetics by Hills Grace Clinic",
  shopUrl: "https://www.hillsonline.shop/view/search?search_keyword=TERASTIE",
  clinicUrl: "https://hillsgrace.or.jp/",
  description:
    "美容皮膚科医が開発したドクターズコスメ「TERASTIE（テラスティー）」。トーンアップエッセンス・リジェンセラム・リッチクリームの3ステップで、ご自宅で本格的なスキンケアを。",
  maker: "製造販売元：NIOMA株式会社",
  seller: "発売元：医療法人社団 光悠会 ヒルズグレイスクリニック",
} as const;

export const frameSequence = {
  // Output of STEP 4: my-video.mp4 (4s / 1080p / 24fps) -> 25fps -> 100 JPGs
  count: 100,
  path: (i: number) => `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`,
  background: "#ececec",
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
    eyebrow: "Doctor's Cosmetics by Hills Grace Clinic",
    title: "生命感に満ちた、\n輝く美肌へ。",
    body: "美容皮膚科医が開発した、3ステップのスキンケア。",
    placement: "left",
  },
  {
    id: "step1",
    range: [0.26, 0.44],
    eyebrow: "STEP 1 — Tone-up Essence",
    title: "肌を整え、\nうるおいを与える。",
    body: "トラネキサム酸、グルタチオン、5種のセラミドを配合した化粧水。朝と夜、洗顔後に。",
    placement: "right",
  },
  {
    id: "step2",
    range: [0.5, 0.66],
    eyebrow: "STEP 2 — Regen Serum",
    title: "夜だけの、\n集中ケア。",
    body: "リポソームに封入したレチノール、ビタミンC誘導体、ナイアシンアミド、6種のペプチドを配合。",
    placement: "left",
  },
  {
    id: "step3",
    range: [0.7, 0.84],
    eyebrow: "STEP 3 — Rich Cream",
    title: "うるおいとツヤを、\n閉じ込める。",
    body: "3種のヒアルロン酸、3種の保湿オイル、セラミドを配合。朝と夜の仕上げに。",
    placement: "right",
  },
  {
    id: "lineup",
    range: [0.89, 1.01],
    eyebrow: "TERASTIE",
    title: "簡単3ステップの、\n本格スキンケア。",
    placement: "right",
    cta: true,
  },
];

export const about = {
  eyebrow: "About",
  title: "長年の美容皮膚診療から\n生まれた、ドクターズコスメ。",
  lead: [
    "TERASTIE（テラスティー）は、長年、美容皮膚診療に携わってきたヒルズグレイスクリニックの医師が開発したスキンケアシリーズです。",
    "厳選した成分と日本の技術で、ご自宅でも本格的なスキンケアを。毎日のお手入れはもちろん、クリニックでの美肌治療の前後にもお使いいただけるよう考えられています。",
  ],
  points: [
    { en: "Developed by Aesthetic Dermatologists", title: "美容皮膚科医が開発", body: "日本人の繊細な肌にも使いやすい、マイルドな処方を目指しました。" },
    { en: "Rich in Essential Ingredients", title: "成分をバランスよく配合", body: "それぞれの役割をもつ成分を組み合わせ、続けやすい3ステップにまとめています。" },
    { en: "With Clinic Treatments", title: "治療の前後にも", body: "デイリーケアとしてはもちろん、クリニックでの美肌治療の前後のケアにも。" },
  ],
};

export type Product = {
  id: string;
  step: string;
  name: string;
  en: string;
  kind: string;
  volume: string;
  price: string;
  image: string;
  summary: string;
  ingredients: string[];
  usage: string;
};

export const products: Product[] = [
  {
    id: "essence",
    step: "1",
    name: "トーンアップエッセンス",
    en: "TONE-UP ESSENCE",
    kind: "ローション",
    volume: "150mL",
    price: "¥11,000",
    image: "/products/tone-up-essence.webp",
    summary: "肌のトーンを整え、すみずみまでうるおいを与える化粧水。",
    ingredients: ["トラネキサム酸", "グルタチオン", "5種のセラミド", "グリチルリチン酸2K", "ヒアルロン酸Na"],
    usage: "1日2回、朝と夕方の洗顔後に。適量を手のひらにとり、顔全体にやさしくなじませます。首やデコルテ、手の甲にも。",
  },
  {
    id: "serum",
    step: "2",
    name: "リジェンセラム",
    en: "REGEN SERUM",
    kind: "美容セラム",
    volume: "50g",
    price: "¥22,000",
    image: "/products/regen-serum.webp",
    summary: "ナノサイズのリポソームに封入したレチノールを配合した、夜用の美容セラム。",
    ingredients: ["レチノール（リポソーム）", "ビタミンC誘導体", "ナイアシンアミド", "6種のペプチド", "5種のセラミド"],
    usage: "1日1回、夜のみエッセンスの後に。1プッシュを、擦り込まずに両手で押し当てるようになじませます。瞼には使用しないでください。",
  },
  {
    id: "cream",
    step: "3",
    name: "リッチクリーム",
    en: "RICH CREAM",
    kind: "保湿クリーム",
    volume: "50g",
    price: "¥22,000",
    image: "/products/rich-cream.webp",
    summary: "うるおいと美しいツヤを長時間キープする保湿クリーム。",
    ingredients: ["3種のヒアルロン酸", "スクワラン・コメヌカ油・ホホバ種子油", "セラミド", "プロテオグリカン", "バクチオール"],
    usage: "1日2回、朝と夕方のスキンケアの最後に。2プッシュを顔全体になじませます。乾燥が気になる部分には重ねづけを。",
  },
];

export const completeSet = {
  name: "コンプリートセット",
  en: "COMPLETE SET",
  price: "¥55,000",
  image: "/products/complete-set.webp",
  contents: ["トーンアップエッセンス 150mL", "リジェンセラム 50g", "リッチクリーム 50g"],
};

export const routine = {
  eyebrow: "How to use",
  title: "朝は2ステップ、\n夜は3ステップ。",
  basic: [
    { time: "Morning", label: "朝", steps: ["1", "3"] },
    { time: "Night", label: "夜", steps: ["1", "2", "3"] },
  ],
  sensitive: {
    title: "敏感肌の方、赤みや乾燥（A反応）が出る場合",
    body: "朝晩は 1 → 3 の2ステップで。リジェンセラム（2）は週に1回、夜に 1 と 3 の間に使うスペシャルケアから始め、2か月ほどかけて少しずつ頻度を上げてください。",
  },
  note: "リジェンセラムは使い始めに一時的な乾燥や赤み（A反応）を感じることがあります。強く出た場合は使用を中止するか、使用量・頻度を減らしてください。",
};

export const faqs = [
  {
    q: "どこで購入できますか？",
    a: "ヒルズグレイスクリニックの公式通販「ヒルズオンライン」でお求めいただけます。",
  },
  {
    q: "初めて購入するときに必要なことはありますか？",
    a: "TERASTIE を初めてご購入いただく場合は、問診票にお答えいただくオンライン診察が必要です。注文完了メールに記載のURLからご回答ください。医師が問診票を確認したあと、発送の準備に入ります。",
  },
  {
    q: "リジェンセラムで赤みや乾燥が出たら？",
    a: "使い始めに、一時的な乾燥や赤み（A反応）を感じることがあります。強く出た場合は使用を一時中止するか、週に1回・1/2〜1/3プッシュ程度に減らしてください。肌が慣れてきたら、少しずつ頻度を上げていきます。",
  },
  {
    q: "クリニックの治療中でも使えますか？",
    a: "美肌治療の前後のケアにもお使いいただけるよう考えられています。治療の内容や肌の状態によって使い方が変わることがあるので、治療中の方は医師にご相談ください。",
  },
  {
    q: "顔以外にも使えますか？",
    a: "トーンアップエッセンスは首・デコルテ・手の甲にも、リッチクリームは腕や脚など乾燥が気になる部分にもお使いいただけます。",
  },
];

export const cta = {
  eyebrow: "TERASTIE",
  title: "毎日のスキンケアを、\nクリニック品質に。",
  body: "初めての方は、ご注文後にオンライン問診（医師が確認）をお願いしています。",
  primary: { label: "ヒルズオンラインで見る", href: site.shopUrl },
  secondary: { label: "クリニックのサイトへ", href: site.clinicUrl },
};
