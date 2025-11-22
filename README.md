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
- `css/`: スタイルシート。
- `js/`: JavaScript ファイル。
- `blog/`: ブログ記事（生成されたもの）。
- `media/`: 画像などのメディアアセット。

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
   category: "Tech" # 任意、ネットワークグラフのグループ化に使用
   ---
   
   ここに記事の本文を書きます...
   ```

### ブログのビルド

記事を作成または修正した後、ブログページを再ビルドする必要があります:

```bash
npm run build:blog
```

このスクリプトは以下を実行します:
1. `_posts/` からすべての Markdown ファイルを読み込む。
2. `blog/` に HTML ファイルを生成する。
3. `blog/index.html` を記事リストで更新する。
4. ネットワーク可視化用のデータを生成する。

## ライセンス

このプロジェクトは [Classic CV](https://github.com/jojoee/classic-cv) テンプレートに基づいており、MIT ライセンスの下で公開されています。
