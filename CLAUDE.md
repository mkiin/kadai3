# kadai3 プロジェクト - Claude Code用設定

このファイルはClaude Codeがプロジェクトを理解するための情報をまとめています。

## プロジェクト概要

**kadai3**は、React 19とTanStack Routerを使用したモダンなWebアプリケーションです。SupabaseとFirebaseを統合したフルスタック構成となっています。

## 技術スタック

- **フロントエンド**: React 19.0.0, TypeScript 5.7.2
- **ルーティング**: TanStack Router (ファイルベースルーティング)
- **スタイリング**: Tailwind CSS 4.0.6
- **ビルドツール**: Vite 6.3.5
- **テスト**: Vitest 3.0.5 + Testing Library
- **バックエンド**: Supabase 2.57.2
- **デプロイ**: Firebase Hosting
- **パッケージマネージャー**: pnpm

## プロジェクト構造

```
tree src/
src/
├── api
│   ├── querys.ts # supabaseからデータ取得
├── components
│   ├── root-provider.tsx  # Chakcra UIと Tanstack Queryのプロバイダー
│   └── ui
│       ├── color-mode.tsx
│       ├── provider.tsx
│       ├── toaster.tsx
│       └── tooltip.tsx
├── lib
│   ├── query-client.ts # tanstack queryのquery clientを生成する関数
│   └── supabase.ts # supabse の clientを生成する関数
├── logo.svg
├── main.tsx
├── reportWebVitals.ts
├── routes
│   ├── index.tsx # メインページ
│   └── __root.tsx
├── routeTree.gen.ts
├── study-records
│   ├── study-record-dialog.tsx # ダイアログ
│   ├── study-record-form.tsx # フォーム
├── styles.css
├── types
│   └── database.types.ts
└── vite-env.d.ts

```

## 開発コマンド

### 基本開発フロー
```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動（ポート3000）
pnpm dev
# または
pnpm start

# 本番ビルド（Vite + TypeScript型チェック）
pnpm build

# テスト実行
pnpm test

# プレビューサーバー
pnpm serve
```

### 型定義生成
```bash
# Supabaseの型定義を自動生成
pnpm generate-types
```

### デプロイ
```bash
# Firebaseへデプロイ
make deploy
```

## 開発規約

### TypeScript設定
- 厳密なTypeScript設定を使用（strict: true）
- 未使用の変数・パラメータはエラーとして扱う
- ES2022ターゲット、React JSX形式

### コードスタイル
- パスエイリアス: `@/*` → `src/*`
- ファイル拡張子: `.tsx` (JSXコンポーネント)
- インポート順序: 外部ライブラリ → 内部モジュール

### ファイル配置
- **ルート**: `src/routes/` にファイルベースでルーティング
- **ユーティリティ**: `src/lib/` にサービスクラスや共通関数
- **型定義**: `src/types/` に型定義ファイル

## タスク完了時のチェックリスト

コード変更後は以下を必ず実行してください：

1. **型チェック**: `pnpm build` でTypeScriptエラーがないか確認
2. **テスト**: `pnpm test` で全テストが通るか確認
3. **起動確認**: `pnpm dev` でエラーなく起動するか確認

## 重要な設定

### 環境変数
- Supabaseの設定は環境変数で管理
- 型定義生成にはSUPABASE_PROJECT_IDが必要

### ビルド設定
- Vite + TypeScriptの組み合わせ
- 自動コード分割有効（autoCodeSplitting: true）
- パス解決エイリアス設定済み

## Claude Codeでの作業について

このプロジェクトでコードを編集する際は：

1. TypeScriptの厳密な型チェックに準拠
2. TanStack Routerのファイルベースルーティング規約に従う
3. Tailwind CSSを使用してスタイリング
4. `@/` エイリアスを使って相対パスを避ける
5. 変更後は必ずビルドとテストを実行

よくあるタスク：
- 新しいページ追加 → `src/routes/` に新しいファイル作成
- APIクライアント修正 → `src/lib/supabase.ts` を編集
- 型定義追加 → `src/types/` にファイル追加または `pnpm generate-types` 実行