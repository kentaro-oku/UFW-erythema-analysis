# TERASTIE（テラスティー）3D スクロール LP

ヒルズグレイスクリニック オリジナルスキンケア「TERASTIE」の、3D スクロールアニメーション型ランディングページです。
かのん「【徹底解説】「Claude Code」で商品LPを作る！」（note）の 8 STEP に沿って作っています。

## 起動

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 記事の STEP との対応

| STEP | 記事の内容 | このプロジェクト |
| --- | --- | --- |
| 1 | GPT Image 2 で 1920×1080 のベース画像 | **代替**：ヒルズオンラインの商品写真をもとに、`tools/scene.html`（Three.js）で実物に近い3本（1・2・3）の商品CGを 1920×1080 でレンダリング |
| 2 | Seedance で 4秒・1080p・24fps・H.264 の動画 | **代替**：96フレームを ffmpeg で `my-video.mp4` に書き出し（4.0秒／1920×1080／24fps／H.264） |
| 3 | プロジェクトフォルダに動画を格納 | `terastie-lp/my-video.mp4` |
| 4 | 動画を JPG 連番に変換 | ffprobe で 4.0秒を確認 → 100〜120枚に収まる 25fps で変換 → `public/frames/frame_0001.jpg`〜`frame_0100.jpg`（**100枚**） |
| 5 | 3d-scroll-website スキルをインストール | スキル本体（Google Drive配布）は入手できないため、記事に書かれた構成（下記）を手で実装 |
| 6 | Next.js 16 プロジェクト生成 | `create-next-app@16.4.5` ＋ framer-motion / lenis / geist。SmoothScrollProvider・デザイントークン・再利用コンポーネント・frame-sequence canvas |
| 7 | ローカルで動作確認 | `npm run dev` で確認済み（ローディングバー、スクロール・逆再生、Retina 対応、スマホ幅） |
| 8 | 修正や調整 | 文言は `src/content/site.ts` にまとめてあるので、そこを直せば反映されます |

### 記事どおりの AI 動画に差し替えるとき

Seedance などで作った動画を `my-video.mp4` として置き換え、次を実行します。

```bash
rm public/frames/*.jpg
ffmpeg -i my-video.mp4 -vf fps=25 -q:v 3 public/frames/frame_%04d.jpg   # 4秒なら100枚
```

枚数が変わったら `src/content/site.ts` の `frameSequence.count` も合わせてください。
背景色が変わる場合は `frameSequence.background` と `globals.css` の `--color-stage` も調整します。

## 構成

```
src/
├── app/
│   ├── layout.tsx            # フォント（Geist / Shippori Mincho / Noto Sans JP）、SmoothScrollProvider
│   ├── page.tsx              # ヒーロー / サービス紹介（About・Lineup）/ 機能（Features・使い方）/ FAQ / CTA
│   └── globals.css           # デザイントークン（@theme）
├── content/site.ts           # ページの文言・価格・FAQ（ここだけ直せばOK）
└── components/
    ├── providers/smooth-scroll-provider.tsx   # Lenis
    ├── hero/frame-sequence-hero.tsx           # 100枚を canvas にスクロール連動で描画
    ├── layout/site-header.tsx
    ├── sections/                               # About・Lineup・Features・FAQ・CTA・Footer
    └── ui/                                     # Container・SectionHeading・ButtonLink・Reveal
tools/                        # STEP 1–2 の代替（3D CG のレンダリング）
```

## 公開前に確認すること

- 商品情報・商品写真（`public/products/`）は公式通販「ヒルズオンライン」の商品ページから取得しています。価格・成分・表記は最新の公式情報と照合してください。
- ショップの紹介文のうち、化粧品の効能表現として注意が必要な言い回し（ターンオーバー、赤み軽減など）はLPでは使っていません。
- 化粧品の広告表現として、医療広告ガイドライン・薬機法の観点で確認してください。
- ヒーローの映像は実物をもとにしたイメージCGです。実物を撮影した動画ができたら差し替えてください。
