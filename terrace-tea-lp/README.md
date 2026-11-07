# TERRACE TEA（テラスティー）LP

スクロールに合わせて商品映像がコマ送りで動く、3Dスクロール型の商品LPです。

参考：かのん「【徹底解説】「Claude Code」で商品LPを作る！」（note）

## 制作の流れ

記事の流れ（ベース画像 → 動画 → 連番フレーム → Claude CodeでLP化）に沿って作っています。
ただし、画像生成AIと動画生成AIの代わりに、Three.jsで作った3Dシーンから素材を書き出しています。

| ステップ | 記事 | このリポジトリ |
| --- | --- | --- |
| 1. ベース画像 | GPT Image 2 で 1920×1080 | `tools/scene.html`（Three.js）で 1920×1080 をレンダリング → `assets/hero.webp` |
| 2. 動画化 | Seedance で4秒の動画 | 120フレームを ffmpeg で連結 → `assets/terrace-tea.mp4`（4秒・30fps） |
| 3. フレーム変換 | 動画を連番画像に分解 | ffmpeg で `frames/frame_0001.webp` 〜 `frame_0120.webp` に分解 |
| 4. サイト化 | Claude Code で実装 | `index.html` / `style.css` / `main.js`（canvasにスクロール連動で描画） |

### 素材を作り直すとき

```bash
cd tools
npm i three@0.170.0
python3 -m http.server 8765 &
node capture.js "" raw              # raw/f_0000.png … f_0119.png
ffmpeg -framerate 30 -i raw/f_%04d.png -t 4 -c:v libx264 -pix_fmt yuv420p -crf 20 ../assets/terrace-tea.mp4
ffmpeg -i ../assets/terrace-tea.mp4 -vf fps=30 -c:v libwebp -quality 72 ../frames/frame_%04d.webp
```

記事どおりに生成AIで作った動画（mp4）がある場合は、3行目の ffmpeg だけを実行すれば `frames/` を差し替えられます。
フレーム数を変えたら、`main.js` の `FRAME_COUNT` も合わせて変更してください。

## ローカルで確認

```bash
cd terrace-tea-lp
python3 -m http.server 8000
# http://localhost:8000
```

## ページ構成

1. スクロール連動ヒーロー（500vh・sticky canvas・コピーは4場面）
2. コンセプト
3. 3つのこだわり
4. 商品スチール
5. 楽しみ方（朝・昼・夜）
6. 製品情報
7. 価格プラン
8. FAQ
9. 最終CTA

※ 商品名以外の内容（価格・成分・産地など）はデモ用の架空の設定です。
