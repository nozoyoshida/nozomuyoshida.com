# nozomuyoshida.com

これは [Classic CV](https://github.com/jojoee/classic-cv) テンプレートをベースにした、[nozomuyoshida.com](https://nozomuyoshida.com)（個人のウェブサイト兼CV）のソースコードです。

## 始め方

Python または Node.js を使用してローカルでウェブサイトを実行できます。

### 前提条件

- **Python 3** (推奨: プレビューが簡単です)
- **Node.js** (任意: 開発/ビルド用)

### ローカルでの実行

#### オプション 1: Python を使用する場合 (簡単)

Node.js の依存関係をインストールせずにサイトをプレビューしたい場合:

```bash
python3 -m http.server
```

その後、ブラウザで [http://localhost:8000](http://localhost:8000) を開いてください。

#### オプション 2: Node.js を使用する場合

テンプレートが提供する開発ツールを使用したい場合:

1. 依存関係のインストール:
   ```bash
   npm install
   ```

2. 開発サーバーの起動:
   ```bash
   npm start
   ```

   これは `npx serve .` を使用してカレントディレクトリを配信します。

## プロジェクト構成

- `index.html`: ウェブサイトのメインエントリーポイント。
- `privacy.html`: Google Analytics（Cookie利用・オプトアウト案内）および個人見解に関する免責事項を記載したプライバシーポリシーページ。
- `css/`: スタイルシート。
- `js/`: JavaScript ファイル。
- `_posts/`: 公開対象のブログ記事（Markdown）。
- `_drafts/`: 非公開・下書き記事および退避済みメディアアセット等のローカル保管ディレクトリ（`.gitignore` により Git 管理対象外）。
- `blog/`: ブログ記事および一覧・ネットワーク可視化ページ（生成されたもの）。
- `media/`: 画像・証明書などのメディアアセット。

## ブログの管理

このウェブサイトには静的ブログジェネレーターが含まれています。

### 記事の作成

1. `_posts/` ディレクトリに新しい Markdown ファイルを作成します。
2. ファイル名は `YYYY-MM-DD-title.md` の形式にすることが推奨されます。
3. ファイルの先頭に必須の Frontmatter を追加します:

   ```markdown
   ---
   title: "記事のタイトル"
   date: "2023-11-20"
   excerpt: "記事の短い概要。"
   image: "https://example.com/image.jpg" # 任意
   category: "Tech" # 任意、ネットワークグラフのグループ化と色分けに使用
   pw: 0.5 # 任意、ネットワークの左右軸（-1: Private, 1: Work）
   so: -0.2 # 任意、ネットワークの上下軸（-1: Subjective, 1: Objective）
   ---
   
   ここに記事の本文を書きます...
   
   > [!TIP]
   > 2026-01-13のアップデートにより、日本語の文章中でも `**太字**` のようにスペースなしで太字記法が使用可能になりました。

   ```

### 記事の非公開化・下書き管理

公開済みの記事を非公開（下書き）に戻す場合は、対象の Markdown ファイルを `_posts/` から `_drafts/` ディレクトリへ移動し、`npm run build:blog` を実行してください。ビルド時に `_posts/` に存在しない古い `blog/<slug>.html` は自動的に削除され、記事一覧（`blog/index.html`）およびネットワークデータ（`blog/network/network-data.json`）からも除外されます。

### ブログのビルド

記事を作成・修正・退避した後、ブログページを再ビルドする必要があります:

```bash
npm run build:blog
```

このスクリプト（`scripts/build-blog.js`）は以下を実行します:
1. `_posts/` に存在しない古い生成済み記事 HTML（`blog/<slug>.html`）を自動クリーンアップ（削除）する。
2. `_posts/` からすべての Markdown ファイルを読み込む。
3. `blog/` に免責フッター・Privacy Policy 導線付きの HTML ファイルを生成する。
4. `blog/index.html` を記事リストで更新する。
5. `Intl.Segmenter`（日本語単語分割対応）を用いてネットワーク可視化用のデータを生成する（`blog/network/network-data.json`）。

### 軸ベースのネットワーク可視化（pw / so）

- 追加の Frontmatter フィールドとして `pw` と `so` を指定できます（任意）。
  - `pw`: Private (-1) ←→ Work (+1)（左右軸）
  - `so`: Subjective (-1) ←→ Objective (+1)（上下軸）
  - 値の範囲は **-1 から +1** です（ビルド時に自動でクランプされます）。

- デフォルトではビルドスクリプトが記事本文を解析して簡易的なヒューリスティックで `pw` / `so` を算出しますが、**front-matter に数値を設定すると手動値が優先**されます。

- ネットワークの可視化ページ: `blog/network/index.html`（軸の表示、ツールチップにスコアを表示します）。

- ヒューリスティックの調整は `scripts/build-blog.js`（`computeAxisScores`）で行えます。より高精度なスコアリング（TF-IDF、埋め込み等）を導入することも可能です。

（補足）フロントマターでの手動指定は、特に主観的評価や個人的な記事の位置づけを正確に反映したい場合に便利です。
