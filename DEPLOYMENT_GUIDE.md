# GitHub + Zenodo デプロイメント手順書

**この文書は先生ご本人の作業手順書です。GitHubとZenodoへの公開は先生のアカウントで行う必要があります。**

リポジトリの全ファイルは `E:/②-1　Writing/20260329　UFW for erythema/UFW-erythema-analysis/` に準備済みです。

---

## 作業全体像

| Step | 所要時間 | 内容 | 状態 |
|:----:|:--------:|------|:----:|
| 1 | 15分 | GitHubアカウント作成（既にあればスキップ） | 先生の作業 |
| 2 | — | プレースホルダ置換 | **✅ 完了済** |
| 3 | 10分 | GitHubリポジトリ作成・ファイルアップロード | 先生の作業 |
| 4 | 5分 | Zenodo連携・DOI発行 | 先生の作業 |
| 5 | 5分 | Response Letterの実URL・実DOI反映 | 私が対応可能 |

合計：**約35分**（Step 2 は完了済みのためスキップ可）

**完了済プレースホルダ値**：
- Author: Kentaro Oku, MD
- Institution: Hills Grace Clinic, Yokohama, Japan
- GitHub username: `kentaro-oku`
- Email: `kentaro.oku@hillsgrace.or.jp`

---

## Step 1：GitHubアカウント作成

### 既にアカウントがある場合
スキップして Step 2 へ。

### 新規作成
1. https://github.com/signup にアクセス
2. Emailアドレス・パスワード・ユーザー名を入力
   - 推奨ユーザー名案：`kentaro-oku`, `k-oku-md`, `oku-research` など
   - 学術用途のため、実名に近いものを推奨
3. メール認証を完了
4. **無料プラン（Free）**で十分です（public repositoryは無料）

---

## Step 2：プレースホルダ置換 — ✅ 完了済

本ステップはClaude側で完了しています。参考までに、適用された置換値：

| 置換項目 | 適用値 | 置換先ファイル |
|---------|--------|---------------|
| `[USERNAME]` | `kentaro-oku` | README.md, CITATION.cff, docs/REPRODUCIBILITY.md |
| `[AUTHOR NAME]` | `Kentaro Oku, MD` / `Kentaro Oku`（LICENSE のみ） | README.md, LICENSE |
| `[AUTHOR]` | `Oku K` | README.md |
| `[LAST NAME]` | `Oku` | CITATION.cff |
| `[FIRST NAME]` | `Kentaro` | CITATION.cff |
| `[INSTITUTION]` | `Hills Grace Clinic, Yokohama, Japan` | README.md, CITATION.cff |
| `[EMAIL]` | `kentaro.oku@hillsgrace.or.jp` | README.md |

Step 3 に進んでください。

---

## Step 3：GitHubリポジトリ作成・ファイルアップロード

### 3-A. リポジトリ作成（Web UI）

1. https://github.com/new にアクセス
2. 以下を入力：
   - **Repository name**: `UFW-erythema-analysis`
   - **Description**: `Semi-quantitative image-analysis pipeline for post-laser erythema quantification (nano-sized ultrafine water clusters, Lasers in Medical Science 2026)`
   - **Public** を選択 ← **重要：査読者がアクセスするため必須**
   - **Initialize this repository** の全チェックボックスは **OFF**（既にローカルに全ファイル準備済のため）
3. 「Create repository」をクリック

### 3-B. ファイルアップロード（最も簡単な方法：ドラッグ&ドロップ）

1. 作成直後のリポジトリ画面で「uploading an existing file」リンクをクリック
2. ローカルフォルダ `E:/②-1　Writing/20260329　UFW for erythema/UFW-erythema-analysis/` を開く
3. **全ファイル・全フォルダを選択し、ドラッグ&ドロップ**でアップロード
   - `.gitignore`, `CITATION.cff`, `LICENSE`, `README.md`, `requirements.txt`, `DEPLOYMENT_GUIDE.md`
   - `src/`, `data/`, `scripts/`, `docs/` フォルダ（中身ごと）
4. Commit message: `Initial public release (v1.0.0)`
5. 「Commit changes」をクリック

### 3-C. 動作確認

アップロード後、以下を確認：
- リポジトリトップページで README が正しく表示される
- `src/`, `data/`, `scripts/`, `docs/` フォルダがすべて表示される
- ファイル数合計：約15ファイル

### 3-D. 最初のリリース（Release）を作成

**Zenodo連携の前提として必須です。**

1. リポジトリトップの右サイドバー「Releases」→「Create a new release」
2. 以下を入力：
   - **Choose a tag**: `v1.0.0`（新規作成）
   - **Release title**: `v1.0.0 – Initial public release`
   - **Description**:
     ```
     Initial public release accompanying the submission:
     
     "Efficacy of Nano-Sized Ultrafine Water Clusters in Reducing Erythema
     Following Fractionated Picosecond Alexandrite Laser Treatment: 
     A Split-Face, Randomized, Evaluator-Blinded Pilot Study"
     Lasers in Medical Science (under review).
     
     Contents:
     - Image-analysis pipeline (R-G hemoglobin index, skin-pixel segmentation,
       erythema density and area with fixed threshold R-G > 50)
     - Statistical analysis (paired t / Wilcoxon / Cohen's d / Cohen's kappa)
     - Anonymized per-subject derived metrics for Post-Tx (n=12) and Pre-Tx (n=13)
     - Full documentation and reproducibility notes
     ```
3. 「Publish release」をクリック

---

## Step 4：Zenodo連携・DOI発行

### 4-A. Zenodoアカウント作成（GitHub経由：最速）

1. https://zenodo.org/ にアクセス
2. 右上「Sign up」→ **「Sign up with GitHub」**を選択
3. GitHub連携を許可

### 4-B. リポジトリをZenodoに登録

1. Zenodoログイン後、右上プロフィール → **「GitHub」**
2. 連携済みリポジトリ一覧が表示される
3. `UFW-erythema-analysis` リポジトリを探し、**トグルスイッチを ON**
4. これで以降のReleaseが自動的にZenodoにアーカイブされる

### 4-C. Release から DOI を発行

**Step 3-D で作成したRelease は、Zenodo連携設定の「前」のため、自動アーカイブされません。**

以下のいずれかで対応：

**方法1（推奨）: 新しいRelease v1.0.1 を作成**
1. GitHub上で Release を再度作成：
   - Tag: `v1.0.1`
   - Title: `v1.0.1 – Zenodo archival release`
   - Description: `First Zenodo-archived release. Content identical to v1.0.0.`
2. Publish release → Zenodoが自動的にアーカイブ・DOI発行

**方法2: v1.0.0 の Re-release**
1. GitHub でv1.0.0 Release を一度削除
2. 再度 v1.0.0 を作成 → Zenodoが自動的にアーカイブ

### 4-D. DOI の取得

1. 数分後、Zenodoの「Upload」セクションに新しいエントリが表示される
2. そのエントリをクリック → DOI（例: `10.5281/zenodo.XXXXXXX`）が表示される
3. **このDOIをメモ**

---

## Step 5：Response Letter・原稿への反映

以下のファイルで実URL・実DOIに置換：

### 論文原稿（Manuscript_LIMS.docx 等）

Data Availability statement を以下に更新：

> The source code for the image-analysis pipeline, the statistical analysis scripts,
> and the anonymized per-subject derived metrics sufficient to fully reproduce all
> reported statistics are publicly available at:
> https://github.com/[ACTUAL_USERNAME]/UFW-erythema-analysis
> Archived version: https://doi.org/10.5281/zenodo.[ACTUAL_DOI]

### Response Letter — Minor Comment 6

実URL・実DOIを記載：

> We have deposited the complete image-analysis pipeline and anonymized
> derived metrics at:
> GitHub: https://github.com/[ACTUAL_USERNAME]/UFW-erythema-analysis
> Zenodo (archived version with persistent DOI): https://doi.org/10.5281/zenodo.[ACTUAL_DOI]
> 
> The repository includes full documentation (README.md, METHODOLOGY.md,
> REPRODUCIBILITY.md) and has been independently verified to reproduce
> the manuscript's statistics bit-identically (see
> docs/REPRODUCIBILITY.md).

### CITATION.cff 更新

DOI発行後、GitHub上で `CITATION.cff` を編集し、`# doi:` 行のコメントを外して実DOI値を記載：

```yaml
doi: "10.5281/zenodo.XXXXXXX"
```

これにより、論文引用ツール（Zotero, EndNote, BibTeX）からの自動引用が容易になります。

---

## 推奨チェックリスト

公開前最終確認：

- [ ] リポジトリが **Public** である
- [ ] README.md のリンク・画像がすべて正しく表示される
- [ ] `python scripts/run_analysis.py` がローカルで動作する
- [ ] 個人名（患者名）が残っていない
- [x] プレースホルダ `[USERNAME]`, `[AUTHOR NAME]` 等がすべて置換済み（完了済）
- [ ] Zenodo DOIが発行済み
- [ ] Response Letter の URL/DOI 記載が実値
- [ ] CITATION.cff にDOIが記載済み

---

## 困ったときは

- **GitHubの操作で困ったら**: 私に操作画面のスクリーンショットを送っていただければ、次のクリック先を案内します
- **Zenodo連携がうまくいかない**: Zenodo側のキャッシュ遅延の場合があります。5-10分待ってから再試行してください
- **プレースホルダ置換を一括実施したい**: 値を指示いただければ、私が全ファイルを一括更新します

---

## 最終構成物

完成時、公開されるものは以下です：

```
GitHub Repository (Public)
├── URL: https://github.com/kentaro-oku/UFW-erythema-analysis
├── Files: 15ファイル、約25 KB
├── License: MIT (code) + CC BY 4.0 (data)
└── Release v1.0.x

Zenodo Archive
├── DOI: 10.5281/zenodo.XXXXXXX
├── Permanent citation URL
└── Automatic versioning for future updates
```

これで**Minor Comment 6への完全対応**が可能になります。
