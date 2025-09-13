# kadai2 - 学習記録管理アプリ

React 19とSupabaseを使用したモダンな学習記録管理Webアプリケーションです。学習内容と時間を記録・管理できます。

## 機能概要

- 学習記録の作成・表示・削除
- 学習時間の合計表示

## 技術スタック

- **フロントエンド**: React 19, TypeScript, TanStack Router
- **スタイリング**: Tailwind CSS 4.0
- **バックエンド**: Supabase
- **ビルドツール**: Vite
- **テスト**: Vitest, Testing Library
- **デプロイ**: Firebase Hosting
- **パッケージマネージャー**: pnpm

## 環境設定

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd kadai2
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の環境変数を設定してください：

```env
# Supabase設定
SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# アプリケーションURL（デプロイ時）
APP_URL="https://your-app-url"
```

**環境変数の取得方法:**
1. [Supabase](https://supabase.com)でプロジェクトを作成
2. Settings > API から `Project URL` と `anon/public key` を取得
3. プロジェクトの設定から `Project ID` を取得

## 起動方法

### 開発サーバーの起動

```bash
pnpm dev
# または
pnpm start
```

アプリケーションは http://localhost:3000 で起動します。

### 本番ビルド

```bash
pnpm build
```

### プレビューサーバー

```bash
pnpm serve
```

## 開発コマンド

```bash
# テスト実行
pnpm test

# リント実行
pnpm lint

# リント（自動修正）
pnpm lint:fix

# フォーマット実行
pnpm format

# Supabase型定義の生成
pnpm generate-types
```

## デプロイ

### Firebase Hostingにデプロイ

```bash
make deploy
```

または手動で：

```bash
pnpm build
firebase deploy
```

## プロジェクト構造

```
src/
├── routes/              # TanStack Routerのファイルベースルーティング
│   ├── __root.tsx      # ルートレイアウト
│   ├── index.tsx       # メインページ（学習記録管理）
│   └── querys.ts       # Supabaseクエリ関数
├── lib/                # ユーティリティ
│   └── supabase.ts     # Supabaseクライアント設定
├── types/              # 型定義
│   └── database.types.ts # Supabase自動生成型
├── main.tsx            # エントリーポイント
└── styles.css          # グローバルスタイル
```

## データベース設計

### study_record テーブル

| カラム名 | 型 | 説明 |
|----------|-----|------|
| id | uuid | 主キー |
| title | text | 学習内容 |
| time | numeric | 学習時間（時間単位） |
| created_at | timestamp | 作成日時 |